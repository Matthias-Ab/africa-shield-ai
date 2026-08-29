import '../data/countries.dart';
import '../models/region.dart';
import 'onboarding_provider.dart';
import 'settings_provider.dart';

/// Picks which region's data represents "mine": an explicit choice from
/// Settings, otherwise the first region matching the onboarding country,
/// otherwise just the first monitored region with `isRealMatch: false` so
/// the caller can show a "not your area yet" notice — never silently
/// invents numbers for somewhere that isn't monitored. `null` if no
/// regions have loaded yet.
///
/// Shared by `HomeScreen` (the region shown on the dashboard) and
/// `AlertChannelsScreen` (which region to register a push token for) —
/// previously duplicated only in `HomeScreen`.
({Region region, bool isRealMatch})? pickMyRegion({
  required List<Region> regions,
  required SettingsProvider settings,
  required OnboardingProvider onboarding,
}) {
  if (regions.isEmpty) return null;
  if (settings.selectedRegion != null) {
    final match = regions.where((r) => r.locationName == settings.selectedRegion);
    if (match.isNotEmpty) return (region: match.first, isRealMatch: true);
  }
  if (onboarding.country != null) {
    final countryName = africanCountries
        .firstWhere(
          (c) => c.iso3 == onboarding.country,
          orElse: () => Country(onboarding.country!, onboarding.country!),
        )
        .name;
    final match = regions.where((r) => r.country == countryName);
    if (match.isNotEmpty) return (region: match.first, isRealMatch: true);
  }
  return (region: regions.first, isRealMatch: false);
}
