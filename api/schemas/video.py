from pydantic import BaseModel


class VideoBase(BaseModel):
    date: str
    video_number: str
    view_count: int
    title: str
    duration: str
    thumbnail_url: str
    embed_url: str


class VideoCreate(VideoBase):
    pass


class Video(VideoBase):
    id: int
    streamer_id: int

    class Config:
        orm_mode = True