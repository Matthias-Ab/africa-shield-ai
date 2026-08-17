# API Contract — Africa Shield AI Backend

**Status (as of 2026-08-10): risk scoring and translation are real.**
`POST /api/risk-check` and `GET /api/regions` now compute live from the
rules-based model in `backend/app/models/risk_model.py` and the
translation dictionary in `backend/app/models/translations.py` — see
[`progress-log.md`](progress-log.md) for details.

**Status (as of 2026-08-17): SMS/USSD alerts are real.** Two new
endpoints, `POST /api/alerts/send` and `POST /api/ussd`, send real SMS via
Africa's Talking and serve a USSD self-service menu, respectively — see
their sections below and `docs/progress-log.md`'s 2026-08-17 entry. Both
are additive; no existing endpoint's shape changed. `GET /api/alerts` now
returns real send history once anything has gone through
`POST /api/alerts/send`, falling back to the original hardcoded list on a
fresh clone where nothing has been sent yet — see that endpoint's section.

**Status (as of 2026-08-17): device ingestion is real.** A new endpoint,
`POST /api/sensor-reading`, accepts a live reading from a registered
ESP32 flood sensor (currently a Wokwi simulation — see
`hardware/wokwi-flood-sensor/`) and scores it exactly the way
`POST /api/risk-check` does. Additive; no existing endpoint's shape
changed. See that endpoint's section below.

**Contract change (additive, non-breaking):** both `POST /api/risk-check`
and `GET /api/regions` gained a new `risk_score_breakdown` field (for a
"why this score" explainability view), and `GET /api/regions` gained
`population_estimate`. No existing field was renamed, removed, or
changed type — anything built against the previous shapes still works
unmodified; these are new fields to opt into. See
[`frontend-feature-spec.md`](frontend-feature-spec.md) for how to use them.

**Second contract change, also additive (2026-08-10): `ml_risk_level` and
`ml_risk_score`.** Both endpoints now also return a genuine trained-ML
"second opinion" alongside the existing rules-based `risk_level`/
`risk_score` — the rules-based fields are unchanged and remain primary;
the ML fields are new, optional-to-use additions. **Flagging this
explicitly, per standing instructions not to change the contract without
saying so** — this is intentional and requested (see
`docs/progress-log.md`'s 2026-08-10 "dual risk model" entry), not a
silent drift. See `backend/app/models/ml_risk_model.py` for how the score
is computed.

**Third contract change, also additive (2026-08-10): `country`,
`rainfall_mm_24h`/`river_level_m` promoted to top-level, and
`alert_message_en`/`alert_message_local`/`local_language` added to
`GET /api/regions`.** Prompted by a frontend teammate asking for the
exact schema and flagging four gaps — see `docs/progress-log.md`'s
2026-08-10 "API enrichment" entry for the full reasoning. Specifically:
- `country` (string) is now a field on both endpoints, parsed from
  `location_name`, so callers don't have to split the string themselves.
- `rainfall_mm_24h` and `river_level_m` are now top-level fields on both
  endpoints (previously only nested inside `risk_score_breakdown`). They
  remain in `risk_score_breakdown` too — this is a duplicate, additive
  copy for convenience, not a move.
- `latitude`/`longitude` are now echoed back in `POST /api/risk-check`'s
  response (previously only in the request).
- `GET /api/regions` now includes `alert_message_en`, `alert_message_local`,
  and `local_language` per region, computed the same way `/api/risk-check`
  does. Previously `GET /api/alerts` was the only source of alert text,
  and it's a separate 5-entry simulated stub, not one-per-region.
Again: no existing field was renamed, removed, or retyped.

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
  "country": "Egypt",
  "latitude": 30.0444,
  "longitude": 31.2357,
  "rainfall_mm_24h": 35.0,
  "river_level_m": 2.0,
  "risk_level": "medium",
  "risk_score": 0.42,
  "alert_message_en": "Flood risk is MEDIUM in Cairo. Stay alert and monitor local updates.",
  "alert_message_local": "خطر الفيضانات متوسط في Cairo. توخَّ الحذر وتابع التحديثات المحلية.",
  "local_language": "Arabic",
  "timestamp": "2026-08-07T12:00:00Z",
  "risk_score_breakdown": {
    "rainfall_mm_24h": 35.0,
    "river_level_m": 2.0,
    "normalized_rainfall": 0.35,
    "normalized_river_level": 0.5,
    "rainfall_cap_mm": 100.0,
    "river_level_cap_m": 4.0,
    "high_threshold": 0.7,
    "medium_threshold": 0.4,
    "risk_level": "medium",
    "risk_score": 0.42
  },
  "ml_risk_level": "medium",
  "ml_risk_score": 0.43
}
```

| Field                  | Type   | Notes                                    |
|------------------------|--------|-------------------------------------------|
| `location_name`        | string | Echoed from the request                  |
| `country`              | string | **New.** Parsed from `location_name` (everything after the last comma). Empty string if `location_name` has no comma. |
| `latitude`             | float  | **New.** Echoed from the request.        |
| `longitude`            | float  | **New.** Echoed from the request.        |
| `rainfall_mm_24h`      | float  | **New.** Echoed from the request. Also present (same value) inside `risk_score_breakdown`. |
| `river_level_m`        | float  | **New.** Echoed from the request. Also present (same value) inside `risk_score_breakdown`. |
| `risk_level`           | string | `"low"` \| `"medium"` \| `"high"` — **rules-based, primary** |
| `risk_score`           | float  | 0.0–1.0 — **rules-based, primary**        |
| `alert_message_en`     | string | Human-readable alert, English            |
| `alert_message_local`  | string | Same alert, translated to `local_language`. **Right-to-left when `local_language` is `"Arabic"`** — the frontend must handle RTL display; this field is a plain string with no directionality markers. |
| `local_language`       | string | One of the team's four agreed languages: `"English"`, `"Swahili"`, `"Arabic"`, `"Somali"` |
| `timestamp`            | string | ISO 8601, UTC                            |
| `risk_score_breakdown` | object | Explainability data for a "why this score" UI — see below. |
| `ml_risk_level`        | string | `"low"` \| `"medium"` \| `"high"` — the trained ML model's second opinion, bucketed with the same thresholds as the rules-based score (see `risk_score_breakdown.high_threshold`/`medium_threshold`). |
| `ml_risk_score`        | float  | 0.0–1.0, same scale as `risk_score`, from a logistic regression trained on synthetic data — see `docs/architecture.md`'s "Two risk scores, on purpose" section and `backend/app/models/train_ml_model.py`. Will often differ slightly from `risk_score`; that's expected, not a bug. |

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

## `POST /api/sensor-reading`

Ingests a live reading from a registered ESP32 flood sensor — currently a
Wokwi simulation (`hardware/wokwi-flood-sensor/`), since no real hardware
exists yet — and scores it exactly the way `POST /api/risk-check` does.
Internally, this is a thin wrapper: it resolves `device_id` to a region
via `backend/app/data/devices.json`, then calls the same scoring function
`/api/risk-check` uses (`build_risk_check_response()` in
`backend/app/routes/risk.py`) — not a reimplementation.

### Request

```json
{
  "device_id": "esp32-demo-01",
  "rainfall_mm_24h": 85.0,
  "river_level_m": 3.2,
  "timestamp": "2026-08-17T09:00:00Z"
}
```

| Field             | Type   | Notes                                                        |
|-------------------|--------|------------------------------------------------------------------|
| `device_id`       | string | Must match a `device_id` in `backend/app/data/devices.json` — 404 otherwise. |
| `rainfall_mm_24h` | float  | Same `allow_inf_nan=False` constraint as `/api/risk-check` — a NaN/Infinity reading gets a clean 422, not a crash. |
| `river_level_m`   | float  | Same constraint as above.                                         |
| `timestamp`       | string | The device's own clock (e.g. Wokwi's simulated NTP time). Accepted and validated, but not echoed in the response — see below. |

### Response

**Identical shape to `POST /api/risk-check`'s response** (see above) —
`location_name`/`country`/`latitude`/`longitude` come from the device's
registry entry, not the request body; `timestamp` in the response is the
time this score was computed, not the device-reported `timestamp` from
the request (same meaning as everywhere else `timestamp` appears in this
API). This is deliberate: the frontend can render a device-originated
reading with the exact same code path as a manual risk-check, with zero
special-casing.

### Device registry

`backend/app/data/devices.json` maps `device_id` → `{location_name,
latitude, longitude}`. Seeded with one demo entry
(`"esp32-demo-01"` → `"Lagos, Nigeria"`) for the Wokwi simulation. Add
entries by hand for additional simulated/real devices — there's no
device-provisioning flow yet.

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
    "country": "Nigeria",
    "latitude": 6.5244,
    "longitude": 3.3792,
    "rainfall_mm_24h": 85,
    "river_level_m": 3.2,
    "risk_level": "high",
    "alert_message_en": "Flood risk is HIGH in Lagos. Move to higher ground and avoid riverbanks.",
    "alert_message_local": "Flood risk is HIGH in Lagos. Move to higher ground and avoid riverbanks.",
    "local_language": "English",
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
    },
    "ml_risk_level": "high",
    "ml_risk_score": 0.84
  }
]
```

An array of objects. `location_name`, `latitude`, `longitude`, and
`risk_level` are unchanged from before; everything else is additive:

| Field                    | Type   | Notes |
|--------------------------|--------|-------|
| `country`               | string | Parsed from `location_name`. |
| `rainfall_mm_24h`       | float  | This region's sample rainfall input. Also present (same value) inside `risk_score_breakdown`. |
| `river_level_m`         | float  | This region's sample river-level input. Also present (same value) inside `risk_score_breakdown`. |
| `alert_message_en` / `alert_message_local` / `local_language` | string | Computed the same way as `POST /api/risk-check`, from this region's `risk_level`. **This is the only place in `/api/regions` an alert message appears** — `GET /api/alerts` is a separate, unrelated 5-entry simulated stub, not one-per-region. |
| `population_estimate`   | int    | Rough public population figure for the city (e.g. commonly cited metro/city-proper estimates). **This is a general population figure, not a flood-exposure model** — it does not mean this many people are at risk of flooding, only that this many people live in the monitored area. See [`frontend-feature-spec.md`](frontend-feature-spec.md) for suggested UI copy that doesn't overstate this. |
| `risk_score_breakdown`  | object | Same shape as in `POST /api/risk-check`'s response, above — explainability data for a "why this score" UI. |
| `ml_risk_level`         | string | Same meaning as in `POST /api/risk-check` — the trained ML model's second opinion for this region's sample rainfall/river data. |
| `ml_risk_score`         | float  | Same meaning as in `POST /api/risk-check`. |

Currently 9 regions — see `backend/app/data/regions.json` for the
underlying sensor inputs and population figures.

---

## `GET /api/alerts`

Alert history, for the dashboard's alert history view.

**Current status:** real once something has been sent — returns
`backend/app/data/alert_log.json`, appended to by every call to
`POST /api/alerts/send`. On a fresh clone/demo where nothing has been sent
yet, that log is empty, so this falls back to the original hardcoded list
from `mock-data.json` instead of returning nothing.

### Response

```json
[
  {
    "location_name": "Lagos, Nigeria",
    "risk_level": "high",
    "message_sent": "Flood risk is HIGH in Lagos. Move to higher ground and avoid riverbanks.",
    "channel": "SMS (simulated)",
    "recipients": 1,
    "timestamp": "2026-08-17T07:47:30Z"
  }
]
```

| Field            | Type   | Notes                                          |
|------------------|--------|--------------------------------------------------|
| `location_name`  | string |                                                  |
| `risk_level`     | string | `"low"` \| `"medium"` \| `"high"`              |
| `message_sent`   | string | The exact text that was (or would have been) sent/said, in the region's local language |
| `channel`        | string | `"SMS"` / `"Voice call"` when actually sent via Africa's Talking, `"SMS (simulated)"` / `"Voice call (simulated)"` when not (no credentials configured, or zero subscribers for that region) — see `POST /api/alerts/send` |
| `recipients`     | int    | **New, only present on real-send-log entries.** Number of subscribers the message went to (0 for a simulated send). Absent on the older hardcoded `mock-data.json` entries returned as a fallback — don't assume it's always present. |
| `timestamp`      | string | ISO 8601, UTC                                   |

---

## `POST /api/alerts/send`

Sends a flood alert for one monitored region to every subscriber
registered for it, via Africa's Talking — SMS or a voice call that reads
the alert aloud (`channel: "voice"`; see `POST /api/voice/callback`
below), the latter for recipients a text-only channel doesn't reach
(can't read, or the local script, or are visually impaired). Real when
the matching credentials are configured (see `backend/.env.example`) and
the region has at least one subscriber; otherwise falls back to a clearly
labeled simulation so this is always safe to call.

### Request

```json
{
  "location_name": "Lagos, Nigeria",
  "channel": "sms"
}
```

| Field           | Type   | Notes                                                        |
|-----------------|--------|----------------------------------------------------------------|
| `location_name` | string | Must exactly match a `location_name` in `backend/app/data/regions.json` — 404 otherwise. |
| `channel`       | string | `"sms"` (default) or `"voice"`. |

### Response

Same shape as one entry of `GET /api/alerts`, above (includes `recipients`).

Recipients come from `backend/app/data/subscribers.json` — a list of
`{"phone_number": ..., "location_name": ...}` pairs, populated by
`POST /api/ussd`'s subscribe flow (or seeded by hand for testing).

---

## `POST /api/ussd`

Africa's Talking USSD webhook — point a sandbox USSD channel's callback
URL at this endpoint. Lets a subscriber, from any phone (no smartphone or
data connection needed), check a region's flood risk or subscribe/
unsubscribe to SMS alerts for it. This is the "last-mile" self-service
counterpart to `POST /api/alerts/send`'s push side.

### Request

Form-encoded (not JSON) — this is Africa's Talking's contract, not ours:

| Field         | Type   | Notes                                                              |
|---------------|--------|-----------------------------------------------------------------------|
| `sessionId`   | string | Required by Africa's Talking; unused by our handler.                 |
| `serviceCode` | string | Required by Africa's Talking; unused by our handler.                 |
| `phoneNumber` | string | The caller's phone number — used as the subscriber key.              |
| `text`        | string | `*`-separated choices accumulated over the session so far (e.g. `"2*1"`). Empty string on the first request. |

### Response

Plain text (not JSON), prefixed `CON ` to keep the session open for
another screen, or `END ` to close it:

```
CON Welcome to Africa Shield AI
1. Check flood risk
2. Subscribe to alerts
3. Unsubscribe from alerts
```

Menu tree: `1` → pick a region → risk level + score + local-language alert
text (same `alert_message_local` used by SMS, so Arabic regions reply in
Arabic, etc. — plain text, no RTL markup, same caveat as everywhere else
this field appears) (`END`). `2` → pick a region → subscribes
`phoneNumber` to that region in `subscribers.json` (`END`). `3` → removes
`phoneNumber` from every region it was subscribed to (`END`).

---

## `POST /api/voice/callback`

Africa's Talking Voice webhook — point a sandbox Voice number's callback
URL at this endpoint. Fires when a call placed by `POST /api/alerts/send`
(`channel: "voice"`) connects, and again when it ends. This endpoint is
never called directly by the frontend or a user — only by Africa's
Talking, as the second half of a voice alert.

### Request

Form-encoded (not JSON) — Africa's Talking's contract:

| Field               | Type   | Notes                                                          |
|---------------------|--------|--------------------------------------------------------------------|
| `sessionId`         | string | Required by Africa's Talking; unused by our handler.              |
| `isActive`          | string | `"1"` when the call just connected, `"0"` when it ended. We respond the same way regardless — Africa's Talking ignores the body once the call has ended. |
| `destinationNumber` | string | The number that was called — used to look up the message queued by `place_call()` right before the call was placed. |
| `callerNumber`      | string | Unused by our handler.                                             |

### Response

XML ("Voice Actions" format), not JSON:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response><Say voice="woman" playBeep="false">Flood risk is HIGH in Lagos. Move to higher ground and avoid riverbanks.</Say></Response>
```

If no message is queued for `destinationNumber` (e.g. a retried callback,
or an unrelated inbound call), reads a generic fallback line instead of
silently saying nothing.

**Caveat, not yet verified:** Africa's Talking's `<Say>` text-to-speech
language/accent support hasn't been tested against non-English alert
text (Arabic/Swahili/Somali) — confirm this works as expected against the
real sandbox before relying on it for a non-English region in the demo.
