from fastapi import FastAPI, Depends, HTTPException, status, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import firebase_admin
from firebase_admin import auth, credentials

cred = credentials.Certificate("./serviceAccountKey.json")
firebase_admin.initialize_app(cred)

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


# リクエストボディの定義
class Message(BaseModel):
    name: str


# 認証関数の定義
def get_current_user(
    res: Response,
    cred: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
):
    if cred is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Bearer authentication required",
            headers={"WWW-Authenticate": 'Bearer realm="auth_required"'},
        )
    try:
        decoded_token = auth.verify_id_token(cred.credentials)
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials. {err}",
            headers={"WWW-Authenticate": 'Bearer error="invalid_token"'},
        )
    res.headers["WWW-Authenticate"] = 'Bearer realm="auth_required"'
    return decoded_token


class JwtToken(BaseModel):
    token: str


@app.post("/api/verify")
def verify_jwt(item: JwtToken):
    try:
        decoded_token = auth.verify_id_token(item.token)
    except Exception:
        print("decode不可")
        return {"uid": ""}
    uid = decoded_token["uid"]
    return {"uid": uid}


# / に対するGETリクエストに応答するエンドポイントを作成
@app.get("/api/message")
def read_root():
    return {"message": "Hello, World"}


# /items/{item_id} に対するGETリクエストに応答するエンドポイントを作成
@app.get("/api/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}


# getを定義
@app.get("/api/hello")
def read_root2(cred=Depends(get_current_user)):
    uid = cred.get("uid")
    return {"message": f"Hello, {uid}!"}


# postを定義
@app.post("/api/hello")
def create_message(message: Message, cred=Depends(get_current_user)):
    uid = cred.get("uid")
    return {"message": f"Hello, {message.name}! Your uid is [{uid}]"}
