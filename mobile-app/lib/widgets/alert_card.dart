import 'package:flutter/material.dart';

import '../models/region.dart';
import '../theme/app_theme.dart';

/// One colored card in the alert list — risk level, message, location,
/// timestamp, and a chevron to view detail. Matches the Figma "Flood Risk
/// Alert" list exactly: pastel background tinted by risk level, bold
/// risk-colored heading, dark chevron button in the same risk color.
class AlertCard extends StatelessWidget {
  final Region region;
  final VoidCallback? onTap;

  const AlertCard({super.key, required this.region, this.onTap});

  @override
  Widget build(BuildContext context) {
    final color = AppColors.forRiskLevel(region.riskLevel);
    final bg = AppColors.bgForRiskLevel(region.riskLevel);

    return Material(
      color: bg,
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(Icons.water_drop_outlined, color: color, size: 18),
                  const SizedBox(width: 6),
                  Text(
                    region.riskLevel.toUpperCase(),
                    style: TextStyle(color: color, fontWeight: FontWeight.w800, fontSize: 15),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                region.alertMessageEn,
                style: const TextStyle(color: AppColors.ink, fontSize: 15, height: 1.3),
              ),
              const SizedBox(height: 10),
              Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Expanded(
                    child: Row(
                      children: [
                        const Icon(Icons.location_on, size: 14, color: AppColors.navy),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            '${region.locationName}, ${region.country}',
                            style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12.5),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(color: color, shape: BoxShape.circle),
                    child: const Icon(Icons.chevron_right, color: Colors.white, size: 20),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
