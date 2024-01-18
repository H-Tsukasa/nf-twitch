from fastapi import APIRouter
from firebase_admin import auth

from pydantic import BaseModel

router = APIRouter()


class JwtToken(BaseModel):
    token: str


@router.post("/api/verify")
def verify_jwt(item: JwtToken):
    try:
        decoded_token = auth.verify_id_token(item.token)
    except Exception:
        print("decodeできません")
        return {"uid": ""}
    uid = decoded_token["uid"]
    return {"uid": uid}