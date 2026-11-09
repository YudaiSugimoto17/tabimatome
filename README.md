# 旅まとめ（Tabi-Matome）

グループ旅行の「日程・行先・割り勘」をまとめて管理する Web アプリです。

- 仕様書: [docs/仕様書.docx](docs/仕様書.docx)
- 開発ガイド（使用言語・関数一覧・Git の使い方）: [docs/開発ガイド.docx](docs/開発ガイド.docx)

## 使っているもの

HTML / CSS / JavaScript（フレームワークなし）、Supabase（データ保存）、GitHub Pages（公開）

## フォルダ構成と担当

| ファイル | 内容 | 担当 |
| --- | --- | --- |
| `index.html` / `js/home.js` / `css/home.css` | ホーム | ホームチーム |
| `js/common.js` / `css/common.css` / `js/config.js` / `js/dummy.js` | 共通部分 | ホームチーム |
| `dates.html` / `js/dates.js` / `css/dates.css` | 日程調整 | 日程調整ペア |
| `spots.html` / `js/spots.js` / `css/spots.css` | スポット投票 | スポット投票ペア |
| `budget.html` / `js/budget.js` / `css/budget.css` | 支払い・割り勘 | 支払い・割り勘ペア |
| `supabase/schema.sql` | データベースの定義 | ホームチーム |

自分の担当ファイル以外は変更しないでください。共通部分を変えたいときはホームチームに相談してください。

## 手元で動かす

JavaScript を `type="module"` で読み込んでいるので、HTML ファイルをダブルクリックで開くと動きません。
次のどちらかでローカルサーバーを立ててから開いてください。

- VS Code の拡張機能「Live Server」で `index.html` を開く
- ターミナルでこのフォルダに移動して `python3 -m http.server 8000` を実行し、ブラウザで http://localhost:8000 を開く

`js/config.js` の `USE_DUMMY` が `true` の間は、各ページが `js/dummy.js` のダミーデータで動きます。
Supabase の準備を待たずに画面を作り始められます。

## Supabase の準備（ホームチームが1回だけ）

1. https://supabase.com でプロジェクトを作る
2. 「SQL Editor」で `supabase/schema.sql` の中身を貼り付けて実行する
3. 「Authentication → Sign In / Providers」で Anonymous sign-ins（匿名ログイン）をオンにする
4. 「Project Settings → API」の Project URL と anon キーを `js/config.js` に貼り付ける
5. `USE_DUMMY` を `false` にする

anon キーは公開してよいキーです。**service_role キーは絶対にコミットしないでください。**

## 公開（GitHub Pages）

リポジトリの Settings → Pages で、Source を「Deploy from a branch」、Branch を `main` / `/ (root)` にして保存します。
数分後に `https://yudaisugimoto17.github.io/tabimatome/` で公開されます。

## 作業の流れ

```bash
git switch main
git pull
git switch -c dates/input-form      # 機能名/やること
# …コードを書く…
git add js/dates.js dates.html
git commit -m "日程調整: 入力画面を追加"
git push -u origin dates/input-form
```

GitHub でプルリクエストを作り、確認してもらってから main にマージします。main に直接 push しないでください。
