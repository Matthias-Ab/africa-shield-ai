from datetime import datetime, timezone

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.models.ml_risk_model import predict_ml_risk
from app.models.risk_model import risk_score_breakdown
from app.models.translations import build_alert_messages, country_from_location

router = APIRouter()


class RiskCheckRequest(BaseModel):
    location_name: str
    latitude: float = Field(allow_inf_nan=False)
    longitude: float = Field(allow_inf_nan=False)
    rainfall_mm_24h: float = Field(allow_inf_nan=False)
    river_level_m: float = Field(allow_inf_nan=False)


class RiskScoreBreakdown(BaseModel):
    rainfall_mm_24h: float
    river_level_m: float
    normalized_rainfall: float
    normalized_river_level: float
    rainfall_cap_mm: float
    river_level_cap_m: float
    high_threshold: float
    medium_threshold: float
    risk_level: str
    risk_score: float


class RiskCheckResponse(BaseModel):
    location_name: str
    country: str
    latitude: float
    longitude: float
    rainfall_mm_24h: float
    river_level_m: float
    risk_level: str
    risk_score: float
    alert_message_en: str
    alert_message_local: str
    local_language: str
    timestamp: str
    risk_score_breakdown: RiskScoreBreakdown
    ml_risk_level: str
    ml_risk_score: float


@router.post("/api/risk-check", response_model=RiskCheckResponse)
def risk_check(payload: RiskCheckRequest) -> RiskCheckResponse:
    breakdown = risk_score_breakdown(payload.rainfall_mm_24h, payload.river_level_m)
    risk_level, risk_score = breakdown["risk_level"], breakdown["risk_score"]
    message_en, message_local, local_language = build_alert_messages(
        payload.location_name, risk_level
    )
    ml_risk_level, ml_risk_score = predict_ml_risk(payload.rainfall_mm_24h, payload.river_level_m)

    return RiskCheckResponse(
        location_name=payload.location_name,
        country=country_from_location(payload.location_name),
        latitude=payload.latitude,
        longitude=payload.longitude,
        rainfall_mm_24h=payload.rainfall_mm_24h,
        river_level_m=payload.river_level_m,
        risk_level=risk_level,
        risk_score=risk_score,
        alert_message_en=message_en,
        alert_message_local=message_local,
        local_language=local_language,
        timestamp=datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        risk_score_breakdown=RiskScoreBreakdown(**breakdown),
        ml_risk_level=ml_risk_level,
        ml_risk_score=ml_risk_score,
    )
