<p align="center">
  <a href="https://nextjs-fastapi-starter.vercel.app/">
    <img src="./public/logo.svg" height="96">
    <h3 align="center">NF-tiwtch</h3>
  </a>
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
│   ├── models
│   ├── lib
│   ├── config.py
│   ├── crud.py
│   ├── main.py
│   └── schemas.py
├── app
│   ├── (auth)
│   ├── (main)
│   ├── components
│   ├── context
│   ├── hooks
│   ├── lib
│   └── types
│   ├── apiClient.ts
│   └── globals.css
│   └── layout.tsx
├── components.json
├── get_clips.py
├── get_streamer_datas.py
├── get_video.py
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