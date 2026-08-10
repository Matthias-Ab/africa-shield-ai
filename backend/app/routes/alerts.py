import json
from pathlib import Path

from fastapi import APIRouter

router = APIRouter()

MOCK_DATA_FILE = Path(__file__).resolve().parents[3] / "docs" / "mock-data.json"


@router.get("/api/alerts")
def get_alerts() -> list[dict]:
    """Intentionally still a simulated alert-history stub: no real
    SMS/USSD/WhatsApp gateway is wired up this week (see
    docs/architecture.md future-improvements list). Returns the hardcoded
    list from docs/mock-data.json. This is a deliberate scope decision,
    not an oversight — flagged in docs/progress-log.md."""
    mock_data = json.loads(MOCK_DATA_FILE.read_text(encoding="utf-8"))
    return mock_data["alerts"]
