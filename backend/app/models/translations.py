"""Alert translations for the hackathon demo.

# TODO: integrate a real translation API (e.g. Google Translate, or an
# Africa-focused NLP/MT model) eventually. For now this is a hardcoded
# lookup across 7 languages: English, Swahili, Arabic, Somali, French,
# Portuguese, Amharic. 6 of these (English, Arabic, French, Portuguese,
# Swahili, Amharic) deliberately match the African Union's 6 official
# languages, with Amharic substituted for Spanish per the organizer's
# own guidance, since Spanish isn't relevant to our flood-risk regions.
# Somali is the 7th, kept alongside the AU-6 rather than dropped —
# it predates the AU-alignment decision and is already reviewed, live,
# and demoed via Mogadishu.
#
# FLAG FOR THE TEAM: **Swahili, Arabic, and Somali were all reviewed and
# confirmed correct by native speakers on 2026-08-17** — no longer
# flagged as unreviewed AI drafts. **French, Portuguese, and Amharic are
# still AI-written drafts, unreviewed by a native speaker** — same
# caveat the other three used to carry, until someone checks each of
# them. Amharic in particular is a bigger leap of faith than the other
# two: it's linguistically further from this project's other languages
# and was drafted with less confidence — treat it as the most likely of
# the three to need correction. Team decision (2026-08-10): ship
# unreviewed languages as the working translations for the hackathon
# demo rather than block on a review pass; flag any wording that looks
# off if you notice.
#
# ARABIC IS RIGHT-TO-LEFT. This module returns Arabic alert text as a
# plain string in `alert_message_local` — it does not add any RTL
# markers/wrapping. The frontend team needs to handle right-to-left
# display themselves (e.g. `dir="rtl"` / CSS) when `local_language` is
# `"Arabic"`; don't assume that's already handled anywhere in this repo.
#
# HIGH-RISK MESSAGES INCLUDE A SAFETY-PRIORITY LINE (added 2026-08-20)
# naming children, elderly people, and pregnant/nursing individuals —
# standard humanitarian evacuation guidance (the same category IFRC/
# UNICEF flood materials use), not a new personal-data field. This
# directly answers a gap flagged in `todo.md`: the "Social Impact &
# Inclusion" scorecard criterion names "women" and "children" as groups
# to address, and until now nothing in the alert content spoke to either
# — voice alerts and local-language text served disabilities/elderly/
# underserved communities, but women and children had no deliberate
# design behind them. This line only fires at "high" risk, alongside the
# existing evacuation instruction; medium/low have no evacuation step to
# attach it to.
#
# FLAG FOR THE TEAM: this new clause is an AI-drafted, UNREVIEWED
# translation in ALL SEVEN languages — including Swahili, Arabic, and
# Somali, whose *existing* wording was already confirmed by native
# speakers. That review only covered the original sentence; this added
# clause needs its own native-speaker check in every language before
# being treated as trustworthy, same as French/Portuguese/Amharic
# already are. Also note: adding a sentence can push a "high" SMS from
# one 160-character segment into two, which roughly doubles that
# message's per-alert send cost — worth knowing before quoting the
# $0.01-$0.03 figure elsewhere as a flat per-alert number.
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
# the seven agreed languages appear as values: English, Swahili, Arabic,
# Somali, French, Portuguese, Amharic. Countries not listed fall back to
# DEFAULT_LOCAL_LANGUAGE.
#
# Yoruba has been removed — it was an earlier draft language choice
# before the team locked the final language set.
#
# DRC is mapped to French (added 2026-08-17) — French is DRC's actual
# official language, correcting the earlier English-fallback placeholder
# used before French was one of the agreed languages. Kinshasa is
# already one of the 10 sample cities in app/data/regions.json, so this
# is exercised live by /api/regions, not just a hypothetical.
#
# **Mozambique corrected from English to Portuguese (2026-08-17) — this
# was a real, live bug, not just a documentation gap.** Portuguese is
# Mozambique's actual official language; the earlier English mapping was
# only ever an arbitrary fallback for a language outside the
# then-agreed set, exactly the same category of bug the DRC/French fix
# corrected. Maputo is one of our 10 sample cities and is the team's most
# real-data-validated city (the Dec 2025-Jan 2026 flood event), so this
# was flagged as a priority fix, not a routine addition — see
# docs/progress-log.md's 2026-08-17 entry for the "don't silently change
# the contract" flag this correction requires.
#
# Nigeria and Ghana correctly map to English — that genuinely is each
# country's official language, unlike Mozambique's old (wrong) mapping.
#
# Ethiopia is mapped to Amharic, its official language. Addis Ababa was
# added as a 10th sample city the same day (2026-08-17), specifically so
# Amharic would be exercised live by /api/regions like every other
# language here — it briefly wasn't, and that gap was flagged explicitly
# rather than left as a "looks supported but isn't really demoable" gap.
# See docs/progress-log.md's 2026-08-17 entries for both the gap and the
# fix.
#
# The extra French/Portuguese-speaking countries below aren't in
# app/data/regions.json yet — added ahead of time so the mapping is
# ready the moment a sample city there is, same reasoning the team used
# when adding Somalia to this table before Mogadishu was a sample city.
#
# Deliberately skipped as ambiguous, per team discipline of not guessing:
# - Congo-Brazzaville/Republic of the Congo: country name too easily
#   confused with DRC ("Congo") to add safely without a real example.
# - Djibouti: Arabic, French, and Somali are all plausible official
#   languages there; guessing wrong is worse than the English default.
# - Comoros: French and Arabic are co-official; genuinely ambiguous
#   between two of our six languages.
# - Eritrea: none of our six languages is actually its primary one
#   (Tigrinya is, which isn't in our set) — Arabic and English are both
#   used administratively, but neither is "the" answer, so left
#   unmapped rather than picking one.
# - Equatorial Guinea is INCLUDED, not skipped, despite Spanish/French
#   also being co-official there — mapped to Portuguese per an explicit
#   team decision (not a guess made by whoever last edited this file).
LOCAL_LANGUAGE_BY_COUNTRY = {
    "kenya": "Swahili",
    "tanzania": "Swahili",
    "uganda": "Swahili",
    "egypt": "Arabic",
    "somalia": "Somali",
    "nigeria": "English",
    "ghana": "English",
    "mozambique": "Portuguese",
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
    "angola": "Portuguese",
    "guinea-bissau": "Portuguese",
    "cabo verde": "Portuguese",
    "cape verde": "Portuguese",
    "são tomé and príncipe": "Portuguese",
    "sao tome and principe": "Portuguese",
    "equatorial guinea": "Portuguese",
    "ethiopia": "Amharic",
}

# Changed from "Swahili" to "English": any country not explicitly listed
# above now falls back to English rather than guessing at a specific
# local language for it.
DEFAULT_LOCAL_LANGUAGE = "English"

_EN_TEMPLATES = {
    "high": "Flood risk is HIGH in {location}. Move to higher ground and avoid riverbanks. Prioritize children, elderly people, and pregnant or nursing individuals when evacuating.",
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
        "high": "Hatari ya mafuriko ni KUBWA katika {location}. Hamia mahali salama na epuka kingo za mto. Wape kipaumbele watoto, wazee, na wanawake wajawazito au wanaonyonyesha wakati wa kuhama.",
        "medium": "Hatari ya mafuriko ni WASTANI katika {location}. Kuwa macho na fuatilia taarifa za eneo lako.",
        "low": "Hatari ya mafuriko ni NDOGO katika {location}. Hakuna hatua inayohitajika kwa sasa.",
    },
    # Reviewed and confirmed correct by a native Arabic speaker, 2026-08-17.
    # Right-to-left text — see RTL note in module docstring.
    "Arabic": {
        "high": "خطر الفيضانات مرتفع في {location}. انتقل إلى مكان مرتفع وتجنب ضفاف النهر. أعطِ الأولوية للأطفال وكبار السن والنساء الحوامل أو المرضعات عند الإخلاء.",
        "medium": "خطر الفيضانات متوسط في {location}. توخَّ الحذر وتابع التحديثات المحلية.",
        "low": "خطر الفيضانات منخفض في {location}. لا حاجة لاتخاذ إجراء في الوقت الحالي.",
    },
    # Reviewed and confirmed correct by a native Somali speaker, 2026-08-17.
    "Somali": {
        "high": "Khatarta daadka ee {location} waa SARE. U guuri meel sare kana fogow xeebaha webiga. Mudnaanta sii carruurta, waayeelka, iyo haweenka uurka leh ama naaska nuujinaya marka la baxayo.",
        "medium": "Khatarta daadka ee {location} waa DHEXDHEXAAD. La soco warbixinnaha maxaliga ah.",
        "low": "Khatarta daadka ee {location} waa HOOSE. Wax tallaabo lagama qaadanayo hadda.",
    },
    # AI-written, unreviewed by a native speaker — added 2026-08-17, same
    # caveat as Arabic/Somali until someone checks it.
    "French": {
        "high": "Le risque d'inondation est ÉLEVÉ à {location}. Déplacez-vous vers un terrain élevé et évitez les berges de la rivière. Donnez la priorité aux enfants, aux personnes âgées et aux femmes enceintes ou allaitantes lors de l'évacuation.",
        "medium": "Le risque d'inondation est MOYEN à {location}. Restez vigilant et suivez les mises à jour locales.",
        "low": "Le risque d'inondation est FAIBLE à {location}. Aucune action n'est nécessaire pour le moment.",
    },
    # AI-written, unreviewed by a native speaker — added 2026-08-17.
    "Portuguese": {
        "high": "O risco de inundação é ALTO em {location}. Desloque-se para um terreno mais elevado e evite as margens do rio. Dê prioridade a crianças, idosos e mulheres grávidas ou lactantes durante a evacuação.",
        "medium": "O risco de inundação é MÉDIO em {location}. Mantenha-se alerta e siga as atualizações locais.",
        "low": "O risco de inundação é BAIXO em {location}. Nenhuma ação é necessária neste momento.",
    },
    # AI-written, unreviewed by a native speaker — added 2026-08-17.
    # Treat this one as the LEAST confident draft in this file — Amharic
    # is linguistically further from the team's other languages than
    # French/Portuguese are from English, so this is a bigger leap of
    # faith than the other unreviewed entries. Written in Ge'ez script.
    "Amharic": {
        "high": "የጎርፍ አደጋ በ{location} ከፍተኛ ነው። ወደ ከፍታ ቦታ ይሂዱ እና የወንዝ ዳርቻዎችን ያስወግዱ። ሲወጡ ልጆችን፣ አዛውንቶችን እና ነፍሰ ጡር ወይም የሚያጠቡ ሴቶችን አስቀድመው ያስቡ።",
        "medium": "የጎርፍ አደጋ በ{location} መካከለኛ ነው። ንቁ ይሁኑ እና የአካባቢ ዝማኔዎችን ይከታተሉ።",
        "low": "የጎርፍ አደጋ በ{location} ዝቅተኛ ነው። በአሁኑ ጊዜ እርምጃ አያስፈልግም።",
    },
}

# City names as they're written in the local language, for
# `alert_message_local` only — `alert_message_en` always uses the plain
# English name from `location_name`. Only cities whose local name
# actually differs need an entry here; most don't (e.g. "Nairobi",
# "Kampala", and "Dar es Salaam" are already their Swahili names, and
# "Kinshasa" and "Maputo" are already their French/Portuguese names) —
# see module docstring.
#
# "Addis Ababa" is now exercised live by /api/regions — it's one of the
# 10 sample cities (added 2026-08-17, same day as Amharic itself, so
# Amharic wouldn't be a mapping that only works in theory).
LOCALIZED_CITY_NAMES = {
    "Arabic": {"Cairo": "القاهرة"},
    "Somali": {"Mogadishu": "Muqdisho"},
    "Amharic": {"Addis Ababa": "አዲስ አበባ"},
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
