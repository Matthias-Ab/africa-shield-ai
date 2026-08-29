import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

import '../../theme/app_theme.dart';
import '../../widgets/afrishield_logo.dart';
import 'language_screen.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const AfriShieldLogo(size: 48),
                  TextButton(
                    onPressed: () => _goToLanguage(context),
                    style: TextButton.styleFrom(
                      backgroundColor: AppColors.navy,
                      foregroundColor: Colors.white,
                      shape: const StadiumBorder(),
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                    ),
                    child: Text(l10n.skip),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Text(
                    l10n.welcomeHeadline,
                    textAlign: TextAlign.center,
                    style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 18),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Expanded(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    color: const Color(0xFF9AD1E0),
                    alignment: Alignment.center,
                    child: Text(
                      l10n.welcomeMapPlaceholder,
                      textAlign: TextAlign.center,
                      style: const TextStyle(color: Colors.white70),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Text(
                    l10n.welcomeIntro,
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
              const SizedBox(height: 12),
              _FeatureRow(
                icon: Icons.notifications_active_outlined,
                iconColor: AppColors.riskLow,
                title: l10n.featureEarlyWarningsTitle,
                subtitle: l10n.featureEarlyWarningsSubtitle,
              ),
              const SizedBox(height: 8),
              _FeatureRow(
                icon: Icons.shield_outlined,
                iconColor: AppColors.riskMedium,
                title: l10n.featureStayPreparedTitle,
                subtitle: l10n.featureStayPreparedSubtitle,
              ),
              const SizedBox(height: 8),
              _FeatureRow(
                icon: Icons.signal_cellular_alt,
                iconColor: AppColors.riskHigh,
                title: l10n.featureStayAlertTitle,
                subtitle: l10n.featureStayAlertSubtitle,
              ),
              const SizedBox(height: 16),
              FilledButton(
                onPressed: () => _goToLanguage(context),
                child: Text(l10n.getStarted),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _goToLanguage(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => const LanguageScreen()),
    );
  }
}

class _FeatureRow extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String title;
  final String subtitle;

  const _FeatureRow({
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            Icon(icon, color: iconColor),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: TextStyle(fontWeight: FontWeight.w800, color: iconColor)),
                  Text(subtitle, style: const TextStyle(color: AppColors.inkSoft, fontSize: 13)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
