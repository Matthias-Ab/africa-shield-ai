# API Contract — Africa Shield AI Backend

**Status (as of 2026-08-10): risk scoring and translation are real.**
`POST /api/risk-check` and `GET /api/regions` now compute live from the
rules-based model in `backend/app/models/risk_model.py` and the
translation dictionary in `backend/app/models/translations.py` — see
[`progress-log.md`](progress-log.md) for details. `GET /api/alerts` is
still an intentional simulated stub (no real SMS/USSD gateway this week).
**The response shapes below are unchanged from the stub version** — the
frontend team's work against `mock-data.json` is still valid.

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
  "timestamp": "2026-08-07T12:00:00Z"
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
  { "location_name": "Lagos, Nigeria", "latitude": 6.5244, "longitude": 3.3792, "risk_level": "high" },
  { "location_name": "Nairobi, Kenya", "latitude": -1.2921, "longitude": 36.8219, "risk_level": "low" },
  { "location_name": "Cairo, Egypt", "latitude": 30.0444, "longitude": 31.2357, "risk_level": "medium" }
]
```

An array of objects, each with `location_name`, `latitude`, `longitude`,
and `risk_level` (`"low"` | `"medium"` | `"high"`). Currently 9 regions —
see `backend/app/data/regions.json` for the underlying sensor inputs.

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
