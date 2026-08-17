# To-Do — Africa Shield AI

Living checklist of everything still open, consolidated from
`docs/progress-log.md`'s "Not Yet Started"/"Flags for the Team" sections
across all sessions so it's tracked in one place. Update this file
directly as items get done — `progress-log.md` stays the historical
record of *when*/*why* something happened; this file just tracks *what's
left*, right now.

**Real deadline: Regional Hackathon & Demo Days, 2026-09-17 to
2026-09-19** — only 5 of 12 teams advance. Aug 29 is just the end of
Innovation Labs, not the finish line (see `docs/progress-log.md`'s
2026-08-17 entry).

Priorities below are ordered by the jury scorecard's actual point
weights (`AI_for_All_Hackathon_Jury_Evaluation_Scorecard.docx`):
Social Impact & Inclusion 20, Functionality & Prototype 20, Problem & DRR
Relevance 15, Innovation & Creativity 15, Feasibility & Scalability 10,
Appropriate Use of AI/Tech 10, Sustainability & Resource Efficiency 5,
Presentation & Pitch 5.

## Critical — must happen before the demo

- [ ] **Create a real Africa's Talking sandbox account** and fill in
      `backend/.env` (`AT_USERNAME`, `AT_API_KEY`, `AT_VOICE_NUMBER`,
      optionally `AT_SENDER_ID`). Free at
      https://account.africastalking.com/. Nothing has been sent for
      real yet — every alert so far says "(simulated)".
- [ ] **Send a real test SMS** to a team member's own phone via
      `POST /api/alerts/send` once credentials are set.
- [ ] **Place a real test voice call** to a team member's own phone via
      `POST /api/alerts/send` with `"channel": "voice"`.
- [ ] **Test USSD against Africa's Talking's real sandbox simulator** —
      needs a public URL (e.g. `ngrok http 8000`) pointed at
      `/api/ussd`, and a sandbox USSD channel configured to call it. Only
      tested locally via raw form-encoded requests so far.
- [ ] **Verify Africa's Talking's voice `<Say>` handles non-English text**
      (Arabic/Swahili/Somali) acceptably — untested. If it doesn't, decide
      a fallback (e.g. speak English instead of `alert_message_local` for
      those regions) before the demo, not during it.
- [ ] **Run the Wokwi ESP32 simulation against a real, locally running
      backend** (`hardware/wokwi-flood-sensor/`) — needs a tunnel (e.g.
      `ngrok http 8000`) since Wokwi can't reach `localhost`. Only tested
      so far with `curl` standing in for the device.

## Social Impact & Inclusion (20 pts) — currently the weakest-covered criterion

- [x] Voice alerts for people a text channel doesn't reach (can't read,
      local script, or visually impaired) — built 2026-08-17.
- [ ] Consider whether anything else in the scorecard's named groups
      ("people with disabilities, women, children, elderly people,
      underserved groups") is still unaddressed — worth a deliberate
      5-minute team discussion, not just an engineering afterthought.

## Functionality & Prototype (20 pts)

- [ ] Everything above under "Critical" — a demo that only shows
      "(simulated)" labels undercuts this criterion directly.
- [ ] Frontend cleanup (left to the frontend team, doesn't block the demo
      but worth doing before judging):
  - [ ] Move the hardcoded `http://localhost:8000` API URL (duplicated in
        `RegionTable.jsx`, `RiskMap.jsx`, `RiskOverview.jsx`,
        `RiskDistribution.jsx`) into one config value.
  - [ ] Delete unused `frontend-web/src/data/mockData.js`.
  - [ ] Fix the stray `py-` Tailwind class typo in `Dashboard.jsx`.
  - [ ] De-duplicate the repeated fetch/loading/error boilerplate into one
        shared hook.
  - [ ] Label `RecentAlerts.jsx`'s data as simulated in the UI, or wire it
        to the now-real `GET /api/alerts`.

## Innovation & Creativity (15 pts) / Appropriate Use of AI & Tech (10 pts)

- [x] IoT sensor ingestion (`POST /api/sensor-reading` + a Wokwi ESP32
      simulation with rain/water-level sensors) — built 2026-08-17,
      directly targets the scorecard's explicit "IoT & Sensors"
      sub-criterion. No real hardware yet — see Critical above for the
      Wokwi-against-real-backend test still needed.
- [ ] Train the ML risk model on real historical rainfall/river-level/
      flood-outcome data instead of synthetic data (see
      `backend/app/models/train_ml_model.py`'s docstring for the isolated
      swap point).
- [ ] Native-speaker review of the Swahili/Arabic/Somali alert wording
      (currently AI-drafted, shipped as-is per an earlier team decision —
      still worth doing if time allows).
- [ ] Automatic threshold-triggered alerts (a scheduled job firing
      `/api/alerts/send` when a region crosses into `high`), instead of
      only on-demand sending.
- [ ] Real subscriber registration/outreach at scale, instead of a
      hand-seeded or USSD-only list.

## Feasibility & Scalability (10 pts) — not addressed in any doc yet

- [ ] Write a short cost/scaling note for the pitch: Africa's Talking SMS
      costs roughly $0.01–0.03/message, so adding a new city/region costs
      pennies per alert — an honest, cheap-to-add talking point.

## Sustainability & Resource Efficiency (5 pts) — not addressed in any doc yet

- [ ] Write a short sustainability note: lightweight JSON-file backend +
      FastAPI, no heavy infra, low compute footprint. Low point weight —
      don't over-invest here.

## Presentation & Pitch (5 pts)

- [ ] Write the actual pitch deck — `docs/pitch-notes.md` is still a
      placeholder.
- [ ] Build an Innovation Canvas artifact (problem, AI solution,
      tech/data sources, partners, impact, risks, scalability) — implied
      as an expected deliverable by the organizers' ideation deck.

## Post-hackathon roadmap (not needed for the Sep demo)

- [ ] Expand beyond flooding to droughts, heatwaves, wildfires, cyclones,
      earthquakes.
- [ ] Offline-first Flutter mobile app.
- [ ] Real translation API instead of the hardcoded dictionary; expand
      language coverage.
- [ ] Community-reporting feature (on-the-ground condition reports).
- [ ] Move from the Wokwi simulation to real ESP32 hardware with real
      rain/water-level sensors (backend ingestion already built).
- [ ] User authentication / role-based access for disaster-management
      authorities.
- [ ] Analytics/impact dashboard (alerts sent, regions covered, estimated
      impact).
