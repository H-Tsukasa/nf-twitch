import requests
import os
from dotenv import load_dotenv
import json
from sqlalchemy.sql import text

from api import models
from api import crud
from api import config


config.Base.metadata.create_all(config.ENGINE)


# print('# Parents')
# for parent in config.session.query(models.Streamer).all():
#     children = [x.name for x in parent.series]
#     print(f'Parent: name={parent.uuid}, children={children}')
# print()

# print('# Children')
# for child in config.session.query(models.Series).all():
#     parents = [x.uuid for x in child.streamers]
#     print(f'Child: name={child.uuid}, parents={parents}')
    
sql = text(f"select * from association where streamer_uuid = 'test' and series_uuid = 'test3'")
result = config.session.execute(sql)
re_dicts = []
for row in result:
    print(row)
    dict_a = {"a": row[0], "b": row[1]}
    re_dicts.append(dict_a)
print(re_dicts)