# new-support-tools

## Next + サーバーレスなモダンなフレームワークで実装する
### ファイル構成
```
.
├── Dockerfile
├── README.md
├── docker-compose.yml
├── lambda -> lambdaのディレクトリ
│   └── SampleFunction
│       ├── Dockerfile
│       ├── entry.sh
│       ├── go.mod
│       └── main.go
└── support-tools -> Nextのディレクトリ
    ├── README.md
    ├── next-env.d.ts
    ├── next.config.js
    ├── package.json
    ├── pages
    │   ├── _app.tsx
    │   ├── api
    │   │   └── hello.ts
    │   └── index.tsx
    ├── public
    │   ├── favicon.ico
    │   └── vercel.svg
    ├── styles
    │   ├── Home.module.css
    │   └── globals.css
    ├── tsconfig.json
    └── yarn.lock
```

### nodeのライブラリ一覧
- Nextjs
- typescript
- tRPC
- jest
- tailwind
- material-ui



### 立ち上げ方法

1. まず[old-support-tools](https://github.com/takenokoroid/old-support-tools)のdbをマイグレートした後に立ち上げてください(GO言語でのマイグレーションは作成していません)
LambdaではこのDBに接続します。
```
docker compose up db
```
2. その後、new-support-toolsのDockerを立ち上げます
```
docker compose up --build
```

> **注意:** 以下のエラーが出た場合
>
> ERROR [new-support-tools_sample-function internal] load metadata for public.ecr.aws/lambda/provided:al2
> => ERROR [new-support-tools_support-tools internal] load metadata for docker.io/library/node:18-alpine
>
> Lambdaを立ち上げるために以下のコマンドでLoginを行う必要がある可能性があります 
>```
> aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws
> ```

### usage

- Nextの表示

以下のurlをブラウザで表示することでNextの画面が表示できる
```
http://localhost:3001/
```

- Lambdaの仕様

以下のurlでlocalのLambdaにアクセスできます。

```
http://localhost:9000/2015-03-31/functions/function/invocations
```

以下のようにcurlで叩くとDBから持ってきたcgg_idの結果が返ってきます

```
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{}'
```

結果例

```
{"message":"cgg_id: GL1004","statusCode":200}
```