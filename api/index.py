from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# FastAPIアプリケーションのインスタンスを作成
app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 許可するフロントエンドのオリジン
    allow_credentials=True,  # 資格情報の共有の可否
    allow_methods=["*"],  # 許可するHTTPリクエストメソッド
    allow_headers=["*"],  # フロントエンドからの認可するHTTPヘッダー情報
    # expose_headers=["Example-Header"],  # フロントエンドがアクセスできるHTTPヘッダー情報
)


# / に対するGETリクエストに応答するエンドポイントを作成
@app.get("/api/message")
def read_root():
    return {"message": "Hello, World"}


# /items/{item_id} に対するGETリクエストに応答するエンドポイントを作成
@app.get("/api/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
