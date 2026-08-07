import json
from pathlib import Path

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

MOCK_DATA_FILE = Path(__file__).resolve().parents[3] / "docs" / "mock-data.json"


class RiskCheckRequest(BaseModel):
    location_name: str
    latitude: float
    longitude: float
    rainfall_mm_24h: float
    river_level_m: float


@router.post("/api/risk-check")
def risk_check(payload: RiskCheckRequest) -> dict:
    """STUBBED for today: validates the request shape but always returns
    the hardcoded example response from docs/mock-data.json, regardless
    of the input values.

    # TODO: implement real risk scoring logic here — call
    # app.models.risk_model.compute_risk(payload.rainfall_mm_24h,
    # payload.river_level_m) and app.models.translations.build_alert_messages(...)
    # instead of returning the fixed example below.
    """
    mock_data = json.loads(MOCK_DATA_FILE.read_text(encoding="utf-8"))
    return mock_data["risk_check_example"]
