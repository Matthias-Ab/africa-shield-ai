import json
from pathlib import Path

from fastapi import APIRouter

router = APIRouter()

# Repo-root/docs/mock-data.json is the single source of truth for stub
# responses, so the docs and the running API can never drift apart.
MOCK_DATA_FILE = Path(__file__).resolve().parents[3] / "docs" / "mock-data.json"


@router.get("/api/regions")
def get_regions() -> list[dict]:
    """STUBBED for today: returns the hardcoded region list from
    docs/mock-data.json as-is. Tomorrow this should compute risk_level
    live from app/data/regions.json via app/models/risk_model.py instead
    of returning a fixed list."""
    mock_data = json.loads(MOCK_DATA_FILE.read_text(encoding="utf-8"))
    return mock_data["regions"]
