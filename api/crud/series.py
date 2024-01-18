from sqlalchemy.orm import Session

from .. import schemas
from .. import models
import uuid


def get_series(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Series).offset(skip).limit(limit).all()


def get_series_by_id(db: Session, series_id: int):
    return db.query(models.Series).filter(models.Series.id == series_id).first()


# ユーザIDによる取得
def get_series_by_user_id(db: Session, user_id: int):
    return db.query(models.Series).filter(models.Series.user_id == user_id).all()


# 時系列の作成
def create_series(db: Session, series: schemas.SeriesCreate):
    db_series = models.Series(
            name=series.name,
            date_start=series.date_start,
            date_end=series.date_end,
            game_id=series.game_id,
            uuid=str(uuid.uuid4()),
            user_id=series.user_id,
            thumbnail_url=series.thumbnail_url
        )
    db.add(db_series)
    db.commit()
    db.refresh(db_series)
    return db_series
