import 'package:flutter/material.dart';

import '../../theme/app_theme.dart';
import '../../widgets/afrishield_logo.dart';
import 'language_screen.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
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
                    child: const Text('Skip'),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              const Card(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Text(
                    'Stay Informed! Stay Prepared!',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18),
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
                    child: const Text(
                      'Map illustration\n(placeholder)',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.white70),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Card(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Text(
                    'Africa Shield AI helps communities receive timely '
                    'warnings about disasters that may affect them.',
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
              const SizedBox(height: 12),
              const _FeatureRow(
                icon: Icons.notifications_active_outlined,
                iconColor: AppColors.riskLow,
                title: 'Early Warnings',
                subtitle: 'Know when danger is near.',
              ),
              const SizedBox(height: 8),
              const _FeatureRow(
                icon: Icons.shield_outlined,
                iconColor: AppColors.riskMedium,
                title: 'Stay Prepared',
                subtitle: 'Get clear actions to stay safe.',
              ),
              const SizedBox(height: 8),
              const _FeatureRow(
                icon: Icons.signal_cellular_alt,
                iconColor: AppColors.riskHigh,
                title: 'Stay Alert',
                subtitle: 'Receive warnings on channels that work.',
              ),
              const SizedBox(height: 16),
              FilledButton(
                onPressed: () => _goToLanguage(context),
                child: const Text('GET STARTED'),
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
