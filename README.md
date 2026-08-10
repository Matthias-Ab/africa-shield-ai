# Africa Shield AI

**Big vision:** Africa Shield AI predicts natural disasters (floods,
droughts, heatwaves, wildfires, cyclones, earthquakes) across Africa and
sends early warnings to at-risk communities before disasters happen,
prioritizing accessibility for people without smartphones or reliable
internet. **Scoped hackathon demo:** "Last-Mile Alert AI" — flooding
only, working end-to-end: a rules-based flood risk score shown alongside
a genuine trained ML model as a second opinion, an API that turns the
result into a human-readable alert, translation into a local African
language, and a simulated SMS/USSD/WhatsApp send, all shown on a simple
web dashboard. **Future:** expand to the other hazards, train the ML
model on real historical data instead of synthetic data, a real SMS
gateway, and an offline-first mobile app (see
[Future Improvements](#future-improvements) below).

Built for the **"AI for All Hackathon: Building Inclusive Solutions for
Early Warning and Disaster Resilience,"** organized by the African Youth
Advisory Board on Disaster Risk Reduction (AYAB-DRR) under the African Union.

## Status: backend logic real, frontend in progress (updated 2026-08-10)

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
- `GET /api/alerts` is **still an intentional simulated stub** — no real
  SMS/USSD gateway this week (documented future improvement, not an
  oversight).
- **Frontend** (Habiba, Farid, Thompson building) is in progress in
  `frontend-web/` — see that folder for current state.
- The API contract (request/response shapes) hasn't changed since the
  skeleton — the frontend team's work against `docs/mock-data.json` is
  still valid.

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
- **Data:** hardcoded/mock JSON for the hackathon demo (no database, no
  real SMS gateway — see Future Improvements)

## Running it locally

- Backend: see [`backend/README.md`](backend/README.md) —
  `uvicorn app.main:app --reload`, runs at `http://localhost:8000`
  (`/docs` for interactive API docs).
- Frontend: see [`frontend-web/README.md`](frontend-web/README.md) —
  `npm install && npm run dev`, runs at `http://localhost:5173`.

## Docs

- [`docs/Africa-Shield-AI-Overview.pdf`](docs/Africa-Shield-AI-Overview.pdf) —
  beginner-friendly project overview with diagrams: what this is, how the
  workflow works, the risk model explained, tech stack, architecture, and
  roadmap. Good starting point for anyone new to the project (including
  judges/reviewers), no technical background assumed.
- [`docs/api-contract.md`](docs/api-contract.md) — exact request/response
  shapes for all 3 endpoints.
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
- Integrate a real SMS/USSD gateway (e.g., Africa's Talking, Twilio)
  instead of simulating sends.
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
- Add low-cost IoT sensor integration (water level sensors, rain gauges)
  as a future hardware track expansion.
- Add user authentication and role-based access for local disaster
  management authorities to manage/verify alerts before they go out.
- Add an analytics/impact dashboard tracking alerts sent, regions
  covered, and (where measurable) lives/property protected.
