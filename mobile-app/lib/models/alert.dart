/// Mirrors one entry from GET /api/alerts. `trigger` distinguishes a
/// person-sent alert from one the backend fired on its own when a sensor
/// crossed into "high" risk — see docs/architecture.md's "Automatic
/// threshold alerts" section.
class AlertEvent {
  final String locationName;
  final String riskLevel;
  final String messageSent;
  final String channel;
  final int recipients;
  final DateTime timestamp;
  final String? trigger;

  const AlertEvent({
    required this.locationName,
    required this.riskLevel,
    required this.messageSent,
    required this.channel,
    required this.recipients,
    required this.timestamp,
    this.trigger,
  });

  bool get isAutomatic => trigger == 'automatic';

  factory AlertEvent.fromJson(Map<String, dynamic> json) {
    return AlertEvent(
      locationName: json['location_name'] as String,
      riskLevel: json['risk_level'] as String,
      messageSent: json['message_sent'] as String,
      channel: json['channel'] as String,
      recipients: (json['recipients'] as num).toInt(),
      timestamp: DateTime.parse(json['timestamp'] as String),
      trigger: json['trigger'] as String?,
    );
  }
}
