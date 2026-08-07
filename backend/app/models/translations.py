"""Alert message translation — NOT implemented yet.

Planned approach (starting tomorrow): hardcode a small dictionary of
pre-written alert translations for 2-3 local languages (e.g. Swahili,
Yoruba, Arabic), keyed by risk level, as a placeholder for a real
translation API.

# TODO: integrate real translation API (e.g. Google Translate, or an
# Africa-focused NLP/MT model) here, or start with the hardcoded
# dictionary described above.

Until this is implemented, POST /api/risk-check (see app/routes/risk.py)
returns a hardcoded example response instead of calling this function.
"""


def build_alert_messages(location_name: str, risk_level: str) -> tuple[str, str, str]:
    # TODO: implement translation lookup here.
    raise NotImplementedError("Translation logic is not implemented yet — see TODO above.")
