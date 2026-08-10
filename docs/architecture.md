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
   and `risk_score`. Rules-based, not ML — explainable for judges. **Real
   and working.** A second, ML-based model now runs alongside it as a
   comparison — see "Two risk scores, on purpose" below.
2. **Backend API** (`backend/app/main.py` + `app/routes/`) exposes
   `POST /api/risk-check`, `GET /api/regions`, `GET /api/alerts`. See
   [`api-contract.md`](api-contract.md) for exact shapes. **Real** for the
   first two; `GET /api/alerts` stays an intentional simulated stub.
3. **Alert/translation layer** (`backend/app/models/translations.py`)
   turns a risk level into a human-readable message in English plus one
   of Swahili/Arabic/Somali by country. **Real** — see
   [`progress-log.md`](progress-log.md) for the country mapping and the
   caveat that the wording is AI-drafted, not yet native-speaker reviewed.
4. **Simulated send**: no real SMS/USSD/WhatsApp gateway — the dashboard
   just displays what would have been sent (see `GET /api/alerts`).
5. **Frontend dashboard** (`frontend-web/`) — being built separately by
   the frontend team (Habiba, Farid, Thompson). Will render regions
   color-coded by risk, alert message detail, and the alert history feed.

## Two risk scores, on purpose

Since this hackathon's track is Artificial Intelligence, the team added a
second, genuinely trained ML model — `backend/app/models/ml_risk_model.py`
— that runs **alongside**, not instead of, the rules-based model. Both
`POST /api/risk-check` and `GET /api/regions` return both:

```
"risk_level": "high",        "risk_score": 0.82,   <- rules-based (primary)
...
"ml_risk_level": "high",     "ml_risk_score": 0.84  <- ML model (second opinion)
```

**Why keep both, rather than switch to the ML model entirely:** the
rules-based score stays primary because it's auditable — anyone can check
the arithmetic by hand (see the "risk score, explained" section of
`docs/Africa-Shield-AI-Overview.pdf`). That's a real strength for a
life-safety tool, not a limitation to hide behind an ML label. The ML
model runs alongside it as a comparison, so the pitch can honestly show a
real, trained model without giving up the explainability story.

**What the ML model actually is:** a `scikit-learn` pipeline (a
`StandardScaler` feeding a `LogisticRegression`), trained on the same two
inputs (`rainfall_mm_24h`, `river_level_m`) to predict low/medium/high.
One-sentence version: *"a learned linear boundary between the three risk
levels, after standardizing the two inputs."*

**Training data is synthetic, and that's flagged in the code.** There's no
large real historical flood dataset available for this hackathon, so
`backend/app/models/train_ml_model.py` generates ~2,000 synthetic
(rainfall, river-level) → risk-level examples. This is **not** a 1:1 copy
of the rules-based formula — it uses different feature weights (55/45
instead of 50/50), adds a compounding interaction term, and injects
Gaussian noise before labeling, so the trained model learns a genuinely
different decision boundary. On held-out synthetic test data, the ML model
disagreed with the rules-based bucket on about **11%** of samples — real
variation, not a restatement of the same number under a different name.
Across the 9 actual sample cities, the two models agree on every
risk_level bucket while differing slightly on the underlying score (e.g.
Lagos: rules 0.82 vs. ML 0.84) — exactly the "second opinion" framing the
pitch wants, without a confusing on-stage contradiction.

**Documented future upgrade:** replace `generate_synthetic_training_data()`
in `train_ml_model.py` with a loader for real historical rainfall/river-
level/flood-outcome data (e.g. NASA/ESA satellite archives, national
meteorological services), retrain, and everything downstream (the
`Pipeline`, the save/load code, the API fields) stays the same — the
synthetic-data step is intentionally isolated so swapping it out later is
a contained change, not a rewrite.

## Future Improvements (post-hackathon roadmap)

- Train the ML risk model on real historical flood/rainfall/river-level
  data (e.g. NASA/ESA satellite archives, national meteorological
  services) instead of the synthetic data it uses today — see "Two risk
  scores, on purpose" above.
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
