import 'package:flutter/foundation.dart';

import '../models/alert.dart';
import '../models/region.dart';
import '../services/api_service.dart';
import '../services/cache_service.dart';

enum LoadStatus { initial, loading, liveData, cachedData, error }

/// Holds regions + alerts for the whole app. On refresh: try the real
/// backend first; on success, cache it and show it live. On failure, fall
/// back to whatever was last cached (and say so — `status` distinguishes
/// live data from cached data so the UI can be honest about which it's
/// showing, the same "don't overclaim" standard the rest of this project
/// holds itself to).
class RegionProvider extends ChangeNotifier {
  final ApiService _api;
  final CacheService _cache;

  RegionProvider({ApiService? api, CacheService? cache})
      : _api = api ?? ApiService(),
        _cache = cache ?? CacheService();

  LoadStatus status = LoadStatus.initial;
  List<Region> regions = [];
  List<AlertEvent> alerts = [];
  String? errorMessage;
  DateTime? lastUpdated;

  Region? regionByName(String name) {
    for (final r in regions) {
      if (r.locationName == name) return r;
    }
    return null;
  }

  List<AlertEvent> alertsForRegion(String name) =>
      alerts.where((a) => a.locationName == name).toList();

  Future<void> load() async {
    status = LoadStatus.loading;
    notifyListeners();

    try {
      final freshRegions = await _api.fetchRegions();
      final freshAlerts = await _api.fetchAlerts();
      regions = freshRegions;
      alerts = freshAlerts;
      await _cache.saveRegions(freshRegions);
      await _cache.saveAlerts(freshAlerts);
      lastUpdated = DateTime.now();
      status = LoadStatus.liveData;
      errorMessage = null;
    } catch (e) {
      final cachedRegions = await _cache.loadRegions();
      final cachedAlerts = await _cache.loadAlerts();
      if (cachedRegions.isNotEmpty) {
        regions = cachedRegions;
        alerts = cachedAlerts;
        lastUpdated = await _cache.lastUpdated();
        status = LoadStatus.cachedData;
      } else {
        status = LoadStatus.error;
      }
      errorMessage = e.toString();
    }

    notifyListeners();
  }
}
