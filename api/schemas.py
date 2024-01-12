from typing import List, Optional
from pydantic import BaseModel


# Item
class ItemBase(BaseModel):
    title: str
    description: Optional[str] = None


class ItemCreate(ItemBase):
    pass


class Item(ItemBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True


# User
class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    is_active: bool
    items: List[Item] = []

    class Config:
        orm_mode = True
        

# Video
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
        
        
# Clip
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


# Streamer
class StreamerBase(BaseModel):
    profile_id: str
    display_name: str
    profile_image_url: str
    uuid: str


class StreamerCreate(StreamerBase):
    pass


class SeriesBase(BaseModel):
    name: str
    date_start: str
    date_end: str
    uuid: str
    game_id: Optional[str] = None
    user_id: str
    

class Streamer(StreamerBase):
    id: int
    videos: List[Video] = []
    clips: List[Clip] = []
    # series: Optional[List[SeriesBase]]
    
    class Config:
        orm_mode = True
        
        
# Series
class SeriesCreate(SeriesBase):
    pass


class Series(SeriesBase):
    id: int
    # streamers: Optional[List[StreamerBase]]

    class Config:
        orm_mode = True


# association
class AssociationBase(BaseModel):
    streamer_uuid: str
    series_uuid: str
    

class AssociationCreate(AssociationBase):
    pass


class Association(AssociationBase):
    id: int

    class Config:
        orm_mode = True