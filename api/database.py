from .config import session


# dbの定義
def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()
