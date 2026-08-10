"""Alert translations for the hackathon demo.

# TODO: integrate a real translation API (e.g. Google Translate, or an
# Africa-focused NLP/MT model) eventually. For now this is a hardcoded
# lookup across the team's four agreed languages: English, Swahili,
# Arabic, Somali.
#
# FLAG FOR THE TEAM: the Swahili, Arabic, and Somali strings in
# ALERT_TEMPLATES below are AI-written and have not been checked by a
# native/fluent speaker. Team decision (2026-08-10): ship these as the
# working translations for the hackathon demo (deadline 2026-08-29)
# rather than block on a review pass. A native-speaker review is still
# worth doing before any use beyond the hackathon — flag any wording
# that looks off if you notice.
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
# guessing at a language outside the agreed four. Mogadishu, Somalia is
# one of the 9 sample cities in app/data/regions.json, so this mapping
# is now exercised by /api/regions, not just a hypothetical.
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
    # AI-written, unreviewed by a native speaker — see module docstring.
    "Swahili": {
        "high": "Hatari ya mafuriko ni KUBWA katika {location}. Hamia mahali salama na epuka kingo za mto.",
        "medium": "Hatari ya mafuriko ni WASTANI katika {location}. Kuwa macho na fuatilia taarifa za eneo lako.",
        "low": "Hatari ya mafuriko ni NDOGO katika {location}. Hakuna hatua inayohitajika kwa sasa.",
    },
    # AI-written, unreviewed by a native speaker — see module docstring.
    # Right-to-left text — see RTL note in module docstring.
    "Arabic": {
        "high": "خطر الفيضانات مرتفع في {location}. انتقل إلى مكان مرتفع وتجنب ضفاف النهر.",
        "medium": "خطر الفيضانات متوسط في {location}. توخَّ الحذر وتابع التحديثات المحلية.",
        "low": "خطر الفيضانات منخفض في {location}. لا حاجة لاتخاذ إجراء في الوقت الحالي.",
    },
    # AI-written, unreviewed by a native speaker — see module docstring.
    "Somali": {
        "high": "Khatarta daadka ee {location} waa SARE. U guuri meel sare kana fogow xeebaha webiga.",
        "medium": "Khatarta daadka ee {location} waa DHEXDHEXAAD. La soco warbixinnaha maxaliga ah.",
        "low": "Khatarta daadka ee {location} waa HOOSE. Wax tallaabo lagama qaadanayo hadda.",
    },
}


def _city_only(location_name: str) -> str:
    """"Lagos, Nigeria" -> "Lagos" (falls back to the full string if no comma)."""
    return location_name.split(",")[0].strip()


def country_from_location(location_name: str) -> str:
    """"Lagos, Nigeria" -> "Nigeria" (empty string if no comma). Display-cased,
    unlike the lowercase form used internally for the language lookup below."""
    parts = location_name.split(",")
    return parts[-1].strip() if len(parts) > 1 else ""


def _country_from_location(location_name: str) -> str:
    return country_from_location(location_name).lower()


def build_alert_messages(location_name: str, risk_level: str) -> tuple[str, str, str]:
    """Return (message_en, message_local, local_language_name)."""
    city = _city_only(location_name)
    country = _country_from_location(location_name)
    local_language = LOCAL_LANGUAGE_BY_COUNTRY.get(country, DEFAULT_LOCAL_LANGUAGE)

    message_en = ALERT_TEMPLATES["en"][risk_level].format(location=city)
    message_local = ALERT_TEMPLATES[local_language][risk_level].format(location=city)

    return message_en, message_local, local_language
