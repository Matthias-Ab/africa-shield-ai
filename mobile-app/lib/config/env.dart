/// Backend API base URL.
///
/// Override at build/run time instead of hardcoding it — the web dashboard
/// hardcoded this in four separate files and it became a real cleanup item
/// (see ../../todo.md). Don't repeat that here.
///
/// Examples:
///   flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8000       (Android emulator -> host machine)
///   flutter run --dart-define=API_BASE_URL=http://192.168.1.23:8000   (physical device on same network)
///   flutter run --dart-define=API_BASE_URL=https://xxxx.serveousercontent.com  (tunneled, matching the Wokwi setup)
class Env {
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:8000',
  );
}
