import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Real, app-wide accessibility settings — not stub UI. `textScale` and
/// `highContrast` are applied in `app.dart`; `voiceAlertsEnabled` gates the
/// "Read Aloud" button on the alert detail screen (see
/// `screens/alert_detail_screen.dart`).
class AccessibilityProvider extends ChangeNotifier {
  static const _textScaleKey = 'a11y_text_scale_v1';
  static const _voiceKey = 'a11y_voice_v1';
  static const _contrastKey = 'a11y_contrast_v1';

  double textScale = 1.0;
  bool voiceAlertsEnabled = false;
  bool highContrast = false;

  Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();
    textScale = prefs.getDouble(_textScaleKey) ?? 1.0;
    voiceAlertsEnabled = prefs.getBool(_voiceKey) ?? false;
    highContrast = prefs.getBool(_contrastKey) ?? false;
    notifyListeners();
  }

  Future<void> setTextScale(double value) async {
    textScale = value;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setDouble(_textScaleKey, value);
    notifyListeners();
  }

  Future<void> setVoiceAlertsEnabled(bool value) async {
    voiceAlertsEnabled = value;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_voiceKey, value);
    notifyListeners();
  }

  Future<void> setHighContrast(bool value) async {
    highContrast = value;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_contrastKey, value);
    notifyListeners();
  }
}
