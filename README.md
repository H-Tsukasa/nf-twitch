<p align="center">
    <img src="./public/logo.svg" height="96">
    <h3 align="center">NF-tiwtch</h3>
</p>

<p align="center">複数のストリーマーの配信・クリップを簡単に確認</p>
<br/>

## アプリケーションの概要

このアプリケーションでは，[Twitch](https://www.twitch.tv/)</a>で活動するストリーマーの配信情報を簡単に確認することができます．
Googleアカウントでログイン後，簡単に利用することができます．

## 開発環境
- フロントエンド：Next.js==13.4.4
- バックエンド  ：FastAPI==0.100.1
- データベース  ：[PlanetScale](https://planetscale.com/) 
- ユーザ認証    ：[Firebase](https://firebase.google.com/?hl=ja)

## 構成
```
├── README.md
├── api
│   ├── __init__.py
│   ├── models # dbのモデルの定義
│   ├── schemas # モデル操作に利用するクラス定義
│   ├── crud # apiで利用するメソッドの定義
│   ├── routers # エンドポイントの定義
│   ├── tests
│   ├── config.py # 環境変数など
│   ├── database.py
│   ├── firebase.py
│   └── main.py
├── app
│   ├── (auth) # 認証ページ
│   ├── (main) # 実際にアプリケーションとして使うページ
│   ├── components
│   ├── context
│   ├── hooks
│   ├── lib
│   └── types
│   └── globals.css
│   └── layout.tsx
├── components.json
├── next-env.d.ts
├── next.config.js
├── node_modules
├── package.json
├── postcss.config.js
├── public
├── requirements.txt
├── tailwind.config.js
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```
## 主なライブラリ
- python
  
  ```
  fastapi
  uvicorn[standard]
  firebase-admin
  pydantic
  python-dotenv=
  python-multipart
  sqlalchemy
  mysqlclient
  mysql-connector-python
  ```
- node
  ```
  next
  react
  tailwind
  ```