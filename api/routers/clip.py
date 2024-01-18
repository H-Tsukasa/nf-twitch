from fastapi import APIRouter, Depends, HTTPException

from .. import schemas
from .. import crud
from ..database import get_db

from typing import List
from sqlalchemy.orm import Session

router = APIRouter()

@router.get("/api/clips/", response_model=List[schemas.Clip])
def read_clips(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    clips = crud.clip.get_clips(db, skip=skip, limit=limit)
    return clips


@router.get("/api/clips/{streamer_id}", response_model=List[schemas.Clip])
def read_clips_by_streamer_id(streamer_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    clips = crud.clip.get_clips_by_streamer_id(db, skip=skip, limit=limit, streamer_id=streamer_id)
    return clips


@router.post("/api/streamers/{streamer_id}/clips/", response_model=schemas.Clip)
def create_clip_for_streamer(
        streamer_id: int, clip: schemas.ClipCreate, db: Session = Depends(get_db)
):
    db_clip = crud.clip.get_clip_by_clip_number(db=db, clip_number=clip.clip_number)
    if db_clip:
        raise HTTPException(status_code=400, detail="Clip already registered")
    return crud.clip.create_streamer_clip(db=db, clip=clip, streamer_id=streamer_id)
