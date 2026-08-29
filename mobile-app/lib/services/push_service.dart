import 'dart:convert';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http/http.dart' as http;

import '../config/env.dart';
import '../firebase_options.dart';

/// A real Firebase project is configured now (`lib/firebase_options.dart`,
/// set up 2026-08-29 via `flutterfire configure` — see that file's doc
/// comment) — Android and iOS push should work as-is once built for those
/// platforms (untested here, no device/emulator available in this
/// environment). **Web push additionally needs a VAPID key**
/// (Project Settings > Cloud Messaging > Web configuration > Web Push
/// certificates in the Firebase console) passed to [_webVapidKey] below —
/// without it, `getToken()` on web fails the same way it did before any
/// Firebase project existed. Every other failure mode (permission denied,
/// no registered app for a platform, etc.) still degrades the same
/// honest way: `enable()` returns `false`, never a fake success.
class PushService {
  /// Fill in once available from Firebase Console > Project Settings >
  /// Cloud Messaging > Web configuration > Web Push certificates. Only
  /// used on web (`FirebaseMessaging.getToken` ignores it on
  /// Android/iOS) — not a secret, this key is meant to be public/client-
  /// side, same as everything in `firebase_options.dart`.
  static const String? _webVapidKey = null;

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
      final token = await FirebaseMessaging.instance.getToken(
        vapidKey: kIsWeb ? _webVapidKey : null,
      );
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
