// Supabase の接続情報
// Supabase の管理画面「Project Settings → API」からコピーして貼り付けてください。
// anon キーは公開してよいキーなので、このままコミットして大丈夫です。
// service_role キーは絶対にここに書かないでください。

export const SUPABASE_URL = 'https://xxxxxxxxxxxx.supabase.co';
export const SUPABASE_ANON_KEY = 'ここに anon キーを貼り付ける';

// true の間は、各ページが js/dummy.js のダミーデータで動きます。
// Supabase の準備ができたら false にします。
export const USE_DUMMY = true;
