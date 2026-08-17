import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.models.risk_model import risk_score_breakdown
from app.models.sms_gateway import is_configured as is_sms_configured, send_sms
from app.models.translations import build_alert_messages
from app.models.voice_gateway import is_configured as is_voice_configured, place_call

router = APIRouter()

MOCK_DATA_FILE = Path(__file__).resolve().parents[3] / "docs" / "mock-data.json"
REGIONS_FILE = Path(__file__).resolve().parent.parent / "data" / "regions.json"
SUBSCRIBERS_FILE = Path(__file__).resolve().parent.parent / "data" / "subscribers.json"
ALERT_LOG_FILE = Path(__file__).resolve().parent.parent / "data" / "alert_log.json"


class SendAlertRequest(BaseModel):
    location_name: str
    channel: Literal["sms", "voice"] = "sms"


class SendAlertResponse(BaseModel):
    location_name: str
    risk_level: str
    message_sent: str
    channel: str
    recipients: int
    timestamp: str


def _read_json(path: Path, default):
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def _append_alert_log(entry: dict) -> None:
    log = _read_json(ALERT_LOG_FILE, [])
    log.append(entry)
    ALERT_LOG_FILE.write_text(json.dumps(log, indent=2), encoding="utf-8")


@router.get("/api/alerts")
def get_alerts() -> list[dict]:
    """Real send history, once at least one alert has gone through
    `POST /api/alerts/send` (logged to `app/data/alert_log.json`). Falls
    back to the original hardcoded `docs/mock-data.json` list on a fresh
    clone/demo where nothing has been sent yet, so the dashboard's alert
    history is never empty."""
    log = _read_json(ALERT_LOG_FILE, [])
    if log:
        return log
    mock_data = json.loads(MOCK_DATA_FILE.read_text(encoding="utf-8"))
    return mock_data["alerts"]


@router.post("/api/alerts/send", response_model=SendAlertResponse)
def send_alert(payload: SendAlertRequest) -> SendAlertResponse:
    """Sends a real alert via Africa's Talking for one of the monitored
    regions in `app/data/regions.json`, to every subscriber registered for
    that region in `app/data/subscribers.json` (subscribers are added via
    `POST /api/ussd`, or seeded by hand for testing).

    `channel="sms"` (default) sends a text message. `channel="voice"`
    places a phone call that reads the alert aloud when answered (see
    `app/models/voice_gateway.py` and `app/routes/voice.py`) — for
    recipients a text-only channel doesn't reach (can't read, or the
    local script, or are visually impaired).

    Either channel falls back to a clearly labeled simulation when its
    Africa's Talking credentials aren't configured yet, or when the
    region has zero subscribers, so this endpoint is always safe to call,
    not just in a fully configured environment."""
    regions = _read_json(REGIONS_FILE, [])
    region = next((r for r in regions if r["location_name"] == payload.location_name), None)
    if region is None:
        raise HTTPException(status_code=404, detail=f"Unknown region: {payload.location_name}")

    breakdown = risk_score_breakdown(region["rainfall_mm_24h"], region["river_level_m"])
    risk_level = breakdown["risk_level"]
    _message_en, message_local, _local_language = build_alert_messages(
        payload.location_name, risk_level
    )

    subscribers = _read_json(SUBSCRIBERS_FILE, [])
    phone_numbers = [
        s["phone_number"] for s in subscribers if s["location_name"] == payload.location_name
    ]

    if payload.channel == "voice":
        if is_voice_configured() and phone_numbers:
            place_call(phone_numbers, message_local)
            channel = "Voice call"
        else:
            channel = "Voice call (simulated)"
    else:
        if is_sms_configured() and phone_numbers:
            send_sms(phone_numbers, message_local)
            channel = "SMS"
        else:
            channel = "SMS (simulated)"

    entry = {
        "location_name": payload.location_name,
        "risk_level": risk_level,
        "message_sent": message_local,
        "channel": channel,
        "recipients": len(phone_numbers),
        "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    }
    _append_alert_log(entry)
    return SendAlertResponse(**entry)
