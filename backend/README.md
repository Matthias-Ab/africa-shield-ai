# Africa Shield AI — Backend

FastAPI service for the "Last-Mile Alert AI" flood demo: real rules-based
flood risk scoring, a genuine trained ML model as a second opinion,
multi-language alert generation, and a simulated alert-history stub.

## Setup

```bash
cd backend
python -m venv .venv
# Windows (Git Bash): source .venv/Scripts/activate
# Windows (PowerShell): .venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
```

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
- `GET /api/regions` — real. Computes both scores live for the 9 sample
  cities in `app/data/regions.json`.
- `GET /api/alerts` — **intentionally stubbed.** Returns the hardcoded
  alert history from `../docs/mock-data.json`; no real SMS/USSD/WhatsApp
  gateway is wired up yet (documented future improvement, not an oversight).

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

## Translations

`app/models/translations.py` hardcodes English plus one of
Swahili/Arabic/Somali per alert (mapped by country, see that file for the
mapping and fallback rules). These are AI-drafted placeholder translations
— see the module docstring and `docs/progress-log.md` for the team's
decision to ship them as-is for the hackathon rather than block on a
native-speaker review.
