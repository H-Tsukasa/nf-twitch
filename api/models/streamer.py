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


class Streamer(Base):
    __tablename__ = "streamers"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    profile_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    display_name: Mapped[str] = mapped_column(String(100))
    profile_image_url: Mapped[str] = mapped_column(String(200))

    videos: Mapped[list["Video"]] = relationship(primaryjoin='foreign(Video.streamer_id) == Streamer.id')
    clips: Mapped[list["Clip"]] = relationship(primaryjoin='foreign(Clip.streamer_id) == Streamer.id')
    series: Mapped[list["Series"]] = relationship("Series", secondary="streamer_series", viewonly=True, back_populates="streamers", primaryjoin="foreign(StreamerSeries.streamer_id) == Streamer.id")
    # series: Mapped[list["Series"]] = relationship(primaryjoin='foreign(Video.streamer_id) == Streamer.id')