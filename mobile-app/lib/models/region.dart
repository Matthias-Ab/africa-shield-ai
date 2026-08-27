/// Mirrors one entry from GET /api/regions — see docs/api-contract.md in
/// the repo root for the authoritative shape. Field names match the JSON
/// keys exactly (snake_case) so there's no silent renaming to keep in sync.
class Region {
  final String locationName;
  final String country;
  final double latitude;
  final double longitude;
  final double rainfallMm24h;
  final double riverLevelM;
  final String riskLevel;
  final double riskScore;
  final String alertMessageEn;
  final String alertMessageLocal;
  final String localLanguage;
  final int? populationEstimate;
  final String? mlRiskLevel;
  final double? mlRiskScore;

  const Region({
    required this.locationName,
    required this.country,
    required this.latitude,
    required this.longitude,
    required this.rainfallMm24h,
    required this.riverLevelM,
    required this.riskLevel,
    required this.riskScore,
    required this.alertMessageEn,
    required this.alertMessageLocal,
    required this.localLanguage,
    this.populationEstimate,
    this.mlRiskLevel,
    this.mlRiskScore,
  });

  factory Region.fromJson(Map<String, dynamic> json) {
    return Region(
      locationName: json['location_name'] as String,
      country: json['country'] as String,
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      rainfallMm24h: (json['rainfall_mm_24h'] as num).toDouble(),
      riverLevelM: (json['river_level_m'] as num).toDouble(),
      riskLevel: json['risk_level'] as String,
      riskScore: (json['risk_score'] as num).toDouble(),
      alertMessageEn: json['alert_message_en'] as String,
      alertMessageLocal: json['alert_message_local'] as String,
      localLanguage: json['local_language'] as String,
      populationEstimate: (json['population_estimate'] as num?)?.toInt(),
      mlRiskLevel: json['ml_risk_level'] as String?,
      mlRiskScore: (json['ml_risk_score'] as num?)?.toDouble(),
    );
  }

  Map<String, dynamic> toJson() => {
        'location_name': locationName,
        'country': country,
        'latitude': latitude,
        'longitude': longitude,
        'rainfall_mm_24h': rainfallMm24h,
        'river_level_m': riverLevelM,
        'risk_level': riskLevel,
        'risk_score': riskScore,
        'alert_message_en': alertMessageEn,
        'alert_message_local': alertMessageLocal,
        'local_language': localLanguage,
        'population_estimate': populationEstimate,
        'ml_risk_level': mlRiskLevel,
        'ml_risk_score': mlRiskScore,
      };
}
