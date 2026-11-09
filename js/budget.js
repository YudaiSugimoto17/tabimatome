// 支払い・割り勘の関数（担当: 支払い・割り勘ペア）
// 仕様書 B-1〜B-5 に対応
// おすすめ: calc の3関数を先に作り、ダミーデータで計算が合うか確かめてから画面を作る

import {
  supabase, getCurrentUser, getTripIdFromUrl, fetchTrip, fetchMembers,
  renderHeader, renderTabBar, subscribeChanges, formatYen, formatDate, showMessage,
} from './common.js';
import { USE_DUMMY } from './config.js';
import { DUMMY } from './dummy.js';

// ---- データの読み書き ----

/** 支払いを日付の新しい順に読み込む */
export async function fetchExpenses(tripId) {
  // TODO
}

/**
 * 「追加する」で呼ぶ。金額が0以下・未入力なら追加しない
 * @param {string} tripId
 * @param {{payerId: string, title: string, amount: number, paidOn: string}} expense
 */
export async function addExpense(tripId, expense) {
  // TODO
}

/** 支払い履歴から編集 */
export async function updateExpense(expenseId, expense) {
  // TODO
}

/** 支払い履歴から削除 */
export async function deleteExpense(expenseId) {
  // TODO
}

/** 精算の行に「支払い済み」を付ける */
export async function markSettlementPaid(tripId, from, to) {
  // TODO
}

// ---- 計算（データベースは使わない） ----

/** 「旅の合計」用 */
export function calcTotal(expenses) {
  // TODO
}

/**
 * 各自の「払った額 − 合計÷人数」。プラス＝もらう側、マイナス＝払う側
 * @returns {Array<{userId: string, balance: number}>}
 */
export function calcBalances(expenses, members) {
  // TODO
}

/**
 * 払う額が一番大きい人から、もらう額が一番大きい人へ順に割り当てる。端数は切り捨て
 * 確かめ方: 3人でAさんが9,000円払った → [{from:B,to:A,amount:3000},{from:C,to:A,amount:3000}]
 * @returns {Array<{from: string, to: string, amount: number}>}
 */
export function calcSettlements(balances) {
  // TODO
}

// ---- 表示 ----

/** 画面上部の「旅の合計：47,000円」 */
export function renderSummary(total) {
  // TODO: #budget-root の中に表示する
}

/** 「自分 レンタカー代 12,000」の一覧 */
export function renderExpenseHistory(expenses, members) {
  // TODO
}

/** 「ケン → ミカ 3,500円」の一覧 */
export function renderSettlements(settlements, members) {
  // TODO
}

// ---- ページを開いたときの処理 ----
async function init() {
  renderTabBar('budget');

  if (USE_DUMMY) {
    renderHeader(DUMMY.trip, DUMMY.members.length);
    // 作った関数はここで試せます。例:
    // console.log(calcSettlements(calcBalances(DUMMY.expenses, DUMMY.members)));
    return;
  }

  const tripId = getTripIdFromUrl();
  const [trip, members] = await Promise.all([fetchTrip(tripId), fetchMembers(tripId)]);
  renderHeader(trip, members.length);
  // TODO: fetchExpenses → renderSummary / renderExpenseHistory / renderSettlements
  // TODO: subscribeChanges('expenses', tripId, ...) で他の人の入力を反映
}

init();
