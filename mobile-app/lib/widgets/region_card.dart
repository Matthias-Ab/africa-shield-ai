import 'package:flutter/material.dart';

import '../models/region.dart';
import '../theme/app_theme.dart';
import 'risk_badge.dart';

/// One row in the region list — name, country, current risk. Placeholder
/// layout; the real design comes from Figma.
class RegionCard extends StatelessWidget {
  final Region region;
  final VoidCallback? onTap;

  const RegionCard({super.key, required this.region, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      color: AppColors.surface,
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      region.locationName,
                      style: const TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 16,
                        color: AppColors.ink,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      region.country,
                      style: const TextStyle(
                        color: AppColors.inkSoft,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
              ),
              RiskBadge(riskLevel: region.riskLevel),
            ],
          ),
        ),
      ),
    );
  }
}
