# SPBUploaderの構築

## 前提

- Node.js (16以上推奨)
- pnpm
- Git

## インストール

```bash
pnpm i
```

## 構成

1. `.env.sample`を`.env`としてコピーし、中身を編集します。
2. `next.config.js`の`domains`に使用するバケットの公開URLを追加してください。

## ビルド

```bash
pnpm run build
```

## 起動

```bash
pnpm run start
```