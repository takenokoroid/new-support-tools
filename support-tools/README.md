# Nextでsuport-toolを作成した

## 立ち上げ方
Dockerを以下の形式で立ち上げる
```
docker compose up
```
## ファイル構造
```
.
├── README.md
├── customHooks.ts
├── next-env.d.ts
├── next.config.js
├── package.json
├── pages
│   ├── _app.tsx
│   ├── api
│   │   └── search-service.ts サーバーにアクセスしているAPI要素を管理している
│   ├── components
│   │   ├── Header.tsx ヘッダー用のコンポーネント
│   │   ├── SearchForm.tsx 検索フォームをまとめたコンポーネント
│   │   ├── SearchResult.tsx 検索結果を表示するコンポーネント
│   │   └── SearchWrapper.tsx 検索部分をまとめるコンポーネント
│   └── index.tsx メインのコンポーネント
├── postcss.config.js
├── prettier.config.js
├── public
│   ├── favicon.ico
│   └── vercel.svg
├── styles
│   ├── SearchResult.module.css SearchResultのCSS要素
│   ├── globals.css グローバルCSSの要素
│   └── lib.css 共通のCSS要素
├── tailwind.config.js
├── tsconfig.json
├── type
│   └── lib.d.ts 型要素の定義ファイル
└── yarn.lock
```

