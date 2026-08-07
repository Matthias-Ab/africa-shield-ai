import json
from pathlib import Path

from fastapi import APIRouter

router = APIRouter()

MOCK_DATA_FILE = Path(__file__).resolve().parents[3] / "docs" / "mock-data.json"


@router.get("/api/alerts")
def get_alerts() -> list[dict]:
    """STUBBED for today: returns the hardcoded alert history from
    docs/mock-data.json. No real SMS/USSD/WhatsApp provider is wired up —
    see docs/architecture.md for the future real-gateway plan."""
    mock_data = json.loads(MOCK_DATA_FILE.read_text(encoding="utf-8"))
    return mock_data["alerts"]
