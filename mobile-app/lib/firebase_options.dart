import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart' show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// **Placeholder values — push notifications will not work until these
/// are replaced with a real Firebase project's config.** No Firebase
/// project has been created for AfriShield yet (that's an external
/// account/console step nobody has done — see `todo.md`).
///
/// To enable real push notifications:
/// 1. Create a free project at https://console.firebase.google.com/.
/// 2. Run `flutterfire configure` from `mobile-app/` (installs via
///    `dart pub global activate flutterfire_cli` if needed) — it
///    overwrites this entire file with your real project's values for
///    every platform, and registers the Android/iOS/web apps for you.
/// 3. Also generate a service-account key for the *backend* side (a
///    separate credential) — see `backend/.env.example`'s
///    `FIREBASE_SERVICE_ACCOUNT_JSON`.
///
/// Until then, `PushService` (see `lib/services/push_service.dart`)
/// catches the failure this causes and reports push as unavailable —
/// the rest of the app is unaffected either way.
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) return web;
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      default:
        return web;
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'REPLACE_WITH_REAL_FIREBASE_WEB_API_KEY',
    appId: 'REPLACE_WITH_REAL_FIREBASE_WEB_APP_ID',
    messagingSenderId: 'REPLACE_WITH_REAL_SENDER_ID',
    projectId: 'REPLACE_WITH_REAL_PROJECT_ID',
    authDomain: 'REPLACE_WITH_REAL_PROJECT_ID.firebaseapp.com',
    storageBucket: 'REPLACE_WITH_REAL_PROJECT_ID.appspot.com',
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'REPLACE_WITH_REAL_FIREBASE_ANDROID_API_KEY',
    appId: 'REPLACE_WITH_REAL_FIREBASE_ANDROID_APP_ID',
    messagingSenderId: 'REPLACE_WITH_REAL_SENDER_ID',
    projectId: 'REPLACE_WITH_REAL_PROJECT_ID',
    storageBucket: 'REPLACE_WITH_REAL_PROJECT_ID.appspot.com',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'REPLACE_WITH_REAL_FIREBASE_IOS_API_KEY',
    appId: 'REPLACE_WITH_REAL_FIREBASE_IOS_APP_ID',
    messagingSenderId: 'REPLACE_WITH_REAL_SENDER_ID',
    projectId: 'REPLACE_WITH_REAL_PROJECT_ID',
    storageBucket: 'REPLACE_WITH_REAL_PROJECT_ID.appspot.com',
    iosBundleId: 'com.afrishield.afrishieldMobile',
  );
}
