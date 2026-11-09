// ダミーデータ（全ペア共通）
// Supabase の準備ができる前は、各ページがこのデータで動きます。
// 形は Supabase から読み込むデータと同じにしてあります。

export const DUMMY = {
  me: { id: 'u1' },

  trip: {
    id: 'dummy-trip',
    name: 'My Tokyo Trip',
    invite_code: 'K7Q2MD',
    owner_id: 'u1',
    confirmed_date: null,
  },

  members: [
    { user_id: 'u1', display_name: '自分', icon: null },
    { user_id: 'u2', display_name: 'ケン', icon: null },
    { user_id: 'u3', display_name: 'ミカ', icon: null },
    { user_id: 'u4', display_name: 'サキ', icon: null },
    { user_id: 'u5', display_name: 'タロ', icon: null },
  ],

  // 日程調整
  candidateDates: [
    { id: 'd1', date: '2026-11-20' },
    { id: 'd2', date: '2026-11-21' },
    { id: 'd3', date: '2026-11-22' },
    { id: 'd4', date: '2026-11-23' },
  ],
  // status: 'ok'（○） / 'maybe'（△） / 'ng'（×）
  // ○の数: 11/20=1人, 11/21=4人, 11/22=5人, 11/23=2人 → 最適日は 11/22
  availabilities: [
    { candidate_date_id: 'd1', user_id: 'u1', status: 'ok' },
    { candidate_date_id: 'd1', user_id: 'u2', status: 'ng' },
    { candidate_date_id: 'd1', user_id: 'u3', status: 'maybe' },
    { candidate_date_id: 'd1', user_id: 'u4', status: 'ng' },
    { candidate_date_id: 'd1', user_id: 'u5', status: 'maybe' },
    { candidate_date_id: 'd2', user_id: 'u1', status: 'ok' },
    { candidate_date_id: 'd2', user_id: 'u2', status: 'ok' },
    { candidate_date_id: 'd2', user_id: 'u3', status: 'ok' },
    { candidate_date_id: 'd2', user_id: 'u4', status: 'maybe' },
    { candidate_date_id: 'd2', user_id: 'u5', status: 'ok' },
    { candidate_date_id: 'd3', user_id: 'u1', status: 'ok' },
    { candidate_date_id: 'd3', user_id: 'u2', status: 'ok' },
    { candidate_date_id: 'd3', user_id: 'u3', status: 'ok' },
    { candidate_date_id: 'd3', user_id: 'u4', status: 'ok' },
    { candidate_date_id: 'd3', user_id: 'u5', status: 'ok' },
    { candidate_date_id: 'd4', user_id: 'u1', status: 'maybe' },
    { candidate_date_id: 'd4', user_id: 'u2', status: 'ok' },
    { candidate_date_id: 'd4', user_id: 'u3', status: 'ng' },
    { candidate_date_id: 'd4', user_id: 'u4', status: 'ok' },
    { candidate_date_id: 'd4', user_id: 'u5', status: 'ng' },
  ],

  // スポット投票
  spots: [
    { id: 's1', name: '浅草寺', photo_url: null, added_by: 'u1' },
    { id: 's2', name: '上野動物公園', photo_url: null, added_by: 'u2' },
    { id: 's3', name: '東京スカイツリー', photo_url: null, added_by: 'u3' },
  ],
  spotVotes: [
    { spot_id: 's1', user_id: 'u1' },
    { spot_id: 's1', user_id: 'u2' },
    { spot_id: 's2', user_id: 'u1' },
    { spot_id: 's2', user_id: 'u3' },
    { spot_id: 's2', user_id: 'u4' },
    { spot_id: 's3', user_id: 'u5' },
  ],

  // 支払い・割り勘（合計 47,000円、1人あたり 9,400円）
  expenses: [
    { id: 'e1', payer_id: 'u1', title: 'レンタカー代', amount: 12000, paid_on: '2026-11-22' },
    { id: 'e2', payer_id: 'u2', title: '昼食代', amount: 10000, paid_on: '2026-11-22' },
    { id: 'e3', payer_id: 'u3', title: '夕食代', amount: 25000, paid_on: '2026-11-22' },
  ],
};
