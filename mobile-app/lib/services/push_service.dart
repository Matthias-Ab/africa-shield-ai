import 'dart:convert';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:http/http.dart' as http;

import '../config/env.dart';
import '../firebase_options.dart';

/// Real push-notification registration (Firebase Cloud Messaging) for the
/// "Mobile App" alert channel — see `AlertChannelsScreen`. Degrades
/// honestly, not silently: until a real Firebase project's config is in
/// `lib/firebase_options.dart` (see that file's doc comment), obtaining a
/// device token fails, `enable()` returns `false`, and the caller shows
/// "not available yet" instead of a fake "on" state.
class PushService {
  bool _initTried = false;
  bool _initialized = false;
  String? _token;

  String? get token => _token;

  Future<bool> _ensureInitialized() async {
    if (_initTried) return _initialized;
    _initTried = true;
    try {
      await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
      final settings = await FirebaseMessaging.instance.requestPermission();
      if (settings.authorizationStatus == AuthorizationStatus.denied) {
        return false;
      }
      final token = await FirebaseMessaging.instance.getToken();
      if (token == null) return false;
      _token = token;
      _initialized = true;
      return true;
    } catch (_) {
      // Covers every real failure mode of a not-yet-configured Firebase
      // project: placeholder API keys, no registered app for this
      // platform, permission denied, no VAPID key on web, etc. — all of
      // it collapses to "push isn't available right now," which is the
      // honest, safe default rather than guessing which one occurred.
      return false;
    }
  }

  /// Initializes Firebase (if not already), obtains a device token, and
  /// registers it with the backend for [locationName]. Returns `true`
  /// only if a real token was obtained AND the backend confirmed
  /// registration — never a fake success.
  Future<bool> enable(String locationName) async {
    final ready = await _ensureInitialized();
    final token = _token;
    if (!ready || token == null) return false;
    try {
      final uri = Uri.parse('${Env.apiBaseUrl}/api/push-tokens');
      final response = await http
          .post(
            uri,
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({'token': token, 'location_name': locationName}),
          )
          .timeout(const Duration(seconds: 10));
      return response.statusCode == 201;
    } catch (_) {
      return false;
    }
  }

  /// Unregisters the current device token from the backend, if one was
  /// ever obtained. Best-effort: a failure here just leaves an unused
  /// token on the backend rather than breaking anything for the user.
  Future<void> disable() async {
    final token = _token;
    if (token == null) return;
    try {
      final uri = Uri.parse('${Env.apiBaseUrl}/api/push-tokens/$token');
      await http.delete(uri).timeout(const Duration(seconds: 10));
    } catch (_) {
      // Best-effort — see doc comment above.
    }
  }
}
