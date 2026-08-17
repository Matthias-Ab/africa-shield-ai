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
