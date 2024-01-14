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

url = "https://api.twitch.tv/helix/clips"
headers = {'Authorization': os.environ.get("AUTHORIZATION_TWITCH"), "Client-ID": os.environ.get("CLIENT_ID_TWITCH")}

params = {"broadcaster_id": "102631269", "first": 100, "started_at": "2023-12-01T00:00:00Z", "ended_at": "2024-01-05T00:00:00Z"}
response = requests.get(url, headers=headers, params=params)
json_data = json.loads(response.text)
data = json_data["data"]

db = config.session()

clips = []
for d in data:
    db_clip = crud.get_clip_by_clip_number(db=db, clip_number=d["id"])
    if not db_clip:
        clip = models.Clip(
                date=d["created_at"],
                title=d["title"],
                game_id=d["game_id"],
                clip_number=d["id"],
                view_count=d["view_count"],
                thumbnail_url=d["thumbnail_url"],
                embed_url=d["embed_url"]
            )
        clips.append(clip)
for clip in clips:
    crud.create_streamer_clip(db=db, clip=clip, streamer_id=75)
db.close()