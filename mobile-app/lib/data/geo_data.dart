import 'dart:convert';

import 'package:flutter/services.dart' show rootBundle;

/// A country's real administrative subdivision, with the real towns/cities
/// inside it — not fabricated placeholder data. See [loadGeoData]'s doc
/// comment for provenance.
class GeoState {
  final String name;
  final List<String> cities;
  const GeoState({required this.name, required this.cities});
}

Map<String, List<GeoState>>? _cache;

/// Loads `assets/geo/states_cities.json`: real State/Region → City data for
/// all 54 countries in `countries.dart`, keyed by ISO3 code. Filtered from
/// the open, CC-licensed `dr5hn/countries-states-cities-database`
/// (github.com/dr5hn/countries-states-cities-database) down to just these
/// 54 countries — 1,117 real states/regions, 4,638 real cities/towns, not
/// invented data.
///
/// There's still no equally reliable third level (a Nigeria-style "Local
/// Government Area") available consistently across all 54 countries, so
/// `LocationSetupScreen`'s LGA field stays free text — faking a third tier
/// for every country would be worse than admitting the gap, same standard
/// this project holds itself to elsewhere.
///
/// Cached after the first call — this is a static ~90KB asset, not
/// something that changes at runtime.
Future<Map<String, List<GeoState>>> loadGeoData() async {
  final cached = _cache;
  if (cached != null) return cached;

  final raw = await rootBundle.loadString('assets/geo/states_cities.json');
  final decoded = jsonDecode(raw) as Map<String, dynamic>;
  final result = <String, List<GeoState>>{};
  for (final entry in decoded.entries) {
    final states = (entry.value as List<dynamic>)
        .map((s) => GeoState(
              name: s['name'] as String,
              cities: (s['cities'] as List<dynamic>).cast<String>(),
            ))
        .toList();
    result[entry.key] = states;
  }
  _cache = result;
  return result;
}
