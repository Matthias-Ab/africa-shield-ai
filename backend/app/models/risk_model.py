"""Rules-based flood risk scoring — NOT implemented yet.

Planned approach (starting tomorrow): a weighted combination of
rainfall_mm_24h and river_level_m thresholds, producing a risk_score in
[0.0, 1.0] and bucketing it into low / medium / high. Sample sensor input
data to develop and test against is in app/data/regions.json.

Until this is implemented, POST /api/risk-check (see app/routes/risk.py)
returns a hardcoded example response instead of calling this function.
"""


def compute_risk(rainfall_mm_24h: float, river_level_m: float) -> tuple[str, float]:
    # TODO: implement real risk scoring logic here.
    raise NotImplementedError("Risk scoring is not implemented yet — see TODO above.")
