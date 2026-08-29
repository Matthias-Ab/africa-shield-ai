# Wokwi Flood Sensor Simulation

A Wokwi (wokwi.com) simulation of an ESP32-WROOM-32 with two analog
sensors — a rain sensor (YL-83/FC-37 style) and a water level sensor —
standing in for the two inputs the backend's risk model already uses
(`rainfall_mm_24h`, `river_level_m`). No real hardware exists yet; this
is simulation-only, using potentiometers in place of the real sensors'
analog voltage output.

## Files

- `sketch.ino` — the ESP32 firmware: reads both simulated sensors, syncs
  real time over NTP, and POSTs a reading to the backend every 15 seconds.
- `diagram.json` — the Wokwi wiring: ESP32 + 2 potentiometers on GPIO34
  (rain) and GPIO35 (water level), plus the ESP32's `TX0`/`RX0` wired to
  the special `$serialMonitor` part. That wiring (found 2026-08-24) is
  required — without it, the Serial Monitor panel never captures any
  output no matter what `"serialMonitor": {"display": "always"}` is set
  to in this same file; the display setting only controls the panel's
  visibility, not whether anything is actually routed to it.

## Running the simulation

1. Go to [wokwi.com](https://wokwi.com/) → New Project → ESP32.
2. Replace the default `sketch.ino` and `diagram.json` with the ones in
   this folder.
3. Edit `SERVER_URL` in `sketch.ino` (see "Connecting to the real
   backend" below) before running.
4. Click the green Run button. The Serial Monitor will show WiFi/NTP
   connecting, then a reading being sent every 15 seconds.

## Connecting to the real backend

**Wokwi's simulated ESP32 cannot reach `http://localhost:8000`** —
inside the simulator, "localhost" means the simulator itself, not your
computer. To let the simulated device reach your locally running
backend, you need a tunnel that exposes it on a public URL:

1. Start the backend as usual: `cd backend && uvicorn app.main:app --reload`
   (runs on `http://localhost:8000`).
2. In a separate terminal, run a tunnel — **use `cloudflared`, not
   `ngrok`** (see the note below for why): `cloudflared tunnel --url
   http://localhost:8000`. No account or login needed for this "quick
   tunnel" mode. It prints a public URL like
   `https://some-random-words.trycloudflare.com`.
3. Use that `https://` address (with `/api/sensor-reading` appended) in
   `SERVER_URL` in `sketch.ino`:
   ```cpp
   const char *SERVER_URL = "https://some-random-words.trycloudflare.com/api/sensor-reading";
   ```
4. Re-run the Wokwi simulation. The Serial Monitor should show each
   reading and the backend's JSON response (risk level, score, alert
   text) coming back.

If your backend isn't running or the tunnel URL is wrong/expired, the
Serial Monitor will show `POST failed: ...` instead of a response —
that's the sketch telling you the connection didn't work, not a crash.
A `cloudflared` quick tunnel's URL is random and temporary — a new one
is generated every time you restart it, and Cloudflare gives it no
uptime guarantee. That's fine for testing; don't rely on the same URL
staying alive long-term.

**Resolved 2026-08-29 — use `cloudflared`, not `ngrok`.** The free
`ngrok` agent force-redirects plain `http://` to `https://` on its own,
and this sketch's `HTTPClient` doesn't follow redirects, so it used to
log `Backend responded (307):` with an empty body. `cloudflared`'s quick
tunnels serve `https://` directly with **no redirect** — verified
2026-08-29 with `curl` against a live tunnel: clean `200 OK` on both
`GET /` and `POST /api/sensor-reading`, no `Location` header, right
away. `sketch.ino` now uses `WiFiClientSecure` (with `setInsecure()` —
fine for a throwaway tunnel URL, not for a real deployment with a stable
domain) instead of a plain `HTTPClient`, since the endpoint is always
`https://` now.

**Still open: whether Wokwi's simulated network actually completes this
TLS handshake hasn't been re-verified against `cloudflared`'s edge**
specifically — a prior attempt against `ngrok`'s `https://` endpoint got
`POST failed: connection refused` during the TLS handshake itself, and
it was never confirmed whether that was a Wokwi limitation or an
`ngrok`-specific interop issue. Whoever runs this next: open
[wokwi.com](https://wokwi.com/), paste in this folder's `sketch.ino` +
`diagram.json`, and click Run — if the Serial Monitor shows a real `200`
response, this whole path is finally confirmed end-to-end; if it still
shows a TLS/connection failure, that narrows it down to a genuine Wokwi
limitation rather than an `ngrok` quirk.

## The device registry

The backend resolves `device_id` → region via
`backend/app/data/devices.json`. This sketch is pre-configured with
`device_id = "esp32-demo-01"`, which is seeded there mapped to
"Lagos, Nigeria". To simulate a second device, add another entry to that
file with a new `device_id` + region, and change `DEVICE_ID` in the
sketch to match. An unregistered `device_id` gets a `404`, not a guess.

## What this does and doesn't prove

- **Proves:** the full path from a device reading → backend scoring
  (rules-based + ML) → the exact same response shape `/api/risk-check`
  returns, works end-to-end.
- **Doesn't prove:** anything about real sensor behavior, calibration, or
  power/connectivity in the field — this is a simulation with
  potentiometers standing in for real analog sensor output. Real
  hardware validation is separate, future work.

## Recommended real sensors (not yet purchased)

No physical sensors have been bought yet — this is a recommendation for
whoever orders parts, not a decision that's already been made.

- **Water level → JSN-SR04T waterproof ultrasonic sensor (~$4–7).**
  Mounts above the water pointing down and measures distance to the
  surface, so the electronics never touch the water. Gives a continuous
  reading that converts directly to `river_level_m` — unlike a float
  switch, which only gives an on/off threshold. Wires into the ESP32 the
  same way the plain HC-SR04 does (trigger/echo pins, e.g. the `NewPing`
  library), but is actually rated for outdoor/wet use, which the bare
  HC-SR04 is not.
- **Rainfall → tipping-bucket rain gauge with reed switch (~$15–25).**
  Each tip is a fixed, known amount of rain (e.g. 0.2mm), so counting
  tips over 24h gives a real calibrated `rainfall_mm_24h` — not just a
  relative wetness signal. The reed switch wires into an ESP32 interrupt
  pin directly.
- **Budget fallback for rainfall:** the YL-83/FC-37 resistive rain
  sensor this simulation is modeled on (~$1–2) is cheaper but only
  outputs a rough wetness/intensity voltage, not a calibrated mm
  measurement. Fine as a stopgap, but say so plainly in the pitch if
  it's what actually ships — don't present it as equivalent to a
  tipping-bucket reading.

Rough total for one full sensor node: **$20–35** (ESP32 board +
JSN-SR04T + tipping-bucket gauge) — cheap enough to deploy several for
a real pilot.
