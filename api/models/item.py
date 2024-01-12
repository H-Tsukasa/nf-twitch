from sqlalchemy import  String
from sqlalchemy.orm import (
    # DeclarativeBase,
    Mapped,
    # Session,
    relationship,
    mapped_column,
    # sessionmaker,
)
from ..config import Base


class Item(Base):
    __tablename__ = "items"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(30), index=True)
    description: Mapped[str] = mapped_column(String(30), index=True)

    user_id: Mapped[int]