import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:provider/provider.dart';

import '../providers/onboarding_provider.dart';
import '../theme/app_theme.dart';
import 'onboarding/country_screen.dart';
import 'onboarding/language_screen.dart';
import 'settings/about_screen.dart';
import 'settings/accessibility_screen.dart';
import 'settings/alert_channels_screen.dart';

/// Matches the Figma "Settings" screen: a stack of list rows, each with an
/// icon, title, current-value subtitle, and a chevron into its own screen.
class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final onboarding = context.watch<OnboardingProvider>();
    final l10n = AppLocalizations.of(context)!;

    return Scaffold(
      appBar: AppBar(title: Text(l10n.settingsTitle)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _SettingsTile(
            icon: Icons.location_on_outlined,
            title: l10n.locationTile,
            subtitle: onboarding.displayLocation,
            onTap: () => Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const CountryScreen(fromSettings: true)),
            ),
          ),
          _SettingsTile(
            icon: Icons.warning_amber_outlined,
            title: l10n.alertPreferenceTile,
            subtitle: l10n.manageYourWarnings,
            onTap: () => Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const AlertChannelsScreen()),
            ),
          ),
          _SettingsTile(
            icon: Icons.public,
            title: l10n.languageTile,
            subtitle: onboarding.language,
            onTap: () => Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const LanguageScreen(fromSettings: true)),
            ),
          ),
          _SettingsTile(
            icon: Icons.notifications_none,
            title: l10n.alertChannelsTile,
            subtitle: l10n.alertChannelsSubtitle,
            onTap: () => Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const AlertChannelsScreen()),
            ),
          ),
          _SettingsTile(
            icon: Icons.accessibility_new,
            title: l10n.accessibilityTile,
            subtitle: l10n.accessibilitySubtitle,
            onTap: () => Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const AccessibilityScreen()),
            ),
          ),
          const SizedBox(height: 24),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  Text(l10n.followUsOn, style: const TextStyle(fontWeight: FontWeight.w700)),
                  const SizedBox(height: 10),
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.facebook),
                      SizedBox(width: 16),
                      Icon(Icons.alternate_email),
                      SizedBox(width: 16),
                      Icon(Icons.business_center_outlined),
                      SizedBox(width: 16),
                      Icon(Icons.camera_alt_outlined),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          Card(
            child: ListTile(
              title: Text(l10n.aboutTile, style: const TextStyle(fontWeight: FontWeight.w700)),
              subtitle: Text(l10n.aboutSubtitleWithVersion),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const AboutScreen()),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _SettingsTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _SettingsTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Card(
        child: ListTile(
          leading: Icon(icon, color: AppColors.navy),
          title: Text(title, style: const TextStyle(fontWeight: FontWeight.w700)),
          subtitle: Text(subtitle, style: const TextStyle(color: AppColors.inkSoft)),
          trailing: const Icon(Icons.chevron_right),
          onTap: onTap,
        ),
      ),
    );
  }
}
