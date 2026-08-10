from datetime import datetime, timezone

from fastapi import APIRouter
from pydantic import BaseModel

from app.models.risk_model import compute_risk
from app.models.translations import build_alert_messages

router = APIRouter()


class RiskCheckRequest(BaseModel):
    location_name: str
    latitude: float
    longitude: float
    rainfall_mm_24h: float
    river_level_m: float


class RiskCheckResponse(BaseModel):
    location_name: str
    risk_level: str
    risk_score: float
    alert_message_en: str
    alert_message_local: str
    local_language: str
    timestamp: str


@router.post("/api/risk-check", response_model=RiskCheckResponse)
def risk_check(payload: RiskCheckRequest) -> RiskCheckResponse:
    risk_level, risk_score = compute_risk(payload.rainfall_mm_24h, payload.river_level_m)
    message_en, message_local, local_language = build_alert_messages(
        payload.location_name, risk_level
    )

    return RiskCheckResponse(
        location_name=payload.location_name,
        risk_level=risk_level,
        risk_score=risk_score,
        alert_message_en=message_en,
        alert_message_local=message_local,
        local_language=local_language,
        timestamp=datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    )
