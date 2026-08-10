# Progress Log — Africa Shield AI

Dated, factual session log for the whole team. Read the most recent entry
first for current state; scroll down for history.

---

## 2026-08-10 — Real flood risk scoring and translation logic

### Completed
- `backend/app/models/risk_model.py`: implemented `compute_risk(rainfall_mm_24h, river_level_m)` for real. Formula: `normalized_rainfall = min(rainfall_mm_24h / 100, 1.0)`, `normalized_river = min(river_level_m / 4.0, 1.0)`, `risk_score = round(0.5*normalized_rainfall + 0.5*normalized_river, 2)`. Buckets: `risk_score >= 0.7` → `high`, `>= 0.4` → `medium`, else `low`. Removed the `NotImplementedError` stub.
- `backend/app/models/translations.py`: implemented `build_alert_messages(location_name, risk_level)` for real. Hardcoded EN + one of {Yoruba, Swahili, Arabic} per alert, mapped by country parsed from `location_name` (`LOCAL_LANGUAGE_BY_COUNTRY` dict: Nigeria→Yoruba, Kenya/Tanzania/Uganda→Swahili, Egypt→Arabic; everything else falls back to `DEFAULT_LOCAL_LANGUAGE = "Swahili"`). Removed the `NotImplementedError` stub.
- `backend/app/routes/risk.py`: `POST /api/risk-check` now calls `compute_risk` + `build_alert_messages` on the actual request body instead of returning the fixed `docs/mock-data.json` example. Response shape unchanged.
- `backend/app/routes/regions.py`: `GET /api/regions` now loads `backend/app/data/regions.json` (8 sample cities) and computes each region's `risk_level` live via `compute_risk`, instead of returning the hardcoded `mock-data.json` list. Response shape unchanged.
- `backend/app/routes/alerts.py`: left as a stub returning `docs/mock-data.json["alerts"]`, with a comment making clear this is intentional (no real SMS/USSD gateway this week), not forgotten.
- Verified end-to-end with the server running locally (`uvicorn app.main:app`):
  - `GET /api/regions` → 3 high (Lagos 0.82, Kampala 0.89, Dar es Salaam 0.70), 2 medium (Cairo 0.42, Accra 0.61), 3 low (Nairobi 0.20, Maputo 0.20, Kinshasa 0.31) — a varied, non-degenerate spread, computed live rather than hardcoded.
  - `POST /api/risk-check` tested with Lagos (85mm/3.2m → high/0.82, Yoruba), Nairobi (12mm/1.1m → low/0.20, Swahili), Cairo (35mm/2.0m → medium/0.42, Arabic), and an unmapped country (90mm/3.8m → high/0.93, fell back to Swahili as expected).
  - Confirmed JSON field names/structure for all three endpoints still match `docs/api-contract.md` exactly — no renames, no shape changes.
- Updated `docs/api-contract.md` status notes (top of file + per-endpoint) to say scoring/translation are real; `/api/alerts` still marked stubbed-on-purpose.
- Updated top-level `README.md` status section to reflect real backend logic.

### In Progress / Partially Done
- Nothing left half-finished from today's scope — all three files planned for this session are complete and verified.

### Not Yet Started
- Real translation API integration (still hardcoded dictionary, per this week's scope — documented future improvement).
- Real SMS/USSD/WhatsApp gateway (`/api/alerts` stays simulated this week).
- ML-based risk model (this week stays rules-based, per team decision).
- Frontend dashboard build-out (Habiba/Farid/Thompson, in progress separately in `frontend-web/` — not touched this session).
- Native-speaker review of the Yoruba/Swahili/Arabic translation text (see Flags below).
- Pitch deck.

### Findings & Decisions
- **Thresholds chosen:** 50/50 weight between rainfall and river level; rainfall normalized against a 100mm/24h cap, river level against a 4m cap; high ≥0.7, medium ≥0.4. Chosen because they produce a believable, varied spread across the 8 sample cities without any single bucket dominating (see Completed section for the actual scores) — not derived from real hydrological data, just tuned to look sane for the demo.
- **Language mapping is per-country, not per-region**, and only covers 5 countries explicitly (Nigeria, Kenya, Egypt, Tanzania, Uganda); every other country (Ghana, Mozambique, DRC, and anything else) silently falls back to Swahili. This is a coarse hackathon shortcut, not a real localization strategy.
- **`docs/mock-data.json`'s hand-picked risk levels from the skeleton session already matched what the real formula produces** for all 8 sample cities — no drift, nothing to reconcile.
- The `RiskCheckRequest` pydantic model still accepts any `location_name` string; if it has no comma (no ", Country" suffix), `_country_from_location` returns `""`, which also falls back to the Swahili default.

### Flags for the Team
- **Translations are unverified.** The Yoruba, Swahili, and Arabic strings in `backend/app/models/translations.py` were written by an AI assistant and have not been checked by a native/fluent speaker. Get someone to review wording before the August 12 presentation — a wrong flood warning is worse than none. Flagged again as a code comment in that file.
- **Risk thresholds are demo-tuned, not scientifically derived.** If real rainfall/river-level data (or judge feedback) suggests the buckets feel wrong, they're isolated in `risk_model.py`'s `RAINFALL_CAP_MM`, `RIVER_LEVEL_CAP_M`, `HIGH_THRESHOLD`, `MEDIUM_THRESHOLD` constants — easy to retune without touching routes.
- **API contract did not change** — `/api/regions` and `/api/risk-check` responses have the same fields/types as the stub version. Frontend work against `docs/mock-data.json` should not break when pointed at the real backend.
- **`/api/alerts` is still fake on purpose** — don't be surprised it doesn't reflect real risk-check calls; it's a fixed list for the demo's "alert history" view.

---

## 2026-08-09 — Initial project skeleton

_(Retroactive summary — this predates the progress-log file itself.)_

### Completed
- Repo structure created: `backend/` (FastAPI), `frontend-web/` (Vite+React), `docs/`.
- Backend skeleton: FastAPI app with CORS, 3 endpoints (`/api/risk-check`, `/api/regions`, `/api/alerts`) stubbed to return hardcoded data from `docs/mock-data.json` rather than computing anything.
- `backend/app/data/regions.json` created with sample rainfall/river-level readings for 8 real African cities (Lagos, Nairobi, Cairo, Accra, Kampala, Maputo, Dar es Salaam, Kinshasa), ready for real scoring logic to be built against.
- `backend/app/models/risk_model.py` and `translations.py` scaffolded as `NotImplementedError` stubs with `# TODO` comments marking where real logic goes.
- `frontend-web/`: genuine unmodified `npm create vite@latest -- --template react` output — no dashboard components, routing, or styling added.
- `docs/api-contract.md` written documenting exact request/response shapes for all 3 endpoints.
- `docs/mock-data.json` written as the single source of truth for stub responses (backend routes read directly from this file, so docs and running API can't drift).
- `docs/architecture.md` (pieces-diagram + future roadmap) and `docs/pitch-notes.md` (narrative placeholder) written.
- Top-level `README.md` and `.gitignore` written.
- Verified backend ran locally and all 3 endpoints returned valid JSON matching the docs; verified frontend ran locally showing the default Vite+React page.
- Git repo initialized, initial commit made, pushed to new public GitHub repo `https://github.com/Matthias-Ab/africa-shield-ai`.

### In Progress / Partially Done
- Nothing — skeleton session was scoped to structure only, and that scope was fully completed.

### Not Yet Started
- Real risk scoring logic (started next session, see 2026-08-10 entry above).
- Real translation logic (started next session, see 2026-08-10 entry above).
- Frontend dashboard UI (starts today, 2026-08-10, with Habiba/Farid/Thompson).
- Real SMS/USSD gateway, real ML model, multi-hazard expansion, mobile app, community reporting, IoT sensors, auth, analytics dashboard — all documented as Future Improvements in `README.md` / `docs/architecture.md`, none started.

### Findings & Decisions
- Chose FastAPI for automatic interactive docs (`/docs`) and fast setup.
- Chose to have stub routes read from `docs/mock-data.json` directly (rather than duplicating hardcoded JSON in Python) specifically to make doc/code drift structurally impossible.
- Had to loosen `backend/requirements.txt` version pins from exact (`==`) to minimum (`>=`) because the pinned `pydantic==2.9.2` has no prebuilt wheel for Python 3.14 (the machine's installed version) and failed to compile from source.

### Flags for the Team
- Frontend devs: `frontend-web/` was a deliberately bare scaffold — no assumptions were baked in about routing, state management, or styling. Build it however makes sense to you.
- Everyone: the region risk levels and alert history in `docs/mock-data.json` were hand-picked placeholders as of this entry — see the 2026-08-10 entry above confirming they now match the real computed values, so no update was needed there.
