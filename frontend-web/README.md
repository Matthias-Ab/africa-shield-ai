# Africa Shield AI — Frontend Web Dashboard

This is a fresh, unmodified Vite + React starter. No dashboard components,
routing, or styling decisions have been made yet — that starts tomorrow and
is intentionally left open for whoever builds the dashboard.

## Setup

```bash
cd frontend-web
npm install
npm run dev
```

Runs at `http://localhost:5173` by default. What you see right now is just
the default Vite + React starter page.

## Where to start tomorrow

- [`../docs/api-contract.md`](../docs/api-contract.md) — exact request/response
  shapes for the three backend endpoints (`/api/risk-check`, `/api/regions`,
  `/api/alerts`).
- [`../docs/mock-data.json`](../docs/mock-data.json) — sample responses in
  those exact shapes, useful for building the dashboard UI before (or
  without) the real backend logic running.
- The backend is running at `http://localhost:8000` once started (see
  [`../backend/README.md`](../backend/README.md)); its endpoints are
  currently stubbed to return the same data as `mock-data.json`.
