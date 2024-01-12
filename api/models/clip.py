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


class Clip(Base):
    __tablename__ = "clips"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    date: Mapped[str] = mapped_column(String(100))
    title: Mapped[str] = mapped_column(String(100))
    game_id: Mapped[str] = mapped_column(String(10))
    clip_number: Mapped[str] = mapped_column(String(60), index=True)
    view_count: Mapped[int]
    thumbnail_url: Mapped[str] = mapped_column(String(300))
    embed_url: Mapped[str] = mapped_column(String(300))

    streamer_id: Mapped[int]