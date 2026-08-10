"""Hardcoded alert translations for the hackathon demo.

# TODO: integrate a real translation API (e.g. Google Translate, or an
# Africa-focused NLP/MT model) and expand language coverage beyond the
# 3 languages below.
#
# FLAG FOR THE TEAM: the Yoruba, Swahili, and Arabic strings below were
# written by an AI assistant for this demo and have NOT been verified by
# a native/fluent speaker. Get a native-speaker review before the final
# submission — a wrong translation in a flood warning is worse than none.
"""

# Which local language to use per country. Countries not listed fall back
# to DEFAULT_LOCAL_LANGUAGE. This is a coarse, demo-only mapping — real
# deployments would localize per-region, not per-country.
LOCAL_LANGUAGE_BY_COUNTRY = {
    "nigeria": "Yoruba",
    "kenya": "Swahili",
    "egypt": "Arabic",
    "tanzania": "Swahili",
    "uganda": "Swahili",
}

DEFAULT_LOCAL_LANGUAGE = "Swahili"

ALERT_TEMPLATES = {
    "en": {
        "high": "Flood risk is HIGH in {location}. Move to higher ground and avoid riverbanks.",
        "medium": "Flood risk is MEDIUM in {location}. Stay alert and monitor local updates.",
        "low": "Flood risk is LOW in {location}. No action needed at this time.",
    },
    "Yoruba": {
        "high": "Ewu omi ga soke ni {location}. Lo si ibi giga, yago fun eti odo.",
        "medium": "Ewu omi wa ni ipele arin ni {location}. Ṣọra, tẹle awọn iroyin agbegbe.",
        "low": "Ewu omi kere ni {location}. Ko si iṣe pataki lọwọlọwọ.",
    },
    "Swahili": {
        "high": "Hatari ya mafuriko ni KUBWA katika {location}. Hamia mahali salama na epuka kingo za mto.",
        "medium": "Hatari ya mafuriko ni WASTANI katika {location}. Kuwa macho na fuatilia taarifa za eneo lako.",
        "low": "Hatari ya mafuriko ni NDOGO katika {location}. Hakuna hatua inayohitajika kwa sasa.",
    },
    "Arabic": {
        "high": "خطر الفيضانات مرتفع في {location}. انتقل إلى مكان مرتفع وتجنب ضفاف النهر.",
        "medium": "خطر الفيضانات متوسط في {location}. توخَّ الحذر وتابع التحديثات المحلية.",
        "low": "خطر الفيضانات منخفض في {location}. لا حاجة لاتخاذ إجراء في الوقت الحالي.",
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
