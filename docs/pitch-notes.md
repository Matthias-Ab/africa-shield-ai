# Pitch Notes — Africa Shield AI (placeholder)

_Fill this in as the demo comes together. Structure below is a starting point._

## The narrative arc

1. **Big vision:** Africa Shield AI — multi-hazard (floods, droughts,
   heatwaves, wildfires, cyclones, earthquakes), continent-wide early
   warning, built for people without smartphones or reliable internet.
2. **Core demo, working today:** "Last-Mile Alert AI" — flooding only,
   end-to-end: rules-based risk score → alert message → translated into a
   local language → simulated SMS/USSD/WhatsApp send → dashboard view.
3. **Future:** expand to the other hazards, real ML model, real SMS
   gateway, offline-first mobile app, community reporting, IoT sensors.

## Talking points (TODO — flesh out with the team)

- Why last-mile alerting matters: [ TODO — stat or story about
  disaster warning reaching people too late or not at all ]
- Why flooding first: [ TODO — e.g. frequency/impact across target regions ]
- Why rules-based, not ML, for the demo: explainable, fast to build, easy
  for judges to audit — sets up the "future: real ML model" beat honestly.
- Why simulated sending, not a real gateway: hackathon time constraint;
  the "message sent" screen proves the concept without needing a paid
  SMS provider account.

## Real-data validation (2026-08-29) — the honest ML story

**The model trains on synthetic data — that's not hidden, and here's the
real evidence we cite instead of pretending otherwise.**

- Real historical flood data for our 10 cities came from the **Dartmouth
  Flood Observatory** (an independent, non-satellite-derived global flood
  catalog, free/no-login) — 49 real, dated flood events across all 10
  cities, 1985–2010 (see `backend/app/data/dfo_flood_events.json`).
- Paired with **real** rainfall (Open-Meteo/ERA5) and river discharge
  (Open-Meteo/GloFAS) for the same cities and years —
  `backend/app/models/fetch_real_training_data_dfo.py`.
- **The real, citable number:** validated against 239 real confirmed
  flood-days (7 of our 10 cities have usable discharge data — GloFAS has
  none at all for Maputo/Mogadishu, and only from 1997 onward elsewhere,
  a real data-coverage limit, not a bug) — see
  `backend/app/models/validate_against_dfo.py`:
  - Our **rules-based** model flagged **41% of real historical flood
    days** as medium-or-high risk (22% false-positive rate on
    non-flood days).
  - The **trained ML model** flagged 28% (13.7% false-positive rate) —
    more conservative, fewer false alarms but also fewer catches.
- **Why this isn't a full retrain, said plainly if asked:** GloFAS gives
  river *discharge* (m³/s), not river *level* (meters) — the two aren't
  convertible without river-specific data we don't have, so this
  compares real rainfall + a river's own relative discharge percentile
  against real flood days, not literal training on real river-level
  readings. It's genuine external validation with real data, not a
  production swap — same honest line the team already held to when the
  first (GDACS-based) attempt at this found almost no usable real
  events at all.

## Cost & scalability

**Africa's Talking SMS costs roughly $0.01–$0.03 per message** (exact rate
varies by country/network). That's the number to quote — it's a real
platform rate, not an estimate we made up.

- **Adding a new city or region costs nothing extra in engineering** — it's
  one more entry in `regions.json`, not new code. The cost that scales is
  purely the per-message send cost, which stays a few cents per alert
  either way.
- **Illustrative math for a pitch soundbite** (not a real event — just to
  make the number concrete): warning an entire region of ~10,000
  subscribed households during one flood event, one SMS each, costs
  roughly **$100–$300** at $0.01–0.03/segment — an order of magnitude
  cheaper than any physical alternative (door-to-door, megaphone convoys).
- **One honest caveat to have ready if asked:** the safety-priority line
  added 2026-08-20 (naming children/elderly/pregnant-or-nursing people as
  evacuation priorities) can push a "high" alert from one 160-character
  GSM-7 segment into two, which roughly **doubles** that message's send
  cost. Quote the doubled figure for high-risk alerts specifically, not a
  single flat rate for every message.
- Voice and USSD both ride the same Africa's Talking account, but we don't
  have a confirmed per-call/per-session rate yet to quote — don't guess a
  number for those on stage; SMS is the one rate we can defend.

## Sustainability & resource efficiency

**Affordable.** Roughly $0.01–$0.03 per alert sent, and the risk-scoring
itself is cheap to run — a small trained model plus simple arithmetic,
not a heavy compute job.

**Environmentally responsible.** A lightweight JSON-file backend and a
small ML model mean minimal server compute and power draw compared to
running large infrastructure. The planned physical sensors are
low-power microcontroller hardware, not energy-intensive equipment.

**Maintainable.** Adding a region is a data-entry task, not a code
change, so a partner disaster authority could plausibly maintain their
own region's thresholds without engineering support once onboarded.

**Resource-efficient.** SMS/USSD/voice were chosen specifically because
they need minimal bandwidth and no data plan on the recipient's end —
the system was designed around scarcity, not around assuming abundant
connectivity.

## Demo flow (TODO — walk through the actual click path once built)

1. Open dashboard → show regions color-coded by risk.
2. Click a high-risk region → show the risk score + English/local alert.
3. Show the "message sent" / alert history view.
4. Close on the roadmap slide (multi-hazard, real gateway, mobile app).

## Team roles

- Matthias — backend / AI (risk model, API)
- Habiba — frontend web dashboard
- Farid — frontend web dashboard
- Thompson — frontend web dashboard
- Mohamed Zaki — embedded systems / robotics
