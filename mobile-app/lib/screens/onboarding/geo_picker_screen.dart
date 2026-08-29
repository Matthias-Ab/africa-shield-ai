import 'package:flutter/material.dart';

import '../../theme/app_theme.dart';

/// Generic search-and-pick screen for a flat list of strings — used for
/// both the State/Region and City/Community pickers in
/// `LocationSetupScreen`, mirroring `CountryScreen`'s exact search+list UX
/// for consistency. Returns the picked string via `Navigator.pop`, or
/// `null` if the user backs out without picking.
class GeoPickerScreen extends StatefulWidget {
  final String title;
  final String searchHint;
  final List<String> items;

  const GeoPickerScreen({
    super.key,
    required this.title,
    required this.searchHint,
    required this.items,
  });

  @override
  State<GeoPickerScreen> createState() => _GeoPickerScreenState();
}

class _GeoPickerScreenState extends State<GeoPickerScreen> {
  String _query = '';

  @override
  Widget build(BuildContext context) {
    final results = widget.items.where((i) => i.toLowerCase().contains(_query.toLowerCase())).toList();

    return Scaffold(
      appBar: AppBar(title: Text(widget.title)),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
            child: TextField(
              autofocus: true,
              decoration: InputDecoration(
                hintText: widget.searchHint,
                prefixIcon: const Icon(Icons.search),
              ),
              onChanged: (v) => setState(() => _query = v),
            ),
          ),
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              itemCount: results.length,
              separatorBuilder: (_, __) => const Divider(height: 1, color: AppColors.divider),
              itemBuilder: (context, index) {
                final item = results[index];
                return ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: Text(item),
                  onTap: () => Navigator.of(context).pop(item),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
