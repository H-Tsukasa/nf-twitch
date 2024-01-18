from sqlalchemy.orm import Session
from sqlalchemy.sql import text


# 時系列IDを利用したストリーマーの取得
def get_by_streamer_series_id(db: Session, streamer_uuid: str, series_uuid: str):
    sql = text(f"select * from association where streamer_uuid = '{streamer_uuid}' and series_uuid = '{series_uuid}'")
    result = db.execute(sql)
    for row in result:
        dict_a = {"streamer_id": row[0], "series_id": row[0]}
        return dict_a


# ストリーマーと時系列の関係登録
def create_streamer_series(db: Session, streamer_uuid: str, series_uuid: str):
    sql = text(f"insert into association (streamer_uuid, series_uuid) values ('{streamer_uuid}', '{series_uuid}');")
    db.execute(sql)
    db.commit()
    return
