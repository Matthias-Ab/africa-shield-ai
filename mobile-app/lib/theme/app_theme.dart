import 'package:flutter/material.dart';

/// Extra bottom padding for the four bottom-tab screens (Home/Alerts/Maps/
/// Reports), so their scrollable content or last fixed element never sits
/// under `RootShell`'s floating pill nav bar (`Positioned(bottom: 16)`,
/// itself roughly 70px tall including its own padding — see
/// `root_shell.dart`'s `_PillNavBar`). Screens reached via `Navigator.push`
/// (Settings, Alert Detail, Safety Guidance, onboarding) render full-screen
/// above `RootShell`'s Stack and never show the pill nav, so they don't
/// need this.
const double kBottomNavClearance = 100.0;

/// Matches the Figma design (AfriShield AI App) — dark navy chrome, a cyan
/// brand ring on the logo, and the same red/amber/green risk system used
/// throughout: a bold color for text/icons, a soft pastel tint for card
/// backgrounds.
class AppColors {
  AppColors._();

  static const Color navy = Color(0xFF12314F);
  static const Color navySoft = Color(0xFF1B4165);
  static const Color cyan = Color(0xFF1DE9E9);

  static const Color riskHigh = Color(0xFFDC2626);
  static const Color riskHighBg = Color(0xFFFBE1E1);
  static const Color riskMedium = Color(0xFFE0A61B);
  static const Color riskMediumBg = Color(0xFFFBF1D2);
  static const Color riskLow = Color(0xFF1F9254);
  static const Color riskLowBg = Color(0xFFDFF2E6);

  static const Color background = Color(0xFFF3F7FA);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color ink = Color(0xFF13233A);
  static const Color inkSoft = Color(0xFF5B6B7C);
  static const Color divider = Color(0xFFE2E8EF);

  static Color forRiskLevel(String riskLevel) {
    switch (riskLevel.toLowerCase()) {
      case 'high':
        return riskHigh;
      case 'medium':
        return riskMedium;
      case 'low':
      default:
        return riskLow;
    }
  }

  static Color bgForRiskLevel(String riskLevel) {
    switch (riskLevel.toLowerCase()) {
      case 'high':
        return riskHighBg;
      case 'medium':
        return riskMediumBg;
      case 'low':
      default:
        return riskLowBg;
    }
  }
}

class AppTheme {
  AppTheme._();

  static ThemeData light() {
    final base = ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.navy,
        primary: AppColors.navy,
        secondary: AppColors.cyan,
        surface: AppColors.surface,
      ),
      scaffoldBackgroundColor: AppColors.background,
      fontFamily: 'Roboto',
    );
    return base.copyWith(
      appBarTheme: base.appBarTheme.copyWith(
        backgroundColor: AppColors.background,
        foregroundColor: AppColors.ink,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: const TextStyle(
          color: AppColors.ink,
          fontWeight: FontWeight.w800,
          fontSize: 18,
          letterSpacing: 0.2,
        ),
      ),
      cardTheme: const CardThemeData(
        elevation: 0,
        margin: EdgeInsets.zero,
        color: AppColors.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(16)),
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: AppColors.navy,
          foregroundColor: Colors.white,
          minimumSize: const Size.fromHeight(52),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          textStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.surface,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.divider),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.divider),
        ),
      ),
    );
  }
}
