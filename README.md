# Africa Shield AI

**Big vision:** Africa Shield AI predicts natural disasters (floods,
droughts, heatwaves, wildfires, cyclones, earthquakes) across Africa and
sends early warnings to at-risk communities before disasters happen,
prioritizing accessibility for people without smartphones or reliable
internet. **Scoped hackathon demo:** "Last-Mile Alert AI" — flooding
only, working end-to-end: a rules-based flood risk score shown alongside
a genuine trained ML model as a second opinion, an API that turns the
result into a human-readable alert, translation into a local African
language, real SMS/voice-call alerts (with USSD self-service to check
risk or subscribe) via Africa's Talking — voice covering people a
text-only channel doesn't reach — and a live IoT sensor ingestion
endpoint, demoed via a Wokwi ESP32 simulation, all shown on a simple web
dashboard. **Future:** expand to the other hazards, train the ML model on
real historical data instead of synthetic data, real ESP32 hardware
instead of the Wokwi simulation, and an offline-first mobile app (see
[Future Improvements](#future-improvements) below).

Built for the **"AI for All Hackathon: Building Inclusive Solutions for
Early Warning and Disaster Resilience,"** organized by the African Youth
Advisory Board on Disaster Risk Reduction (AYAB-DRR) under the African Union.

## Status: backend + frontend both real, alerts send for real, IoT ingestion live (updated 2026-08-17)

- **Backend risk scoring and translation are real**, not stubbed.
  `POST /api/risk-check` and `GET /api/regions` compute live from the
  rules-based model in `backend/app/models/risk_model.py` and the
  hardcoded translation dictionary in `backend/app/models/translations.py`.
  See [`docs/progress-log.md`](docs/progress-log.md) for thresholds,
  assumptions, and what's still unverified.
- **A second, genuinely trained ML model now runs alongside the
  rules-based one** (`ml_risk_level`/`ml_risk_score`, additive fields on
  both endpoints) — a `scikit-learn` logistic regression, trained on
  synthetic data standing in for real historical flood data. See
  [`docs/architecture.md`](docs/architecture.md)'s "Two risk scores, on
  purpose" section for why both are kept.
- **Alerts now send for real, by SMS or voice call.** `POST /api/alerts/send`
  messages every subscriber for a region via Africa's Talking, as SMS or
  a voice call that reads the alert aloud (`"channel": "voice"` — for
  recipients who can't read, or the local script, or are visually
  impaired), falling back to a clearly labeled simulation without sandbox
  credentials. `POST /api/ussd` is a USSD self-service menu to check risk
  or subscribe/unsubscribe from any phone. See
  [`docs/architecture.md`](docs/architecture.md)'s "Real SMS/USSD/Voice
  alerts" section.
- **Frontend dashboard** (Habiba, Farid, Thompson) merged 2026-08-15 —
  live in `frontend-web/`, pulling real data from `GET /api/regions`.
- **IoT device ingestion is live.** `POST /api/sensor-reading` accepts a
  reading from a registered ESP32 flood sensor and scores it exactly like
  `POST /api/risk-check` — currently demoed via a Wokwi simulation
  (`hardware/wokwi-flood-sensor/`), since no real hardware exists yet.
  See [`docs/architecture.md`](docs/architecture.md)'s "IoT sensor
  ingestion" section.
- The API contract only ever gained fields, never changed existing ones —
  anything built against earlier shapes still works unmodified. See
  [`docs/api-contract.md`](docs/api-contract.md) for the current, complete
  shape of every endpoint.

## Team

- Matthias — Backend / AI (risk model, API)
- Habiba — Frontend web dashboard
- Farid — Frontend web dashboard
- Thompson — Frontend web dashboard
- Mohamed Zaki — Embedded Systems / Robotics

## Tech stack

- **Backend:** Python, FastAPI
- **ML model:** scikit-learn (`StandardScaler` + `LogisticRegression`),
  trained on synthetic data — see `backend/app/models/train_ml_model.py`
- **Frontend:** React + Vite
- **Alerts:** Africa's Talking (SMS + USSD + Voice)
- **IoT:** ESP32, simulated in Wokwi (rain + water level sensors) — see
  `hardware/wokwi-flood-sensor/`
- **Data:** JSON files for the hackathon demo (no database — see Future
  Improvements)

## Running it locally

- Backend: see [`backend/README.md`](backend/README.md) —
  `uvicorn app.main:app --reload`, runs at `http://localhost:8000`
  (`/docs` for interactive API docs).
- Frontend: see [`frontend-web/README.md`](frontend-web/README.md) —
  `npm install && npm run dev`, runs at `http://localhost:5173`.
- IoT simulation: see
  [`hardware/wokwi-flood-sensor/README.md`](hardware/wokwi-flood-sensor/README.md) —
  runs in the browser at wokwi.com, needs a tunnel to reach a locally
  running backend.
- Mobile: see [`mobile-app/README.md`](mobile-app/README.md) — citizen-facing
  companion app, structural scaffold only so far (real UI pending Figma),
  `flutter run --dart-define=API_BASE_URL=...`.

## Docs

- [`docs/Africa-Shield-AI-Overview.pdf`](docs/Africa-Shield-AI-Overview.pdf) —
  beginner-friendly project overview with diagrams: what this is, how the
  workflow works, the risk model explained, tech stack, architecture, and
  roadmap. Good starting point for anyone new to the project (including
  judges/reviewers), no technical background assumed.
- [`docs/api-contract.md`](docs/api-contract.md) — exact request/response
  shapes for every endpoint. Living source of truth.
- [`docs/API-Schema-Reference.pdf`](docs/API-Schema-Reference.pdf) —
  frontend-facing PDF snapshot of the exact schema (same content as
  `api-contract.md`, formatted to hand directly to a teammate).
- [`docs/mock-data.json`](docs/mock-data.json) — sample data in those exact
  shapes (also what the backend's stubbed endpoints currently return).
- [`docs/architecture.md`](docs/architecture.md) — how the pieces connect,
  plus the future roadmap.
- [`docs/pitch-notes.md`](docs/pitch-notes.md) — placeholder for demo
  narrative and talking points.
- [`docs/progress-log.md`](docs/progress-log.md) — dated session log: what's
  done, in progress, assumptions, and flags for the team.
- [`docs/frontend-feature-spec.md`](docs/frontend-feature-spec.md) — handoff
  spec for the frontend team: map view, live risk simulator, "why this
  score" breakdown, phone-mockup alert screens, population/impact framing,
  low-bandwidth mode — with exact API examples for each.

## Future Improvements

Beyond the hackathon demo, the roadmap includes:

- Train the ML risk model on real historical flood/rainfall/river-level
  data (e.g. NASA/ESA satellite archives, national meteorological
  services) instead of the synthetic data it uses today.
- Automatically trigger alerts when a region's risk crosses into `high`,
  instead of requiring an on-demand `POST /api/alerts/send` call.
- Real subscriber self-registration/outreach at scale, instead of a
  hand-seeded or USSD-only subscriber list.
- Expand beyond flooding to droughts, heatwaves, wildfires, cyclones, and
  earthquakes, each with their own risk factors and thresholds.
- Build an offline-first Flutter mobile app for areas with poor
  connectivity, including push notifications and local caching.
- Integrate a real translation API (e.g., Google Translate, or an
  Africa-focused NLP model) instead of hardcoded translations, and expand
  language coverage.
- Add a community-reporting feature so people can report on-the-ground
  conditions (e.g., "river rising near my village") to improve prediction
  accuracy.
- Move from the Wokwi simulation to real ESP32 hardware with real rain/
  water-level sensors (backend ingestion already built — see
  `hardware/wokwi-flood-sensor/`).
- Add user authentication and role-based access for local disaster
  management authorities to manage/verify alerts before they go out.
- Add an analytics/impact dashboard tracking alerts sent, regions
  covered, and (where measurable) lives/property protected.
