from typing import Optional
from pydantic import BaseModel


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
    thumbnail_url: Optional[str] = None


class Streamer(StreamerBase):
    id: int
    
    class Config:
        orm_mode = True
        
        
# Series
class SeriesCreate(SeriesBase):
    pass


class Series(SeriesBase):
    id: int

    class Config:
        orm_mode = True


# association
# post用のモデル
class PostAssociationCreate(BaseModel):
    streamer_uuid: str
    series_id: int


class AssociationBase(BaseModel):
    streamer_uuid: str
    series_uuid: str
    

class AssociationCreate(AssociationBase):
    pass


class Association(AssociationBase):
    id: int

    class Config:
        orm_mode = True