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
  location, GPS, photo) — sent for real, see below.

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
| Hazard reporting ("Reports" tab) | **Real** — `POST /api/hazard-reports`. Category/description/location/GPS are sent for real and persisted server-side; a failed send shows a real error, not a fake success |
| Hazard report photo attachment | **Real** — `image_picker` (camera or gallery) + `POST /api/hazard-reports/{id}/photo`. If the report sends but the photo upload fails, the dialog says so honestly rather than claiming full success |
| "Use my current location" (GPS) | **Real** — `geolocator`, in both onboarding's Location Setup and the Reports tab. No reverse geocoding: onboarding shows the raw coordinates and still requires manual State/LGA/City entry; Reports attaches the raw coordinates to the report |
| Emergency call button | **Deliberately inert** — no verified per-country emergency number exists in the data model; dialing a guessed number would be actively misleading, so it explains that instead of guessing |
| Country/State/LGA/City dropdowns | Country is a real 54-country list. State/LGA/City are **plain text fields**, not dropdowns — there's no real administrative-boundary dataset to populate them from yet |
| Yoruba / Hausa (2 of the 9 languages) | Selectable, tagged "alerts not translated yet" — the backend's `translations.py` only covers 7 of the 9 languages Figma lists. The app's own UI chrome (buttons/labels) also has no translation for these two, and falls back to English |
| UI chrome translation (buttons, labels, headings) | **Real for the 7 backend-supported languages** — `lib/l10n/*.arb` + generated `AppLocalizations`, switched live from the Settings > Language choice. **AI-drafted, unreviewed by a native speaker** — same caveat as the backend's own French/Portuguese/Amharic alert text (see `backend/README.md`), except here it applies to all 6 non-English languages, since this is a different set of strings than the alert wording and has never been reviewed even for Swahili/Arabic/Somali. Runtime error messages (`ApiException`, `LocationException`) are a separate, deliberately out-of-scope gap — still English-only |

## Structure

```
lib/
  main.dart, app.dart
  config/env.dart                      — API base URL, override via --dart-define
  theme/app_theme.dart                  — colors/type matching the Figma file
  data/countries.dart, languages.dart    — static reference lists
  models/region.dart, alert.dart, hazard_report.dart
  services/api_service.dart, cache_service.dart, location_service.dart
  l10n/app_en.arb, app_sw.arb, app_ar.arb, app_so.arb, app_fr.arb,
       app_pt.arb, app_am.arb  — UI chrome translations (see l10n.yaml)
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

- Real geo dataset for State/LGA/City (currently free text) — GPS gives raw
  coordinates, not an address, so this still needs manual entry.
- A verified per-country emergency-line number source, before enabling the
  "Call Emergency Line" button for real.
- **Native-speaker review of the 6 non-English UI-chrome translations**
  (`lib/l10n/*.arb`) — all are unreviewed AI drafts right now, including
  Swahili/Arabic/Somali even though those languages' *alert* wording was
  already reviewed (that review never covered this separate set of
  strings).
- Localize `ApiException`/`LocationException` runtime error messages —
  currently English-only regardless of the selected language, since
  they're thrown from service classes with no `BuildContext`.
