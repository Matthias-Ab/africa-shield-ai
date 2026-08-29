import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
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
    final l10n = AppLocalizations.of(context)!;
    final when = lastUpdated == null
        ? l10n.unknownTime
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
              l10n.showingSavedData(when),
              style: const TextStyle(fontSize: 12, color: AppColors.inkSoft),
            ),
          ),
        ],
      ),
    );
  }
}
