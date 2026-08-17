# Frontend Feature Spec — "Make the demo superb" pass

For Habiba, Farid, Thompson. This is a handoff, not a mandate — build these
however makes sense in your structure. Each feature below has: why it's
worth the time, exactly what backend data to use (with live examples), and
a suggested (not prescribed) UX. Nothing here requires backend changes —
everything listed already works against the running API. If you want a
different shape than what's documented in
[`api-contract.md`](api-contract.md), ask before assuming the backend can't
do it — some of this was added specifically to support these features.

Priority order (do these roughly in this order if time is short):

1. Map view
2. Live "simulate the disaster" control
3. "Why this score" breakdown
4. Phone-mockup "message sent" screens
5. Population/impact framing
6. Low-bandwidth / text-only mode toggle

---

## 1. Map view

**Why:** a color-coded map reads as "real monitoring system" in about one
second; a list reads as "spreadsheet." This is the single highest-impact
visual for a live demo.

**Data:** `GET /api/regions` already returns `latitude`/`longitude`/
`risk_level` per region — nothing new needed.

**Suggested approach:** [Leaflet](https://leafletjs.com/) + OpenStreetMap
tiles — free, no API key, works offline-cached after first load (bonus
point for the "works with poor connectivity" narrative). One marker per
region, colored by `risk_level`:

- `"high"` → red
- `"medium"` → yellow/amber
- `"low"` → green

Clicking a marker should show the region's alert detail (see #3/#4 below).

---

## 2. Live "simulate the disaster" control

**Why:** the single most convincing thing you can do in front of judges is
change a number and watch the whole pipeline — risk level, score, both
alert languages — update live. Screenshots are forgettable; a judge
personally causing a flood alert to fire is not.

**Data:** `POST /api/risk-check`. Give the judge two inputs — rainfall
(mm/24h) and river level (m) — as sliders or number fields, plus a location
name (can default to one of the 9 sample cities, or let them type
anything).

Example request:
```json
{
  "location_name": "Lagos, Nigeria",
  "latitude": 6.5244,
  "longitude": 3.3792,
  "rainfall_mm_24h": 85,
  "river_level_m": 3.2
}
```

Example response (abbreviated — full shape in `api-contract.md`):
```json
{
  "risk_level": "high",
  "risk_score": 0.82,
  "alert_message_en": "Flood risk is HIGH in Lagos. Move to higher ground and avoid riverbanks.",
  "alert_message_local": "...",
  "local_language": "English" (Nigeria has no dedicated local template — see the Note below)
}
```

**Suggested UX:** two sliders (rainfall 0–100mm, river level 0–4m — those
are the model's caps, see #3), a location dropdown/input, and a "Check
risk" button (or auto-submit on slider release with debounce). Show the
resulting risk-level chip + both alert messages updating live.

**Note:** any `location_name` works — the backend parses the country from
the string after the last comma (`"City, Country"`) to pick a language.
DRC maps to French and Mozambique maps to Portuguese (both corrected
2026-08-17 — each is that country's actual official language; Mozambique
in particular was a live bug, not just a documentation gap, since Maputo
is a sample city). Ethiopia maps to Amharic, though no sample city is
there yet — see `docs/progress-log.md`'s 2026-08-17 entry. If you type a
location whose country isn't explicitly mapped (see
`LOCAL_LANGUAGE_BY_COUNTRY` in `backend/app/models/translations.py` for
the full list), it'll fall back to English. That's expected, not a bug.

---

## 3. "Why this score" breakdown

**Why:** the team deliberately chose a rules-based model over an opaque
one specifically so it's explainable. Showing the actual math (not just
the output) turns "we didn't have time for real ML" into "we chose a model
a disaster-response official could actually audit" — a real strength if a
judge asks how the score works.

**Data:** both `POST /api/risk-check` and each object in `GET /api/regions`
now include a `risk_score_breakdown` field (new as of today — additive,
doesn't change anything you've already built against):

```json
"risk_score_breakdown": {
  "rainfall_mm_24h": 85,
  "river_level_m": 3.2,
  "normalized_rainfall": 0.85,
  "normalized_river_level": 0.8,
  "rainfall_cap_mm": 100.0,
  "river_level_cap_m": 4.0,
  "high_threshold": 0.7,
  "medium_threshold": 0.4,
  "risk_level": "high",
  "risk_score": 0.82
}
```

**Suggested UX:** two horizontal bars/meters — "Rainfall: 85mm / 100mm cap
(85%)" and "River level: 3.2m / 4m cap (80%)" — plus a one-line sentence:
*"Risk score = average of the two = 0.82 → HIGH (≥0.70)"*. This is the
"explain it in one sentence" moment for judges.

---

## 4. Phone-mockup "message sent" screens

**Why:** the pitch's whole promise is "here's exactly what a person without
a smartphone would receive." A JSON blob doesn't sell that; a fake phone
screen with a real SMS bubble does.

**Data:** `alert_message_en`/`alert_message_local` — now available
directly on **both** `POST /api/risk-check` and each object in
`GET /api/regions` (added 2026-08-10; previously only on `risk-check`,
which meant a per-region view needed an extra call). For `channel`
labels (`"SMS (simulated)"`, `"USSD (simulated)"`, `"WhatsApp (simulated)"`)
use `GET /api/alerts` — that's still the only source of channel type,
since it's a separate 5-entry simulated history, not one-per-region.

**Suggested UX:** a simple phone-frame `<div>` with a status bar and, based
on `channel`:
- **SMS** → a single gray message bubble with the text.
- **WhatsApp** → a green bubble with a timestamp/checkmarks, WhatsApp-style.
- **USSD** → a plain monochrome text screen (USSD has no rich UI — a
  numbered-menu look, e.g. `"1. View alert  2. Dismiss"` under the message,
  sells the "this works on a $10 feature phone" point hard).

**Arabic note:** when `local_language` is `"Arabic"`, the text is
right-to-left. Render that bubble with `dir="rtl"` (or the CSS
`direction: rtl`) — the backend returns plain text with no directionality
markers, so this needs to be handled here.

---

## 5. Population/impact framing

**Why:** "risk_level: high" is a label. "≈15,000,000 people live in this
area" is a stake. Turns an abstract risk score into something a judge
feels.

**Data:** `GET /api/regions` now includes `population_estimate` per
region (new field, e.g. `15000000` for Lagos).

**Important caveat — read before using this in the pitch:** these are
rough, publicly-known city/metro population figures, not a flood-exposure
model. We have not calculated how many people actually live in a
flood-prone zone within each city — that would need real GIS/elevation
data we don't have this week. **Do not phrase this as "X people at risk of
flooding."** Safe phrasing: *"Monitoring an area home to ~15M people"* or
*"Population of monitored region: ~15M."* If a judge asks "is that the
number of people who'll be flooded?", the honest answer is "no, that's the
city's general population — we're flagging that as a known simplification,
real flood-exposure modeling is on the roadmap." Better to preempt that in
the pitch than get caught by the question.

---

## 6. Low-bandwidth / text-only mode toggle

**Why:** the hackathon's own framing is "accessibility for people without
smartphones or reliable internet." A visible toggle that swaps the map/rich
UI for a plain-text list is a literal, demoable proof of that promise —
not just a claim in a slide.

**Data:** none new — same `GET /api/regions` data, just rendered as plain
text (`"Lagos, Nigeria — HIGH"`, one per line) instead of map markers/cards.

**Suggested UX:** a toggle switch labeled something like "Low-bandwidth
mode" that strips images/map/animations down to a plain list. Worth
narrating explicitly during the demo ("and for areas with poor
connectivity...") rather than leaving it undiscovered.

---

## Everything above is additive — nothing here changes `/api/alerts`,
which stays a simulated stub on purpose (see `api-contract.md`). If you
hit a case where the API doesn't give you what a feature needs, flag it —
don't guess at a shape and build against it, since that's exactly the kind
of drift this project has been trying to avoid from day one.
