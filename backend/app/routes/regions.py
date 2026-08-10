import json
from pathlib import Path

from fastapi import APIRouter

from app.models.risk_model import compute_risk

router = APIRouter()

DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "regions.json"


@router.get("/api/regions")
def get_regions() -> list[dict]:
    """Monitored regions with their current risk level, computed live from
    each region's sample rainfall/river-level data (app/data/regions.json)
    via the same risk model used by /api/risk-check, so the two endpoints
    never drift apart."""
    regions = json.loads(DATA_FILE.read_text(encoding="utf-8"))

    result = []
    for region in regions:
        risk_level, _ = compute_risk(region["rainfall_mm_24h"], region["river_level_m"])
        result.append(
            {
                "location_name": region["location_name"],
                "latitude": region["latitude"],
                "longitude": region["longitude"],
                "risk_level": risk_level,
            }
        )
    return result
