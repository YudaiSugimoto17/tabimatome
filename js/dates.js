// 日程調整の関数（担当: 日程調整ペア）
// 仕様書 D-1〜D-12 に対応
// ○△× はデータ上 'ok' / 'maybe' / 'ng' と書きます

import {
  supabase, getCurrentUser, getTripIdFromUrl, fetchTrip, fetchMembers,
  renderHeader, renderTabBar, subscribeChanges, formatDate, showMessage,
} from './common.js';
import { USE_DUMMY } from './config.js';
import { DUMMY } from './dummy.js';

// ---- データの読み書き ----

/** 候補日を日付の早い順に読み込む */
export async function fetchCandidateDates(tripId) {
  // TODO
}

/** 候補日を追加する */
export async function addCandidateDate(tripId, date) {
  // TODO
}

/** 全員の○△×を読み込む */
export async function fetchAvailabilities(tripId) {
  // TODO
}

/**
 * 自分の回答を保存する（前の回答は上書き）。「保存してみんなに共有」で呼ぶ
 * @param {string} tripId
 * @param {Array<{candidate_date_id: string, status: 'ok'|'maybe'|'ng'}>} answers
 */
export async function saveMyAvailabilities(tripId, answers) {
  // TODO: upsert を使うと上書きしやすい
}

/** 旅の日程を確定して保存する（trips.confirmed_date） */
export async function confirmDate(tripId, date) {
  // TODO
}

// ---- 計算（データベースは使わない） ----

/** ○ → △ → × → ○ の順に切り替える */
export function nextStatus(status) {
  // TODO
}

/**
 * 日ごとに○・△・×の人数を数える
 * @returns {Array<{candidate_date_id, date, ok, maybe, ng}>}
 */
export function countByDate(dates, answers) {
  // TODO
}

/** 最適日を返す。○が最多 → 同数なら×が少ない日 → それも同じなら早い日 */
export function findBestDate(counts) {
  // TODO
}

/** 画面③のランキング用に並べ替える。並べ方は findBestDate と同じ */
export function rankDates(counts) {
  // TODO
}

/** 「回答 4/5」用 @returns {{answered: number, total: number}} */
export function countAnswered(answers, members) {
  // TODO
}

// ---- 表示 ----

/** 画面①: 全員の○△×の表。最適日の列を色つきにする */
export function renderDateTable(dates, members, answers) {
  // TODO: #dates-root の中に表示する
}

/** 画面②: 自分の予定の入力画面 */
export function renderInputForm(dates, myAnswers) {
  // TODO
}

/** 画面③: 候補日ランキング（緑○・黄△・灰×の棒つき） */
export function renderRanking(rankedCounts) {
  // TODO
}

// ---- ページを開いたときの処理 ----
async function init() {
  renderTabBar('dates');

  if (USE_DUMMY) {
    renderHeader(DUMMY.trip, DUMMY.members.length);
    // 作った関数はここで試せます。例:
    // renderDateTable(DUMMY.candidateDates, DUMMY.members, DUMMY.availabilities);
    return;
  }

  const tripId = getTripIdFromUrl();
  const [trip, members] = await Promise.all([fetchTrip(tripId), fetchMembers(tripId)]);
  renderHeader(trip, members.length);
  // TODO: 候補日と回答を読み込んで renderDateTable
  // TODO: subscribeChanges('availabilities', tripId, ...) で他の人の入力を反映
}

init();
