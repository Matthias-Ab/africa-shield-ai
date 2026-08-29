import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

import '../../data/countries.dart';
import '../../theme/app_theme.dart';
import 'location_setup_screen.dart';

class CountryScreen extends StatefulWidget {
  final bool fromSettings;

  const CountryScreen({super.key, this.fromSettings = false});

  @override
  State<CountryScreen> createState() => _CountryScreenState();
}

class _CountryScreenState extends State<CountryScreen> {
  final _searchController = TextEditingController();
  String _query = '';

  @override
  Widget build(BuildContext context) {
    final results = africanCountries
        .where((c) => c.name.toLowerCase().contains(_query.toLowerCase()))
        .toList();

    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(title: Text(l10n.countryAppBarTitle)),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: l10n.searchCountryHint,
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
                final c = results[index];
                return ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: Text(c.name),
                  trailing: Text(c.iso3, style: const TextStyle(color: AppColors.inkSoft)),
                  onTap: () => Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => LocationSetupScreen(country: c, fromSettings: widget.fromSettings),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
