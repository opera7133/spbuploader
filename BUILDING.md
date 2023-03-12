# SPBUploaderの構築

## 前提

- Node.js (16以上推奨)
- pnpm
- Git
- Firebase アカウント
- Amazon S3 (または類似のサービス)

## インストール

```bash
pnpm i
```

## 構成

1. `.env.sample`を`.env`としてコピーし、中身を編集します。
2. FirestoreにコレクションID`maps`、`uid`昇順、`createdAt`降順、`__name__`降順でインデックスを追加します。
3. `next.config.js`の`domains`に使用するバケットの公開URLを追加してください。

### Firestoreのセキュリティルール例

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read;
      allow write: if request.auth != null && request.auth.uid == uid;
    }
    match /maps/{id} {
      allow read;
      allow write: if request.auth != null && request.auth.uid == resource.data.uid;
    }
  }
}
```

## ビルド

```bash
pnpm run build
```

## 起動

```bash
pnpm run start
```