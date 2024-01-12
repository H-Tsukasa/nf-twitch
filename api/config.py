from firebase_admin import credentials
import os
import base64
import json
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base


ENV = 'development'
DEBUG = True

load_dotenv(override=True)
# firebaseの定義
tmp = os.environ.get("FAST_FIREBASE_CREDENTIAL_JSON")
tmp2 = base64.b64decode(tmp.encode())
firebase_dict = json.loads(tmp2)
CRED = credentials.Certificate(firebase_dict)

# dbの定義と接続
USER = os.environ.get('DB_USERNAME'),
PASSWD = os.environ.get('DB_PASSWORD'),
HOST = os.environ.get('DB_HOST'),
DB = os.environ.get('DB_NAME')

connection_string = f"mysql://{USER[0]}:{PASSWD[0]}@{HOST[0]}:3306/{DB}"
ENGINE = create_engine(connection_string, echo=True)

session = scoped_session(sessionmaker(autoflush=False, bind=ENGINE))
# modelで使用
Base = declarative_base()
Base.query = session.query_property()
