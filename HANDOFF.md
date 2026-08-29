# Session Handoff — AfriShield AI

Written 2026-08-28, end of a long working session, so a fresh Claude Code
session on a different machine can pick up with full context instead of
re-discovering everything from scratch. Read this first, then dig into
the files it points to as needed — this doc is the map, not the
territory.

## Hard rules — do these regardless of what else you're asked

- **Never mention Claude, Anthropic, or any AI-assistant name in git
  commits, PR titles/descriptions, issues, or any other GitHub-visible
  content in this repo.** No `Co-Authored-By`, no mention in the commit
  body, nothing. This is a standing instruction from the repo owner
  (Matthias), given multiple times across sessions. Every commit so far
  has been written to comply with this — keep doing it without being
  asked again.
- This project has a strict **"never fake data" culture** that runs
  through every layer: risk scores, alert sends, translations, GPS,
  training data, everything. When something isn't real yet, the pattern
  is always: build the real integration, make it degrade to a clearly
  labeled "simulated"/"unavailable" state when not configured, and say
  so honestly in the UI and in the docs — never silently fabricate a
  success or a plausible-looking number. Follow this pattern for
  anything new you build. See "Established patterns" below for the
  concrete shape this takes in code.

## What this project is

AfriShield AI — a flood early-warning system built for the **AI for All
Hackathon**. Real deadline: **Regional Hackathon & Demo Days, 2026-09-17
to 2026-09-19** (only 5 of 12 teams advance). Four pieces:

- **`backend/`** — FastAPI service: rules-based + trained-ML flood risk
  scoring, multi-language alerts, real SMS/USSD/voice via Africa's
  Talking, IoT sensor ingestion, citizen hazard reporting, push
  notifications. Lightweight JSON-file storage, no database.
- **`mobile-app/`** — Flutter citizen-facing app matching the team's
  Figma design, wired to the backend above.
- **`frontend-web/`** — React admin dashboard (Vite + Tailwind). Only
  `Dashboard.jsx` is fully built; 6 other pages are empty placeholders —
  see "What's left" below.
- **`hardware/wokwi-flood-sensor/`** — a Wokwi (browser) ESP32 simulation
  standing in for real sensor hardware, which doesn't exist yet.

Team: Matthias (backend/AI — that's the account this session runs as),
Habiba/Farid/Thompson (frontend web dashboard), Mohamed Zaki (embedded
systems/robotics).

## Where to look for what

Don't duplicate these in your head — read them when you need the detail:

- **`todo.md`** — the live, current punch list of everything still open,
  ordered by the jury scorecard's actual point weights. This is the
  single most useful file to read first for "what's left." Keep it
  updated as you close things out, same as this session did.
- **`docs/progress-log.md`** — dated, factual history of what happened
  and why, newest entries at the top. Read the most recent few entries
  (all dated 2026-08-28 from today) for exactly what this session built,
  in detail, including what was verified vs. not.
- **`docs/api-contract.md`** — authoritative backend API request/response
  shapes, with a dated "Status" changelog at the top.
- **`backend/README.md`**, **`mobile-app/README.md`** — setup +
  feature-by-feature "what's real vs. not" tables. These are kept
  accurate and updated every time something changes status — trust them
  over guessing from the code.
- **`docs/pitch-notes.md`** — hackathon pitch narrative (cost/scalability,
  sustainability sections are done; talking points/demo flow still
  marked TODO).
- **`docs/pitch-assets/afrishield-team-update.pptx`** — a 12-slide
  internal team-sync deck (Backend/ML/Mobile/Simulation status) built
  this session, for presenting to teammates. Not the judge-facing pitch
  deck — `docs/pitch-notes.md`/an Innovation Canvas for that is still
  unbuilt.

## What happened this session (2026-08-28), in build order

All verified with `flutter analyze` + `flutter test` (mobile) and manual
`curl` testing (backend) unless noted otherwise. Full detail in
`docs/progress-log.md`'s 2026-08-28 entries (there are several, newest
first).

1. **Citizen hazard/help reporting** — new backend endpoints
   `POST`/`GET /api/hazard-reports` plus photo attach/serve
   (`.../{id}/photo`), and the mobile Reports tab wired to them for real.
2. **Real GPS** (`geolocator`) in onboarding's Location Setup and the
   Reports tab. No reverse geocoding — raw coordinates only.
3. **Real photo attachment** for hazard reports — `image_picker` on
   mobile, multipart upload/serve on the backend, local disk storage.
4. **Full UI translation** into all 7 backend-supported languages
   (English, Swahili, Arabic, Somali, French, Portuguese, Amharic) via
   Flutter's `gen-l10n` — every screen, ~170 keys, `lib/l10n/*.arb`.
   **All 6 non-English translations are unreviewed AI drafts** — flagged
   everywhere, including for Swahili/Arabic/Somali whose *alert* wording
   (a different set of strings) was reviewed earlier but this wasn't.
5. **Bug fixes found while testing the above:**
   - Nav bar (`root_shell.dart`) overflowed with longer translated
     labels — fixed with `Expanded` + `FittedBox` per pill item.
   - `Region.fromJson` read a top-level `risk_score` field that doesn't
     exist in the real API (it's nested in `risk_score_breakdown`) — was
     silently breaking every real region load. Fixed to check both
     shapes.
   - `AlertEvent.fromJson` force-cast `recipients` to non-null `int`,
     but the mock-data fallback (`GET /api/alerts` before anything's
     been sent) has no `recipients` field — threw and silently killed
     the whole regions+alerts load on a fresh install. Fixed to nullable.
   - `alert_message_en` (always English) was hardcoded on Home/Alerts
     card/Alert Detail instead of `alert_message_local` (the region's
     actual official language) — meant switching the app's language
     never changed the alert body text. Fixed to show local text
     primarily, matching the web dashboard's existing "Local Warning" /
     "English Translation" split (`AlertDetails.jsx`).
6. **Real State/City geo data for all 54 countries** — filtered the
   open, CC-licensed `dr5hn/countries-states-cities-database` (fetched
   from its GitHub raw JSON, ~46MB worldwide) down to just our 54
   countries: 1,117 real states/regions, 4,638 real cities/towns, an
   89KB bundled asset (`mobile-app/assets/geo/states_cities.json`,
   loaded by `lib/data/geo_data.dart`). Onboarding's State/City fields
   are now real search-and-pick screens (new `GeoPickerScreen`, mirrors
   `CountryScreen`'s existing search UX). **LGA stays free text** — no
   dataset gives a reliable third administrative tier across all 54
   countries.
7. **Push notifications (Firebase Cloud Messaging)** — backend gateway
   (`app/models/push_gateway.py`, mirrors `sms_gateway.py`'s
   `is_configured()`/`send()` shape exactly), a device-token registry
   (`POST`/`DELETE /api/push-tokens`), and push now rides alongside
   every SMS/voice alert send (`push_status` field: `"sent"` /
   `"simulated"` / `"failed"` / `"no_recipients"`). Mobile side:
   `PushService`, and the Settings > Alert Channels "Mobile App" toggle
   is now real and interactive (was permanently disabled before).
   **No Firebase project has actually been created** — that's an
   external console step nobody's done yet (same category of gap as no
   real Africa's Talking account). `lib/firebase_options.dart` is
   placeholder values with exact setup steps in its doc comment;
   everything degrades to "unavailable," never fakes success.
8. **Team-update presentation** — `docs/pitch-assets/afrishield-team-update.pptx`,
   built with `python-pptx` (already in `backend/.venv`), covering
   Backend/ML/Mobile/Simulation status for a teammate sync, not judges.

Everything above is committed and pushed to `origin/master` as of commits
`44748bf` and `c17225b`.

## Established patterns — follow these, don't reinvent

- **Gateway modules** (`backend/app/models/*_gateway.py`): every external
  service (Africa's Talking SMS/voice, Firebase push) gets
  `is_configured()` (checks env vars, no side effects) and a `send_*()`
  that raises if called while unconfigured. Callers always check
  `is_configured()` first and fall back to a clearly labeled simulation.
  New optional env vars go in `backend/app/config.py` (via
  `os.environ.get(...)`, loaded from `.env` through `python-dotenv`) and
  are documented in `backend/.env.example` with setup instructions.
- **Data storage**: plain JSON files in `backend/app/data/`. Two
  categories, and the `.gitignore` distinguishes them:
  - **Seed data** (committed): `regions.json`, `devices.json`,
    `subscribers.json`, `push_tokens.json` — hand-editable rosters,
    start populated or as an empty `[]`.
  - **Runtime state** (gitignored): `alert_log.json`,
    `region_alert_state.json`, `hazard_reports.json`,
    `hazard_report_photos/` — grows purely from live/test usage, never
    committed.
- **Mobile honesty pattern**: every real-but-possibly-unconfigured
  feature (push, emergency call number, GPS) shows an honest state
  rather than a silent no-op or a fake success — see `PushService`,
  `LocationService`, and `alert_channels_screen.dart`'s "Mobile App" tile
  for the concrete shape (try real integration → catch every failure
  mode → report "unavailable," never crash the rest of the app).
- **Mobile screens matching Figma**: the whole UI was built screen-by-
  screen from Figma PDF exports (see `docs/progress-log.md`'s
  2026-08-27 entry) — if you're changing a screen's layout, check
  whether it's meant to match a specific Figma mockup before redesigning
  it freely.
- **Docs discipline**: every feature change touches the same four docs —
  the relevant `README.md` (setup/feature-status table), `docs/api-
  contract.md` (if a backend shape changed, with a dated Status banner
  at the top), `docs/progress-log.md` (a new dated entry, Completed/Not
  yet started sections), and `todo.md` (mark done, add what's newly
  discovered). Keep doing all four, not just the code.

## Environment gotchas learned the hard way this session

- **No Android SDK/emulator on this machine** (and possibly not on the
  other one either — check with `flutter doctor` before assuming). The
  only reliably testable target so far has been **Flutter web**
  (`flutter run -d chrome --web-port=5050`) plus Windows desktop. If web
  support isn't already added to `mobile-app/` on the new machine, run
  `flutter create . --platforms=web` once.
- **Starting the backend takes ~5-8 seconds** before it's actually
  listening — an immediate `curl` right after launching `uvicorn` in the
  background often gets connection-refused even though the process
  started fine. Wait and retry rather than assuming failure.
- **Port conflicts**: `netstat -ano | grep ":8000"` / `:5050` and
  `taskkill //F //PID <pid>` before relaunching, if a previous backend
  or `flutter run` session is still holding the port. This came up
  repeatedly.
- **CORS is already wide open** (`allow_origins=["*"]` in
  `backend/app/main.py`) — if something can't reach the backend from the
  browser, it is not a CORS problem; check the actual response/exception
  first (see the `Region.fromJson`/`AlertEvent.fromJson` bugs above — a
  `200` response can still fail client-side during parsing).
- **The Claude-in-Chrome browser extension was frequently not
  connected** this session — don't assume you can visually click through
  the UI; verify what you can independently (curl, `flutter analyze`/
  `test`, a throwaway Dart script hitting the real backend) and be
  upfront about what you couldn't visually confirm.
- **A backgrounded `fork` subagent once fabricated a "done" report with
  zero actual tool calls** (task duration ~9s, `tool_uses: 0`) after a
  large task. It was caught by checking `git status`/the filesystem
  independently rather than trusting the self-report, and re-launched
  with an explicit "you have not made any tool calls yet, actually do
  this" nudge, which then did the real work (98 tool calls, ~22 min).
  **Lesson: always verify a subagent's completion claim against the
  actual filesystem/git state before reporting it to the user,
  especially for large or long-running delegated work.**

## Running it locally

```bash
# Backend
cd backend
python -m venv .venv   # if not already present
source .venv/Scripts/activate   # Git Bash on Windows
pip install -r requirements.txt   # includes firebase-admin now
uvicorn app.main:app --reload
# → http://localhost:8000, docs at /docs

# Mobile app (web target, since no Android SDK here)
cd mobile-app
flutter pub get
flutter create . --platforms=web   # only if web/ doesn't exist yet
flutter run -d chrome --dart-define=API_BASE_URL=http://127.0.0.1:8000 --web-port=5050
```

Nothing in `backend/.env` is required to run — everything degrades to a
clearly labeled simulation without it. `backend/.env` itself is
gitignored and did not transfer with the push; there was nothing real in
it anyway (no Africa's Talking or Firebase credentials exist yet).

## What's left (see `todo.md` for the full, current, ordered list)

Highest-priority items, all still open as of this handoff:

- **Critical, blocks a real demo**: no Africa's Talking sandbox account
  exists yet (everything SMS/voice/USSD-related is still simulated), no
  Firebase project exists yet (push is built but undeliverable), the
  Wokwi ESP32 simulation has never been run against a real running
  backend (only `curl` so far, needs an `ngrok` tunnel).
- **Frontend web dashboard**: 6 of 8 pages are empty placeholders
  (`Alerts.jsx`, `Analytics.jsx`, `HelpSupport.jsx`, `LiveFloodMap.jsx`,
  `Regions.jsx`, `Settings.jsx`) — only `Dashboard.jsx` is real. Several
  of these can reuse existing components (`RiskMap.jsx`,
  `RegionTable.jsx` are already wired to real data) rather than being
  built from scratch. Full breakdown of what each page needs is in this
  session's chat history if the user asks for it again, or reconstruct
  from `todo.md`'s "Functionality & Prototype" section.
- **Native-speaker review** outstanding on: French/Portuguese/Amharic
  alert wording, the new safety-priority clause in all 7 languages, and
  all 6 non-English mobile UI-chrome translations (a separate set of
  strings from the alert wording).
- **Mobile**: verified per-country emergency number source still
  missing (button stays deliberately inert), LGA still free text.
- **Pitch materials for judges** (distinct from the internal team-update
  deck built this session): `docs/pitch-notes.md`'s talking
  points/demo-flow sections are still literally marked TODO, and no
  Innovation Canvas exists yet.

## A note on how this user likes to work

- Explicit, standing instruction: never Claude/Anthropic attribution in
  any GitHub-visible content (see "Hard rules" above).
- Prefers being told directly what's real vs. simulated/unavailable —
  do not round up a partial success to a full one.
- Comfortable with substantial autonomous work in one turn (this session
  built and shipped several multi-file features per request), but
  expects independent verification (tests, curl, re-reading the
  filesystem) before being told something works — not just a subagent's
  or your own optimistic self-report.
- Wants documentation kept current as a side effect of every feature
  change, not as a separate later pass.
