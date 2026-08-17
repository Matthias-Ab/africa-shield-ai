"""Africa's Talking Voice wrapper — reads flood alerts aloud over a phone
call, for people a text-only channel doesn't reach (can't read, don't
read the local language script, or are visually impaired). Addresses the
hackathon scorecard's "Social Impact & Inclusion" criterion directly.

Outbound calls are two-step in Africa's Talking's model: `place_call()`
starts the call, then Africa's Talking POSTs to a callback URL (see
`app/routes/voice.py`) once the recipient answers, expecting XML telling
it what to say. That callback carries no memory of *why* the call was
placed, so `_pending_messages` bridges the gap: the message to read,
keyed by the number being called, written here right before the call and
read (and cleared) by the callback.
"""
import africastalking

from app.config import AT_API_KEY, AT_USERNAME, AT_VOICE_NUMBER

_initialized = False
_pending_messages: dict[str, str] = {}


def is_configured() -> bool:
    return bool(AT_USERNAME and AT_API_KEY and AT_VOICE_NUMBER)


def _ensure_initialized() -> None:
    global _initialized
    if _initialized:
        return
    africastalking.initialize(AT_USERNAME, AT_API_KEY)
    _initialized = True


def place_call(phone_numbers: list[str], message: str) -> dict:
    """Places a real voice call to each number. Raises if not configured —
    callers must check `is_configured()` first."""
    if not is_configured():
        raise RuntimeError("AT_USERNAME/AT_API_KEY/AT_VOICE_NUMBER are not configured")
    _ensure_initialized()
    for phone_number in phone_numbers:
        _pending_messages[phone_number] = message
    return africastalking.Voice.call(AT_VOICE_NUMBER, phone_numbers)


def take_pending_message(phone_number: str) -> str | None:
    """Pops and returns the message queued for this number by
    `place_call()`, or None if nothing's queued (e.g. an unrelated call to
    the same voice number). Used exactly once, by the voice callback."""
    return _pending_messages.pop(phone_number, None)
