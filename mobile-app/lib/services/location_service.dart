import 'package:geolocator/geolocator.dart';

class LocationException implements Exception {
  final String message;
  LocationException(this.message);
  @override
  String toString() => message;
}

/// Thin wrapper over `geolocator` for "Use my current location" (onboarding
/// and hazard reports). Every failure mode (services off, permission
/// denied/denied forever) surfaces as a real `LocationException` with a
/// message a user can act on — never a silent fallback to a fake position.
class LocationService {
  Future<Position> getCurrentPosition() async {
    if (!await Geolocator.isLocationServiceEnabled()) {
      throw LocationException(
        'Location services are turned off. Enable location in your device settings and try again.',
      );
    }

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        throw LocationException('Location permission was denied.');
      }
    }
    if (permission == LocationPermission.deniedForever) {
      throw LocationException(
        'Location permission is permanently denied. Enable it for AfriShield in your device settings.',
      );
    }

    return Geolocator.getCurrentPosition(
      locationSettings: const LocationSettings(accuracy: LocationAccuracy.high),
    );
  }
}
