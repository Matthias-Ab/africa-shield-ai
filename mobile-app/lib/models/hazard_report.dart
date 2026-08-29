/// A citizen-submitted "what are you seeing" report — matches the Figma
/// "Report a Hazard" screen. Sent for real via `ApiService.submitHazardReport`
/// to `POST /api/hazard-reports` (see `docs/api-contract.md`).
class HazardReport {
  final String category;
  final String? description;
  final String locationName;
  final DateTime submittedAt;
  final double? latitude;
  final double? longitude;

  const HazardReport({
    required this.category,
    this.description,
    required this.locationName,
    required this.submittedAt,
    this.latitude,
    this.longitude,
  });

  /// Only the fields the backend accepts — `submittedAt` is client-side
  /// display data; the server stamps its own `submitted_at` on receipt.
  /// `needs_assistance` isn't sent: the Figma design has no "I need help"
  /// toggle, so every mobile-submitted report defaults to `false`
  /// server-side.
  Map<String, dynamic> toJson() => {
        'category': category,
        if (description != null) 'description': description,
        'location_name': locationName,
        if (latitude != null) 'latitude': latitude,
        if (longitude != null) 'longitude': longitude,
      };
}

const List<String> hazardCategories = [
  'Water Rising',
  'Heavy Rainfall',
  'Flooded Road',
  'Flooded Home',
  'Other',
];
