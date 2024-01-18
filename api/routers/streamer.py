from fastapi import APIRouter, Depends, HTTPException

from .. import schemas
from .. import crud
from ..database import get_db

from typing import List
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/api/streamers/", response_model=schemas.Streamer)
def create_streamer(streamer: schemas.StreamerCreate, db: Session = Depends(get_db)):
    db_streamer = crud.streamer.get_streamer_by_profile_id(db=db, profile_id=streamer.profile_id)
    if db_streamer:
        raise HTTPException(status_code=400, detail="Streamer already registered")
    return crud.streamer.create_streamer(db=db, streamer=streamer)


@router.get("/api/streamers/", response_model=List[schemas.Streamer])
def read_streamers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    streamers = crud.streamer.get_streamers(db, skip=skip, limit=limit)
    return streamers


@router.get("/api/streamers/{streamer_id}", response_model=schemas.Streamer)
def read_streamer(streamer_id: int, db: Session = Depends(get_db)):
    db_streamer = crud.streamer.get_streamer(db, streamer_id=streamer_id)
    if db_streamer is None:
        raise HTTPException(status_code=404, detail="Streamer not found")
    return db_streamer

