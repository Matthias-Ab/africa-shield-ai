"""Rules-based flood risk scoring.

Deliberately simple and explainable for the demo: judges can see exactly
why a location is scored the way it is, in one sentence — "we blend
normalized rainfall and normalized river level 50/50, then bucket the
result." Swap this for a trained ML model later without changing the API
contract (see docs/architecture.md).
"""

RAINFALL_CAP_MM = 100.0  # rainfall_mm_24h at/above this is treated as maximum severity
RIVER_LEVEL_CAP_M = 4.0  # river_level_m at/above this is treated as maximum severity

HIGH_THRESHOLD = 0.7
MEDIUM_THRESHOLD = 0.4


def _normalized_inputs(rainfall_mm_24h: float, river_level_m: float) -> tuple[float, float]:
    normalized_rainfall = min(max(rainfall_mm_24h, 0.0) / RAINFALL_CAP_MM, 1.0)
    normalized_river_level = min(max(river_level_m, 0.0) / RIVER_LEVEL_CAP_M, 1.0)
    return normalized_rainfall, normalized_river_level


def compute_risk(rainfall_mm_24h: float, river_level_m: float) -> tuple[str, float]:
    """Return (risk_level, risk_score) for the given inputs.

    risk_score is a 0.0-1.0 blend of normalized rainfall and normalized
    river level, weighted equally. risk_level buckets the score into
    low / medium / high for display and alerting.

    Sanity-checked against the 9 sample cities in app/data/regions.json:
    Lagos 0.82/high, Kampala 0.89/high, Dar es Salaam 0.70/high,
    Cairo 0.42/medium, Accra 0.61/medium, Mogadishu 0.60/medium,
    Nairobi 0.20/low, Maputo 0.20/low, Kinshasa 0.31/low — an even
    3/3/3 high/medium/low spread.
    """
    normalized_rainfall, normalized_river_level = _normalized_inputs(rainfall_mm_24h, river_level_m)

    risk_score = round(0.5 * normalized_rainfall + 0.5 * normalized_river_level, 2)

    if risk_score >= HIGH_THRESHOLD:
        risk_level = "high"
    elif risk_score >= MEDIUM_THRESHOLD:
        risk_level = "medium"
    else:
        risk_level = "low"

    return risk_level, risk_score


def risk_score_breakdown(rainfall_mm_24h: float, river_level_m: float) -> dict:
    """Explainability data for a "why this score" UI: the raw inputs, what
    they normalized to, and the thresholds used to bucket them. Judges (and
    the dashboard) can see the whole calculation, not just the output —
    the point of choosing a rules-based model over an opaque one."""
    normalized_rainfall, normalized_river_level = _normalized_inputs(rainfall_mm_24h, river_level_m)
    risk_level, risk_score = compute_risk(rainfall_mm_24h, river_level_m)

    return {
        "rainfall_mm_24h": rainfall_mm_24h,
        "river_level_m": river_level_m,
        "normalized_rainfall": round(normalized_rainfall, 2),
        "normalized_river_level": round(normalized_river_level, 2),
        "rainfall_cap_mm": RAINFALL_CAP_MM,
        "river_level_cap_m": RIVER_LEVEL_CAP_M,
        "high_threshold": HIGH_THRESHOLD,
        "medium_threshold": MEDIUM_THRESHOLD,
        "risk_level": risk_level,
        "risk_score": risk_score,
    }
