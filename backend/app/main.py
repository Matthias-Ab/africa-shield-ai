from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import alerts, regions, risk

app = FastAPI(
    title="Africa Shield AI - Last-Mile Alert API",
    description=(
        "Flood risk scoring and simulated early-warning alerts for the AI for All "
        "Hackathon demo. Risk scoring and translation are real (rules-based, not "
        "ML) — see docs/architecture.md. /api/alerts is still a simulated stub, "
        "by design (no real SMS/USSD gateway this week)."
    ),
    version="0.1.0",
)

# Wide-open CORS for local hackathon development. Tighten before any real deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(risk.router)
app.include_router(regions.router)
app.include_router(alerts.router)


@app.get("/")
def root() -> dict:
    return {
        "service": "Africa Shield AI backend",
        "docs": "/docs",
        "endpoints": ["/api/risk-check", "/api/regions", "/api/alerts"],
    }
