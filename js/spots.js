// スポット投票の関数（担当: スポット投票ペア）
// 仕様書 S-1〜S-4 に対応

import {
  supabase, getCurrentUser, getTripIdFromUrl, fetchTrip, fetchMembers,
  renderHeader, renderTabBar, subscribeChanges, showMessage,
} from './common.js';
import { USE_DUMMY } from './config.js';
import { DUMMY } from './dummy.js';

// ---- データの読み書き ----

/**
 * スポットを読み込む。各スポットに票数（votes）と自分が投票したか（votedByMe）を付けて返す
 * @returns {Promise<Array<{id, name, photo_url, added_by, votes, votedByMe}>>}
 */
export async function fetchSpots(tripId) {
  // TODO
}

/** ＋ボタンから呼ぶ。名前が空なら追加しない */
export async function addSpot(tripId, name) {
  // TODO
}

/** 追加した本人だけが削除できる */
export async function deleteSpot(spotId) {
  // TODO
}

/** ♡を押すと投票、もう一度押すと取り消し */
export async function toggleVote(spotId) {
  // TODO
}

// ---- 計算（データベースは使わない） ----

/** 「Search spot」欄の絞り込み */
export function filterSpots(spots, keyword) {
  // TODO
}

/** 票数の多い順。同数なら先に追加された順 */
export function sortSpotsByVotes(spots) {
  // TODO
}

// ---- 表示 ----

/** 名前・♡・票数を一覧表示。投票済みの♡は色つき */
export function renderSpotList(spots) {
  // TODO: #spots-root の中に表示する
}

// ---- ページを開いたときの処理 ----
async function init() {
  renderTabBar('spots');

  if (USE_DUMMY) {
    renderHeader(DUMMY.trip, DUMMY.members.length);
    // ダミーのスポットに票数を付けた例:
    // const spots = DUMMY.spots.map((s) => ({
    //   ...s,
    //   votes: DUMMY.spotVotes.filter((v) => v.spot_id === s.id).length,
    //   votedByMe: DUMMY.spotVotes.some((v) => v.spot_id === s.id && v.user_id === DUMMY.me.id),
    // }));
    // renderSpotList(sortSpotsByVotes(spots));
    return;
  }

  const tripId = getTripIdFromUrl();
  const [trip, members] = await Promise.all([fetchTrip(tripId), fetchMembers(tripId)]);
  renderHeader(trip, members.length);
  // TODO: fetchSpots → renderSpotList
  // TODO: subscribeChanges('spot_votes', tripId, ...) で他の人の投票を反映
}

init();
