from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse

from .. import schemas
from .. import crud
from ..database import get_db

from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/api/streamer_series/streamers/{series_id}")
def read_streamers_by_series_id(series_id: int, db: Session = Depends(get_db)):
    db_streamer = crud.series.get_series_by_id(db, series_id=series_id)
    return db_streamer.streamers


# streamerが属しているseriesを検索
@router.get("/api/streamer_series/series/{streamer_id}")
def read_series_by_streamer_id(streamer_id: int, db: Session = Depends(get_db)):
    db_streamer = crud.streamer.get_streamer(db, streamer_id=streamer_id)
    return db_streamer.series


# streamerとseriesの登録
@router.post("/api/streamer_series/", response_model=schemas.Association)
def create_association(streamer_series: schemas.PostAssociationCreate, db: Session = Depends(get_db)):
    db_series = crud.series.get_series_by_id(db=db, series_id=streamer_series.series_id)
    db_s = crud.streamer_series.get_by_streamer_series_id(db=db, streamer_uuid=streamer_series.streamer_uuid, series_uuid=db_series.uuid)
    if db_s:
        raise HTTPException(status_code=400, detail="Association already registered")
    crud.streamer_series.create_streamer_series(db=db, streamer_uuid=streamer_series.streamer_uuid, series_uuid=db_series.uuid)
    return JSONResponse(status_code=status.HTTP_200_OK, content={"msg": "Success"})
