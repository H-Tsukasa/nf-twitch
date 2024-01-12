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


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(100))
    is_active: Mapped[bool] = mapped_column(default=True)

    items: Mapped[list["Item"]] = relationship(primaryjoin='foreign(Item.user_id) == User.id')