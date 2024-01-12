from fastapi import Depends, HTTPException, status, Response, FastAPI
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin

from typing import List
from sqlalchemy.orm import Session

from . import crud, schemas
from .config import Base, ENGINE, CRED, session
from pydantic import BaseModel
from firebase_admin import auth

Base.metadata.create_all(bind=ENGINE)

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

# firebaseの認証
firebase_admin.initialize_app(CRED)


# dbの定義
def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()


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
    

# dbに関するapi

# streamer
@app.post("/api/streamers/", response_model=schemas.Streamer)
def create_streamer(streamer: schemas.StreamerCreate, db: Session = Depends(get_db)):
    db_streamer = crud.get_streamer_by_profile_id(db=db, profile_id=streamer.profile_id)
    if db_streamer:
        raise HTTPException(status_code=400, detail="Streamer already registered")
    return crud.create_streamer(db=db, streamer=streamer)


@app.get("/api/streamers/", response_model=List[schemas.Streamer])
def read_streamers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    streamers = crud.get_streamers(db, skip=skip, limit=limit)
    return streamers


@app.get("/api/streamers/{streamer_id}", response_model=schemas.Streamer)
def read_streamer(streamer_id: int, db: Session = Depends(get_db)):
    db_streamer = crud.get_streamer(db, streamer_id=streamer_id)
    if db_streamer is None:
        raise HTTPException(status_code=404, detail="Streamer not found")
    return db_streamer


@app.post("/api/streamers/{streamer_id}/videos/", response_model=schemas.Video)
def create_video_for_streamer(
        streamer_id: int, video: schemas.VideoCreate, db: Session = Depends(get_db)
):
    return crud.create_streamer_video(db=db, video=video, streamer_id=streamer_id)


@app.post("/api/streamers/{streamer_id}/clips/", response_model=schemas.Clip)
def create_clip_for_streamer(
        streamer_id: int, clip: schemas.ClipCreate, db: Session = Depends(get_db)
):
    db_clip = crud.get_clip_by_clip_number(db=db, clip_number=clip.clip_number)
    if db_clip:
        raise HTTPException(status_code=400, detail="Clip already registered")
    return crud.create_streamer_clip(db=db, clip=clip, streamer_id=streamer_id)


# series
@app.get("/api/series/", response_model=List[schemas.Series])
def read_series(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    series = crud.get_series(db, skip=skip, limit=limit)
    return series


@app.post("/api/series/", response_model=schemas.Series)
def create_series(series: schemas.SeriesCreate, db: Session = Depends(get_db)):
    return crud.create_series(db=db, series=series)


# streamer-series
# seriesに属しているstreamerを検索
@app.get("/api/streamer_series/streamers/{series_id}")
def read_streamers_by_series_id(series_id: int, db: Session = Depends(get_db)):
    db_streamer = crud.get_series_by_id(db, series_id=series_id)
    return db_streamer.streamers


# streamerが属しているseriesを検索
@app.get("/api/streamer_series/series/{streamer_id}")
def read_series_by_streamer_id(streamer_id: int, db: Session = Depends(get_db)):
    db_streamer = crud.get_streamer(db, streamer_id=streamer_id)
    return db_streamer.series


# streamerとseriesの登録
@app.post("/api/streamer_series/", response_model=schemas.Association)
def create_association(streamer_series: schemas.AssociationCreate, db: Session = Depends(get_db)):
    db_s = crud.get_by_streamer_series_id(db=db, streamer_series=streamer_series)
    if db_s:
        raise HTTPException(status_code=400, detail="Association already registered")
    crud.create_streamer_series(streamer_series=streamer_series, db=db)
    return JSONResponse(status_code=status.HTTP_200_OK, content={"msg": "Success"})

# video
@app.get("/api/videos/", response_model=List[schemas.Video])
def read_videos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    videos = crud.get_videos(db, skip=skip, limit=limit)
    return videos


# clip
@app.get("/api/clips/", response_model=List[schemas.Clip])
def read_clips(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    clips = crud.get_clips(db, skip=skip, limit=limit)
    return clips

# firebaseの認証
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
