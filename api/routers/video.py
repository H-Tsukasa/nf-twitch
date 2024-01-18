from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from .. import schemas
from .. import crud
from ..database import get_db

from typing import List
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/api/videos/", response_model=List[schemas.Video])
def read_videos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    videos = crud.video.get_videos(db, skip=skip, limit=limit)
    print(videos)
    return JSONResponse(status_code=status.HTTP_200_OK, content=jsonable_encoder(videos))


@router.get("/api/videos/{streamer_id}", response_model=List[schemas.Video])
def read_videos_by_streamer_id(streamer_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    videos = crud.video.get_videos_by_streamer_id(db, skip=skip, limit=limit, streamer_id=streamer_id)
    return JSONResponse(status_code=status.HTTP_200_OK, content=jsonable_encoder(videos))


@router.post("/api/streamers/{streamer_id}/videos/", response_model=schemas.Video)
def create_video_for_streamer(
        streamer_id: int, video: schemas.VideoCreate, db: Session = Depends(get_db)
):
    return crud.video.create_streamer_video(db=db, video=video, streamer_id=streamer_id)