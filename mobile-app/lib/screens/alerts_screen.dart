import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/region_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/alert_card.dart';
import 'alert_detail_screen.dart';

/// One card per monitored region, filterable by risk level — matches the
/// Figma "Flood Risk Alert" screen's All/High/Medium/Low tabs exactly.
/// This reads `GET /api/regions` (current risk state per region), not the
/// separate `GET /api/alerts` send-history log — the Figma cards are "here's
/// each place's current risk," not "here's every message ever sent."
class AlertsScreen extends StatefulWidget {
  const AlertsScreen({super.key});

  @override
  State<AlertsScreen> createState() => _AlertsScreenState();
}

class _AlertsScreenState extends State<AlertsScreen> {
  String _filter = 'All';

  static const _filters = ['All', 'High', 'Medium', 'Low'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('FLOOD RISK ALERT'),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: Center(
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _filter,
                  items: _filters
                      .map((f) => DropdownMenuItem(value: f, child: Text(f.toUpperCase())))
                      .toList(),
                  onChanged: (v) => setState(() => _filter = v ?? 'All'),
                ),
              ),
            ),
          ),
        ],
      ),
      body: Consumer<RegionProvider>(
        builder: (context, provider, _) {
          if (provider.status == LoadStatus.loading || provider.status == LoadStatus.initial) {
            return const Center(child: CircularProgressIndicator());
          }

          final regions = provider.regions.where((r) {
            if (_filter == 'All') return true;
            return r.riskLevel.toLowerCase() == _filter.toLowerCase();
          }).toList();

          if (regions.isEmpty) {
            return const Center(
              child: Text('No regions at this risk level right now.', style: TextStyle(color: AppColors.inkSoft)),
            );
          }

          return RefreshIndicator(
            onRefresh: provider.load,
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: regions.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final region = regions[index];
                return AlertCard(
                  region: region,
                  onTap: () => Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => AlertDetailScreen(locationName: region.locationName),
                    ),
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
