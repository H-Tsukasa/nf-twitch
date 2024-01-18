from fastapi import APIRouter, Depends

from .. import schemas
from .. import crud
from ..database import get_db

from typing import List
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/api/series/", response_model=List[schemas.Series])
def read_series(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    series = crud.series.get_series(db, skip=skip, limit=limit)
    return series

@router.get("/api/series/{series_id}", response_model=schemas.Series)
def read_series_by_id(series_id: int, db: Session = Depends(get_db)):
    series = crud.series.get_series_by_id(db=db, series_id=series_id)
    return series


@router.get("/api/series/user_id/{user_id}", response_model=List[schemas.Series])
def read_series_by_user_id(user_id: str, db: Session = Depends(get_db)):
    series = crud.series.get_series_by_user_id(db=db, user_id=user_id)
    return series


@router.post("/api/series/", response_model=schemas.Series)
def create_series(series: schemas.SeriesCreate, db: Session = Depends(get_db)):
    return crud.series.create_series(db=db, series=series)