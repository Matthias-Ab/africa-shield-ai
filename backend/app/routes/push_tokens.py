import json
from pathlib import Path

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

PUSH_TOKENS_FILE = Path(__file__).resolve().parent.parent / "data" / "push_tokens.json"


class PushTokenRequest(BaseModel):
    token: str
    location_name: str


def read_push_tokens() -> list[dict]:
    if not PUSH_TOKENS_FILE.exists():
        return []
    return json.loads(PUSH_TOKENS_FILE.read_text(encoding="utf-8"))


def _write_push_tokens(tokens: list[dict]) -> None:
    PUSH_TOKENS_FILE.write_text(json.dumps(tokens, indent=2), encoding="utf-8")


@router.post("/api/push-tokens", status_code=201)
def register_push_token(payload: PushTokenRequest) -> dict:
    """Registers (or re-registers) a device's FCM token against a region,
    so `POST /api/alerts/send` and the automatic sensor-triggered path
    (`maybe_auto_trigger()` in `app/routes/alerts.py`) can push a real
    notification to it alongside SMS. A token already registered
    elsewhere is moved to the new region rather than duplicated — a
    device only cares about one region's alerts at a time, matching how
    the mobile app's Settings > Location works.

    `location_name` is freeform, same as `POST /api/hazard-reports` — not
    required to already exist in `regions.json`, so a token can be
    registered before the region it cares about is added."""
    tokens = [t for t in read_push_tokens() if t["token"] != payload.token]
    tokens.append({"token": payload.token, "location_name": payload.location_name})
    _write_push_tokens(tokens)
    return {"token": payload.token, "location_name": payload.location_name}


@router.delete("/api/push-tokens/{token}")
def unregister_push_token(token: str) -> dict:
    """Removes a device token — called when push notifications are turned
    off from the mobile app's Settings > Alert Channels. Always returns
    200 (not 404) whether or not the token was actually registered, since
    the caller's desired end state ("this token gets no more pushes") is
    satisfied either way."""
    tokens = read_push_tokens()
    remaining = [t for t in tokens if t["token"] != token]
    _write_push_tokens(remaining)
    return {"removed": len(remaining) < len(tokens)}
