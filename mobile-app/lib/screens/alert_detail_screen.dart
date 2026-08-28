import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
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
  final _tts = FlutterTts();
  bool _speaking = false;

  @override
  void dispose() {
    _tts.stop();
    super.dispose();
  }

  Future<void> _readAloud(String message, List<String> steps, String whatYouShouldDo) async {
    if (_speaking) {
      await _tts.stop();
      setState(() => _speaking = false);
      return;
    }
    setState(() => _speaking = true);
    final text = '$message. $whatYouShouldDo: ${steps.join(". ")}.';
    await _tts.speak(text);
    _tts.setCompletionHandler(() {
      if (mounted) setState(() => _speaking = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    final voiceEnabled = context.watch<AccessibilityProvider>().voiceAlertsEnabled;
    final l10n = AppLocalizations.of(context)!;
    final steps = [
      l10n.stepMoveToHigherGround,
      l10n.stepAvoidRivers,
      l10n.stepKeepPhoneCharged,
      l10n.stepFollowAuthorities,
    ];

    return Consumer<RegionProvider>(
      builder: (context, provider, _) {
        final region = provider.regionByName(widget.locationName);
        if (region == null) {
          return Scaffold(body: Center(child: Text(l10n.alertNotFound)));
        }

        final color = AppColors.forRiskLevel(region.riskLevel);
        final bg = AppColors.bgForRiskLevel(region.riskLevel);

        return Scaffold(
          appBar: AppBar(
            title: Text(l10n.floodAlertAppBarTitle),
            foregroundColor: color,
            titleTextStyle: TextStyle(color: color, fontWeight: FontWeight.w800, fontSize: 18),
            actions: [
              if (voiceEnabled)
                IconButton(
                  tooltip: _speaking ? l10n.stopTooltip : l10n.readAloudTooltip,
                  icon: Icon(_speaking ? Icons.stop_circle_outlined : Icons.volume_up_outlined, color: color),
                  onPressed: () => _readAloud(region.alertMessageEn, steps, l10n.whatYouShouldDo),
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
                        l10n.floodRiskSuffix(region.riskLevel.toUpperCase()),
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
                          _Stat(label: l10n.statRainfall, sub: l10n.statLast24Hours, value: '${region.rainfallMm24h.toStringAsFixed(0)} mm'),
                          _Stat(label: l10n.statRiverLevel, sub: l10n.statCurrent, value: '${region.riverLevelM.toStringAsFixed(1)} m'),
                          _Stat(label: l10n.statRiskScore, sub: l10n.statCurrent, value: region.riskScore.toStringAsFixed(2)),
                        ],
                      ),
                      const SizedBox(height: 12),
                      const Divider(),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(l10n.yourCurrentLocation, style: const TextStyle(color: AppColors.inkSoft, fontSize: 12.5)),
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
                            l10n.shareAlertTemplate(
                              region.riskLevel.toUpperCase(),
                              region.locationName,
                              region.alertMessageEn,
                            ),
                          ),
                          child: Text(l10n.shareAlert),
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
                      Text(l10n.whatYouShouldDo,
                          style: TextStyle(color: color, fontWeight: FontWeight.w800, fontSize: 16)),
                      const SizedBox(height: 8),
                      for (var i = 0; i < steps.length; i++)
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
                              Expanded(child: Text(steps[i])),
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
                    title: Text(l10n.emergencyDialogTitle),
                    content: Text(l10n.emergencyDialogBody),
                    actions: [
                      TextButton(onPressed: () => Navigator.pop(context), child: Text(l10n.ok)),
                    ],
                  ),
                ),
                child: Text(l10n.callEmergencyLine),
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
