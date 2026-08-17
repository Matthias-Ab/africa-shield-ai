import json
from pathlib import Path

from fastapi import APIRouter, Form
from fastapi.responses import PlainTextResponse

from app.models.risk_model import risk_score_breakdown
from app.models.translations import build_alert_messages

router = APIRouter()

REGIONS_FILE = Path(__file__).resolve().parent.parent / "data" / "regions.json"
SUBSCRIBERS_FILE = Path(__file__).resolve().parent.parent / "data" / "subscribers.json"


def _regions() -> list[dict]:
    return json.loads(REGIONS_FILE.read_text(encoding="utf-8"))


def _short_name(location_name: str) -> str:
    return location_name.split(",")[0]


def _read_subscribers() -> list[dict]:
    if not SUBSCRIBERS_FILE.exists():
        return []
    return json.loads(SUBSCRIBERS_FILE.read_text(encoding="utf-8"))


def _write_subscribers(subscribers: list[dict]) -> None:
    SUBSCRIBERS_FILE.write_text(json.dumps(subscribers, indent=2), encoding="utf-8")


def _region_menu(regions: list[dict]) -> str:
    return "\n".join(f"{i + 1}. {_short_name(r['location_name'])}" for i, r in enumerate(regions))


def _pick_region(regions: list[dict], choice: str) -> dict | None:
    try:
        index = int(choice) - 1
    except ValueError:
        return None
    if 0 <= index < len(regions):
        return regions[index]
    return None


@router.post("/api/ussd")
def ussd_callback(
    sessionId: str = Form(...),
    serviceCode: str = Form(...),
    phoneNumber: str = Form(...),
    text: str = Form(""),
) -> PlainTextResponse:
    """Africa's Talking USSD webhook — point a sandbox USSD channel's
    callback URL at this endpoint. `sessionId`/`serviceCode` are required
    by Africa's Talking's contract but unused here (no multi-step state is
    kept server-side; `text` alone encodes the whole session so far).

    `text` accumulates every choice made this session, `*`-separated (e.g.
    "1*3" = picked menu 1, then region 3) — that's Africa's Talking's
    session model, not ours. A response must start with `CON ` to keep the
    session open for another screen, or `END ` to close it. Content-type
    must be text/plain, hence `PlainTextResponse` rather than a normal
    FastAPI JSON model.

    Menu: 1) check flood risk for a region, 2) subscribe this phone number
    to SMS alerts for a region (writes to `app/data/subscribers.json`,
    read by `POST /api/alerts/send`), 3) unsubscribe from all regions.
    """
    choices = text.split("*") if text else []
    regions = _regions()

    if not choices:
        response = (
            "CON Welcome to Africa Shield AI\n"
            "1. Check flood risk\n"
            "2. Subscribe to alerts\n"
            "3. Unsubscribe from alerts"
        )
    elif choices[0] == "1":
        if len(choices) == 1:
            response = "CON Select a region:\n" + _region_menu(regions)
        else:
            region = _pick_region(regions, choices[1])
            if region is None:
                response = "END Invalid selection."
            else:
                breakdown = risk_score_breakdown(
                    region["rainfall_mm_24h"], region["river_level_m"]
                )
                _message_en, message_local, _local_language = build_alert_messages(
                    region["location_name"], breakdown["risk_level"]
                )
                response = (
                    f"END Flood risk in {_short_name(region['location_name'])} is "
                    f"{breakdown['risk_level'].upper()} (score {breakdown['risk_score']}).\n"
                    f"{message_local}"
                )
    elif choices[0] == "2":
        if len(choices) == 1:
            response = "CON Select region to receive alerts for:\n" + _region_menu(regions)
        else:
            region = _pick_region(regions, choices[1])
            if region is None:
                response = "END Invalid selection."
            else:
                subscribers = _read_subscribers()
                already = any(
                    s["phone_number"] == phoneNumber
                    and s["location_name"] == region["location_name"]
                    for s in subscribers
                )
                if not already:
                    subscribers.append(
                        {"phone_number": phoneNumber, "location_name": region["location_name"]}
                    )
                    _write_subscribers(subscribers)
                response = (
                    f"END You are now subscribed to flood alerts for "
                    f"{region['location_name']}."
                )
    elif choices[0] == "3":
        subscribers = [s for s in _read_subscribers() if s["phone_number"] != phoneNumber]
        _write_subscribers(subscribers)
        response = "END You have been unsubscribed from all flood alerts."
    else:
        response = "END Invalid selection."

    return PlainTextResponse(response)
