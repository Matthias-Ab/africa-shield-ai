"""Alert translations for the hackathon demo.

# TODO: integrate a real translation API (e.g. Google Translate, or an
# Africa-focused NLP/MT model) eventually. For now this is a hardcoded
# lookup across the team's four agreed languages: English, Swahili,
# Arabic, Somali.
#
# FLAG FOR THE TEAM: the Swahili and Arabic strings in ALERT_TEMPLATES
# below are still unreviewed AI-written drafts and MUST be replaced with
# reviewed wording before the August 12 presentation. Somali has no
# wording yet at all — see the "TODO: awaiting reviewed Somali
# translation" placeholders below; do not ship those as-is.
#
# ARABIC IS RIGHT-TO-LEFT. This module returns Arabic alert text as a
# plain string in `alert_message_local` — it does not add any RTL
# markers/wrapping. The frontend team needs to handle right-to-left
# display themselves (e.g. `dir="rtl"` / CSS) when `local_language` is
# `"Arabic"`; don't assume that's already handled anywhere in this repo.
"""

# Which local language to use per country, keyed by lowercase country
# name (parsed from the end of "City, Country" in location_name). Only
# the four agreed languages appear as values: English, Swahili, Arabic,
# Somali. Countries not listed fall back to DEFAULT_LOCAL_LANGUAGE.
#
# Yoruba has been removed — it was an earlier draft language choice
# before the team locked English/Swahili/Arabic/Somali as the final set.
#
# Nigeria, Ghana, Mozambique, and DRC don't cleanly map to Swahili,
# Arabic, or Somali, so they're mapped to English explicitly rather than
# guessing at a language outside the agreed four. "somalia" is included
# even though it's not one of the 8 sample cities in app/data/regions.json,
# since Somali is one of the four agreed languages and this is the
# obvious country for it.
LOCAL_LANGUAGE_BY_COUNTRY = {
    "kenya": "Swahili",
    "tanzania": "Swahili",
    "uganda": "Swahili",
    "egypt": "Arabic",
    "somalia": "Somali",
    "nigeria": "English",
    "ghana": "English",
    "mozambique": "English",
    "drc": "English",
}

# Changed from "Swahili" to "English": any country not explicitly listed
# above now falls back to English rather than guessing at a specific
# local language for it.
DEFAULT_LOCAL_LANGUAGE = "English"

_EN_TEMPLATES = {
    "high": "Flood risk is HIGH in {location}. Move to higher ground and avoid riverbanks.",
    "medium": "Flood risk is MEDIUM in {location}. Stay alert and monitor local updates.",
    "low": "Flood risk is LOW in {location}. No action needed at this time.",
}

ALERT_TEMPLATES = {
    # "en" is always used to build alert_message_en. "English" is an
    # alias for the same content, used when local_language == "English"
    # (i.e. a country with no dedicated local-language template) so
    # alert_message_local resolves without a KeyError.
    "en": _EN_TEMPLATES,
    "English": _EN_TEMPLATES,
    # DRAFT — unreviewed AI-written Swahili, see module docstring. Replace
    # before Aug 12.
    "Swahili": {
        "high": "Hatari ya mafuriko ni KUBWA katika {location}. Hamia mahali salama na epuka kingo za mto.",
        "medium": "Hatari ya mafuriko ni WASTANI katika {location}. Kuwa macho na fuatilia taarifa za eneo lako.",
        "low": "Hatari ya mafuriko ni NDOGO katika {location}. Hakuna hatua inayohitajika kwa sasa.",
    },
    # DRAFT — unreviewed AI-written Arabic, see module docstring. Replace
    # before Aug 12. Right-to-left text — see RTL note in module docstring.
    "Arabic": {
        "high": "خطر الفيضانات مرتفع في {location}. انتقل إلى مكان مرتفع وتجنب ضفاف النهر.",
        "medium": "خطر الفيضانات متوسط في {location}. توخَّ الحذر وتابع التحديثات المحلية.",
        "low": "خطر الفيضانات منخفض في {location}. لا حاجة لاتخاذ إجراء في الوقت الحالي.",
    },
    # PLACEHOLDER ONLY — no Somali wording has been written yet. Do not
    # ship these TODO strings; replace with reviewed Somali translations.
    "Somali": {
        "high": "TODO: awaiting reviewed Somali translation",
        "medium": "TODO: awaiting reviewed Somali translation",
        "low": "TODO: awaiting reviewed Somali translation",
    },
}


def _city_only(location_name: str) -> str:
    """"Lagos, Nigeria" -> "Lagos" (falls back to the full string if no comma)."""
    return location_name.split(",")[0].strip()


def _country_from_location(location_name: str) -> str:
    parts = location_name.split(",")
    return parts[-1].strip().lower() if len(parts) > 1 else ""


def build_alert_messages(location_name: str, risk_level: str) -> tuple[str, str, str]:
    """Return (message_en, message_local, local_language_name)."""
    city = _city_only(location_name)
    country = _country_from_location(location_name)
    local_language = LOCAL_LANGUAGE_BY_COUNTRY.get(country, DEFAULT_LOCAL_LANGUAGE)

    message_en = ALERT_TEMPLATES["en"][risk_level].format(location=city)
    message_local = ALERT_TEMPLATES[local_language][risk_level].format(location=city)

    return message_en, message_local, local_language
