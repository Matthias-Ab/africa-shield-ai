# Architecture — Africa Shield AI

## Today's demo slice: "Last-Mile Alert AI" (flooding only)

```
 [Sensor / weather data]        [Frontend dashboard]
   rainfall, river level                 ^
          |                              |
          v                              |
  +----------------+   POST /api/risk-check
  |  Risk model    |------------------->  +----------------+
  |  (rules-based) |   GET  /api/regions  |  FastAPI backend|
  +----------------+<-------------------  |                |
          |            GET  /api/alerts   +----------------+
          v                                       ^
  +----------------+                              |
  | Translation /  |------------------------------+
  | alert message  |
  +----------------+
          |
          v
  +----------------+
  | Simulated send |  ("message sent" screen — no real
  | (SMS/USSD/     |   gateway wired up yet)
  |  WhatsApp)     |
  +----------------+
```

1. **Risk model** (`backend/app/models/risk_model.py`) takes rainfall +
   river level for a location and produces a `risk_level` (low/medium/high)
   and `risk_score`. Rules-based, not ML — explainable for judges. **Not
   implemented yet** (as of today's skeleton) — see the `TODO` in that file.
2. **Backend API** (`backend/app/main.py` + `app/routes/`) exposes
   `POST /api/risk-check`, `GET /api/regions`, `GET /api/alerts`. See
   [`api-contract.md`](api-contract.md) for exact shapes. **Currently
   stubbed** to return hardcoded data from [`mock-data.json`](mock-data.json).
3. **Alert/translation layer** (`backend/app/models/translations.py`)
   turns a risk level into a human-readable message in English + one local
   language. **Not implemented yet.**
4. **Simulated send**: no real SMS/USSD/WhatsApp gateway — the dashboard
   just displays what would have been sent (see `GET /api/alerts`).
5. **Frontend dashboard** (`frontend-web/`) — currently a bare Vite+React
   starter. Will render regions color-coded by risk, alert message detail,
   and the alert history feed, starting tomorrow.

## Future Improvements (post-hackathon roadmap)

- Replace the rules-based risk score with a real ML model trained on
  historical satellite (NASA/ESA) and meteorological data.
- Integrate a real SMS/USSD gateway (e.g., Africa's Talking, Twilio) instead
  of simulating sends.
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
- Add low-cost IoT sensor integration (water level sensors, rain gauges) as
  a future hardware track expansion, feeding real-time data into the model.
- Add user authentication and role-based access for local disaster
  management authorities to manage/verify alerts before they go out.
- Add an analytics/impact dashboard tracking alerts sent, regions covered,
  and (where measurable) lives/property protected.
