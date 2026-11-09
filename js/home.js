// ホームの関数（担当: ホームチーム）
// 仕様書 H-1〜H-4 に対応

import { supabase, getCurrentUser, formatDate, showMessage } from './common.js';
import { USE_DUMMY } from './config.js';

/**
 * H-1: 旅を作る。招待コードを作り、旅を保存して自分をメンバーに追加する
 * 作ったら spots.html?trip=旅ID へ移動する
 * @param {string} name 旅の名前
 * @param {string} displayName 自分の表示名
 * @returns {Promise<object>} 作った旅
 */
export async function createTrip(name, displayName) {
  // TODO: getCurrentUser() → trips に insert → trip_members に自分を insert
}

/**
 * 招待コードを作る（英大文字と数字の6文字。例: K7Q2MD）
 * 見間違えやすい O・0・I・1 は使わない
 * @returns {string}
 */
export function generateInviteCode() {
  // TODO
}

/**
 * H-3: 招待コードで旅に参加する
 * データベースの join_trip 関数を呼ぶ（supabase/schema.sql 参照）
 *   const { data: tripId, error } = await supabase.rpc('join_trip', { p_code: code, p_display_name: displayName });
 * コードが見つからなければ「コードが見つかりません」と表示する
 * @param {string} code
 * @param {string} displayName
 * @returns {Promise<string>} 参加した旅のID
 */
export async function joinTripByCode(code, displayName) {
  // TODO
}

/**
 * H-4: 自分が参加している旅を新しい順に読み込む
 * @returns {Promise<Array<object>>}
 */
export async function fetchMyTrips() {
  // TODO
}

/**
 * H-4: 「京都旅行 (10/12)」の形で一覧表示する。タップで dates.html?trip=旅ID へ
 * @param {Array<object>} trips
 */
export function renderTripHistory(trips) {
  // TODO: #trip-history の中に表示する
}

// ---- ページを開いたときの処理 ----
async function init() {
  // 招待リンク（index.html?code=XXXXXX）から来たら、コード欄に入れておく
  const code = new URLSearchParams(location.search).get('code');
  if (code) document.getElementById('invite-code').value = code;

  if (USE_DUMMY) return; // ダミーの間はここまで
  // TODO: fetchMyTrips() → renderTripHistory()
}

init();
