from sqlalchemy import String
from sqlalchemy.orm import (
    # DeclarativeBase,
    Mapped,
    # Session,
    mapped_column,
    relationship,
    # sessionmaker,
)
from ..config import Base


class Video(Base):
    __tablename__ = "videos"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    date: Mapped[str] = mapped_column(String(40))
    title: Mapped[str] = mapped_column(String(300))
    duration: Mapped[str] = mapped_column(String(15))
    video_number: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    view_count: Mapped[int]
    thumbnail_url: Mapped[str] = mapped_column(String(300))
    embed_url: Mapped[str] = mapped_column(String(300))

    streamer_id: Mapped[int]