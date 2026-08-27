import 'package:flutter/material.dart';

import '../widgets/afrishield_logo.dart';

/// Static safety content — matches the Figma "Safety Guidance" screen
/// exactly. No backend data involved; this is general DRR guidance, not
/// tied to a specific region's current risk.
class SafetyGuidanceScreen extends StatelessWidget {
  const SafetyGuidanceScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('SAFETY GUIDANCE')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Row(
                children: const [
                  AfriShieldLogo(size: 32),
                  SizedBox(width: 12),
                  Expanded(
                    child: Text('Prepare before flooding happens',
                        style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          const _GuidanceSection(
            title: 'Before a flood!',
            points: [
              'Keep important documents and essential items in a safe place.',
              'Know where you can move to higher ground.',
              'Keep your phone charged.',
            ],
          ),
          const SizedBox(height: 12),
          const _GuidanceSection(
            title: 'During a flood!',
            points: [
              'Move to a safe location.',
              'Avoid walking or driving through floodwater.',
              'Follow instructions from local authorities.',
            ],
          ),
          const SizedBox(height: 12),
          const _GuidanceSection(
            title: 'After a flood!',
            points: [
              'Avoid contaminated water.',
              'Report damaged infrastructure.',
              'Continue monitoring official updates.',
            ],
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
