import math

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.routes import alerts, regions, risk, ussd

app = FastAPI(
    title="Africa Shield AI - Last-Mile Alert API",
    description=(
        "Flood risk scoring and early-warning alerts for the AI for All Hackathon "
        "demo. Risk scoring and translation are real (rules-based, not ML) — see "
        "docs/architecture.md. POST /api/alerts/send sends a real SMS via Africa's "
        "Talking when AT_USERNAME/AT_API_KEY are configured (see .env.example), "
        "and clearly labels the send as simulated otherwise. POST /api/ussd is a "
        "USSD webhook (check risk / subscribe / unsubscribe) for Africa's "
        "Talking's USSD sandbox."
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
app.include_router(ussd.router)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """FastAPI's default 422 handler echoes the rejected value back in
    each error's "input" field. If that value is a non-finite float
    (NaN/Infinity — rejected by the `allow_inf_nan=False` field
    constraints on request bodies), Starlette's JSONResponse enforces
    strict JSON and crashes with a 500 trying to render the *error*
    response itself. Stringify any non-finite float before it gets there
    so the client gets a clean 422 instead."""
    errors = exc.errors()
    for error in errors:
        value = error.get("input")
        if isinstance(value, float) and not math.isfinite(value):
            error["input"] = str(value)
    return JSONResponse(status_code=422, content={"detail": errors})


@app.get("/")
def root() -> dict:
    return {
        "service": "Africa Shield AI backend",
        "docs": "/docs",
        "endpoints": [
            "/api/risk-check",
            "/api/regions",
            "/api/alerts",
            "/api/alerts/send",
            "/api/ussd",
        ],
    }
