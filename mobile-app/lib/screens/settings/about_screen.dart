import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

import '../../theme/app_theme.dart';
import '../../widgets/afrishield_logo.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(title: Text(l10n.aboutAppBarTitle)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Center(child: AfriShieldLogo(size: 88)),
          const SizedBox(height: 12),
          Center(
            child: Text(l10n.appName, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 22)),
          ),
          Center(
            child: Text(l10n.tagline,
                style: const TextStyle(color: AppColors.inkSoft)),
          ),
          const SizedBox(height: 20),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Text(l10n.aboutBody),
            ),
          ),
          const SizedBox(height: 16),
          Text(l10n.versionLabel, textAlign: TextAlign.center, style: const TextStyle(color: AppColors.inkSoft)),
          Text(l10n.copyrightLabel, textAlign: TextAlign.center, style: const TextStyle(color: AppColors.inkSoft)),
        ],
      ),
    );
  }
}
