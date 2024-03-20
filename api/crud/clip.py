from sqlalchemy.orm import Session
from .. import models
from .. import schemas


# クリップの取得
def get_clip(db: Session, clip_id: int):
    return db.query(models.Clip).filter(models.Clip.id == clip_id).first()


# クリップ番号によるクリップの取得
def get_clip_by_clip_number(db: Session, clip_number: str):
    return db.query(models.Clip).filter(models.Clip.clip_number == clip_number).first()


# ストリーマー番号によるクリップの取得
def get_clips_by_streamer_id(db: Session, streamer_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Clip).filter(models.Clip.streamer_id == streamer_id).offset(skip).limit(limit).all()


# 複数のクリップの取得
def get_clips(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Clip).offset(skip).limit(limit).all()


# クリップの登録
def create_streamer_clip(db: Session, clip: schemas.ClipCreate, streamer_id: int):
    db_clip = models.Clip(
            date=clip.date,
            title=clip.title,
            game_id=clip.game_id,
            clip_number=clip.clip_number,
            view_count=clip.view_count,
            thumbnail_url=clip.thumbnail_url,
            embed_url=clip.embed_url,
            streamer_id=streamer_id
        )
    db.add(db_clip)
    db.commit()
    db.refresh(db_clip)
    return db_clip

