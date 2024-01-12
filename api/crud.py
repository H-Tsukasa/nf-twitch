from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from . import models, schemas
import uuid



# userに関する処理
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(email=user.email, hashed_password=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# itemに関する処理
def get_items(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Item).offset(skip).limit(limit).all()


# user-itemに関する処理
def create_user_item(db: Session, item: schemas.ItemCreate, user_id: int):
    db_item = models.Item(**item.dict(), user_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


# streamerに関する処理
def get_streamer(db: Session, streamer_id: int):
    return db.query(models.Streamer).filter(models.Streamer.id == streamer_id).first()


def get_streamer_by_profile_id(db: Session, profile_id: str):
    return db.query(models.Streamer).filter(models.Streamer.profile_id == profile_id).first()


def get_streamers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Streamer).offset(skip).limit(limit).all()


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


# seriesに関する処理
def get_series(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Series).offset(skip).limit(limit).all()


def get_series_by_id(db: Session, series_id: int):
    return db.query(models.Series).filter(models.Series.id == series_id).first()


def create_series(db: Session, series: schemas.SeriesCreate):
    db_series = models.Series(
            name=series.name,
            date_start=series.date_start,
            date_end=series.date_end,
            game_id=series.game_id,
            uuid=str(uuid.uuid4()),
            user_id=series.user_id
        )
    db.add(db_series)
    db.commit()
    db.refresh(db_series)
    return db_series


# streamer-seriesに関する処理
# def get_streamer_by_series_id()


def get_by_streamer_series_id(db: Session, streamer_series: schemas.Association):
    sql = text(f"select * from association where streamer_uuid = '{streamer_series.streamer_uuid}' and series_uuid = '{streamer_series.series_uuid}'")
    result = db.execute(sql)
    for row in result:
        dict_a = {"streamer_id": row[0], "series_id": row[0]}
        return dict_a


def create_streamer_series(db: Session, streamer_series: schemas.Association):
    sql = text(f"insert into association (streamer_uuid, series_uuid) values ('{streamer_series.streamer_uuid}', '{streamer_series.series_uuid}');")
    db.execute(sql)
    db.commit()
    return 


# videoに関する処理
def get_video(db: Session, video_id: int):
    return db.query(models.Video).filter(models.Video.id == video_id).first()


def get_videos_by_streamer_id(db: Session, streamer_id: int):
    return db.query(models.Video).filter(models.Video.streamer_id == streamer_id).all()


def get_video_by_video_number(db: Session, video_number: str):
    return db.query(models.Video).filter(models.Video.video_number == video_number).all()


def get_videos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Video).offset(skip).limit(limit).all()


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


# clipに関する処理
def get_clip(db: Session, clip_id: int):
    return db.query(models.Clip).filter(models.Clip.id == clip_id).first()


def get_clip_by_clip_number(db: Session, clip_number: str):
    return db.query(models.Clip).filter(models.Clip.clip_number == clip_number).first()


def get_clips_by_streamer_id(db: Session, streamer_id: int):
    return db.query(models.Clip).filter(models.Clip.streamer_id == streamer_id).all()


def get_clips(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Clip).offset(skip).limit(limit).all()


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
