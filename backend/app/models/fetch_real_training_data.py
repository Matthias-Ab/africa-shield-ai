"""Assembles a REAL-data candidate dataset for the ML risk model, from
free/keyless public sources — investigated and confirmed accessible on
2026-08-17 (see docs/progress-log.md's entry of that date for the full
investigation, including which sources were tried and rejected: EM-DAT,
ICPAC East Africa Hazards Watch, and NASA EONET were all dead ends —
registration-gated, categorical-only, or effectively empty for Africa).

Two sources actually work, for free, with no registration:

1. Open-Meteo's Historical Weather API (ERA5/ERA5-Land reanalysis,
   ecmwf-backed, back to 1950) for daily rainfall — a real proxy for
   `rainfall_mm_24h`, though modeled/reanalysis data, not a rain-gauge
   reading. https://archive-api.open-meteo.com/v1/archive

2. Open-Meteo's Flood API (GloFAS reanalysis, back to 1984, ends
   July 2022) for daily river discharge in **m³/s** — NOT the same
   quantity as this project's `river_level_m` (meters). Used here as a
   flood-proxy signal, not a drop-in substitute; see `build_dataset()`'s
   docstring for how (and why) this script does NOT attempt to rescale
   discharge into a fake "meters" value.
   https://flood-api.open-meteo.com/v1/flood

3. GDACS's public event-search API for real historical flood events
   (free, no key, genuine depth back to at least 2010) — supplies
   `alertlevel` (Green/Orange/Red) as a real severity label for specific
   dates/places. https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH

**The honest limitation this script cannot get around:** GDACS records
an event only where a flood was significant enough to alert on, and only
for SOME of our 9 cities is there a GDACS event close enough (within
EVENT_RADIUS_KM) to plausibly attribute to that specific city rather than
"somewhere in the country." Every other day in the multi-decade rainfall/
discharge series has no confirmed real label — this script assumes those
are "low" risk, which is a reasonable but unverified default, not a
confirmed negative. Cairo, specifically, has zero GDACS flood events in
the entire lookback window (consistent with the Nile being dam-regulated)
— so this script will never produce a real "medium"/"high" label for
Cairo, at all.

This means the assembled dataset is small, label-scarce, and unevenly
covered across cities — see this script's own printed summary when run.
Concretely, run live on 2026-08-17: 7 of 9 cities matched ZERO nearby
GDACS events at all in the 2010–2022 window (the window forced by
GloFAS's data ending July 2022 — several of the *closest* real GDACS
events for our cities, e.g. Nairobi and Dar es Salaam, turned out to be
from 2023–2024, just past that cutoff). Only Maputo produced any
elevated-label days (7, from a single matched event) out of roughly
41,000 total city-days assembled — a positive rate under 0.02%, not a
usable class balance for a 3-class classifier.

**A second, more fundamental problem, found while inspecting a live GDACS
response, not just from the coverage numbers above:** many GDACS river
flood events carry `"source": "GLOFAS"` — meaning the "event happened"
label is itself partly auto-generated FROM a GloFAS discharge threshold
crossing. Since this script also uses GloFAS discharge as an input
FEATURE, using GDACS-GloFAS-sourced events as the LABEL risks a real
leakage/circularity problem: a model could "predict" the label by
partially re-deriving the same discharge series it's already being
handed as input, rather than learning anything new. This is a data
validity issue, separate from and worse than the coverage/imbalance
problem above.

**This is why `train_ml_model.py` was NOT changed to use this script's
output** — both problems are real, not hypothetical, and neither is
fixable by more engineering effort in the time available. See
docs/progress-log.md's 2026-08-17 entry for the full reasoning. This file
exists so the assembled real data can be inspected and cited (e.g. "real
GDACS-confirmed flood dates overlaid on real rainfall history"), not so
it can be silently swapped in as if it were a clean, sufficient
replacement for the synthetic training set.

Run it (needs real internet access — this was run successfully against
the live APIs from this session's environment on 2026-08-17; the retry/
backoff in `_get_with_retries` exists because the flood-api endpoint
occasionally reset the connection under repeated calls, not because the
API is unreliable in general):

    cd backend
    .venv/Scripts/python.exe -m app.models.fetch_real_training_data
"""

import csv
import json
import math
import time
from datetime import date
from pathlib import Path

import requests

REGIONS_FILE = Path(__file__).resolve().parent.parent / "data" / "regions.json"
OUTPUT_FILE = Path(__file__).resolve().parent.parent / "data" / "real_training_data.csv"

RAINFALL_URL = "https://archive-api.open-meteo.com/v1/archive"
DISCHARGE_URL = "https://flood-api.open-meteo.com/v1/flood"
GDACS_SEARCH_URL = "https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH"

# Both Open-Meteo series need to overlap for a paired (rainfall,
# discharge) row to exist. GloFAS (discharge) is the binding constraint —
# its reanalysis run stops in July 2022, well short of "today."
SERIES_START = date(2010, 1, 1)
SERIES_END = date(2022, 7, 31)

# How close a GDACS event's coordinates must be to a city to be
# attributed to it, rather than "somewhere else in the same country." A
# judgment call, not a scientific threshold — see module docstring on
# why several of our 9 cities end up with zero real positive labels even
# with a generous radius like this one.
EVENT_RADIUS_KM = 150
EVENT_WINDOW_DAYS = 3  # label days within this many days of a matched event

# GDACS's country filter wants a plain English name; most of our 9
# match `location_name`'s country directly, but "DRC" does not.
GDACS_COUNTRY_OVERRIDES = {"DRC": "Democratic Republic of the Congo"}

# GDACS alert levels, mapped onto this project's 3-class label. A
# judgment call, flagged as such: GDACS's own "Green" alerts are already
# significant enough to be logged as a global event, so treating Green as
# "medium" (not "low") reflects that, rather than assuming Green means
# harmless.
ALERT_LEVEL_TO_RISK = {"Green": "medium", "Orange": "high", "Red": "high"}


def _load_regions() -> list[dict]:
    return json.loads(REGIONS_FILE.read_text(encoding="utf-8"))


def _get_with_retries(url: str, params: dict, attempts: int = 3) -> requests.Response:
    """These free public APIs occasionally reset the connection under
    rapid repeated calls (observed against the real flood-api endpoint
    while building this script) — a short retry/backoff is enough to get
    through it reliably, not a sign the API itself is unreliable."""
    last_error = None
    for attempt in range(attempts):
        try:
            response = requests.get(url, params=params, timeout=60)
            response.raise_for_status()
            return response
        except requests.exceptions.RequestException as error:
            last_error = error
            time.sleep(2 * (attempt + 1))
    raise last_error


def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    d_p = math.radians(lat2 - lat1)
    d_l = math.radians(lon2 - lon1)
    a = math.sin(d_p / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(d_l / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def fetch_rainfall_series(latitude: float, longitude: float) -> dict[str, float]:
    """Returns {date_str: rainfall_mm} from Open-Meteo's ERA5-backed
    historical archive. Real daily values, no API key. Response shape
    (`{"daily": {"time": [...], "precipitation_sum": [...]}}`) verified
    against a live call, not assumed."""
    response = _get_with_retries(
        RAINFALL_URL,
        params={
            "latitude": latitude,
            "longitude": longitude,
            "start_date": SERIES_START.isoformat(),
            "end_date": SERIES_END.isoformat(),
            "daily": "precipitation_sum",
            "timezone": "UTC",
        },
    )
    daily = response.json()["daily"]
    return dict(zip(daily["time"], daily["precipitation_sum"]))


def fetch_discharge_series(latitude: float, longitude: float) -> dict[str, float]:
    """Returns {date_str: discharge_m3s} from Open-Meteo's GloFAS-backed
    flood API. This is river DISCHARGE in m³/s, not river LEVEL in
    meters — see module docstring. No API key. Same verified shape as
    the rainfall endpoint, under a "river_discharge" key instead."""
    response = _get_with_retries(
        DISCHARGE_URL,
        params={
            "latitude": latitude,
            "longitude": longitude,
            "start_date": SERIES_START.isoformat(),
            "end_date": SERIES_END.isoformat(),
            "daily": "river_discharge",
        },
    )
    daily = response.json()["daily"]
    return dict(zip(daily["time"], daily["river_discharge"]))


def fetch_flood_events(country: str) -> list[dict]:
    """Returns real historical flood events for a country from GDACS's
    public search API — free, no key. Verified against a live call to be
    a GeoJSON FeatureCollection; each feature's `properties` includes
    `fromdate`, `alertlevel`, and `source` (often "GLOFAS" for river
    floods — see module docstring on why that matters for this dataset's
    validity, not just its coverage)."""
    country = GDACS_COUNTRY_OVERRIDES.get(country, country)
    response = _get_with_retries(
        GDACS_SEARCH_URL,
        params={
            "eventtypes": "FL",
            "country": country,
            "fromDate": SERIES_START.isoformat(),
            "toDate": SERIES_END.isoformat(),
        },
    )
    if not response.text.strip():
        return []  # GDACS returns 204/empty body for a country with zero matching events
    payload = response.json()
    features = payload.get("features", payload if isinstance(payload, list) else [])

    events = []
    for feature in features:
        props = feature.get("properties", feature)
        geometry = feature.get("geometry") or {}
        coords = geometry.get("coordinates")
        if coords:
            lon, lat = coords[0], coords[1]
        else:
            lat, lon = props.get("latitude"), props.get("longitude")
        event_date = props.get("fromdate") or props.get("todate")
        alert_level = props.get("alertlevel")
        if lat is None or lon is None or event_date is None or alert_level is None:
            continue
        events.append(
            {"latitude": float(lat), "longitude": float(lon), "date": event_date[:10], "alert_level": alert_level}
        )
    return events


def build_dataset() -> list[dict]:
    """Assembles one row per (city, date) with real rainfall + real
    discharge, labeled "low" by default and overridden to "medium"/"high"
    for dates within EVENT_WINDOW_DAYS of a real GDACS event within
    EVENT_RADIUS_KM of that city. See module docstring for the honesty
    caveat this implies: "low" here means "no confirmed nearby GDACS
    event," not "confirmed safe.\""""
    regions = _load_regions()
    rows = []

    for region in regions:
        location_name = region["location_name"]
        country = location_name.split(",")[-1].strip()
        lat, lon = region["latitude"], region["longitude"]

        rainfall = fetch_rainfall_series(lat, lon)
        time.sleep(1)  # be a polite, not-rate-limited citizen of these free APIs
        discharge = fetch_discharge_series(lat, lon)
        time.sleep(1)
        events = [
            e for e in fetch_flood_events(country) if _haversine_km(lat, lon, e["latitude"], e["longitude"]) <= EVENT_RADIUS_KM
        ]
        time.sleep(1)

        elevated_dates: dict[str, str] = {}
        for event in events:
            event_date = date.fromisoformat(event["date"])
            risk = ALERT_LEVEL_TO_RISK.get(event["alert_level"], "medium")
            for offset in range(-EVENT_WINDOW_DAYS, EVENT_WINDOW_DAYS + 1):
                day = date.fromordinal(event_date.toordinal() + offset).isoformat()
                elevated_dates[day] = risk

        for day, rainfall_mm in rainfall.items():
            if day not in discharge:
                continue
            rows.append(
                {
                    "location_name": location_name,
                    "date": day,
                    "rainfall_mm_24h": rainfall_mm,
                    "river_discharge_m3s": discharge[day],
                    "risk_level": elevated_dates.get(day, "low"),
                    "label_source": "gdacs_event" if day in elevated_dates else "default_low_unconfirmed",
                }
            )

        n_elevated = sum(1 for r in rows if r["location_name"] == location_name and r["label_source"] == "gdacs_event")
        print(f"{location_name}: {len(events)} nearby GDACS events -> {n_elevated} elevated-label days")

    return rows


def main() -> None:
    rows = build_dataset()
    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)

    total = len(rows)
    elevated = sum(1 for r in rows if r["label_source"] == "gdacs_event")
    print(f"\nWrote {total} rows to {OUTPUT_FILE}")
    print(f"Real-event-confirmed elevated-risk rows: {elevated} ({elevated / total:.2%} of total)")
    print(
        "This class imbalance is real, not a bug — see this file's module "
        "docstring before using this data to retrain anything."
    )


if __name__ == "__main__":
    main()
