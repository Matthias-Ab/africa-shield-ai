import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/alert.dart';
import '../models/region.dart';

/// Local cache so the app still shows the last-known risk levels and alerts
/// with no connectivity — the actual "offline-first" part of the offline-
/// first requirement. This is deliberately a plain last-write-wins cache,
/// not a sync engine: the app is read-only for citizens, so there's nothing
/// to reconcile on reconnect.
class CacheService {
  static const _regionsKey = 'cached_regions_v1';
  static const _alertsKey = 'cached_alerts_v1';
  static const _lastUpdatedKey = 'cached_last_updated_v1';

  Future<void> saveRegions(List<Region> regions) async {
    final prefs = await SharedPreferences.getInstance();
    final encoded = jsonEncode(regions.map((r) => r.toJson()).toList());
    await prefs.setString(_regionsKey, encoded);
    await prefs.setString(_lastUpdatedKey, DateTime.now().toIso8601String());
  }

  Future<List<Region>> loadRegions() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_regionsKey);
    if (raw == null) return [];
    final data = jsonDecode(raw) as List<dynamic>;
    return data
        .map((e) => Region.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<void> saveAlerts(List<AlertEvent> alerts) async {
    final prefs = await SharedPreferences.getInstance();
    final encoded = jsonEncode(alerts
        .map((a) => {
              'location_name': a.locationName,
              'risk_level': a.riskLevel,
              'message_sent': a.messageSent,
              'channel': a.channel,
              'recipients': a.recipients,
              'timestamp': a.timestamp.toIso8601String(),
              'trigger': a.trigger,
            })
        .toList());
    await prefs.setString(_alertsKey, encoded);
  }

  Future<List<AlertEvent>> loadAlerts() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_alertsKey);
    if (raw == null) return [];
    final data = jsonDecode(raw) as List<dynamic>;
    return data
        .map((e) => AlertEvent.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<DateTime?> lastUpdated() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_lastUpdatedKey);
    return raw == null ? null : DateTime.tryParse(raw);
  }
}
