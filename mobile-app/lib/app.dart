import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';

import 'providers/accessibility_provider.dart';
import 'providers/onboarding_provider.dart';
import 'providers/region_provider.dart';
import 'providers/settings_provider.dart';
import 'screens/onboarding/splash_screen.dart';
import 'theme/app_theme.dart';

/// Locale codes for the same 7 languages the backend generates alerts in.
/// Only wired up as *supported* locales so far (enables RTL for Arabic,
/// etc.) — the UI's own strings aren't translated yet; that's real
/// follow-up work, not scaffolding.
const supportedLocales = [
  Locale('en'),
  Locale('sw'),
  Locale('ar'),
  Locale('so'),
  Locale('fr'),
  Locale('pt'),
  Locale('am'),
];

class AfriShieldApp extends StatelessWidget {
  const AfriShieldApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => RegionProvider()),
        ChangeNotifierProvider(create: (_) => SettingsProvider()..load()),
        ChangeNotifierProvider(create: (_) => OnboardingProvider()..load()),
        ChangeNotifierProvider(create: (_) => AccessibilityProvider()..load()),
      ],
      child: Consumer<AccessibilityProvider>(
        builder: (context, a11y, _) {
          return MaterialApp(
            title: 'AfriShield',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.light(),
            localizationsDelegates: const [
              GlobalMaterialLocalizations.delegate,
              GlobalWidgetsLocalizations.delegate,
              GlobalCupertinoLocalizations.delegate,
            ],
            supportedLocales: supportedLocales,
            builder: (context, child) {
              // Real accessibility settings applied app-wide, not just on
              // the screen where they're set — see AccessibilityProvider.
              return MediaQuery(
                data: MediaQuery.of(context).copyWith(
                  textScaler: TextScaler.linear(a11y.textScale),
                  highContrast: a11y.highContrast,
                ),
                child: child!,
              );
            },
            home: const SplashScreen(),
          );
        },
      ),
    );
  }
}
