import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Which backend region (one of the 10 in `GET /api/regions`) the app
/// should show on Home/Alerts. Language now lives on `OnboardingProvider`
/// instead — see `lib/data/languages.dart` for the real (9-item, Figma-
/// matching) language list.
class SettingsProvider extends ChangeNotifier {
  static const _regionKey = 'selected_region_v1';

  String? selectedRegion;

  Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();
    selectedRegion = prefs.getString(_regionKey);
    notifyListeners();
  }

  Future<void> setRegion(String regionName) async {
    selectedRegion = regionName;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_regionKey, regionName);
    notifyListeners();
  }
}
