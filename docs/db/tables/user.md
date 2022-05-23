# ユーザ関連テーブル

## user テーブル

|カラム名|説明|形式|データ型|属性|備考|
|:-:|:-:|:-:|:-:|:-:|:-:|
|id|ユーザ ID|UUID|CHAR(36)|PRIMARY KEY||
|email|登録メールアドレス|Text|TEXT|||
|google_access_token|ハッシュ化した Google アカウントのアクセストークン|Text|TEXT|||
|is_admin|管理者かどうか|Boolean|BOOLEAN|||

## user_setting テーブル

|カラム名|説明|形式|データ型|属性|備考|
|:-:|:-:|:-:|:-:|:-:|:-:|
|id|ユーザ ID|UUID|CHAR(36)|PRIMARY KEY||
|nickname|ユーザのニックネーム|User Nickname|TEXT|||
|display_language|表示言語コード|Enum|ENUM \*1|||
|display_font|表示フォント名|Font Name|TEXT|||
|sound_effect|操作時の効果音|Click Sound|TEXT|||
|reduce_motion|モーションを低減するかどうか|Boolean|BOOLEAN|||
|color_img|色及び画像の設定|ColorImg JSON \*2|TEXT|||

\*1 `ENUM('en_us', 'ja', 'ja_kana')`
\*2 [background.json](../samples/settings/colorimg.json) を参照
