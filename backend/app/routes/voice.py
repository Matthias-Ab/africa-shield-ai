from xml.sax.saxutils import escape

from fastapi import APIRouter, Form
from fastapi.responses import Response

from app.models.voice_gateway import take_pending_message

router = APIRouter()

FALLBACK_MESSAGE = "This is Africa Shield AI. No specific alert was found for this call."


@router.post("/api/voice/callback")
def voice_callback(
    sessionId: str = Form(...),
    isActive: str = Form(...),
    destinationNumber: str = Form(""),
    callerNumber: str = Form(""),
) -> Response:
    """Africa's Talking Voice webhook — point a Voice sandbox number's
    callback URL at this endpoint. Fires once when a call connects
    (`isActive="1"`) and again when it ends (`isActive="0"`); `sessionId`/
    `callerNumber` aren't needed for this one-way announcement flow.
    Response must be Africa's Talking's XML "Voice Actions" format, not
    JSON — hence a raw `Response`, not a FastAPI model.

    `destinationNumber` is the number that was called, used to look up
    the message `voice_gateway.place_call()` queued right before this
    call was placed. Falls back to a generic line if nothing's queued
    (e.g. a retried callback, or a call this project didn't initiate)
    rather than reading nothing."""
    message = take_pending_message(destinationNumber) or FALLBACK_MESSAGE
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>'
        "<Response>"
        f'<Say voice="woman" playBeep="false">{escape(message)}</Say>'
        "</Response>"
    )
    return Response(content=xml, media_type="application/xml")
