import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../theme/app_theme.dart';

/// Shown when the app is displaying cached data instead of a live backend
/// response — the visible half of "offline-first": never pretend cached
/// data is live.
class OfflineBanner extends StatelessWidget {
  final DateTime? lastUpdated;

  const OfflineBanner({super.key, this.lastUpdated});

  @override
  Widget build(BuildContext context) {
    final when = lastUpdated == null
        ? 'unknown time'
        : DateFormat('MMM d, HH:mm').format(lastUpdated!);
    return Container(
      width: double.infinity,
      color: AppColors.riskMedium.withValues(alpha: 0.12),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          const Icon(Icons.cloud_off, size: 16, color: AppColors.riskMedium),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              'Showing saved data from $when — no connection right now.',
              style: const TextStyle(fontSize: 12, color: AppColors.inkSoft),
            ),
          ),
        ],
      ),
    );
  }
}
