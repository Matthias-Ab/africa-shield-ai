import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:provider/provider.dart';

import '../../providers/accessibility_provider.dart';
import '../../theme/app_theme.dart';

class AccessibilityScreen extends StatelessWidget {
  const AccessibilityScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final a11y = context.watch<AccessibilityProvider>();
    final l10n = AppLocalizations.of(context)!;

    return Scaffold(
      appBar: AppBar(title: Text(l10n.accessibilityAppBarTitle)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(l10n.textSize, style: const TextStyle(fontWeight: FontWeight.w800)),
                  Text(l10n.previewTextAtSize,
                      style: const TextStyle(color: AppColors.inkSoft, fontSize: 12)),
                  const SizedBox(height: 8),
                  Text(
                    l10n.previewSampleText,
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
              title: Text(l10n.voiceAlerts, style: const TextStyle(fontWeight: FontWeight.w700)),
              subtitle: Text(l10n.voiceAlertsSubtitle),
              value: a11y.voiceAlertsEnabled,
              onChanged: (v) => context.read<AccessibilityProvider>().setVoiceAlertsEnabled(v),
            ),
          ),
          const SizedBox(height: 12),
          Card(
            child: SwitchListTile(
              title: Text(l10n.highContrast, style: const TextStyle(fontWeight: FontWeight.w700)),
              subtitle: Text(l10n.highContrastSubtitle),
              value: a11y.highContrast,
              onChanged: (v) => context.read<AccessibilityProvider>().setHighContrast(v),
            ),
          ),
        ],
      ),
    );
  }
}
