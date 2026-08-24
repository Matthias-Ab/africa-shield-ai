# Africa Shield AI — Backend

FastAPI service for the "Last-Mile Alert AI" flood demo: real rules-based
flood risk scoring, a genuine trained ML model as a second opinion,
multi-language alert generation, real SMS/USSD/voice alerts via Africa's
Talking, and live IoT sensor ingestion (currently a Wokwi ESP32
simulation — see `../hardware/wokwi-flood-sensor/`).

## Setup

```bash
cd backend
python -m venv .venv
# Windows (Git Bash): source .venv/Scripts/activate
# Windows (PowerShell): .venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # fill in AT_USERNAME/AT_API_KEY (+ AT_VOICE_NUMBER for voice) — optional, see below
```

Without a filled-in `.env`, everything still runs — `POST /api/alerts/send`
just labels every send as simulated instead of calling Africa's Talking.
Get free sandbox credentials at https://account.africastalking.com/.

## Run

```bash
uvicorn app.main:app --reload
```

The API is at `http://localhost:8000`. Interactive docs (Swagger UI) are at
`http://localhost:8000/docs`.

## Endpoints

See [`../docs/api-contract.md`](../docs/api-contract.md) for exact request/response
shapes. Summary:

- `POST /api/risk-check` — real. Computes the rules-based risk level/score
  and the ML model's second opinion from the posted rainfall/river level,
  plus a translated alert message.
- `GET /api/regions` — real. Computes both scores live for the 10 sample
  cities in `app/data/regions.json`.
- `GET /api/alerts` — real send history (`app/data/alert_log.json`) once
  something has been sent via `POST /api/alerts/send`; falls back to the
  hardcoded list in `../docs/mock-data.json` before that.
- `POST /api/alerts/send` — real. Sends a region's alert via Africa's
  Talking to its subscribers (`app/data/subscribers.json`), by SMS
  (default) or voice call (`"channel": "voice"`); simulates the send
  (clearly labeled) if the matching credentials aren't set or the region
  has no subscribers yet.
- `POST /api/ussd` — real. Africa's Talking USSD webhook: check a
  region's risk, or subscribe/unsubscribe a phone number, no smartphone
  needed. See `app/routes/ussd.py`.
- `POST /api/voice/callback` — real. Africa's Talking Voice webhook,
  called when a `channel: "voice"` alert is answered; responds with the
  queued alert text as speech. See `app/routes/voice.py`.
- `POST /api/sensor-reading` — real. Ingests a reading from a registered
  ESP32 flood sensor (`app/data/devices.json` resolves `device_id` to a
  region) and scores it exactly like `POST /api/risk-check` — same
  underlying function, same input validation, identical response shape.
  **Also auto-sends a real SMS** the first time this pushes the region
  into `"high"` (not on every reading while it stays high) — see
  "Automatic alerts" below. See `app/routes/sensors.py` and
  `../hardware/wokwi-flood-sensor/`.

## Automatic alerts

- `POST /api/sensor-reading` calls `maybe_auto_trigger()`
  (`app/routes/alerts.py`) after scoring a reading — it sends a real
  alert the first time a region crosses into `"high"`, using the exact
  same `send_alert_for_region()` function `POST /api/alerts/send` uses,
  so there's one send code path, not two.
- `app/data/region_alert_state.json` tracks each region's last-seen risk
  level so "still high" doesn't re-fire the same alert every reading —
  gitignored, since it's runtime state, not seed data.
- `POST /api/risk-check` does **not** auto-trigger — it's also the
  judge/dashboard "what-if" slider demo, which needs to stay
  side-effect-free.
- `GET /api/alerts` entries now include `"trigger": "manual"` or
  `"trigger": "automatic"` so the history is honest about which is which.

## How the two risk scores work

- `app/models/risk_model.py` — the primary, rules-based score: an
  equal-weighted blend of normalized rainfall and normalized river level,
  bucketed into low/medium/high. Simple enough to explain and audit by hand.
- `app/models/ml_risk_model.py` — a genuine trained ML model (scikit-learn:
  `StandardScaler` + `LogisticRegression`) that runs alongside the
  rules-based score as a comparison, not a replacement. Loads
  `ml_risk_model.pkl` at import time — that file is committed to the repo
  so the server doesn't need to retrain on every start.
- `app/models/train_ml_model.py` — the training script that produced
  `ml_risk_model.pkl`. Trains on **synthetic** data (clearly flagged in
  that file's docstring) standing in for real historical flood data. Run
  it directly to retrain: `python -m app.models.train_ml_model`.
- See [`../docs/architecture.md`](../docs/architecture.md)'s "Two risk
  scores, on purpose" section for why both are kept side by side.

## SMS/USSD/Voice alerts

- `app/models/sms_gateway.py` wraps the `africastalking` SDK behind
  `is_configured()`/`send_sms()`. Set `AT_USERNAME`/`AT_API_KEY` in `.env`
  (free sandbox account at https://account.africastalking.com/) to send
  real SMS; leave them unset to keep everything running in simulated mode.
- `app/models/voice_gateway.py` does the same for voice calls
  (`place_call()`), needs `AT_VOICE_NUMBER` too (your sandbox app's Voice
  number). A voice call reads the alert aloud when answered — for
  recipients a text-only channel doesn't reach (can't read, or the local
  script, or are visually impaired). `POST /api/alerts/send` with
  `"channel": "voice"` uses this path instead of SMS.
- `app/data/subscribers.json` is the shared recipient list (used by both
  SMS and voice) — `{"phone_number": ..., "location_name": ...}` pairs.
  Starts empty; add entries by hand for testing, or use the USSD
  subscribe flow below.
- To test USSD or voice without a real telecom, use Africa's Talking's
  sandbox simulators, pointed at your locally running server's
  `/api/ussd` or `/api/voice/callback` (needs a public URL — e.g.
  `ngrok http 8000` — since Africa's Talking calls these endpoints from
  their servers, not the other way around).
- All three endpoints are additive and safe to call with no
  configuration — see `POST /api/alerts/send`, `POST /api/ussd`, and
  `POST /api/voice/callback` in
  [`../docs/api-contract.md`](../docs/api-contract.md).

## IoT sensor ingestion

- `app/routes/sensors.py` (`POST /api/sensor-reading`) is a thin route:
  it resolves `device_id` → region via `app/data/devices.json`, then
  calls `build_risk_check_response()` (`app/routes/risk.py`) — the exact
  same function `POST /api/risk-check` calls — so a device reading and a
  manual risk-check are scored identically, by one code path, not two.
- `app/data/devices.json` maps `device_id` → `{location_name, latitude,
  longitude}`. Seeded with one demo device (`"esp32-demo-01"` →
  "Lagos, Nigeria"). Add entries by hand for more simulated/real devices.
- No real hardware exists yet — `../hardware/wokwi-flood-sensor/` is a
  Wokwi (browser-based) ESP32 simulation with two potentiometers standing
  in for a rain sensor and a water level sensor. See that folder's
  README for how to run it against this backend (needs a tunnel — Wokwi
  can't reach `localhost`, same constraint as the USSD/voice sandbox
  testing above).

## Translations

`app/models/translations.py` hardcodes English plus one of
Swahili/Arabic/Somali/French/Portuguese/Amharic per alert (mapped by
country, see that file for the mapping and fallback rules), with the
city name itself localized too where it differs from English (e.g.
"Cairo" → "القاهرة", "Addis Ababa" → "አዲስ አበባ" — see
`LOCALIZED_CITY_NAMES` in that file). 6 of these 7 languages
(English, Arabic, French, Portuguese, Swahili, Amharic) match the
African Union's official languages — Amharic substitutes for Spanish
per the organizer's guidance, since Spanish isn't relevant to our
flood-risk regions; Somali is a 7th, kept from before that alignment
since it's already reviewed and live via Mogadishu.

Swahili, Arabic, and Somali are reviewed and confirmed correct by
native speakers (2026-08-17). French, Portuguese, and Amharic (all
added 2026-08-17) are still AI-drafted placeholders — see the module
docstring and `docs/progress-log.md` for the team's decision to ship
unreviewed languages as-is for the hackathon rather than block on a
review pass. **Mozambique's mapping was corrected from English to
Portuguese the same day** — it was a real bug (Portuguese is
Mozambique's actual official language), not just a new addition; Maputo
is a live sample city, so this changed real output, not just added a
new option.
