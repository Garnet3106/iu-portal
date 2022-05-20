# Database

## assignment テーブル

|カラム名|説明|形式|データ型|属性|備考|
|:-:|:-:|:-:|:-:|:-:|:-:|
|id|課題 ID|UUID|CHAR(36)|PRIMARY KEY||
|registrar_id|課題登録者のユーザ ID|UUID|CHAR(36)|||
|registered_at|課題の登録時間|Timestamp|TIMESTAMP|||
|number_of_checkers|情報精査者の数|UInt|INT|ZEROFILL|新規カラム挿入時は値省略可|
|course_id|講義のコース ID|UUID|CHAR(36)|||
|lecture_id|課題元の講義 ID|UUID|CHAR(36)|||
|assigned_from|公開元のプラフォ ID|UUID|CHAR(36)||存在しなければ NULL|
|submit_to|提出先のプラフォ ID|UUID|CHAR(36)||存在しなければ NULL|
|deadline|提出期限時間|Timestamp|TIMESTAMP||期限がなければ NULL|
|description|課題の内容説明|Text|TEXT|||
|note|補足情報の説明|Text|TEXT|||

## course テーブル

|カラム名|説明|形式|データ型|属性|備考|
|:-:|:-:|:-:|:-:|:-:|:-:|
|id|科目 ID|UUID|CHAR(36)|PRIMARY KEY||
|code|科目コード|Text|TEXT||不明であれば NULL|
|name|科目名|Text|TEXT|||
|election_kind|選択 / 必修の種別|Enum|ENUM \*1|||
|number_of_credits|単位数|UInt|INT|UNSIGNED||
|academic_year|受講年度|UInt|INT|UNSIGNED||
|grade|受講学年|UInt|INT|UNSIGNED||
|semester|受講時期|Enum|ENUM \*2|||
|teacher_ids|学年|Text|TEXT||`,` で ID 分割|

\*1 `ENUM('REQUIRED', 'ELECTIVELY_REQUIRED', 'ELECTIVE')`
\*2 `ENUM('FIRST', 'SECOND')`

## lecture テーブル

|カラム名|説明|形式|データ型|属性|備考|
|:-:|:-:|:-:|:-:|:-:|:-:|
|id|コース ID|UUID|CHAR(36)|PRIMARY KEY||
|number_of_times|講義回数|UInt|INT|UNSIGNED||
|date|講義日程|Date|DATE|||

## user テーブル

|カラム名|説明|形式|データ型|属性|備考|
|:-:|:-:|:-:|:-:|:-:|:-:|
|id|ユーザ ID|UUID|CHAR(36)|PRIMARY KEY||
|email|登録メールアドレス|Text|TEXT|||
|firebase_id|Firebase 上の ユーザ ID|Text|TEXT|||
|is_admin|管理者かどうか|Boolean|BOOLEAN|||

## teacher テーブル

|カラム名|説明|形式|データ型|属性|備考|
|:-:|:-:|:-:|:-:|:-:|:-:|
|id|教員 ID|UUID|CHAR(36)|PRIMARY KEY||
|name|教員名|Text|TEXT|||

## platform テーブル

|カラム名|説明|形式|データ型|属性|備考|
|:-:|:-:|:-:|:-:|:-:|:-:|
|id|プラフォ ID|UUID|CHAR(36)|PRIMARY KEY||
|nickname|プラフォニックネーム|Text|TEXT|||

## access_log テーブル

|カラム名|説明|形式|データ型|属性|備考|
|:-:|:-:|:-:|:-:|:-:|:-:|
|id|ログ ID|UUID|CHAR(36)|PRIMARY KEY||
|url|アクセス先 URL|Text|TEXT \*1|||
