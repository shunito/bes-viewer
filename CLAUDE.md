# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 概要

BES Viewer は、日本で使用される BES（点字電子書籍標準）ファイルをブラウザで閲覧するためのビューアです。バイナリの BES ファイルを Unicode 点字文字に変換し、ブラウザ上で読みやすい形式でレンダリングします。

## コマンド

```bash
npm install          # 依存パッケージのインストール
npm run serve        # ホットリロード付き開発サーバー（localhost:8080）
npm run build        # プロダクションビルド（出力先: dist/）
npm run lint         # Lint と自動修正
```

> スクリプトでは `cross-env` 経由で `NODE_OPTIONS=--openssl-legacy-provider` が設定されています。Node.js バージョン互換性のために必要なため削除しないこと。

## アーキテクチャ

**Vue 2** のシングルページアプリケーション（ルーター・Vuex なし）。アプリ全体はコンポーネント 2 つと変換モジュール 1 つで構成されています。

- **`src/modules/bes2unicode.ts`** — コアロジック。BES ファイルの `Uint8Array` を受け取り、1029 バイトのヘッダーをスキップした後、各バイトを 2 桁の16進数文字列として Unicode 点字文字または特殊トークン（`@LB@`、`@PB@`、`@HR@`）にマッピングして Unicode 文字列として返す。

- **`src/App.vue`** — ルートコンポーネント。`<input type="file">` またはクエリパラメータ `?url=` 経由のファイル取得を担当し、`bes2unicode()` を呼び出して得た Unicode 文字列を `braille` プロップとして `Braille` コンポーネントに渡す。

- **`src/components/Braille.vue`** — 点字コンテンツのレンダリング担当。内部の `splitbraille()` 関数がトークン区切りの文字列をページ・行単位に解析し、見出しを検出（ページ内で最初に現れる十分な長さの行）して `{ docTitle, title[], body[][] }` 構造のオブジェクトを生成する。目次ナビゲーションとページ単位の `<section>` をレンダリングし、`tenji` パッケージの `tenji.fromTenji()` を使った読み仮名カラムのオプション表示にも対応。

## 点字文字列内の特殊トークン

| トークン | 意味 |
|---------|------|
| `@LB@` | 改行 |
| `@PB@` | 改ページ |
| `@HR@` | 水平線 |
| `@H1@` プレフィックス | 文書内の最初の見出し |
| `@H2@` プレフィックス | 各ページの見出し |

## 技術スタック

- Vue 2 + `vue-class-component` + `vue-property-decorator`（クラスベースコンポーネント）
- TypeScript（Babel 経由で ES5 にトランスパイル）
- Buefy（Bulma ベースの UI コンポーネントライブラリ）
- PWA プラグイン（`src/registerServiceWorker.ts` でサービスワーカー登録）
- `@vue/cli-service` による Webpack ビルド

## エディタ設定

**Vetur** を使用すること（Volar は不可）。Volar は Vue 2 のテンプレートで誤検知エラーを出します。`.vscode/` のワークスペース設定が既に適切に構成されています。
