"""Assembles a REAL-data candidate training set for the ML risk model,
using the Dartmouth Flood Observatory (DFO) as the label source instead
of GDACS — investigated and built 2026-08-29 specifically because it
fixes both problems that killed the GDACS attempt in
`fetch_real_training_data.py` (see that file's module docstring and
`docs/progress-log.md`'s 2026-08-17 entry for the full history of why
GDACS didn't work):

1. **Coverage**: GDACS matched a nearby event for only 2 of our 9 cities
   at the time (Maputo, barely). DFO's master list — the "Global Active
   Archive of Large Flood Events," a long-running, independent flood
   catalog (floodobservatory.colorado.edu, republished via HDX at
   data.humdata.org/dataset/global-active-archive-of-large-flood-events-dfo,
   free, no login) — has real, dated, named events for **all 10** of our
   sample cities. See `app/data/dfo_flood_events.json` for the 49 events
   this produced, extracted 2026-08-29 by text-matching each event's
   `Detailed_L` (location) field against our city names (with the one
   false positive — "Cairo, Illinois, USA" — filtered out by requiring
   "Egypt" in the country field for the Cairo match).

2. **Leakage**: DFO's events are compiled from "news, governmental,
   instrumental, and remote sensing sources" — independent of GloFAS.
   GDACS's river-flood events, by contrast, are often themselves derived
   from a GloFAS discharge threshold crossing, which this project also
   uses as a training FEATURE — a real circularity risk GDACS couldn't
   avoid. DFO's event dates don't have that problem.

**The honest limitation this script still can't get around:** DFO's
archive stops in 2010 (the last matched event across all 10 cities is
2010-08-15, despite the file being republished in 2019) — this dataset
cannot be extended into recent years without a second, newer label
source layered on top. It's also still small: 49 real events total
across 10 cities, some cities (Cairo: 1, Addis Ababa: 2) with very few.
This is real, unleaked, and covers every city — genuinely better than
the GDACS attempt — but "better" does not mean "large." Treat the
printed per-city counts from this script the same way the GDACS script's
0.02% figure was treated: state it plainly, don't round it up.

Severity mapping (a judgment call, flagged as such, same as the GDACS
script's alert-level mapping): DFO's own `Severity` field (0/1/1.5/2,
roughly "notable" / "large" / "very large" / "extreme" flood) is mapped
to `{0.0: "medium", 1.0: "medium", 1.5: "high", 2.0: "high"}`. Every
event in this archive was significant enough to be catalogued in a
*global* database of large floods in the first place, so even DFO's
lowest severity tier is treated as at least "medium," not "low."

Run it (needs real internet access; `app/data/dfo_flood_events.json` is
already committed and static, so this only needs to reach Open-Meteo,
unlike the GDACS script which also calls a live event-search API):

    cd backend
    .venv/Scripts/python.exe -m app.models.fetch_real_training_data_dfo
"""

import csv
import json
import time
from datetime import date, timedelta
from pathlib import Path

from app.models.fetch_real_training_data import fetch_discharge_series, fetch_rainfall_series

REGIONS_FILE = Path(__file__).resolve().parent.parent / "data" / "regions.json"
DFO_EVENTS_FILE = Path(__file__).resolve().parent.parent / "data" / "dfo_flood_events.json"
OUTPUT_FILE = Path(__file__).resolve().parent.parent / "data" / "real_training_data_dfo.csv"

# DFO's archive runs 1985-01-01 through 2010-08-15 for our matched
# events (see module docstring). Open-Meteo's rainfall archive (ERA5,
# back to 1950) and GloFAS discharge series (1984 onward) both cover
# this range comfortably.
SERIES_START = date(1985, 1, 1)
SERIES_END = date(2010, 12, 31)

SEVERITY_TO_RISK = {0.0: "medium", 1.0: "medium", 1.5: "high", 2.0: "high"}


def _load_regions() -> dict[str, dict]:
    regions = json.loads(REGIONS_FILE.read_text(encoding="utf-8"))
    return {r["location_name"]: r for r in regions}


def _load_dfo_events() -> dict[str, list[dict]]:
    events = json.loads(DFO_EVENTS_FILE.read_text(encoding="utf-8"))
    by_location: dict[str, list[dict]] = {}
    for event in events:
        by_location.setdefault(event["location_name"], []).append(event)
    return by_location


def build_dataset() -> list[dict]:
    """One row per (city, date) in SERIES_START..SERIES_END with real
    rainfall + real discharge, labeled "low" by default and overridden
    for any date falling inside a real DFO event's [began, ended] span
    for that city. See module docstring for the "low" caveat — it means
    "no confirmed DFO event," not "confirmed safe," same as the GDACS
    script's identical caveat."""
    regions_by_location = _load_regions()
    events_by_location = _load_dfo_events()
    rows: list[dict] = []

    for location_name, region in regions_by_location.items():
        lat, lon = region["latitude"], region["longitude"]

        rainfall = fetch_rainfall_series(lat, lon, start=SERIES_START, end=SERIES_END)
        time.sleep(5)  # be a polite, not-rate-limited citizen of these free APIs
        discharge = fetch_discharge_series(lat, lon, start=SERIES_START, end=SERIES_END)
        time.sleep(5)

        elevated_dates: dict[str, str] = {}
        for event in events_by_location.get(location_name, []):
            began = date.fromisoformat(event["began"])
            ended = date.fromisoformat(event["ended"])
            risk = SEVERITY_TO_RISK.get(event["severity"], "medium")
            day = began
            while day <= ended:
                elevated_dates[day.isoformat()] = risk
                day += timedelta(days=1)

        n_elevated_in_range = 0
        for day, rainfall_mm in rainfall.items():
            if day not in discharge:
                continue
            risk_level = elevated_dates.get(day, "low")
            if day in elevated_dates:
                n_elevated_in_range += 1
            rows.append(
                {
                    "location_name": location_name,
                    "date": day,
                    "rainfall_mm_24h": rainfall_mm,
                    "river_discharge_m3s": discharge[day],
                    "risk_level": risk_level,
                    "label_source": "dfo_event" if day in elevated_dates else "default_low_unconfirmed",
                }
            )

        print(
            f"{location_name}: {len(events_by_location.get(location_name, []))} DFO events -> "
            f"{n_elevated_in_range} elevated-label days in range"
        )

    return rows


def main() -> None:
    rows = build_dataset()
    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)

    total = len(rows)
    elevated = sum(1 for r in rows if r["label_source"] == "dfo_event")
    print(f"\nWrote {total} rows to {OUTPUT_FILE}")
    print(f"Real-DFO-event-confirmed elevated-risk rows: {elevated} ({elevated / total:.2%} of total)")
    print(
        "Compare against fetch_real_training_data.py's GDACS attempt "
        "(0.03% elevated, 7 of 9 cities with zero) — this is a real "
        "improvement, not a large dataset. See this file's module "
        "docstring before using it to retrain anything."
    )


if __name__ == "__main__":
    main()
