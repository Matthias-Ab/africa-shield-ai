# Africa Shield AI

**Big vision:** Africa Shield AI predicts natural disasters (floods,
droughts, heatwaves, wildfires, cyclones, earthquakes) across Africa and
sends early warnings to at-risk communities before disasters happen,
prioritizing accessibility for people without smartphones or reliable
internet. **Scoped hackathon demo:** "Last-Mile Alert AI" — flooding
only, working end-to-end: a rules-based flood risk score, an API that
turns it into a human-readable alert, translation into a local African
language, and a simulated SMS/USSD/WhatsApp send, all shown on a simple
web dashboard. **Future:** expand to the other hazards, a real ML model,
a real SMS gateway, and an offline-first mobile app (see
[Future Improvements](#future-improvements) below).

Built for the **"AI for All Hackathon: Building Inclusive Solutions for
Early Warning and Disaster Resilience,"** organized by the African Youth
Advisory Board on Disaster Risk Reduction (AYAB-DRR) under the African Union.

## Status: skeleton only

This repo currently contains **project scaffolding, not finished
features.** Backend logic (the real risk scoring + translations) and
frontend UI (the dashboard) both **start tomorrow**. Right now:

- Backend runs, but its 3 endpoints return **hardcoded stub data** (see
  `docs/mock-data.json`) instead of computing anything.
- Frontend is an **unmodified Vite + React starter** — no dashboard
  components, routing, or styling yet. That's intentionally left open for
  whoever builds it.
- The API contract (request/response shapes) is fully defined and
  documented, so both of us can build against it independently without
  waiting on each other or re-negotiating data shapes later.

## Team

- [ Name ] — Backend / AI (risk model, API)
- [ Name ] — Frontend web dashboard

## Tech stack

- **Backend:** Python, FastAPI
- **Frontend:** React + Vite
- **Data:** hardcoded/mock JSON for the hackathon demo (no database, no
  real ML model, no real SMS gateway — see Future Improvements)

## Running it locally

- Backend: see [`backend/README.md`](backend/README.md) —
  `uvicorn app.main:app --reload`, runs at `http://localhost:8000`
  (`/docs` for interactive API docs).
- Frontend: see [`frontend-web/README.md`](frontend-web/README.md) —
  `npm install && npm run dev`, runs at `http://localhost:5173`.

## Docs

- [`docs/api-contract.md`](docs/api-contract.md) — exact request/response
  shapes for all 3 endpoints.
- [`docs/mock-data.json`](docs/mock-data.json) — sample data in those exact
  shapes (also what the backend's stubbed endpoints currently return).
- [`docs/architecture.md`](docs/architecture.md) — how the pieces connect,
  plus the future roadmap.
- [`docs/pitch-notes.md`](docs/pitch-notes.md) — placeholder for demo
  narrative and talking points.

## Future Improvements

Beyond the hackathon demo, the roadmap includes:

- Replace the rules-based risk score with a real ML model trained on
  historical satellite (NASA/ESA) and meteorological data.
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
