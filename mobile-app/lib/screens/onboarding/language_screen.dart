import 'package:flutter/material.dart';
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
    return Scaffold(
      appBar: AppBar(title: const Text('🌐  LANGUAGE')),
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
                    const Text('Choose Your Language!',
                        style: TextStyle(fontWeight: FontWeight.w800, fontSize: 20)),
                    const SizedBox(height: 4),
                    const Text("Select the language you'd like to receive alerts in.",
                        style: TextStyle(color: AppColors.inkSoft)),
                    const SizedBox(height: 12),
                    ...supportedLanguages.map(
                      (lang) => RadioListTile<String>(
                        contentPadding: EdgeInsets.zero,
                        title: Row(
                          children: [
                            Text(lang.name, style: const TextStyle(fontWeight: FontWeight.w600)),
                            if (!lang.isBackendSupported) ...[
                              const SizedBox(width: 8),
                              const _ComingSoonTag(),
                            ],
                          ],
                        ),
                        value: lang.name,
                        groupValue: _selected,
                        onChanged: (value) => setState(() => _selected = value),
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'More local languages will be supported in future versions.',
                      style: TextStyle(color: AppColors.inkSoft, fontSize: 12),
                    ),
                  ],
                ),
              ),
            ),
            const Spacer(),
            FilledButton(
              onPressed: _selected == null ? null : _continue,
              child: Text(widget.fromSettings ? 'SAVE' : 'CONTINUE'),
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
  const _ComingSoonTag();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: AppColors.riskMediumBg,
        borderRadius: BorderRadius.circular(999),
      ),
      child: const Text(
        'alerts not translated yet',
        style: TextStyle(fontSize: 10, color: AppColors.riskMedium, fontWeight: FontWeight.w700),
      ),
    );
  }
}
