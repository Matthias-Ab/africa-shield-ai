"""Alert translations for the hackathon demo.

# TODO: integrate a real translation API (e.g. Google Translate, or an
# Africa-focused NLP/MT model) eventually. For now this is a hardcoded
# lookup across the team's five agreed languages: English, Swahili,
# Arabic, Somali, French.
#
# FLAG FOR THE TEAM: **Swahili, Arabic, and Somali were all reviewed and
# confirmed correct by native speakers on 2026-08-17** — no longer
# flagged as unreviewed AI drafts. Only French (added 2026-08-17) is
# still an AI-written draft, unreviewed by a native speaker — same
# caveat the other three used to carry, until someone checks it. Team
# decision (2026-08-10): ship unreviewed languages as the working
# translations for the hackathon demo rather than block on a review
# pass; flag any wording that looks off if you notice.
#
# ARABIC IS RIGHT-TO-LEFT. This module returns Arabic alert text as a
# plain string in `alert_message_local` — it does not add any RTL
# markers/wrapping. The frontend team needs to handle right-to-left
# display themselves (e.g. `dir="rtl"` / CSS) when `local_language` is
# `"Arabic"`; don't assume that's already handled anywhere in this repo.
#
# CITY NAMES ARE LOCALIZED for the local-language message, per a
# 2026-08-17 team decision (previously every language's message dropped
# in the plain English/Latin city name, e.g. "Cairo" inside an Arabic
# sentence). See LOCALIZED_CITY_NAMES below — `alert_message_en` always
# keeps the English name; `alert_message_local` uses the local name where
# one is on file, and falls back to the English name otherwise (most
# cities' names don't change across these languages, e.g. "Nairobi" is
# already the Swahili name).
"""

# Which local language to use per country, keyed by lowercase country
# name (parsed from the end of "City, Country" in location_name). Only
# the five agreed languages appear as values: English, Swahili, Arabic,
# Somali, French. Countries not listed fall back to DEFAULT_LOCAL_LANGUAGE.
#
# Yoruba has been removed — it was an earlier draft language choice
# before the team locked the final language set.
#
# DRC is mapped to French (added 2026-08-17) — French is DRC's actual
# official language, correcting the earlier English-fallback placeholder
# used before French was one of the agreed languages. Kinshasa is
# already one of the 9 sample cities in app/data/regions.json, so this
# is exercised live by /api/regions, not just a hypothetical.
#
# Nigeria, Ghana, and Mozambique still don't cleanly map to any of the
# five agreed languages (Mozambique's real primary language is
# Portuguese, not covered here), so they stay mapped to English rather
# than guessing.
#
# The extra French-speaking countries below aren't in
# app/data/regions.json yet — added ahead of time so the mapping is
# ready the moment a French-speaking sample city is, same reasoning the
# team used when adding Somalia to this table before Mogadishu was a
# sample city. Deliberately excludes Congo-Brazzaville/Republic of the
# Congo — its country name is too easily confused with DRC ("Congo") to
# add safely without a real example to test against.
LOCAL_LANGUAGE_BY_COUNTRY = {
    "kenya": "Swahili",
    "tanzania": "Swahili",
    "uganda": "Swahili",
    "egypt": "Arabic",
    "somalia": "Somali",
    "nigeria": "English",
    "ghana": "English",
    "mozambique": "English",
    "drc": "French",
    "senegal": "French",
    "mali": "French",
    "cote d'ivoire": "French",
    "ivory coast": "French",
    "cameroon": "French",
    "niger": "French",
    "chad": "French",
    "burkina faso": "French",
    "benin": "French",
    "togo": "French",
    "guinea": "French",
    "gabon": "French",
    "madagascar": "French",
    "central african republic": "French",
    "rwanda": "French",
    "burundi": "French",
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
    # Reviewed and confirmed correct by a native Swahili speaker, 2026-08-17.
    "Swahili": {
        "high": "Hatari ya mafuriko ni KUBWA katika {location}. Hamia mahali salama na epuka kingo za mto.",
        "medium": "Hatari ya mafuriko ni WASTANI katika {location}. Kuwa macho na fuatilia taarifa za eneo lako.",
        "low": "Hatari ya mafuriko ni NDOGO katika {location}. Hakuna hatua inayohitajika kwa sasa.",
    },
    # Reviewed and confirmed correct by a native Arabic speaker, 2026-08-17.
    # Right-to-left text — see RTL note in module docstring.
    "Arabic": {
        "high": "خطر الفيضانات مرتفع في {location}. انتقل إلى مكان مرتفع وتجنب ضفاف النهر.",
        "medium": "خطر الفيضانات متوسط في {location}. توخَّ الحذر وتابع التحديثات المحلية.",
        "low": "خطر الفيضانات منخفض في {location}. لا حاجة لاتخاذ إجراء في الوقت الحالي.",
    },
    # Reviewed and confirmed correct by a native Somali speaker, 2026-08-17.
    "Somali": {
        "high": "Khatarta daadka ee {location} waa SARE. U guuri meel sare kana fogow xeebaha webiga.",
        "medium": "Khatarta daadka ee {location} waa DHEXDHEXAAD. La soco warbixinnaha maxaliga ah.",
        "low": "Khatarta daadka ee {location} waa HOOSE. Wax tallaabo lagama qaadanayo hadda.",
    },
    # AI-written, unreviewed by a native speaker — added 2026-08-17, same
    # caveat as Arabic/Somali until someone checks it.
    "French": {
        "high": "Le risque d'inondation est ÉLEVÉ à {location}. Déplacez-vous vers un terrain élevé et évitez les berges de la rivière.",
        "medium": "Le risque d'inondation est MOYEN à {location}. Restez vigilant et suivez les mises à jour locales.",
        "low": "Le risque d'inondation est FAIBLE à {location}. Aucune action n'est nécessaire pour le moment.",
    },
}

# City names as they're written in the local language, for
# `alert_message_local` only — `alert_message_en` always uses the plain
# English name from `location_name`. Only cities whose local name
# actually differs need an entry here; most don't (e.g. "Nairobi",
# "Kampala", and "Dar es Salaam" are already their Swahili names, and
# "Kinshasa" is already its French name) — see module docstring.
LOCALIZED_CITY_NAMES = {
    "Arabic": {"Cairo": "القاهرة"},
    "Somali": {"Mogadishu": "Muqdisho"},
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
    local_city = LOCALIZED_CITY_NAMES.get(local_language, {}).get(city, city)

    message_en = ALERT_TEMPLATES["en"][risk_level].format(location=city)
    message_local = ALERT_TEMPLATES[local_language][risk_level].format(location=local_city)

    return message_en, message_local, local_language
