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
- [x] **Women and children — the two named groups nothing had been
      deliberately designed for — addressed 2026-08-20.** High-risk
      alerts (all 7 languages) now include a safety-priority line naming
      children, elderly people, and pregnant/nursing individuals during
      evacuation — standard humanitarian guidance (the IFRC/UNICEF
      category), not a new personal-data field. See
      `backend/app/models/translations.py`.
- [ ] **Native-speaker review of the new safety-priority clause, in all
      7 languages — including Swahili, Arabic, and Somali**, whose
      *original* wording was already reviewed. That review didn't cover
      this new clause; treat it as unreviewed everywhere until checked.

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
- [x] **Investigated real training data — not cleanly feasible, don't
      force it.** Checked 2026-08-17: EM-DAT (registration-gated),
      ICPAC (categorical, no raw-data API), NASA EONET (effectively
      empty for Africa) all ruled out. GDACS + Open-Meteo (rainfall +
      river-discharge) actually work, and `backend/app/models/
      fetch_real_training_data.py` assembles real data from them — but
      only 14 of 41,355 assembled rows (0.03%) carry a real confirmed
      label, 7 of 9 cities got zero real positive examples, and GDACS's
      river-flood events are partly auto-derived from the same discharge
      series used as the feature (a real leakage risk, not just
      imbalance). Kept the synthetic-trained model; recommend citing
      real GDACS/rainfall data as external validation in the pitch
      instead of a training-data swap. See `docs/progress-log.md`'s
      2026-08-17 entry for the full investigation.
- [x] **Native-speaker review of Swahili, Arabic, and Somali alert
      wording — all 3 confirmed correct (2026-08-17).** Also added
      city-name localization per the reviewers' feedback (e.g. "Cairo" →
      "القاهرة", "Mogadishu" → "Muqdisho") — see `LOCALIZED_CITY_NAMES`
      in `backend/app/models/translations.py`.
- [x] **Added French as a 5th language (2026-08-17)** to reach more
      Francophone African countries — DRC corrected from an English
      fallback to French (its actual official language; Kinshasa is a
      live sample city), plus 15 more Francophone countries mapped ahead
      of having a sample city there yet (same pattern used for Somalia
      before Mogadishu was added). Deliberately excluded
      Congo-Brazzaville — too easily confused with DRC by country name.
- [ ] **Native-speaker review of the new French alert wording** —
      unreviewed AI draft, same status Arabic/Swahili/Somali were in
      before this session. Whoever finds a French speaker next should
      use the same `docs/translation-review/` packet pattern.
- [x] **Fixed a real live bug: Maputo/Mozambique was defaulting to
      English (2026-08-17).** Portuguese is Mozambique's actual official
      language — corrected, same category of bug the DRC/French fix
      caught. Maputo is the team's most real-data-validated city (a real
      confirmed flood event from the Dec 2025-Jan 2026 investigation),
      so this was a priority fix, not a routine addition.
- [x] **Added Portuguese and Amharic (2026-08-17)**, completing
      alignment with the African Union's 6 official languages (Amharic
      substituted for Spanish per the organizer's guidance) — English,
      Arabic, French, Portuguese, Swahili, Amharic, plus Somali kept as
      a 7th from before that alignment. Portuguese also mapped to
      Angola, Guinea-Bissau, Cabo Verde, São Tomé and Príncipe, and
      Equatorial Guinea (explicit team call despite Spanish/French also
      being co-official there) ahead of having sample cities in them.
      Skipped as genuinely ambiguous: Djibouti (Arabic/French/Somali all
      plausible), Comoros (French/Arabic co-official), Eritrea (none of
      our 7 languages is actually its primary one — Tigrinya is).
- [x] **Added Addis Ababa, Ethiopia as a 10th sample city (2026-08-17).**
      Amharic is now exercised live by `GET /api/regions`, not just
      reachable via a manual `POST /api/risk-check` call — closes the gap
      flagged earlier the same day. Inputs (65mm rainfall, 2.6m river
      level) chosen to land in `medium` (score 0.65, ML model
      independently agrees at 0.66), keeping the 10-city distribution a
      reasonable 3 high / 4 medium / 3 low. Updated every doc/comment
      that said "9 sample cities."
- [ ] **Native-speaker review of Portuguese and Amharic alert wording**
      — both unreviewed AI drafts, same status French is in. **Amharic
      especially needs review** — it's the least confident draft of all
      7 languages (different script, linguistically furthest from the
      team's other languages) — see
      `docs/translation-review/amharic-review.txt`'s explicit warning.
      Portuguese packet: `docs/translation-review/portuguese-review.txt`.
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
