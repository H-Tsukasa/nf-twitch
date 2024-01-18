from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import firebase_admin

from . import routers
from .config import Base, ENGINE, CRED
from . import firebase

# dbの作成
Base.metadata.create_all(bind=ENGINE)

# FastAPIアプリケーションのインスタンスを作成
app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

# ミドルウェアの定義
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 許可するフロントエンドのオリジン
    allow_credentials=True,  # 資格情報の共有の可否
    allow_methods=["*"],  # 許可するHTTPリクエストメソッド
    allow_headers=["*"],  # フロントエンドからの認可するHTTPヘッダー情報
)

# firebaseの認証
firebase_admin.initialize_app(CRED)
app.include_router(firebase.router)

# データベースに関するルーティング
app.include_router(routers.clip.router)
app.include_router(routers.video.router)
app.include_router(routers.streamer.router)
app.include_router(routers.series.router)
app.include_router(routers.streamer_series.router)
