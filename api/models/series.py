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


class Series(Base):
    __tablename__ = "series"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100))
    date_start: Mapped[str] = mapped_column(String(30))
    date_end: Mapped[str] = mapped_column(String(30))
    game_id: Mapped[str] = mapped_column(String(20), nullable=True)

    streamers: Mapped[list["Streamers"]] = relationship("Streamer", secondary="streamer_series", back_populates="series", primaryjoin="StreamerSeries.series_id == Series.id")