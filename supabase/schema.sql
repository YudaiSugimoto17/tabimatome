-- 旅まとめ データベース定義
-- Supabase の管理画面「SQL Editor」にこのファイルの中身を貼り付けて、1回だけ実行してください。
-- 仕様書の「データモデル」に対応しています。
-- 表示名は旅ごとに変えられるよう、users テーブルの代わりに trip_members に持たせています。
-- リアルタイム同期で絞り込めるよう、spot_votes と availabilities にも trip_id を持たせています。

-- ===== テーブル =====

create table trips (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  invite_code    text not null unique,
  owner_id       uuid not null default auth.uid() references auth.users(id),
  confirmed_date date,
  created_at     timestamptz not null default now()
);

create table trip_members (
  trip_id      uuid not null references trips(id) on delete cascade,
  user_id      uuid not null default auth.uid() references auth.users(id),
  display_name text not null,
  icon         text,
  joined_at    timestamptz not null default now(),
  primary key (trip_id, user_id)
);

create table spots (
  id         uuid primary key default gen_random_uuid(),
  trip_id    uuid not null references trips(id) on delete cascade,
  name       text not null,
  photo_url  text,
  added_by   uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now()
);

create table spot_votes (
  spot_id uuid not null references spots(id) on delete cascade,
  trip_id uuid not null references trips(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id),
  primary key (spot_id, user_id)
);

create table candidate_dates (
  id      uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  date    date not null,
  unique (trip_id, date)
);

create table availabilities (
  candidate_date_id uuid not null references candidate_dates(id) on delete cascade,
  trip_id           uuid not null references trips(id) on delete cascade,
  user_id           uuid not null default auth.uid() references auth.users(id),
  status            text not null check (status in ('ok', 'maybe', 'ng')),
  primary key (candidate_date_id, user_id)
);

create table expenses (
  id         uuid primary key default gen_random_uuid(),
  trip_id    uuid not null references trips(id) on delete cascade,
  payer_id   uuid not null references auth.users(id),
  title      text not null,
  amount     integer not null check (amount > 0),
  paid_on    date not null,
  created_at timestamptz not null default now()
);

create table settlements (
  trip_id      uuid not null references trips(id) on delete cascade,
  from_user_id uuid not null references auth.users(id),
  to_user_id   uuid not null references auth.users(id),
  amount       integer not null,
  is_paid      boolean not null default false,
  primary key (trip_id, from_user_id, to_user_id)
);

-- ===== アクセスのルール（その旅のメンバーだけが読み書きできる） =====

create function is_member(p_trip_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from trip_members where trip_id = p_trip_id and user_id = auth.uid()
  );
$$;

alter table trips           enable row level security;
alter table trip_members    enable row level security;
alter table spots           enable row level security;
alter table spot_votes      enable row level security;
alter table candidate_dates enable row level security;
alter table availabilities  enable row level security;
alter table expenses        enable row level security;
alter table settlements     enable row level security;

-- trips: メンバー（と作成者）だけが見られる。作るのは誰でも、自分が owner になる
create policy trips_select on trips for select using (is_member(id) or owner_id = auth.uid());
create policy trips_insert on trips for insert with check (owner_id = auth.uid());
create policy trips_update on trips for update using (is_member(id));

-- trip_members: メンバー同士で見られる。直接追加できるのは「自分が作った旅に自分を」だけ
-- （招待コードでの参加は下の join_trip 関数を使う）
create policy members_select on trip_members for select using (is_member(trip_id));
create policy members_insert on trip_members for insert with check (
  user_id = auth.uid()
  and exists (select 1 from trips where id = trip_id and owner_id = auth.uid())
);
create policy members_update on trip_members for update using (user_id = auth.uid());

-- 各機能のテーブル: その旅のメンバーなら読み書きできる
create policy spots_all           on spots           for all using (is_member(trip_id)) with check (is_member(trip_id));
create policy spot_votes_all      on spot_votes      for all using (is_member(trip_id)) with check (is_member(trip_id) and user_id = auth.uid());
create policy candidate_dates_all on candidate_dates for all using (is_member(trip_id)) with check (is_member(trip_id));
create policy availabilities_all  on availabilities  for all using (is_member(trip_id)) with check (is_member(trip_id) and user_id = auth.uid());
create policy expenses_all        on expenses        for all using (is_member(trip_id)) with check (is_member(trip_id));
create policy settlements_all     on settlements     for all using (is_member(trip_id)) with check (is_member(trip_id));

-- ===== 招待コードで参加する関数 =====
-- JavaScript からは supabase.rpc('join_trip', { p_code, p_display_name }) で呼ぶ
create function join_trip(p_code text, p_display_name text) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_trip_id uuid;
begin
  select id into v_trip_id from trips where invite_code = upper(trim(p_code));
  if v_trip_id is null then
    raise exception 'trip_not_found';
  end if;

  insert into trip_members (trip_id, user_id, display_name)
  values (v_trip_id, auth.uid(), p_display_name)
  on conflict (trip_id, user_id) do nothing;

  return v_trip_id;
end;
$$;

revoke execute on function join_trip(text, text) from public, anon;
grant execute on function join_trip(text, text) to authenticated;

-- ===== リアルタイム同期の対象 =====
alter publication supabase_realtime add table
  trips, trip_members, spots, spot_votes, candidate_dates, availabilities, expenses, settlements;
