from typing import Optional
from pydantic import BaseModel


class ClipBase(BaseModel):
    date: str
    clip_number: str
    view_count: int
    game_id: Optional[str]
    title: str
    thumbnail_url: str
    embed_url: str


class ClipCreate(ClipBase):
    pass


class Clip(ClipBase):
    id: int
    streamer_id: int

    class Config:
        orm_mode = True
