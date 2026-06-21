# CLAUDE.md

全プロジェクト共通のCLAUDE.md（~/.claude/CLAUDE.md）の内容を参照してください。 

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 概要

UniBraille Viewer は、日本で使用される BES（点字電子書籍標準）ファイルや、世界的に普及している BRF などの各種点字ファイル（BRL, BSE）をブラウザで閲覧するためのビューアです。バイナリの BES ファイルおよび各種テキスト点字ファイルを Unicode 点字文字に変換し、ブラウザ上で読みやすい形式でレンダリングします。

## コマンド

```bash
npm install          # 依存パッケージのインストール
npm run dev          # ホットリロード付き開発サーバー（localhost:5173）
npm run build        # プロダクションビルド（出力先: dist/）
npm run preview      # プロダクションビルドのプレビュー
npm run lint         # Lint と自動修正
npm test             # テスト実行（watch モード）
npm test -- --run    # テストを一度だけ実行して終了
```

## アーキテクチャ

**Vue 3** のシングルページアプリケーション（ルーター・Pinia なし）。アプリ全体はコンポーネント 2 つと変換モジュール 2 つで構成されています。

- **`src/modules/bes2unicode.ts`** — コアロジック。BES ファイルの `Uint8Array` を受け取り、1029 バイトのヘッダーをスキップした後、各バイトを 2 桁の16進数文字列として Unicode 点字文字または特殊トークン（`@LB@`、`@PB@`、`@HR@`）にマッピングして Unicode 文字列として返す。

- **`src/modules/brf2unicode.ts`** — ASCII点字デコーダー。BRF/BRL/BSE で用いられる ASCII点字（NABCC）のテキストデータを Unicode点字文字に変換する `brf2unicode()`、および Unicode点字をアルファベット平文に逆変換する `unicode2brf()` を提供する。

- **`src/modules/brailleParser.ts`** — 点字文字列のパースロジック。`splitbraille()` がトークン区切りの文字列をページ・行単位に解析し、見出しを検出して `{ docTitle, title[], body[][] }` 構造の `ParsedBraille` オブジェクトを返す。`isHeader()` が見出し判定を担当。

- **`src/App.vue`** — ルートコンポーネント。`<input type="file">` またはクエリパラメータ `?url=` 経由のファイル取得を担当し、拡張子に応じて `bes2unicode()` または `brf2unicode()` を呼び出して得た Unicode 文字列を `braille` プロップとして `Braille` コンポーネントに渡す。

- **`src/components/Braille.vue`** — 点字コンテンツのレンダリング担当。`brailleParser.ts` の `splitbraille()` を使ってデータを整形し、目次ナビゲーションとページ単位の `<section>` をレンダリングする。`tenji` パッケージの `tenji.fromTenji()` を使った日本語読み仮名表示、または `unicode2brf()` を使ったアルファベット平文のオプション併記に対応。

## 点字文字列内の特殊トークン

| トークン | 意味 |
|---------|------|
| `@LB@` | 改行 |
| `@PB@` | 改ページ |
| `@HR@` | 水平線 |
| `@H1@` プレフィックス | 文書内の最初の見出し |
| `@H2@` プレフィックス | 各ページの見出し |

## 技術スタック

- Vue 3 + Composition API（`<script setup>`）
- TypeScript 5
- Oruga UI（Bulma テーマ）
- Vite 6 によるビルド
- Vitest によるユニットテスト
- PWA プラグイン（`src/registerServiceWorker.ts` でサービスワーカー登録）

## エディタ設定

**Volar**（Vue Language Features）を使用すること。Vue 3 の公式サポート拡張です。
