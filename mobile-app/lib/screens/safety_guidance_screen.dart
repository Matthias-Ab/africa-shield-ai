import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

import '../widgets/afrishield_logo.dart';

/// Static safety content — matches the Figma "Safety Guidance" screen
/// exactly. No backend data involved; this is general DRR guidance, not
/// tied to a specific region's current risk.
class SafetyGuidanceScreen extends StatelessWidget {
  const SafetyGuidanceScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(title: Text(l10n.safetyGuidanceTitle)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Row(
                children: [
                  const AfriShieldLogo(size: 32),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(l10n.prepareBeforeFlooding,
                        style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          _GuidanceSection(
            title: l10n.beforeAFlood,
            points: [l10n.beforeFlood1, l10n.beforeFlood2, l10n.beforeFlood3],
          ),
          const SizedBox(height: 12),
          _GuidanceSection(
            title: l10n.duringAFlood,
            points: [l10n.duringFlood1, l10n.duringFlood2, l10n.duringFlood3],
          ),
          const SizedBox(height: 12),
          _GuidanceSection(
            title: l10n.afterAFlood,
            points: [l10n.afterFlood1, l10n.afterFlood2, l10n.afterFlood3],
          ),
        ],
      ),
    );
  }
}

class _GuidanceSection extends StatelessWidget {
  final String title;
  final List<String> points;

  const _GuidanceSection({required this.title, required this.points});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 17)),
            const SizedBox(height: 8),
            for (final p in points)
              Padding(
                padding: const EdgeInsets.only(bottom: 6),
                child: Text(p, style: const TextStyle(height: 1.35)),
              ),
          ],
        ),
      ),
    );
  }
}
