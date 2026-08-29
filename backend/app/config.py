"""Centralized environment configuration.

Loads `.env` (see `.env.example` for the expected keys) via python-dotenv
if one exists, so local dev doesn't require exporting shell vars. Real
environment variables (e.g. set by CI or a hosting platform) always take
precedence over anything in `.env`.
"""
import os

from dotenv import load_dotenv

load_dotenv()

AT_USERNAME = os.environ.get("AT_USERNAME")
AT_API_KEY = os.environ.get("AT_API_KEY")
AT_SENDER_ID = os.environ.get("AT_SENDER_ID")  # optional — sandbox uses a default if unset
AT_VOICE_NUMBER = os.environ.get("AT_VOICE_NUMBER")  # required only for voice calls, not SMS/USSD

# Path to a Firebase service-account JSON file (Project Settings > Service
# Accounts > Generate new private key, in the Firebase console). Optional —
# push notifications simulate/skip cleanly without it, same pattern as the
# Africa's Talking vars above. See app/models/push_gateway.py.
FIREBASE_SERVICE_ACCOUNT_JSON = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON")
