/// Real, source-cited general emergency phone numbers for all 54
/// countries in `countries.dart`. Sourced 2026-08-29 from Wikipedia's
/// "List of emergency telephone numbers"
/// (en.wikipedia.org/wiki/List_of_emergency_telephone_numbers), read
/// directly from that article's wikitext table (not an AI-summarized
/// paraphrase of it) — most entries there are themselves cited to a
/// government, embassy, telecom, or ITU source. Where a country has one
/// unified emergency number, that's used; otherwise this is the police
/// number, since that's the one number every listed country has and is
/// the closest to a universal "get connected to help" line where no
/// single unified number exists.
///
/// **This is real, cited data — not a guess — but it has not been
/// independently re-verified against each country's own current
/// official source, and phone systems do change.** Treat this the same
/// way the rest of this project treats an AI-drafted translation:
/// meaningfully better than nothing, appropriate to ship, but flagged
/// for a follow-up verification pass before relying on it at real scale
/// — see `todo.md`.
///
/// Keyed by the country name exactly as it appears in `countries.dart`.
/// A couple of short-form aliases are included too, since
/// `country_from_location()` on the backend derives a region's country
/// from whatever comes after the last comma in its `location_name` (e.g.
/// "Kinshasa, DRC" → `"DRC"`), which doesn't always match the full name
/// used in the country picker.
const Map<String, String> emergencyNumberByCountry = {
  'Algeria': '1548',
  'Angola': '113',
  'Benin': '117',
  'Botswana': '999',
  'Burkina Faso': '17',
  'Burundi': '117',
  'Cabo Verde': '132',
  'Cameroon': '112',
  'Central African Republic': '117',
  'Chad': '17',
  'Comoros': '17',
  'Congo, Democratic Republic of the': '112',
  'DRC': '112', // alias — see doc comment
  'Congo, Republic of the': '117',
  'Djibouti': '17',
  'Egypt': '112',
  'Equatorial Guinea': '114',
  'Eritrea': '113',
  'Eswatini': '999',
  'Ethiopia': '911',
  'Gabon': '1730',
  'Gambia': '117',
  'Ghana': '112',
  'Guinea': '117',
  'Guinea-Bissau': '112',
  "Ivory Coast (Côte d'Ivoire)": '110',
  'Kenya': '112',
  'Lesotho': '123',
  'Liberia': '911',
  'Libya': '1515',
  'Madagascar': '117',
  'Malawi': '997',
  'Mali': '17',
  'Mauritania': '117',
  'Mauritius': '112',
  'Morocco': '19',
  'Mozambique': '119',
  'Namibia': '10111',
  'Niger': '17',
  'Nigeria': '112',
  'Rwanda': '112',
  'São Tomé and Príncipe': '112',
  'Senegal': '17',
  'Seychelles': '112',
  'Sierra Leone': '019',
  'Somalia': '888',
  'South Africa': '10111',
  'South Sudan': '999',
  'Sudan': '999',
  'Tanzania': '112',
  'Togo': '117',
  'Tunisia': '197',
  'Uganda': '112',
  'Zambia': '999',
  'Zimbabwe': '999',
};
