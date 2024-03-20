from sqlalchemy.orm import Session

from .. import schemas
from .. import models
import uuid


# ストリーマーの取得
def get_streamer(db: Session, streamer_id: int):
    return db.query(models.Streamer).filter(models.Streamer.id == streamer_id).first()


# プロフィールIDによるストリーマーの取得
def get_streamer_by_profile_id(db: Session, profile_id: str):
    return db.query(models.Streamer).filter(models.Streamer.profile_id == profile_id).first()


# 複数のストリーマーの取得
def get_streamers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Streamer).offset(skip).limit(limit).all()


# ストリーマーの登録
def create_streamer(db: Session, streamer: schemas.StreamerCreate):
    db_streamer = models.Streamer(
        profile_id=streamer.profile_id,
        display_name=streamer.display_name,
        profile_image_url=streamer.profile_image_url,
        uuid=str(uuid.uuid4())
    )
    db.add(db_streamer)
    db.commit()
    db.refresh(db_streamer)
    return db_streamer
