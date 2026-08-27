import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

/// Small colored pill showing a risk level ("low" / "medium" / "high").
/// Used everywhere a region's risk needs to be scannable at a glance —
/// placeholder styling only, expect this to be redone to match Figma.
class RiskBadge extends StatelessWidget {
  final String riskLevel;

  const RiskBadge({super.key, required this.riskLevel});

  @override
  Widget build(BuildContext context) {
    final color = AppColors.forRiskLevel(riskLevel);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: color.withValues(alpha: 0.4)),
      ),
      child: Text(
        riskLevel.toUpperCase(),
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w700,
          fontSize: 12,
          letterSpacing: 0.4,
        ),
      ),
    );
  }
}
