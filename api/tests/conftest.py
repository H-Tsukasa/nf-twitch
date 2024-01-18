import pytest
import uuid

from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session, sessionmaker, scoped_session
from sqlalchemy.orm.session import close_all_sessions

from ..config import Base
from ..main import app
from ..database import get_db


class TestingSession(Session):
    def commit(self):
        # テストなので永続化しない
        self.flush()
        self.expire_all()
    

@pytest.fixture(scope="function")
def test_db():
    user = "thrd"
    password = "pass"
    host = "192.168.240.4"
    db_name = "dbtest"
    connection_string = f"mysql://{user}:{password}@{host}/{db_name}"
    engine = create_engine(connection_string, echo=True)

    Base.metadata.create_all(bind=engine)

    function_scope = uuid.uuid4().hex
    TestSessionLocal = scoped_session(
        sessionmaker(
            class_=TestingSession, autocommit=False, autoflush=False, bind=engine
            ), scopefunc=lambda: function_scope
    )
    
    Base.query = TestSessionLocal.query_property()

    db = TestSessionLocal()

    def get_db_for_testing():
        try:
            yield db
            db.commit()
        except SQLAlchemyError as e:
            assert e is not None
            db.rollback()
            
    app.dependency_overrides[get_db] = get_db_for_testing
    
    # テストケース実行
    yield db

    # 後処理
    db.rollback()
    close_all_sessions()
    engine.dispose()