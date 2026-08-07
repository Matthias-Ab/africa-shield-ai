# API Contract — Africa Shield AI Backend

**Status: today's implementation is stubbed.** All three endpoints below
currently return hardcoded data from [`mock-data.json`](mock-data.json)
regardless of input. Real rules-based scoring and translation logic land
next (see the `# TODO` comments in `backend/app/models/` and
`backend/app/routes/risk.py`). The shapes documented here are the
long-term contract both the backend and frontend should build against —
they won't change when the real logic is implemented.

Base URL (local dev): `http://localhost:8000`

---

## `POST /api/risk-check`

Score a location's flood risk from rainfall and river level, and get back
a ready-to-send alert message in English and one local language.

**Current status:** stubbed — validates the request body shape, then
always returns the fixed example below regardless of the values sent.

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
  "location_name": "Lagos, Nigeria",
  "risk_level": "high",
  "risk_score": 0.82,
  "alert_message_en": "Flood risk is HIGH in Lagos. Move to higher ground and avoid riverbanks.",
  "alert_message_local": "Ewu omi ga soke ni Lagos. Lo si ibi giga, yago fun eti odo.",
  "local_language": "Yoruba",
  "timestamp": "2026-08-07T12:00:00Z"
}
```

| Field                  | Type   | Notes                                    |
|------------------------|--------|-------------------------------------------|
| `location_name`        | string | Echoed from the request                  |
| `risk_level`           | string | `"low"` \| `"medium"` \| `"high"`        |
| `risk_score`           | float  | 0.0–1.0                                   |
| `alert_message_en`     | string | Human-readable alert, English            |
| `alert_message_local`  | string | Same alert, translated to `local_language` |
| `local_language`       | string | e.g. `"Yoruba"`, `"Swahili"`, `"Arabic"` |
| `timestamp`            | string | ISO 8601, UTC                            |

---

## `GET /api/regions`

Static/mock list of monitored regions with their current risk levels, for
the dashboard's map/list view.

**Current status:** stubbed — returns the hardcoded list from `mock-data.json`.

### Response

```json
[
  { "location_name": "Lagos, Nigeria", "latitude": 6.5244, "longitude": 3.3792, "risk_level": "high" },
  { "location_name": "Nairobi, Kenya", "latitude": -1.2921, "longitude": 36.8219, "risk_level": "low" },
  { "location_name": "Cairo, Egypt", "latitude": 30.0444, "longitude": 31.2357, "risk_level": "medium" }
]
```

An array of objects, each with `location_name`, `latitude`, `longitude`,
and `risk_level` (`"low"` | `"medium"` | `"high"`). The current stub
returns 8 regions — see `mock-data.json` for the full list.

---

## `GET /api/alerts`

Mock list of recently "sent" alerts (simulated — no real SMS/USSD/WhatsApp
provider), for the dashboard's alert history view.

**Current status:** stubbed — returns the hardcoded list from `mock-data.json`.

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
