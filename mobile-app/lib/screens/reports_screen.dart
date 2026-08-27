import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/hazard_report.dart';
import '../providers/onboarding_provider.dart';
import '../theme/app_theme.dart';

/// Community hazard reporting — matches the Figma "Report a Hazard" screen.
/// **No backend endpoint exists for this yet** (see `HazardReport`'s
/// doc comment) — submitting confirms locally and nothing more. Wire this
/// up to a real `POST` once the backend has somewhere to send it.
class ReportsScreen extends StatefulWidget {
  const ReportsScreen({super.key});

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  String? _category;
  final _descriptionController = TextEditingController();

  @override
  void dispose() {
    _descriptionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final onboarding = context.watch<OnboardingProvider>();

    return Scaffold(
      appBar: AppBar(title: const Text('⚠️  REPORT A HAZARD')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text('What are you seeing?', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18)),
          const Text("Help us understand what's happening in your community.",
              style: TextStyle(color: AppColors.inkSoft)),
          const SizedBox(height: 16),
          ...hazardCategories.map(
            (c) => Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: _CategoryTile(
                label: c,
                selected: _category == c,
                onTap: () => setState(() => _category = c),
              ),
            ),
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Your Location:', style: TextStyle(fontWeight: FontWeight.w700)),
              Text(onboarding.displayLocation, style: const TextStyle(color: AppColors.inkSoft)),
            ],
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _descriptionController,
            maxLines: 4,
            decoration: const InputDecoration(hintText: "Describe what you're seeing..."),
          ),
          const SizedBox(height: 12),
          Align(
            alignment: Alignment.centerRight,
            child: OutlinedButton.icon(
              onPressed: () => ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Photo attachments are coming in a later build.')),
              ),
              icon: const Icon(Icons.camera_alt_outlined),
              label: const Text('ADD PHOTO'),
            ),
          ),
          const SizedBox(height: 20),
          FilledButton(
            onPressed: _category == null ? null : _submit,
            child: const Text('Submit Report'),
          ),
        ],
      ),
    );
  }

  void _submit() {
    // Local-only confirmation — see the file doc comment for why.
    final report = HazardReport(
      category: _category!,
      description: _descriptionController.text.trim().isEmpty ? null : _descriptionController.text.trim(),
      locationName: context.read<OnboardingProvider>().displayLocation,
      submittedAt: DateTime.now(),
    );
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Report recorded'),
        content: Text(
          'Thanks — "${report.category}" at ${report.locationName} has been '
          "noted on this device. This isn't sent to AfriShield's team yet; "
          "community reporting doesn't have a backend endpoint built for it "
          'so far.',
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              setState(() {
                _category = null;
                _descriptionController.clear();
              });
            },
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }
}

class _CategoryTile extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _CategoryTile({required this.label, required this.selected, required this.onTap});

  static const _icons = {
    'Water Rising': Icons.waves,
    'Heavy Rainfall': Icons.grain,
    'Flooded Road': Icons.warning_amber,
    'Flooded Home': Icons.house_outlined,
    'Other': Icons.report_gmailerrorred_outlined,
  };

  @override
  Widget build(BuildContext context) {
    return Material(
      color: selected ? AppColors.navy.withValues(alpha: 0.08) : AppColors.surface,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            border: Border.all(color: selected ? AppColors.navy : AppColors.divider),
            borderRadius: BorderRadius.circular(14),
          ),
          child: Row(
            children: [
              Icon(_icons[label] ?? Icons.help_outline, color: AppColors.navy),
              const SizedBox(width: 12),
              Text(label, style: const TextStyle(fontWeight: FontWeight.w700)),
              const Spacer(),
              if (selected) const Icon(Icons.check_circle, color: AppColors.navy, size: 18),
            ],
          ),
        ),
      ),
    );
  }
}
