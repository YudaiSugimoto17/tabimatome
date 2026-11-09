// 共通関数（担当: ホームチーム）
// どのページからも import して使います。ここを変えるときはホームチームに相談してください。

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

/** Supabase の接続。各ファイルはこれを import して使う */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * 自分のユーザー情報を返す。未ログインなら匿名ログインしてから返す
 * @returns {Promise<object>}
 */
export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) return session.user;

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return data.user;
}

/**
 * URL の ?trip= から旅IDを読む（例: dates.html?trip=abc123 → "abc123"）
 * @returns {string|null}
 */
export function getTripIdFromUrl() {
  return new URLSearchParams(location.search).get('trip');
}

/**
 * 旅の情報を読み込む
 * @param {string} tripId
 * @returns {Promise<{id, name, invite_code, owner_id, confirmed_date, created_at}>}
 */
export async function fetchTrip(tripId) {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('id', tripId)
    .single();
  if (error) throw error;
  return data;
}

/**
 * 旅のメンバーを参加した順に読み込む
 * @param {string} tripId
 * @returns {Promise<Array<{user_id, display_name, icon, joined_at}>>}
 */
export async function fetchMembers(tripId) {
  const { data, error } = await supabase
    .from('trip_members')
    .select('user_id, display_name, icon, joined_at')
    .eq('trip_id', tripId)
    .order('joined_at');
  if (error) throw error;
  return data;
}

/**
 * 旅ページのヘッダー（‹・旅の名前と人数・共有ボタン）を表示する
 * HTML に <header id="app-header"></header> が必要
 * @param {{name: string, invite_code: string}} trip
 * @param {number} memberCount
 */
export function renderHeader(trip, memberCount) {
  const header = document.getElementById('app-header');
  header.innerHTML = `
    <a href="index.html" class="header-back" aria-label="ホームへ戻る">‹</a>
    <h1 class="header-title"></h1>
    <button type="button" class="header-share" aria-label="招待を共有">共有</button>
  `;
  header.querySelector('.header-title').textContent = `${trip.name} (${memberCount})`;
  header.querySelector('.header-share').addEventListener('click', () => shareInvite(trip));
}

/**
 * 画面下部のタブ（DATES / SPOTS / BUDGET）を表示する
 * HTML に <nav id="tab-bar"></nav> が必要
 * @param {'dates'|'spots'|'budget'} activeTab
 */
export function renderTabBar(activeTab) {
  const tripQuery = location.search; // ?trip=... をそのまま引き継ぐ
  const tabs = [
    { key: 'dates', label: 'DATES', href: 'dates.html' },
    { key: 'spots', label: 'SPOTS', href: 'spots.html' },
    { key: 'budget', label: 'BUDGET', href: 'budget.html' },
  ];
  const nav = document.getElementById('tab-bar');
  nav.innerHTML = tabs
    .map((t) => `<a href="${t.href}${tripQuery}" class="tab${t.key === activeTab ? ' is-active' : ''}">${t.label}</a>`)
    .join('');
}

/**
 * 招待リンクと招待コードを共有する
 * スマホでは共有画面を開き、使えない端末ではクリップボードにコピーする
 * （ヘッダーの共有ボタンから呼ぶので common.js に置いています）
 * @param {{name: string, invite_code: string}} trip
 */
export async function shareInvite(trip) {
  const base = location.href.replace(/[^/]*$/, '');
  const url = `${base}index.html?code=${trip.invite_code}`;
  const text = `「${trip.name}」に参加しよう！ 招待コード: ${trip.invite_code}`;

  if (navigator.share) {
    try {
      await navigator.share({ title: '旅まとめ', text, url });
    } catch {
      // 共有画面を閉じただけなので何もしない
    }
    return;
  }
  await navigator.clipboard.writeText(`${text}\n${url}`);
  showMessage('招待リンクをコピーしました');
}

/**
 * 他の人がデータを変えたら onChange を呼ぶ（リアルタイム同期）
 * 対象テーブルには trip_id 列が必要
 * @param {string} table テーブル名（例: 'spots'）
 * @param {string} tripId
 * @param {Function} onChange
 * @returns 購読（ページを離れるときに supabase.removeChannel(戻り値) で止められる）
 */
export function subscribeChanges(table, tripId, onChange) {
  return supabase
    .channel(`${table}-${tripId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table, filter: `trip_id=eq.${tripId}` },
      onChange,
    )
    .subscribe();
}

/**
 * 12000 → "12,000円"
 * @param {number} amount
 */
export function formatYen(amount) {
  return `${amount.toLocaleString('ja-JP')}円`;
}

/**
 * "2026-11-22" → "11/22(日)"
 * @param {string} date
 */
export function formatDate(date) {
  const [y, m, d] = date.split('-').map(Number);
  const week = '日月火水木金土'[new Date(y, m - 1, d).getDay()];
  return `${m}/${d}(${week})`;
}

/**
 * 画面下に短いメッセージを数秒表示する（保存しました・エラーなど）
 * @param {string} text
 */
export function showMessage(text) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = text;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}
