import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:provider/provider.dart';

import '../../providers/onboarding_provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/afrishield_logo.dart';
import '../root_shell.dart';
import 'welcome_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _proceed();
  }

  Future<void> _proceed() async {
    final onboarding = context.read<OnboardingProvider>();
    // Make sure the persisted flag is actually loaded before deciding —
    // don't just hope the app-level ..load() finished in time.
    final delay = Future.delayed(const Duration(milliseconds: 1200));
    await Future.wait([onboarding.load(), delay]);
    if (!mounted) return;
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (_) => onboarding.isComplete ? const RootShell() : const WelcomeScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const AfriShieldLogo(size: 140),
            const SizedBox(height: 20),
            Text(
              l10n.appName,
              style: const TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.w800,
                color: AppColors.ink,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              l10n.tagline,
              style: const TextStyle(fontSize: 14, color: AppColors.inkSoft),
            ),
          ],
        ),
      ),
    );
  }
}
