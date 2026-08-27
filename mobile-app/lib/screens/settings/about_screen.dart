import 'package:flutter/material.dart';

import '../../theme/app_theme.dart';
import '../../widgets/afrishield_logo.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('ABOUT')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Center(child: AfriShieldLogo(size: 88)),
          const SizedBox(height: 12),
          const Center(
            child: Text('AfriShield', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 22)),
          ),
          const Center(
            child: Text('Know the Risk. Act Early. Stay Safe.',
                style: TextStyle(color: AppColors.inkSoft)),
          ),
          const SizedBox(height: 20),
          const Card(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Text(
                'AfriShield helps communities receive timely, plain-language '
                'warnings about floods that may affect them — in their own '
                'language, over SMS, USSD, voice, or this app, whichever '
                'actually reaches them.',
              ),
            ),
          ),
          const SizedBox(height: 16),
          const Text('Version 1.0.0', textAlign: TextAlign.center, style: TextStyle(color: AppColors.inkSoft)),
          const Text('© AfriShield AI 2026', textAlign: TextAlign.center, style: TextStyle(color: AppColors.inkSoft)),
        ],
      ),
    );
  }
}
