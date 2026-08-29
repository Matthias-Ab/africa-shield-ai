"""Africa's Talking SMS wrapper.

Wraps the `africastalking` SDK's global initialize-then-call pattern
behind two simple functions so the rest of the app only ever calls
`is_configured()` / `send_sms()`, and never touches the SDK directly.

When `AT_USERNAME`/`AT_API_KEY` aren't set (e.g. a fresh clone with no
sandbox credentials yet), `is_configured()` returns False and callers
(see `app/routes/alerts.py`) fall back to a clearly labeled simulation
instead of calling this module at all — this file never sends fake data
itself.
"""
import africastalking

from app.config import AT_API_KEY, AT_SENDER_ID, AT_USERNAME

_initialized = False


def is_configured() -> bool:
    return bool(AT_USERNAME and AT_API_KEY)


def _ensure_initialized() -> None:
    global _initialized
    if _initialized:
        return
    africastalking.initialize(AT_USERNAME, AT_API_KEY)
    _initialized = True


def send_sms(phone_numbers: list[str], message: str) -> dict:
    """Sends a real SMS via Africa's Talking. Raises if not configured —
    callers must check `is_configured()` first (this function does not
    fall back to simulating anything)."""
    if not is_configured():
        raise RuntimeError("AT_USERNAME/AT_API_KEY are not configured")
    _ensure_initialized()
    return africastalking.SMS.send(message, phone_numbers, sender_id=AT_SENDER_ID or None)
