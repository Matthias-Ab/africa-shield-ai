import 'package:flutter/material.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:provider/provider.dart';
import 'package:share_plus/share_plus.dart';

import '../providers/accessibility_provider.dart';
import '../providers/region_provider.dart';
import '../theme/app_theme.dart';

/// Matches the Figma "Alerts Details" screen: risk banner, the 3 headline
/// stats, location + timestamp, a share button, numbered "what you should
/// do" steps, and an emergency-call button. Also adds a real "Read Aloud"
/// button when Settings > Accessibility > Voice alerts is on — reads the
/// alert message and safety steps out loud via on-device text-to-speech,
/// for anyone who can't read the local script or is visually impaired.
class AlertDetailScreen extends StatefulWidget {
  final String locationName;

  const AlertDetailScreen({super.key, required this.locationName});

  @override
  State<AlertDetailScreen> createState() => _AlertDetailScreenState();
}

class _AlertDetailScreenState extends State<AlertDetailScreen> {
  static const _steps = [
    'Move to higher ground',
    'Avoid rivers and flooded roads',
    'Keep your phone charged',
    'Follow local authority instructions',
  ];

  final _tts = FlutterTts();
  bool _speaking = false;

  @override
  void dispose() {
    _tts.stop();
    super.dispose();
  }

  Future<void> _readAloud(String message) async {
    if (_speaking) {
      await _tts.stop();
      setState(() => _speaking = false);
      return;
    }
    setState(() => _speaking = true);
    final text = '$message. What you should do: ${_steps.join(". ")}.';
    await _tts.speak(text);
    _tts.setCompletionHandler(() {
      if (mounted) setState(() => _speaking = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    final voiceEnabled = context.watch<AccessibilityProvider>().voiceAlertsEnabled;

    return Consumer<RegionProvider>(
      builder: (context, provider, _) {
        final region = provider.regionByName(widget.locationName);
        if (region == null) {
          return const Scaffold(body: Center(child: Text('Alert not found.')));
        }

        final color = AppColors.forRiskLevel(region.riskLevel);
        final bg = AppColors.bgForRiskLevel(region.riskLevel);

        return Scaffold(
          appBar: AppBar(
            title: const Text('FLOOD ALERT'),
            foregroundColor: color,
            titleTextStyle: TextStyle(color: color, fontWeight: FontWeight.w800, fontSize: 18),
            actions: [
              if (voiceEnabled)
                IconButton(
                  tooltip: _speaking ? 'Stop' : 'Read aloud',
                  icon: Icon(_speaking ? Icons.stop_circle_outlined : Icons.volume_up_outlined, color: color),
                  onPressed: () => _readAloud(region.alertMessageEn),
                ),
            ],
          ),
          body: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Card(
                color: bg,
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '${region.riskLevel.toUpperCase()} FLOOD RISK',
                        style: TextStyle(color: color, fontWeight: FontWeight.w800, fontSize: 17),
                      ),
                      const SizedBox(height: 6),
                      Text(region.alertMessageEn),
                      const SizedBox(height: 12),
                      const Divider(),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          _Stat(label: 'Rainfall', sub: 'Last 24 hours', value: '${region.rainfallMm24h.toStringAsFixed(0)} mm'),
                          _Stat(label: 'River Level', sub: 'Current', value: '${region.riverLevelM.toStringAsFixed(1)} m'),
                          _Stat(label: 'Risk Score', sub: 'Current', value: region.riskScore.toStringAsFixed(2)),
                        ],
                      ),
                      const SizedBox(height: 12),
                      const Divider(),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Your Current Location', style: TextStyle(color: AppColors.inkSoft, fontSize: 12.5)),
                          Row(
                            children: [
                              const Icon(Icons.location_on, size: 14, color: AppColors.navy),
                              const SizedBox(width: 4),
                              Text('${region.locationName}, ${region.country}',
                                  style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12.5)),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Align(
                        alignment: Alignment.centerRight,
                        child: FilledButton(
                          style: FilledButton.styleFrom(backgroundColor: color),
                          onPressed: () => Share.share(
                            '${region.riskLevel.toUpperCase()} flood risk in ${region.locationName}: ${region.alertMessageEn}',
                          ),
                          child: const Text('SHARE ALERT'),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Card(
                color: bg,
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('What you should do',
                          style: TextStyle(color: color, fontWeight: FontWeight.w800, fontSize: 16)),
                      const SizedBox(height: 8),
                      for (var i = 0; i < _steps.length; i++)
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 6),
                          child: Row(
                            children: [
                              CircleAvatar(
                                radius: 13,
                                backgroundColor: color,
                                child: Text('${i + 1}', style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w700)),
                              ),
                              const SizedBox(width: 12),
                              Expanded(child: Text(_steps[i])),
                            ],
                          ),
                        ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              FilledButton(
                style: FilledButton.styleFrom(backgroundColor: color),
                onPressed: () => showDialog(
                  context: context,
                  builder: (_) => AlertDialog(
                    title: const Text('Emergency line not set up yet'),
                    content: const Text(
                      "AfriShield doesn't have a verified emergency number for "
                      "this country yet — showing the wrong one could send "
                      'someone to the wrong service. Use your local emergency '
                      'number directly for now.',
                    ),
                    actions: [
                      TextButton(onPressed: () => Navigator.pop(context), child: const Text('OK')),
                    ],
                  ),
                ),
                child: const Text('CALL EMERGENCY LINE'),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _Stat extends StatelessWidget {
  final String label;
  final String sub;
  final String value;

  const _Stat({required this.label, required this.sub, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12.5)),
        Text(value, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
        Text(sub, style: const TextStyle(color: AppColors.inkSoft, fontSize: 11)),
      ],
    );
  }
}
