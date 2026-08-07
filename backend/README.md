# Africa Shield AI — Backend

FastAPI service for the "Last-Mile Alert AI" flood demo.

**Status: skeleton only.** All three endpoints are currently stubbed to
return hardcoded data from [`../docs/mock-data.json`](../docs/mock-data.json)
regardless of input. Real rules-based risk scoring and translation logic
start next — see the `# TODO` comments in `app/models/risk_model.py`,
`app/models/translations.py`, and `app/routes/risk.py`.

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

- `POST /api/risk-check` — **stubbed**, always returns the fixed example from
  `docs/mock-data.json`. Validates the request body shape but ignores its values.
- `GET /api/regions` — **stubbed**, returns the hardcoded region list from
  `docs/mock-data.json`.
- `GET /api/alerts` — **stubbed**, returns the hardcoded alert history from
  `docs/mock-data.json`.

## Structure ready for tomorrow

- `app/models/risk_model.py` — where the rules-based risk scoring function
  goes (rainfall + river level → risk_level/risk_score). Not implemented yet.
- `app/models/translations.py` — where hardcoded alert translations (e.g.
  Swahili, Yoruba, Arabic) go. Not implemented yet.
- `app/data/regions.json` — sample rainfall/river-level readings for 8 real
  African cities, ready to develop the scoring logic against.
