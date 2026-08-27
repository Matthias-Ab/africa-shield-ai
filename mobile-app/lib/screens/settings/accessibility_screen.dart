import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/accessibility_provider.dart';
import '../../theme/app_theme.dart';

class AccessibilityScreen extends StatelessWidget {
  const AccessibilityScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final a11y = context.watch<AccessibilityProvider>();

    return Scaffold(
      appBar: AppBar(title: const Text('ACCESSIBILITY')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Text size', style: TextStyle(fontWeight: FontWeight.w800)),
                  const Text('Preview text at the size below.',
                      style: TextStyle(color: AppColors.inkSoft, fontSize: 12)),
                  const SizedBox(height: 8),
                  Text(
                    'Flood risk is HIGH. Move to higher ground.',
                    style: TextStyle(fontSize: 15 * a11y.textScale),
                  ),
                  Slider(
                    value: a11y.textScale,
                    min: 0.85,
                    max: 1.6,
                    divisions: 15,
                    label: '${(a11y.textScale * 100).round()}%',
                    onChanged: (v) => context.read<AccessibilityProvider>().setTextScale(v),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          Card(
            child: SwitchListTile(
              title: const Text('Voice alerts', style: TextStyle(fontWeight: FontWeight.w700)),
              subtitle: const Text(
                'Adds a "Read Aloud" button to alert details — for anyone who '
                "can't read the local script, or is visually impaired.",
              ),
              value: a11y.voiceAlertsEnabled,
              onChanged: (v) => context.read<AccessibilityProvider>().setVoiceAlertsEnabled(v),
            ),
          ),
          const SizedBox(height: 12),
          Card(
            child: SwitchListTile(
              title: const Text('High contrast', style: TextStyle(fontWeight: FontWeight.w700)),
              subtitle: const Text('Increases text and border contrast throughout the app.'),
              value: a11y.highContrast,
              onChanged: (v) => context.read<AccessibilityProvider>().setHighContrast(v),
            ),
          ),
        ],
      ),
    );
  }
}
