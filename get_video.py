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

url = "https://api.twitch.tv/helix/videos"
headers = {'Authorization': os.environ.get("AUTHORIZATION_TWITCH"), "Client-ID": os.environ.get("CLIENT_ID_TWITCH")}

params = {"user_id": "102631269", "first": 100}
response = requests.get(url, headers=headers, params=params)
json_data = json.loads(response.text)
data = json_data["data"]
db = config.session()

videos = []
for i, d in enumerate(data):
    if not i==0 and i%20==0:
        db.close()
        db = config.session()
    if d["stream_id"] is not None:
        db_video = crud.get_video_by_video_number(db=db, video_number=d["id"])
        if not db_video:
            video = models.Video(
                    date=d["created_at"],
                    title=d["title"],
                    duration=d["duration"],
                    video_number=d["id"],
                    view_count=d["view_count"],
                    thumbnail_url=d["thumbnail_url"],
                    embed_url=d["url"]
                )
            videos.append(video)
for video in videos:
    crud.create_streamer_video(db=db, video=video, streamer_id=75)
db.close()