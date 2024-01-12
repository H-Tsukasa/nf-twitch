import sqlalchemy as sa
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


# class StreamerSeries(Base):
#     __tablename__ = "streamer_series"

#     streamer_id: Mapped[int] = mapped_column(primary_key=True)
#     series_id: Mapped[int] = mapped_column(primary_key=True)

association_table = sa.Table(
    'association',
    Base.metadata,
    sa.Column('streamer_uuid', sa.String(36), primary_key=True),
    sa.Column('series_uuid', sa.String(36), primary_key=True),
)


class Streamer(Base):
    __tablename__ = "streamers"
    __table_args__ = (
        sa.Index('streamers_uuid_idx', 'uuid', unique=True),
    )
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    uuid: Mapped[str] = mapped_column(sa.String(36), nullable=False)
    profile_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    display_name: Mapped[str] = mapped_column(String(100))
    profile_image_url: Mapped[str] = mapped_column(String(200))

    videos: Mapped[list["Video"]] = relationship(primaryjoin='foreign(Video.streamer_id) == Streamer.id')
    clips: Mapped[list["Clip"]] = relationship(primaryjoin='foreign(Clip.streamer_id) == Streamer.id')
    
    series: Mapped[list["Series"]] = relationship(
        "Series", 
        secondary="association", 
        back_populates="streamers", 
        primaryjoin="Streamer.uuid == foreign(association.c.streamer_uuid)",
        secondaryjoin="foreign(association.c.series_uuid) == Series.uuid",
    )

class Series(Base):
    __tablename__ = "series"
    __table_args__ = (
        sa.Index('series_uuid_idx', 'uuid', unique=True),
    )
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    uuid: Mapped[str] = mapped_column(sa.String(36), nullable=False)
    name: Mapped[str] = mapped_column(String(100))
    date_start: Mapped[str] = mapped_column(String(30))
    date_end: Mapped[str] = mapped_column(String(30))
    game_id: Mapped[str] = mapped_column(String(20), nullable=True)
    user_id: Mapped[str] = mapped_column(String(30))
    

    streamers: Mapped[list["Streamers"]] = relationship(
            "Streamer", 
            secondary="association", 
            back_populates="series", 
            primaryjoin="Series.uuid == foreign(association.c.series_uuid)",
            secondaryjoin="foreign(association.c.streamer_uuid) == Streamer.uuid",
        )