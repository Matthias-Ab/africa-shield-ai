# Progress Log — Africa Shield AI

Dated, factual session log for the whole team. Read the most recent entry
first for current state; scroll down for history.

---

## 2026-08-10 — Documentation accuracy pass

### Completed
- **Leftover Yoruba reference removed** from `docs/frontend-feature-spec.md` (an example response had literally said `"local_language": "Yoruba"`, stale from before the team dropped Yoruba) and from the PDF's API-overview example (same issue). Confirmed via full-text extraction of the regenerated PDF and a grep of `docs/*.md` that no live-facing doc mentions Yoruba anymore. `docs/progress-log.md`'s own historical entries still mention Yoruba by name — that's correct and intentional (they're a dated record of what was true in earlier sessions, not live content) and were left unchanged.
- **"3-day hackathon" framing corrected.** The actual deadline is **2026-08-29**, not the ~3-day/Aug-12 window several earlier sessions assumed. Fixed in the PDF (4 occurrences — the "simulated" callout, the translations caveat, the tech-stack callout, and the closing note) and in `backend/app/models/translations.py`'s module docstring (was "the Aug 12 demo," now references the real 2026-08-29 deadline). Historical `docs/progress-log.md` entries that mention "Aug 12" were left as-is — they're an accurate record of what the team believed/decided at the time, not a live claim.
- **Confirmed Mogadishu, Somalia is genuinely in `backend/app/data/regions.json`** (read the file directly rather than trusting memory) — it is, bringing the total to 9 sample cities, matching every current doc that states "9." The only places that say "8 sample cities" are `docs/progress-log.md`'s historical entries from before Mogadishu was added, which is correct as a dated record — no live doc or code needed a fix here.
- **Team & Roles completed.** Added Mohamed Zaki (Embedded Systems / Robotics, confirmed with the team lead) and removed the `[ Name ] / [ Role ]` placeholder row, in `README.md`, `docs/pitch-notes.md`, and the PDF's Team & Roles table. Full team: Matthias (Backend/AI), Habiba/Farid/Thompson (Frontend web dashboard), Mohamed Zaki (Embedded Systems/Robotics).
- **Docs/code sync claim corrected.** The PDF's architecture section previously said syncing was "checked automatically" — it isn't; there's no test suite or CI check in this repo enforcing it. Reworded to say it's manually re-verified each session (which is what actually happened — see the 2026-08-10 "backend pass" entry below, where a one-off script was run by hand, not a standing automated check).
- Regenerated `docs/Africa-Shield-AI-Overview.pdf` from the corrected HTML source and verified via text extraction (not just visual spot-check) that none of the fixed strings reappear and the corrected ones (Mohamed Zaki, 2026-08-29, "manually re-verifying") are present on the expected pages. Page count unchanged (14).

### In Progress / Partially Done
- Nothing left half-finished from this session.

### Not Yet Started
- `docs/architecture.md` itself (the markdown file, not the PDF) is still written from the very first skeleton session and says things like "risk model... Not implemented yet" and frontend "starting tomorrow" — both long since overtaken by events. Noticed during this pass but **not fixed**, since it wasn't one of the 5 items asked for this session and a full rewrite is a bigger job than a targeted correction. Worth a dedicated pass.
- Everything else already listed as Not Yet Started in prior entries.

### Findings & Decisions
- Distinguished consistently between "historical record" (progress-log.md's dated entries — never rewritten, even when they mention since-corrected facts like Yoruba or Aug 12) and "live/current-state claims" (README, pitch-notes, architecture sections of the PDF, code comments — corrected when wrong). This distinction is what let this pass fix real inconsistencies without falsifying the team's actual history of decisions.
- The "checked automatically" claim was an overstatement of what actually happened in past sessions: a person (or this assistant) ran a one-off Python script via the terminal to diff live API output against `docs/mock-data.json`. That's more rigorous than eyeballing, but it is not a repeatable, automated mechanism (no test file, no CI config) — so it shouldn't be described as "automatic" without that caveat.

### Flags for the Team
- **If the Aug 29 deadline changes again, search before editing.** The stale "Aug 12" framing this session fixed came from an earlier, apparently superseded deadline. Live docs affected: `docs/Africa-Shield-AI-Overview.pdf` (regenerate from `docs/frontend-feature-spec.md`'s sibling HTML source — ask for it, it isn't committed) and `backend/app/models/translations.py`'s docstring.
- **`docs/architecture.md` is stale** (see Not Yet Started above) — don't cite it as current-state without checking against `docs/api-contract.md` and `docs/progress-log.md` first.
- **Team roster is now complete** in README/pitch-notes/PDF: Matthias, Habiba, Farid, Thompson, Mohamed Zaki. If anyone else joins or a role changes, update all three places (they're not generated from a single source).

---

## 2026-08-10 — Beginner-friendly project overview PDF

### Completed
- Wrote `docs/Africa-Shield-AI-Overview.pdf` (14 pages) — a beginner-friendly explainer of the whole project: what it is, the problem it solves, the workflow step by step, the risk-scoring formula worked through with a real example (Lagos, 0.82 → HIGH), the four-language translation mapping, simulated alert delivery, tech stack in plain language, system architecture, API overview, and the roadmap. Includes diagrams (workflow pipeline, risk-score bar chart, language-mapping diagram, roadmap timeline) rather than just text.
- Built from an HTML source (print-styled) and converted with headless Chrome (`--print-to-pdf`) — no paid tooling needed. Verified page count (14, matches the 12 content sections + cover + TOC, no overflow) and visually spot-checked rendering (emoji, SVG diagrams, RTL Arabic, tables) via screenshots before finalizing.
- Linked from the top-level `README.md`'s Docs section as the recommended starting point for anyone new to the project, including judges/reviewers.

### In Progress / Partially Done
- Nothing left half-finished from this session.

### Not Yet Started
- N/A — this was a standalone documentation task, not tied to open backend/frontend work.

### Findings & Decisions
- Used population/risk figures and translation examples already established in prior sessions (e.g. Lagos 0.82/HIGH, Cairo/Arabic example) rather than inventing new ones, so this document can't drift from the actual running system.
- Repeated the same honesty pattern as the rest of this project's docs: the PDF explicitly states what's simulated (SMS/USSD/WhatsApp sending), what's unreviewed (Swahili/Arabic/Somali translations), and what's roadmap vs. built today — rather than presenting the demo as more finished than it is.

### Flags for the Team
- This PDF is a good one to send to judges/reviewers ahead of the live demo, or to hand a new teammate on day one.
- The source HTML isn't committed to the repo (only the final PDF is, in `docs/`) — if the content needs updating later, ask for it to be regenerated rather than hand-editing the PDF.

---

## 2026-08-10 — "Make the demo superb" backend pass + frontend handoff spec

### Completed
- Discussed a prioritized feature list to strengthen the Aug 12 demo (map view, live risk simulator, "why this score" breakdown, phone-mockup alert screens, population/impact framing, low-bandwidth mode). Confirmed with the team lead that `frontend-web/` is still off-limits (no teammate commits there yet, but the boundary stands) — so this session did backend enrichment + a written spec instead of touching frontend code.
- `backend/app/models/risk_model.py`: added `risk_score_breakdown(rainfall_mm_24h, river_level_m) -> dict`, returning the raw inputs, their normalized values, the caps/thresholds used, and the resulting risk_level/risk_score — full explainability data for a "why this score" UI. Refactored the normalization math into a shared `_normalized_inputs()` helper used by both `compute_risk()` (unchanged signature/behavior) and the new function.
- `backend/app/data/regions.json`: added `population_estimate` to all 9 sample cities — rough, publicly-known city/metro population figures (e.g. Lagos 15,000,000, Kinshasa 15,000,000, Maputo 1,100,000). **Not a flood-exposure model** — see Flags below.
- `backend/app/routes/regions.py` and `risk.py`: both endpoints now include `risk_score_breakdown` in their response; `/api/regions` also includes `population_estimate` per region. Both are **additive fields only** — `location_name`/`latitude`/`longitude`/`risk_level`/`risk_score`/`alert_message_en`/`alert_message_local`/`local_language`/`timestamp` are all unchanged in name, type, and meaning.
- `docs/api-contract.md` and `docs/mock-data.json` updated to document and mirror the new fields exactly, including a top-of-file note flagging this as an additive/non-breaking contract change.
- Wrote `docs/frontend-feature-spec.md` — a full handoff doc for Habiba/Farid/Thompson covering all 6 features with concrete API request/response examples, a suggested priority order (map → live simulator → score breakdown → phone mockups → population framing → low-bandwidth toggle), and explicit caveats (population figures aren't a flood model; Arabic needs `dir="rtl"`; USSD has no rich UI).
- Verified end-to-end with a programmatic diff (not just eyeballing): started the server, pulled live `/api/regions` and `/api/risk-check` responses, and asserted they match `docs/mock-data.json` byte-for-byte (excluding the timestamp field) — confirmed zero drift for all 9 regions plus the Cairo/Arabic risk-check example.

### In Progress / Partially Done
- Nothing left half-finished from this session's backend scope. The 6 features themselves are specced, not built — that's explicitly frontend work per the team's decision this session.

### Not Yet Started
- All 6 frontend features described in `docs/frontend-feature-spec.md` (map, live simulator, score breakdown UI, phone mockups, population framing, low-bandwidth toggle) — backend is ready for all of them, none are built yet.
- Everything else already listed as Not Yet Started in prior entries (native-speaker translation review — no longer a hard blocker per the earlier team decision, but still open; real SMS/USSD gateway; ML model; pitch deck).

### Findings & Decisions
- **Chose to keep `population_estimate` as a general city-population figure rather than attempting a flood-exposure estimate.** Computing "population actually in a flood-prone zone" would need real GIS/elevation data this team doesn't have this week; a fabricated-looking subset number would be easier for a judge to poke a hole in than an honestly-labeled general population figure. Flagged prominently in both `api-contract.md` and `frontend-feature-spec.md` with suggested safe phrasing.
- **`risk_score_breakdown` duplicates `risk_level`/`risk_score` inside itself** (they also appear at the top level of the response). Deliberate — lets a UI component receive the breakdown object standalone (e.g. for a detail modal) without needing to also thread through the parent response's top-level fields.
- Confirmed via automated diff, not manual inspection, that there is no drift between `docs/mock-data.json` and the live API — this is a stronger check than previous sessions' manual `curl` comparisons and worth repeating this way going forward.

### Flags for the Team
- **API contract gained two new fields, non-breaking.** If anyone already started building against the old `/api/regions`/`/api/risk-check` shapes, nothing breaks — the new fields (`population_estimate`, `risk_score_breakdown`) are additive and can be adopted whenever convenient.
- **`population_estimate` is not a flood-risk number — it's the city's general population.** Do not present it in the pitch as "X people at risk of flooding." See the caveat and suggested phrasing in `docs/frontend-feature-spec.md` section 5. If a judge asks about it, the honest answer is "general population of the monitored area, not a flood-exposure model — that's on the roadmap."
- **All 6 features are specced in `docs/frontend-feature-spec.md` with a suggested priority order** (map view first, low-bandwidth toggle last) in case there isn't time for all six before Aug 12 — do the highest-impact ones first rather than going in this log's listed order.
- **Arabic RTL reminder repeated in the new spec doc** (section 4) — easy to miss until someone actually renders a Cairo/Mogadishu-adjacent-Arabic alert card.

---

## 2026-08-10 — Add Mogadishu, Somalia; ship AI-drafted translations as-is

### Completed
- Added `Mogadishu, Somalia` (lat 2.0469, lon 45.3182, rainfall 55mm/24h, river 2.6m) to `backend/app/data/regions.json` and the matching entry to `docs/mock-data.json`'s `regions` list — the sample set is now 9 cities, not 8. Computed risk: 0.6 / `medium`. Chosen to give an even 3-high/3-medium/3-low spread across all 9 sample cities (previously 3/2/3 with none in Somalia).
- Wrote real Somali wording in `backend/app/models/translations.py`'s `ALERT_TEMPLATES["Somali"]`, replacing the three `"TODO: awaiting reviewed Somali translation"` placeholders. Per team decision, kept the existing AI-written Swahili and Arabic strings as the working translations too — no longer blocking on a review pass before Aug 12 (softened the "MUST be replaced" comment in the module docstring to reflect this; the native-speaker-review recommendation stays, just not as a blocker).
- Updated region counts from "8" to "9" everywhere they were stated as current-state facts: `docs/api-contract.md`, and the sanity-check comments in `backend/app/models/risk_model.py` and `translations.py`. (Left "8" untouched in this log's own prior dated entries — those describe the past, not now.)
- Verified end-to-end: `GET /api/regions` now returns 9 entries including `{"location_name": "Mogadishu, Somalia", ..., "risk_level": "medium"}`; `POST /api/risk-check` for Mogadishu returns the real Somali sentence (`"Khatarta daadka ee Mogadishu waa DHEXDHEXAAD. La soco warbixinnaha maxaliga ah."`), not a TODO string, and it matches `docs/mock-data.json` exactly.

### In Progress / Partially Done
- Nothing left half-finished from this session's scope.

### Not Yet Started
- Native-speaker review of Swahili/Arabic/Somali wording — no longer a hard blocker for Aug 12 per today's team decision, but still worth doing if time allows.
- Frontend RTL handling for Arabic, real translation API, real SMS/USSD gateway, ML model, pitch deck — all still open from prior entries.

### Findings & Decisions
- **Team decision (2026-08-10): ship the AI-written Swahili/Arabic/Somali translations as the working set for the Aug 12 demo**, rather than waiting on a native-speaker review pass. This reverses the "MUST be replaced" framing from the previous entry — the review is now a nice-to-have, not a blocker.
- Mogadishu's rainfall/river inputs (55mm, 2.6m) were picked specifically to land in the `medium` bucket and even out the risk-level distribution across all 9 cities — not based on real Somali hydrological data.

### Flags for the Team
- **`/api/regions` now returns 9 entries, not 8** — anyone (frontend, pitch deck) who assumed a fixed count of 8 should double check that assumption.
- **Somali now has real (if unreviewed) wording**, not a visible TODO string — if you test a Somalia request and expect to still see a placeholder, that's been replaced.
- Swahili/Arabic wording is unchanged from the previous entry — still AI-written, just no longer flagged as blocking.

---

## 2026-08-10 — Finalize language mapping (English/Swahili/Arabic/Somali)

### Completed
- `backend/app/models/translations.py`: replaced `LOCAL_LANGUAGE_BY_COUNTRY` to map only to the team's four agreed languages. Final mapping: `kenya` → Swahili, `tanzania` → Swahili, `uganda` → Swahili, `egypt` → Arabic, `somalia` → Somali, `nigeria` → English, `ghana` → English, `mozambique` → English, `drc` → English. `DEFAULT_LOCAL_LANGUAGE` changed from `"Swahili"` to `"English"` for any country not explicitly listed.
- Removed Yoruba entirely from `translations.py` — no leftover mapping entries or template block. (It remains mentioned in this log's 2026-08-10 "real logic" entry below and the entry before that, since those are a historical record of what was true at the time and are not rewritten.)
- `ALERT_TEMPLATES` restructured: kept `"en"` (always used for `alert_message_en`), added an `"English"` alias pointing at the same template dict (needed because `local_language` can now be `"English"` itself, and the lookup would otherwise `KeyError`), kept the Swahili and Arabic draft templates as-is, added a `"Somali"` block with `"TODO: awaiting reviewed Somali translation"` placeholders for `high`/`medium`/`low` instead of any guessed wording.
- Added a prominent module-docstring flag: Swahili and Arabic strings are unreviewed AI-written drafts; Somali has no wording yet; both need the team's reviewed text before Aug 12.
- Added a module-docstring note that `alert_message_local` is right-to-left when `local_language` is `"Arabic"`, and that this module does nothing about RTL rendering — that's explicitly a frontend concern.
- `docs/mock-data.json` and `docs/api-contract.md`: replaced the `risk_check_example` (was Lagos/Nigeria/Yoruba) with Cairo/Egypt/Arabic, using the exact same Arabic string as `translations.py`'s `ALERT_TEMPLATES["Arabic"]["medium"]` formatted for Cairo — verified character-for-character identical, so there's no drift between the docs and the code. Updated the `local_language` field note in `api-contract.md` to list the four agreed languages and call out the RTL consideration.
- Verified end-to-end with the server running locally: tested one request per language path — Cairo/Egypt → Arabic (medium/0.42), Nairobi/Kenya → Swahili (low/0.20), Lagos/Nigeria → English (high/0.82, now matching `alert_message_en` since Nigeria has no dedicated local template), Mogadishu/Somalia → Somali (medium/0.50, returned the TODO placeholder string as expected, not invented wording), and an unmapped country → English (high/0.93, confirming the fallback change from Swahili to English). `/api/regions` response shape unchanged. Confirmed no remaining "Yoruba" references anywhere in `backend/` via a full-repo grep (the only hits are in this log's historical entries below, which is correct — they're a record of the past, not live code).

### In Progress / Partially Done
- Nothing left half-finished from this session's scope.

### Not Yet Started
- Reviewed Swahili and Arabic wording (still AI-written drafts as of this entry).
- Any Somali wording at all (currently just TODO placeholders).
- Frontend RTL handling for Arabic (`frontend-web/` not touched this session, per instructions).
- Everything else already listed as Not Yet Started in the entry below (real translation API, real SMS/USSD gateway, ML model, frontend dashboard, pitch deck, etc.).

### Findings & Decisions
- **Somalia is in the language mapping even though it's not one of the 8 sample cities in `backend/app/data/regions.json`.** Added because Somali is one of the four agreed languages and Somalia is the obvious country for it — flagging this as an addition beyond the 8 sample cities so it can be sanity-checked.
- **Nigeria, Ghana, Mozambique, and DRC are mapped explicitly to `"English"`** in the dictionary (rather than relying on `DEFAULT_LOCAL_LANGUAGE` for them) — this makes the mapping self-documenting and means adding a 9th agreed language later won't silently change what these four countries show.
- **The `"English"` alias in `ALERT_TEMPLATES` is a plumbing necessity, not a design choice** — `build_alert_messages` looks up `ALERT_TEMPLATES[local_language][risk_level]`, and once `"English"` became a possible value of `local_language` (not just `"en"`), that lookup needed a matching key or it would crash. `alert_message_local` and `alert_message_en` are therefore identical strings whenever `local_language == "English"`.

### Flags for the Team
- **Yoruba is fully removed.** The final four languages are English, Swahili, Arabic, and Somali — English is always the baseline, the other three are the local-language options depending on country.
- **Swahili and Arabic wording in `translations.py` is still an unreviewed AI-written draft.** Needs native/fluent-speaker review before Aug 12 — same flag as the previous entry, not yet resolved.
- **Somali has zero real wording yet** — three `"TODO: awaiting reviewed Somali translation"` placeholder strings sitting in `ALERT_TEMPLATES["Somali"]`. Whoever owns Somali translation needs to fill these in; until then, any Somalia-mapped request will visibly return the TODO string, not silently wrong text.
- **Arabic is right-to-left — this needs frontend handling.** The backend returns plain Arabic text with no directionality markup; the dashboard needs to render it RTL (e.g. `dir="rtl"`) when `local_language === "Arabic"`. Flagging explicitly for Habiba/Farid/Thompson since this is easy to miss until someone actually looks at a Cairo alert card.
- **Default fallback language changed from Swahili to English** for any country not in `LOCAL_LANGUAGE_BY_COUNTRY`. If a new sample city gets added later and its country isn't explicitly mapped, it'll now show English by default, not Swahili — worth knowing if that ever looks surprising in a demo.

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
