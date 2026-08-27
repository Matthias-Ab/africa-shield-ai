import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:provider/provider.dart';

import '../data/countries.dart';
import '../models/region.dart';
import '../providers/onboarding_provider.dart';
import '../providers/region_provider.dart';
import '../providers/settings_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/afrishield_logo.dart';
import '../widgets/offline_banner.dart';
import 'alert_detail_screen.dart';
import 'safety_guidance_screen.dart';
import 'settings_screen.dart';

/// The app's front door — one region's current risk, matching the Figma
/// "Home / High Risk" and "Home / Low Risk" mockups exactly (both states
/// use the same layout, just re-colored by `region.riskLevel`).
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<RegionProvider>().load();
    });
  }

  /// Picks which region's data to show: an explicit choice from Settings,
  /// otherwise the first region matching the onboarding country, otherwise
  /// just the first monitored region with a "not your area yet" notice —
  /// never silently invent numbers for somewhere that isn't monitored.
  ({Region region, bool isRealMatch}) _pickRegion(
    List<Region> regions,
    SettingsProvider settings,
    OnboardingProvider onboarding,
  ) {
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

  @override
  Widget build(BuildContext context) {
    return Consumer3<RegionProvider, SettingsProvider, OnboardingProvider>(
      builder: (context, regionProvider, settings, onboarding, _) {
        if (regionProvider.status == LoadStatus.loading ||
            regionProvider.status == LoadStatus.initial) {
          return const Scaffold(body: Center(child: CircularProgressIndicator()));
        }
        if (regionProvider.status == LoadStatus.error) {
          return Scaffold(
            body: Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.cloud_off, size: 40, color: AppColors.inkSoft),
                    const SizedBox(height: 12),
                    const Text("Can't reach AfriShield, and there's no saved data yet.",
                        textAlign: TextAlign.center),
                    const SizedBox(height: 16),
                    FilledButton(onPressed: regionProvider.load, child: const Text('Try again')),
                  ],
                ),
              ),
            ),
          );
        }

        final picked = _pickRegion(regionProvider.regions, settings, onboarding);
        final region = picked.region;
        final color = AppColors.forRiskLevel(region.riskLevel);
        final bg = AppColors.bgForRiskLevel(region.riskLevel);

        return Scaffold(
          body: SafeArea(
            child: RefreshIndicator(
              onRefresh: regionProvider.load,
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  if (regionProvider.status == LoadStatus.cachedData)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: OfflineBanner(lastUpdated: regionProvider.lastUpdated),
                    ),
                  if (!picked.isRealMatch)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: Card(
                        color: AppColors.riskMediumBg,
                        child: Padding(
                          padding: const EdgeInsets.all(12),
                          child: Text(
                            "AfriShield isn't monitoring your set location yet — "
                            'showing ${region.locationName} as sample data.',
                            style: const TextStyle(fontSize: 12.5, color: AppColors.inkSoft),
                          ),
                        ),
                      ),
                    ),
                  Row(
                    children: [
                      const AfriShieldLogo(size: 36),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          '${region.locationName.toUpperCase()}, ${region.country.toUpperCase()}',
                          style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15),
                        ),
                      ),
                      IconButton(
                        tooltip: 'Settings',
                        onPressed: () => Navigator.of(context).push(
                          MaterialPageRoute(builder: (_) => const SettingsScreen()),
                        ),
                        icon: const Icon(Icons.settings_outlined),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Text('CURRENT FLOOD RISK', style: TextStyle(fontWeight: FontWeight.w800)),
                  const SizedBox(height: 8),
                  Card(
                    color: bg,
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(Icons.water_drop_outlined, color: color),
                              const SizedBox(width: 8),
                              Text(
                                region.riskLevel.toUpperCase(),
                                style: TextStyle(color: color, fontWeight: FontWeight.w800, fontSize: 18),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Text(
                            region.riskLevel.toLowerCase() == 'high'
                                ? 'Your area is at high risk of flooding.'
                                : region.riskLevel.toLowerCase() == 'medium'
                                    ? 'Stay alert and monitor local updates.'
                                    : 'No immediate flood threat detected.',
                          ),
                          const SizedBox(height: 10),
                          const Divider(),
                          const SizedBox(height: 6),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              _Stat(label: 'Rainfall', sub: 'Last 24 hours', value: '${region.rainfallMm24h.toStringAsFixed(0)} mm'),
                              _Stat(label: 'River Level', sub: 'Current', value: '${region.riverLevelM.toStringAsFixed(1)} m'),
                              _Stat(label: 'Risk Score', sub: 'Current', value: region.riskScore.toStringAsFixed(2)),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: SizedBox(
                      height: 200,
                      child: IgnorePointer(
                        child: FlutterMap(
                          options: MapOptions(
                            initialCenter: LatLng(region.latitude, region.longitude),
                            initialZoom: 10,
                          ),
                          children: [
                            TileLayer(
                              urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                              userAgentPackageName: 'com.afrishield.afrishield_mobile',
                            ),
                            MarkerLayer(markers: [
                              Marker(
                                point: LatLng(region.latitude, region.longitude),
                                child: Icon(Icons.location_on, color: color, size: 34),
                              ),
                            ]),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Card(
                    color: bg,
                    child: Padding(
                      padding: const EdgeInsets.all(14),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  region.riskLevel.toLowerCase() == 'low' ? 'STAY PREPARED' : 'ACTION RECOMMENDED',
                                  style: TextStyle(color: color, fontWeight: FontWeight.w800, fontSize: 13),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  region.riskLevel.toLowerCase() == 'low'
                                      ? 'Continue monitoring local updates and weather conditions.'
                                      : region.alertMessageEn,
                                  style: const TextStyle(fontSize: 12.5),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 10),
                          FilledButton(
                            style: FilledButton.styleFrom(backgroundColor: color, minimumSize: const Size(0, 40)),
                            onPressed: () {},
                            child: const Text('SHARE ALERT'),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () => Navigator.of(context).push(
                            MaterialPageRoute(builder: (_) => const SafetyGuidanceScreen()),
                          ),
                          child: const Text('Safety Guidance'),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () => Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (_) => AlertDetailScreen(locationName: region.locationName),
                            ),
                          ),
                          child: const Text('View Full Alert'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}

class _Stat extends StatelessWidget {
  final String label;
  final String sub;
  final String value;

  const _Stat({required this.label, required this.sub, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12.5)),
        Text(value, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
        Text(sub, style: const TextStyle(color: AppColors.inkSoft, fontSize: 11)),
      ],
    );
  }
}
