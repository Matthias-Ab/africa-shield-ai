import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../data/countries.dart';
import '../../providers/onboarding_provider.dart';
import '../../theme/app_theme.dart';
import '../root_shell.dart';

/// State/Region, Local Government Area, and City/Community are plain text
/// fields, not dropdowns — the Figma design shows them as dropdowns, but
/// there's no real administrative-boundary dataset for all 54 countries to
/// populate them from (only Nigeria's "LGA" terminology was shown in the
/// mock). Faking that data for every country would be worse than a plain
/// text field; wire up dropdowns once a real geo dataset is chosen.
class LocationSetupScreen extends StatefulWidget {
  final Country country;
  final bool fromSettings;

  const LocationSetupScreen({super.key, required this.country, this.fromSettings = false});

  @override
  State<LocationSetupScreen> createState() => _LocationSetupScreenState();
}

class _LocationSetupScreenState extends State<LocationSetupScreen> {
  late final _stateController = TextEditingController(
      text: context.read<OnboardingProvider>().stateRegion ?? '');
  late final _lgaController =
      TextEditingController(text: context.read<OnboardingProvider>().lga ?? '');
  late final _cityController =
      TextEditingController(text: context.read<OnboardingProvider>().city ?? '');
  bool _rememberLocation = false;

  @override
  void dispose() {
    _stateController.dispose();
    _lgaController.dispose();
    _cityController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('📍  LOCATION')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: ListView(
          children: [
            const Text('Where are you located?',
                style: TextStyle(fontWeight: FontWeight.w800, fontSize: 20)),
            const SizedBox(height: 4),
            const Text("We'll use your location to provide relevant disaster alerts.",
                style: TextStyle(color: AppColors.inkSoft)),
            const SizedBox(height: 20),
            const _FieldLabel('Country *'),
            TextField(
              readOnly: true,
              controller: TextEditingController(text: widget.country.name),
            ),
            const SizedBox(height: 16),
            const _FieldLabel('State / Region'),
            TextField(
              controller: _stateController,
              decoration: const InputDecoration(hintText: 'Enter your state / region'),
            ),
            const SizedBox(height: 16),
            const _FieldLabel('Local Government Area'),
            TextField(
              controller: _lgaController,
              decoration: const InputDecoration(hintText: 'Enter your local government area'),
            ),
            const SizedBox(height: 16),
            const _FieldLabel('City / Community'),
            TextField(
              controller: _cityController,
              decoration: const InputDecoration(hintText: 'Enter your city / community'),
            ),
            const SizedBox(height: 20),
            const Row(
              children: [
                Expanded(child: Divider()),
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 12),
                  child: Text('OR', style: TextStyle(fontWeight: FontWeight.w700)),
                ),
                Expanded(child: Divider()),
              ],
            ),
            const SizedBox(height: 16),
            OutlinedButton.icon(
              onPressed: () => ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('GPS location detection is coming in a later build.')),
              ),
              icon: const Icon(Icons.my_location),
              label: const Text('Use my current location'),
            ),
            const SizedBox(height: 8),
            CheckboxListTile(
              contentPadding: EdgeInsets.zero,
              controlAffinity: ListTileControlAffinity.leading,
              value: _rememberLocation,
              onChanged: (v) => setState(() => _rememberLocation = v ?? false),
              title: const Text('Remember last used location'),
            ),
            const Text(
              'Your location is used to provide relevant alerts.',
              style: TextStyle(color: AppColors.inkSoft, fontSize: 12),
            ),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: _continue,
              child: const Text('CONTINUE'),
            ),
          ],
        ),
      ),
    );
  }

  void _continue() async {
    await context.read<OnboardingProvider>().completeLocation(
          country: widget.country.iso3,
          stateRegion: _stateController.text.trim().isEmpty ? null : _stateController.text.trim(),
          lga: _lgaController.text.trim().isEmpty ? null : _lgaController.text.trim(),
          city: _cityController.text.trim().isEmpty ? null : _cityController.text.trim(),
        );
    if (!mounted) return;
    if (widget.fromSettings) {
      Navigator.of(context)
        ..pop()
        ..pop();
      return;
    }
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const RootShell()),
      (route) => false,
    );
  }
}

class _FieldLabel extends StatelessWidget {
  final String text;
  const _FieldLabel(this.text);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Text(text, style: const TextStyle(fontWeight: FontWeight.w700)),
    );
  }
}
