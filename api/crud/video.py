from sqlalchemy.orm import Session
from .. import models
from .. import schemas


def get_video(db: Session, video_id: int):
    return db.query(models.Video).filter(models.Video.id == video_id).first()


# ストリーマーのidによるvideoの取得
def get_videos_by_streamer_id(db: Session, streamer_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Video).filter(models.Video.streamer_id == streamer_id).offset(skip).limit(limit).all()


# video番号によるvideoの取得
def get_video_by_video_number(db: Session, video_number: str):
    return db.query(models.Video).filter(models.Video.video_number == video_number).all()


def get_videos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Video).offset(skip).limit(limit).all()


# ビデオの登録
def create_streamer_video(db: Session, video: schemas.VideoCreate, streamer_id: int):
    db_video = models.Video(
        date=video.date,
        title=video.title,
        duration=video.duration,
        video_number=video.video_number,
        view_count=video.view_count,
        thumbnail_url=video.thumbnail_url,
        embed_url=video.embed_url,
        streamer_id=streamer_id
    )
    db.add(db_video)
    db.commit()
    db.refresh(db_video)
    return db_video
