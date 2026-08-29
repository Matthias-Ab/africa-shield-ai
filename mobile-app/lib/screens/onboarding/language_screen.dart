import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:provider/provider.dart';

import '../../data/languages.dart';
import '../../providers/onboarding_provider.dart';
import '../../theme/app_theme.dart';
import 'country_screen.dart';

class LanguageScreen extends StatefulWidget {
  /// True when opened from Settings (just save + pop) rather than during
  /// onboarding (save + continue to country selection).
  final bool fromSettings;

  const LanguageScreen({super.key, this.fromSettings = false});

  @override
  State<LanguageScreen> createState() => _LanguageScreenState();
}

class _LanguageScreenState extends State<LanguageScreen> {
  String? _selected;

  @override
  void initState() {
    super.initState();
    _selected = context.read<OnboardingProvider>().language;
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(title: Text(l10n.languageAppBarTitle)),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(l10n.chooseYourLanguage,
                        style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 20)),
                    const SizedBox(height: 4),
                    Text(l10n.languageSubtitle,
                        style: const TextStyle(color: AppColors.inkSoft)),
                    const SizedBox(height: 12),
                    ...supportedLanguages.map(
                      (lang) => RadioListTile<String>(
                        contentPadding: EdgeInsets.zero,
                        title: Row(
                          children: [
                            Text(lang.name, style: const TextStyle(fontWeight: FontWeight.w600)),
                            if (!lang.isBackendSupported) ...[
                              const SizedBox(width: 8),
                              _ComingSoonTag(label: l10n.alertsNotTranslatedYet),
                            ],
                          ],
                        ),
                        value: lang.name,
                        groupValue: _selected,
                        onChanged: (value) => setState(() => _selected = value),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      l10n.moreLanguagesNote,
                      style: const TextStyle(color: AppColors.inkSoft, fontSize: 12),
                    ),
                  ],
                ),
              ),
            ),
            const Spacer(),
            FilledButton(
              onPressed: _selected == null ? null : _continue,
              child: Text(widget.fromSettings ? l10n.saveButton : l10n.continueButton),
            ),
          ],
        ),
      ),
    );
  }

  void _continue() async {
    await context.read<OnboardingProvider>().setLanguage(_selected!);
    if (!mounted) return;
    if (widget.fromSettings) {
      Navigator.of(context).pop();
      return;
    }
    Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => const CountryScreen()),
    );
  }
}

class _ComingSoonTag extends StatelessWidget {
  final String label;
  const _ComingSoonTag({required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: AppColors.riskMediumBg,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        label,
        style: const TextStyle(fontSize: 10, color: AppColors.riskMedium, fontWeight: FontWeight.w700),
      ),
    );
  }
}
