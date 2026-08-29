"""Firebase Cloud Messaging (FCM) push notification wrapper.

Mirrors `app/models/sms_gateway.py`'s pattern exactly: `is_configured()` /
`send_push()`, with initialization deferred and guarded so a clone with
no Firebase project configured yet (the default state) never crashes —
it just reports itself unconfigured and lets the caller
(`app/routes/alerts.py`) fall back to a clearly labeled skip, the same
way an unconfigured `sms_gateway` does.

Setup (not done by default — this file just makes it possible once a
Firebase project exists):
1. Create a free Firebase project at https://console.firebase.google.com/.
2. Project Settings > Service Accounts > Generate new private key — saves
   a JSON file. Put it somewhere on this machine (never commit it) and
   set `FIREBASE_SERVICE_ACCOUNT_JSON` in `backend/.env` to its path.
3. The mobile app also needs its own Firebase config to obtain a device
   token in the first place — see
   `mobile-app/lib/firebase_options.dart`'s doc comment.
"""
from pathlib import Path

import firebase_admin
from firebase_admin import credentials, messaging

from app.config import FIREBASE_SERVICE_ACCOUNT_JSON

_app: firebase_admin.App | None = None


def is_configured() -> bool:
    return bool(FIREBASE_SERVICE_ACCOUNT_JSON) and Path(FIREBASE_SERVICE_ACCOUNT_JSON).exists()


def _ensure_initialized() -> firebase_admin.App:
    global _app
    if _app is not None:
        return _app
    cred = credentials.Certificate(FIREBASE_SERVICE_ACCOUNT_JSON)
    _app = firebase_admin.initialize_app(cred)
    return _app


def send_push(tokens: list[str], title: str, body: str) -> dict:
    """Sends a real push notification via FCM to every device token given.
    Raises if not configured — callers must check `is_configured()`
    first, same contract as `send_sms()`/`place_call()`; this function
    never falls back to simulating anything itself.

    Returns `{"success_count": int, "failure_count": int}` rather than
    FCM's raw `BatchResponse` — that object isn't JSON-serializable, and
    callers here (see `app/routes/alerts.py`) only need the counts for
    the alert log."""
    if not is_configured():
        raise RuntimeError("FIREBASE_SERVICE_ACCOUNT_JSON is not configured")
    _ensure_initialized()
    message = messaging.MulticastMessage(
        notification=messaging.Notification(title=title, body=body),
        tokens=tokens,
    )
    response = messaging.send_each_for_multicast(message)
    return {"success_count": response.success_count, "failure_count": response.failure_count}
