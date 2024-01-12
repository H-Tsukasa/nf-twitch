import requests
import os
from dotenv import load_dotenv
import json

from api import models
from api import crud
from api import config


load_dotenv(override=True)

with open("./public/streamer_id_100.txt", "r") as f:
    lines = [line.replace("\n", "") for line in f.readlines()]
print(lines[0])

url = "https://api.twitch.tv/helix/users"
headers = {'Authorization': os.environ.get("AUTHORIZATION_TWITCH"), "Client-ID": os.environ.get("CLIENT_ID_TWITCH")}

for line in lines:
    params = {"login": str(line)}
    response = requests.get(url, headers=headers, params=params)
    json_data = json.loads(response.text)
    print(json_data)
    data = json_data["data"][0]

    db = config.session()
    db_streamer = crud.get_streamer_by_profile_id(db=db, profile_id=data["id"])
    if db_streamer:
        print("存在します")
    else:
        streamer = models.Streamer(profile_id=data["id"], display_name=data["display_name"], profile_image_url=data["profile_image_url"])
        crud.create_streamer(db=db, streamer=streamer)
    db.close()