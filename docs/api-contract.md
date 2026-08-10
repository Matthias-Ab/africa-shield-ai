# API Contract — Africa Shield AI Backend

**Status (as of 2026-08-10): risk scoring and translation are real.**
`POST /api/risk-check` and `GET /api/regions` now compute live from the
rules-based model in `backend/app/models/risk_model.py` and the
translation dictionary in `backend/app/models/translations.py` — see
[`progress-log.md`](progress-log.md) for details. `GET /api/alerts` is
still an intentional simulated stub (no real SMS/USSD gateway this week).

**Contract change (additive, non-breaking):** both `POST /api/risk-check`
and `GET /api/regions` gained a new `risk_score_breakdown` field (for a
"why this score" explainability view), and `GET /api/regions` gained
`population_estimate`. No existing field was renamed, removed, or
changed type — anything built against the previous shapes still works
unmodified; these are new fields to opt into. See
[`frontend-feature-spec.md`](frontend-feature-spec.md) for how to use them.

Base URL (local dev): `http://localhost:8000`

---

## `POST /api/risk-check`

Score a location's flood risk from rainfall and river level, and get back
a ready-to-send alert message in English and one local language.

**Current status:** real — computes `risk_level`/`risk_score` from the
rules-based model and looks up the translated alert message. See
[`progress-log.md`](progress-log.md) for the thresholds and translation
mapping used.

### Request

```json
{
  "location_name": "Lagos, Nigeria",
  "latitude": 6.5244,
  "longitude": 3.3792,
  "rainfall_mm_24h": 85,
  "river_level_m": 3.2
}
```

| Field              | Type   | Notes                          |
|--------------------|--------|---------------------------------|
| `location_name`    | string | Human-readable "City, Country" |
| `latitude`          | float  |                                 |
| `longitude`         | float  |                                 |
| `rainfall_mm_24h`  | float  | Rainfall in the last 24 hours, mm |
| `river_level_m`    | float  | River level in meters           |

### Response

```json
{
  "location_name": "Cairo, Egypt",
  "risk_level": "medium",
  "risk_score": 0.42,
  "alert_message_en": "Flood risk is MEDIUM in Cairo. Stay alert and monitor local updates.",
  "alert_message_local": "خطر الفيضانات متوسط في Cairo. توخَّ الحذر وتابع التحديثات المحلية.",
  "local_language": "Arabic",
  "timestamp": "2026-08-07T12:00:00Z",
  "risk_score_breakdown": {
    "rainfall_mm_24h": 35,
    "river_level_m": 2.0,
    "normalized_rainfall": 0.35,
    "normalized_river_level": 0.5,
    "rainfall_cap_mm": 100.0,
    "river_level_cap_m": 4.0,
    "high_threshold": 0.7,
    "medium_threshold": 0.4,
    "risk_level": "medium",
    "risk_score": 0.42
  }
}
```

| Field                  | Type   | Notes                                    |
|------------------------|--------|-------------------------------------------|
| `location_name`        | string | Echoed from the request                  |
| `risk_level`           | string | `"low"` \| `"medium"` \| `"high"`        |
| `risk_score`           | float  | 0.0–1.0                                   |
| `alert_message_en`     | string | Human-readable alert, English            |
| `alert_message_local`  | string | Same alert, translated to `local_language`. **Right-to-left when `local_language` is `"Arabic"`** — the frontend must handle RTL display; this field is a plain string with no directionality markers. |
| `local_language`       | string | One of the team's four agreed languages: `"English"`, `"Swahili"`, `"Arabic"`, `"Somali"` |
| `timestamp`            | string | ISO 8601, UTC                            |
| `risk_score_breakdown` | object | **New.** Explainability data for a "why this score" UI — see below. |

`risk_score_breakdown` fields:

| Field                    | Type   | Notes                                          |
|--------------------------|--------|--------------------------------------------------|
| `rainfall_mm_24h`        | float  | Echoed input                                    |
| `river_level_m`          | float  | Echoed input                                    |
| `normalized_rainfall`    | float  | `rainfall_mm_24h / rainfall_cap_mm`, capped at 1.0 |
| `normalized_river_level` | float  | `river_level_m / river_level_cap_m`, capped at 1.0 |
| `rainfall_cap_mm`        | float  | Currently `100.0`                               |
| `river_level_cap_m`      | float  | Currently `4.0`                                 |
| `high_threshold`         | float  | Currently `0.7` — `risk_score` at/above this is `"high"` |
| `medium_threshold`       | float  | Currently `0.4` — `risk_score` at/above this is `"medium"` |
| `risk_level`             | string | Same value as the top-level `risk_level` (duplicated here for convenience) |
| `risk_score`             | float  | Same value as the top-level `risk_score` (duplicated here for convenience) |

---

## `GET /api/regions`

Static/mock list of monitored regions with their current risk levels, for
the dashboard's map/list view.

**Current status:** real — computes each region's `risk_level` live from
`backend/app/data/regions.json` via the same risk model used by
`/api/risk-check`.

### Response

```json
[
  {
    "location_name": "Lagos, Nigeria",
    "latitude": 6.5244,
    "longitude": 3.3792,
    "risk_level": "high",
    "population_estimate": 15000000,
    "risk_score_breakdown": {
      "rainfall_mm_24h": 85,
      "river_level_m": 3.2,
      "normalized_rainfall": 0.85,
      "normalized_river_level": 0.8,
      "rainfall_cap_mm": 100.0,
      "river_level_cap_m": 4.0,
      "high_threshold": 0.7,
      "medium_threshold": 0.4,
      "risk_level": "high",
      "risk_score": 0.82
    }
  }
]
```

An array of objects, each with `location_name`, `latitude`, `longitude`,
and `risk_level` (`"low"` | `"medium"` | `"high"`, unchanged from before),
plus two **new** fields:

| Field                    | Type   | Notes |
|--------------------------|--------|-------|
| `population_estimate`   | int    | Rough public population figure for the city (e.g. commonly cited metro/city-proper estimates). **This is a general population figure, not a flood-exposure model** — it does not mean this many people are at risk of flooding, only that this many people live in the monitored area. See [`frontend-feature-spec.md`](frontend-feature-spec.md) for suggested UI copy that doesn't overstate this. |
| `risk_score_breakdown`  | object | Same shape as in `POST /api/risk-check`'s response, above — explainability data for a "why this score" UI. |

Currently 9 regions — see `backend/app/data/regions.json` for the
underlying sensor inputs and population figures.

---

## `GET /api/alerts`

Mock list of recently "sent" alerts (simulated — no real SMS/USSD/WhatsApp
provider), for the dashboard's alert history view.

**Current status:** stubbed, intentionally — returns the hardcoded list
from `mock-data.json`. No real SMS/USSD/WhatsApp gateway this week; see
`docs/architecture.md`'s Future Improvements.

### Response

```json
[
  {
    "location_name": "Lagos, Nigeria",
    "risk_level": "high",
    "message_sent": "Flood risk is HIGH in Lagos. Move to higher ground and avoid riverbanks.",
    "channel": "SMS (simulated)",
    "timestamp": "2026-08-07T09:15:00Z"
  }
]
```

| Field            | Type   | Notes                                          |
|------------------|--------|--------------------------------------------------|
| `location_name`  | string |                                                  |
| `risk_level`     | string | `"low"` \| `"medium"` \| `"high"`              |
| `message_sent`   | string | The exact text that "was sent"                  |
| `channel`        | string | e.g. `"SMS (simulated)"`, `"USSD (simulated)"`, `"WhatsApp (simulated)"` |
| `timestamp`      | string | ISO 8601, UTC                                   |
