import json
from pathlib import Path

from fastapi import APIRouter

from app.models.ml_risk_model import predict_ml_risk
from app.models.risk_model import risk_score_breakdown
from app.models.translations import build_alert_messages, country_from_location

router = APIRouter()

DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "regions.json"


@router.get("/api/regions")
def get_regions() -> list[dict]:
    """Monitored regions with their current risk level, computed live from
    each region's sample rainfall/river-level data (app/data/regions.json)
    via the same risk model used by /api/risk-check, so the two endpoints
    never drift apart.

    Also includes: `country` (parsed from location_name), `rainfall_mm_24h`/
    `river_level_m` (flat top-level copies of the same values nested in
    risk_score_breakdown, for callers that don't want to reach into a
    nested object), `alert_message_en`/`alert_message_local`/
    `local_language` (computed the same way as /api/risk-check, from this
    region's rules-based risk_level), `risk_score_breakdown`
    (explainability data for a "why this score" UI), `population_estimate`
    (a rough public city-population figure, NOT a flood-exposure model —
    see app/data/regions.json's comment and docs/frontend-feature-spec.md
    for the caveat on how to present this in the UI), and `ml_risk_level`/
    `ml_risk_score` (the trained ML model's second opinion — see
    app/models/ml_risk_model.py and docs/architecture.md). All are
    additive fields; `location_name`/`latitude`/`longitude`/`risk_level`
    are unchanged from before."""
    regions = json.loads(DATA_FILE.read_text(encoding="utf-8"))

    result = []
    for region in regions:
        breakdown = risk_score_breakdown(region["rainfall_mm_24h"], region["river_level_m"])
        risk_level = breakdown["risk_level"]
        ml_risk_level, ml_risk_score = predict_ml_risk(
            region["rainfall_mm_24h"], region["river_level_m"]
        )
        message_en, message_local, local_language = build_alert_messages(
            region["location_name"], risk_level
        )
        result.append(
            {
                "location_name": region["location_name"],
                "country": country_from_location(region["location_name"]),
                "latitude": region["latitude"],
                "longitude": region["longitude"],
                "rainfall_mm_24h": region["rainfall_mm_24h"],
                "river_level_m": region["river_level_m"],
                "risk_level": risk_level,
                "alert_message_en": message_en,
                "alert_message_local": message_local,
                "local_language": local_language,
                "population_estimate": region["population_estimate"],
                "risk_score_breakdown": breakdown,
                "ml_risk_level": ml_risk_level,
                "ml_risk_score": ml_risk_score,
            }
        )
    return result
