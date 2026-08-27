# AfriShield Mobile

Citizen-facing companion app to the SMS/USSD/voice alerts — see
`../docs/progress-log.md`'s 2026-08-27 entries for why it's scoped this way
and not as an admin tool. UI now implements the team's Figma design
("AfriShield AI App"); everything is wired to the real backend, nothing is
mocked.

## Screens (matching Figma)

**Onboarding:** Splash → Welcome → Language (9 languages) → Country (all 54)
→ Location Setup (Country/State/LGA/City) → main app.

**Main app**, 4-tab bottom nav:
- **Home** — the citizen's chosen region's current risk, stats, mini map,
  quick links to Safety Guidance and the full alert.
- **Alert** — every monitored region as a colored card, filterable by
  risk (All/High/Medium/Low), tap through to full detail.
- **Maps** — real OpenStreetMap (`flutter_map`) with every region pinned,
  color-coded, tap a pin for its stats + "View Alert".
- **Reports** — community hazard reporting form (category, description,
  location, photo). **No backend endpoint exists for this yet** — see below.

Reached from Home's app bar (not a bottom tab, matching Figma): **Settings**
— Location, Alert Preference, Language, Alert Channels, Accessibility,
About.

## What's real vs. not, by feature

| Feature | Status |
|---|---|
| Region risk, alert text, map pins | **Real** — `GET /api/regions` |
| Alert filtering by risk level | **Real** — computed from the same data |
| SMS alert channel toggle | **Real channel** (backend sends via Africa's Talking); the toggle itself is just a local preference, doesn't yet call a backend "opt in" endpoint |
| WhatsApp / USSD / in-app push channels | **Not built.** Switches are disabled with an inline note explaining why — see `screens/settings/alert_channels_screen.dart` |
| Voice alerts (text-to-speech "Read Aloud") | **Real** — `flutter_tts`, on-device, no backend involved |
| Text size / high contrast | **Real** — applied app-wide via `AccessibilityProvider` + `MediaQuery` override in `app.dart` |
| Offline cache | **Real** — last-known regions/alerts persist via `SharedPreferences`, shown with an honest "showing saved data" banner |
| Hazard reporting ("Reports" tab) | **UI only.** Submitting shows a local confirmation dialog saying it isn't sent anywhere — see `HazardReport`'s doc comment. Community reporting has no backend endpoint (`todo.md` roadmap item) |
| "Use my current location" (GPS) | **UI only** — shows a "coming in a later build" message, no `geolocator` wired in yet |
| Emergency call button | **Deliberately inert** — no verified per-country emergency number exists in the data model; dialing a guessed number would be actively misleading, so it explains that instead of guessing |
| Country/State/LGA/City dropdowns | Country is a real 54-country list. State/LGA/City are **plain text fields**, not dropdowns — there's no real administrative-boundary dataset to populate them from yet |
| Yoruba / Hausa (2 of the 9 languages) | Selectable, tagged "alerts not translated yet" — the backend's `translations.py` only covers 7 of the 9 languages Figma lists |

## Structure

```
lib/
  main.dart, app.dart
  config/env.dart                      — API base URL, override via --dart-define
  theme/app_theme.dart                  — colors/type matching the Figma file
  data/countries.dart, languages.dart    — static reference lists
  models/region.dart, alert.dart, hazard_report.dart
  services/api_service.dart, cache_service.dart
  providers/
    region_provider.dart                 — live regions/alerts + cache fallback
    settings_provider.dart                — which backend region is "mine"
    onboarding_provider.dart               — language/country/location + completion flag
    accessibility_provider.dart             — text scale, voice alerts, high contrast
  screens/
    onboarding/  — splash, welcome, language, country, location_setup
    settings/    — alert_channels, accessibility, about
    home_screen.dart, alerts_screen.dart, alert_detail_screen.dart,
    risk_map_screen.dart, reports_screen.dart, safety_guidance_screen.dart,
    settings_screen.dart, root_shell.dart (4-tab pill nav)
  widgets/
    afrishield_logo.dart, alert_card.dart, risk_badge.dart,
    region_card.dart, offline_banner.dart
```

## Running it

```
cd mobile-app
flutter pub get
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8000   # Android emulator -> host machine
```

Backend must be running (`cd ../backend && uvicorn app.main:app --reload`)
for real data; with nothing reachable and nothing cached yet, screens show
a real error state, not fake data.

`flutter analyze` and `flutter test` both pass clean.

## Known gaps worth tackling next

- Real geo dataset for State/LGA/City (currently free text).
- `geolocator` for "Use my current location".
- A backend endpoint for hazard reports, then wire `ReportsScreen` to it
  for real instead of a local-only confirmation.
- A verified per-country emergency-line number source, before enabling the
  "Call Emergency Line" button for real.
- Translated UI chrome for all 7 (or 9) languages — locales are declared
  in `app.dart` (enables e.g. Arabic RTL) but the screens' own strings are
  English-only so far.
