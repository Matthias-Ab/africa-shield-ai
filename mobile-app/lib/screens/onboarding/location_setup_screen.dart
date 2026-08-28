import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:provider/provider.dart';

import '../../data/countries.dart';
import '../../providers/onboarding_provider.dart';
import '../../services/location_service.dart';
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
  final _locationService = LocationService();
  bool _locatingGps = false;
  double? _gpsLatitude;
  double? _gpsLongitude;

  @override
  void dispose() {
    _stateController.dispose();
    _lgaController.dispose();
    _cityController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(title: Text(l10n.locationAppBarTitle)),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: ListView(
          children: [
            Text(l10n.whereAreYouLocated,
                style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 20)),
            const SizedBox(height: 4),
            Text(l10n.locationIntro,
                style: const TextStyle(color: AppColors.inkSoft)),
            const SizedBox(height: 20),
            _FieldLabel(l10n.countryFieldLabel),
            TextField(
              readOnly: true,
              controller: TextEditingController(text: widget.country.name),
            ),
            const SizedBox(height: 16),
            _FieldLabel(l10n.stateFieldLabel),
            TextField(
              controller: _stateController,
              decoration: InputDecoration(hintText: l10n.stateFieldHint),
            ),
            const SizedBox(height: 16),
            _FieldLabel(l10n.lgaFieldLabel),
            TextField(
              controller: _lgaController,
              decoration: InputDecoration(hintText: l10n.lgaFieldHint),
            ),
            const SizedBox(height: 16),
            _FieldLabel(l10n.cityFieldLabel),
            TextField(
              controller: _cityController,
              decoration: InputDecoration(hintText: l10n.cityFieldHint),
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                const Expanded(child: Divider()),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  child: Text(l10n.orDivider, style: const TextStyle(fontWeight: FontWeight.w700)),
                ),
                const Expanded(child: Divider()),
              ],
            ),
            const SizedBox(height: 16),
            OutlinedButton.icon(
              onPressed: _locatingGps ? null : _useCurrentLocation,
              icon: _locatingGps
                  ? const SizedBox(
                      height: 16,
                      width: 16,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Icon(Icons.my_location),
              label: Text(l10n.useMyCurrentLocation),
            ),
            if (_gpsLatitude != null && _gpsLongitude != null) ...[
              const SizedBox(height: 8),
              Text(
                l10n.gpsCapturedNote(
                  _gpsLatitude!.toStringAsFixed(4),
                  _gpsLongitude!.toStringAsFixed(4),
                ),
                style: const TextStyle(color: AppColors.inkSoft, fontSize: 12),
              ),
            ],
            const SizedBox(height: 8),
            CheckboxListTile(
              contentPadding: EdgeInsets.zero,
              controlAffinity: ListTileControlAffinity.leading,
              value: _rememberLocation,
              onChanged: (v) => setState(() => _rememberLocation = v ?? false),
              title: Text(l10n.rememberLocation),
            ),
            Text(
              l10n.locationUsageNote,
              style: const TextStyle(color: AppColors.inkSoft, fontSize: 12),
            ),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: _continue,
              child: Text(l10n.continueButton),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _useCurrentLocation() async {
    setState(() => _locatingGps = true);
    try {
      final position = await _locationService.getCurrentPosition();
      if (!mounted) return;
      setState(() {
        _gpsLatitude = position.latitude;
        _gpsLongitude = position.longitude;
        _locatingGps = false;
      });
    } on LocationException catch (e) {
      if (!mounted) return;
      setState(() => _locatingGps = false);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message)));
    }
  }

  void _continue() async {
    await context.read<OnboardingProvider>().completeLocation(
          country: widget.country.iso3,
          stateRegion: _stateController.text.trim().isEmpty ? null : _stateController.text.trim(),
          lga: _lgaController.text.trim().isEmpty ? null : _lgaController.text.trim(),
          city: _cityController.text.trim().isEmpty ? null : _cityController.text.trim(),
          latitude: _gpsLatitude,
          longitude: _gpsLongitude,
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
