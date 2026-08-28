import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:provider/provider.dart';

import '../models/region.dart';
import '../providers/region_provider.dart';
import '../theme/app_theme.dart';
import 'alert_detail_screen.dart';

/// A real OSM map with every monitored region pinned, color-coded by risk —
/// matches the Figma "Flood Risk Map" screen (search bar, map, a bottom
/// card for whichever region is selected, "View Alert"). This is the one
/// screen with a genuinely 1:1 web-dashboard equivalent: `RiskMap.jsx` in
/// `frontend-web/` does the same thing with Leaflet.
class RiskMapScreen extends StatefulWidget {
  const RiskMapScreen({super.key});

  @override
  State<RiskMapScreen> createState() => _RiskMapScreenState();
}

class _RiskMapScreenState extends State<RiskMapScreen> {
  final _mapController = MapController();
  Region? _selected;
  String _query = '';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<RegionProvider>().load();
    });
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(title: Text(l10n.floodRiskMapTitle)),
      body: Consumer<RegionProvider>(
        builder: (context, provider, _) {
          if (provider.status == LoadStatus.loading || provider.status == LoadStatus.initial) {
            return const Center(child: CircularProgressIndicator());
          }

          final regions = provider.regions
              .where((r) => r.locationName.toLowerCase().contains(_query.toLowerCase()))
              .toList();
          final selected = _selected ?? (regions.isNotEmpty ? regions.first : null);

          return Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: TextField(
                  decoration: InputDecoration(
                    hintText: l10n.searchLocationHint,
                    prefixIcon: const Icon(Icons.search),
                  ),
                  onChanged: (v) => setState(() => _query = v),
                ),
              ),
              Expanded(
                child: FlutterMap(
                  mapController: _mapController,
                  options: MapOptions(
                    initialCenter: const LatLng(2, 20),
                    initialZoom: 3.2,
                  ),
                  children: [
                    TileLayer(
                      urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                      userAgentPackageName: 'com.afrishield.afrishield_mobile',
                    ),
                    MarkerLayer(
                      markers: regions
                          .map(
                            (r) => Marker(
                              point: LatLng(r.latitude, r.longitude),
                              child: GestureDetector(
                                onTap: () => setState(() => _selected = r),
                                child: Icon(
                                  Icons.location_on,
                                  color: AppColors.forRiskLevel(r.riskLevel),
                                  size: r == selected ? 40 : 30,
                                ),
                              ),
                            ),
                          )
                          .toList(),
                    ),
                  ],
                ),
              ),
              if (selected != null)
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Card(
                    color: AppColors.bgForRiskLevel(selected.riskLevel),
                    child: Padding(
                      padding: const EdgeInsets.all(14),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.location_on, size: 16, color: AppColors.navy),
                              const SizedBox(width: 4),
                              Text('${selected.locationName}, ${selected.country}',
                                  style: const TextStyle(fontWeight: FontWeight.w800)),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              _Stat(label: l10n.statRainfall, sub: l10n.statLast24Hours, value: '${selected.rainfallMm24h.toStringAsFixed(0)} mm'),
                              _Stat(label: l10n.statRiverLevel, sub: l10n.statCurrent, value: '${selected.riverLevelM.toStringAsFixed(1)} m'),
                              _Stat(label: l10n.statRiskScore, sub: l10n.statCurrent, value: selected.riskScore.toStringAsFixed(2)),
                            ],
                          ),
                          const SizedBox(height: 12),
                          FilledButton(
                            style: FilledButton.styleFrom(backgroundColor: AppColors.forRiskLevel(selected.riskLevel)),
                            onPressed: () => Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (_) => AlertDetailScreen(locationName: selected.locationName),
                              ),
                            ),
                            child: Text(l10n.viewAlertButton),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
            ],
          );
        },
      ),
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
