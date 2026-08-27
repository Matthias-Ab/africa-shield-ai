import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../theme/app_theme.dart';

/// Matches the Figma "Alert Channels" screen. **Only SMS is real today** —
/// it's the one channel the backend actually sends
/// (`POST /api/alerts/send`, tested against Africa's Talking). WhatsApp,
/// USSD, and in-app push are still switches with nothing behind them yet;
/// see `todo.md` for what's actually built versus planned.
class AlertChannelsScreen extends StatefulWidget {
  const AlertChannelsScreen({super.key});

  @override
  State<AlertChannelsScreen> createState() => _AlertChannelsScreenState();
}

class _AlertChannelsScreenState extends State<AlertChannelsScreen> {
  static const _mobileAppKey = 'channel_mobile_app_v1';
  static const _whatsappKey = 'channel_whatsapp_v1';
  static const _smsKey = 'channel_sms_v1';
  static const _ussdKey = 'channel_ussd_v1';

  bool _mobileApp = false;
  bool _whatsapp = false;
  bool _sms = true;
  bool _ussd = false;
  bool _loaded = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _mobileApp = prefs.getBool(_mobileAppKey) ?? false;
      _whatsapp = prefs.getBool(_whatsappKey) ?? false;
      _sms = prefs.getBool(_smsKey) ?? true;
      _ussd = prefs.getBool(_ussdKey) ?? false;
      _loaded = true;
    });
  }

  Future<void> _save() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_mobileAppKey, _mobileApp);
    await prefs.setBool(_whatsappKey, _whatsapp);
    await prefs.setBool(_smsKey, _sms);
    await prefs.setBool(_ussdKey, _ussd);
    if (!mounted) return;
    ScaffoldMessenger.of(context)
        .showSnackBar(const SnackBar(content: Text('Preferences saved.')));
  }

  @override
  Widget build(BuildContext context) {
    if (!_loaded) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    return Scaffold(
      appBar: AppBar(title: const Text('⚠️  ALERT CHANNELS')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text('How would you like to receive alerts?',
              style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18)),
          const Text("We'll use your preferred channels to deliver important warnings.",
              style: TextStyle(color: AppColors.inkSoft)),
          const SizedBox(height: 16),
          _ChannelTile(
            icon: Icons.phone_iphone,
            title: 'Mobile App',
            subtitle: 'Receive alerts directly in AfriShield.',
            enabled: false,
            note: 'Push notifications aren\'t wired up yet.',
            value: _mobileApp,
            onChanged: (v) => setState(() => _mobileApp = v),
          ),
          _ChannelTile(
            icon: Icons.chat_bubble_outline,
            title: 'WhatsApp',
            subtitle: 'Receive alerts through WhatsApp.',
            enabled: false,
            note: 'Not built on the backend yet.',
            value: _whatsapp,
            onChanged: (v) => setState(() => _whatsapp = v),
          ),
          _ChannelTile(
            icon: Icons.sms_outlined,
            title: 'SMS',
            subtitle: 'Receive alerts via SMS even without internet.',
            enabled: true,
            note: 'Real — sent via Africa\'s Talking.',
            value: _sms,
            onChanged: (v) => setState(() => _sms = v),
          ),
          _ChannelTile(
            icon: Icons.dialpad,
            title: 'USSD',
            subtitle: 'Receive alerts on basic feature phones.',
            enabled: false,
            note: 'Built, but not yet verified against a real carrier.',
            value: _ussd,
            onChanged: (v) => setState(() => _ussd = v),
          ),
          const SizedBox(height: 12),
          Card(
            color: AppColors.background,
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('No smartphone? No problem.', style: TextStyle(fontWeight: FontWeight.w800)),
                  SizedBox(height: 4),
                  Text(
                    'AfriShield is designed to make critical warnings accessible '
                    'beyond the app.',
                    style: TextStyle(color: AppColors.inkSoft),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),
          FilledButton(onPressed: _save, child: const Text('Save Preferences')),
        ],
      ),
    );
  }
}

class _ChannelTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final String note;
  final bool enabled;
  final bool value;
  final ValueChanged<bool> onChanged;

  const _ChannelTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.note,
    required this.enabled,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          child: Row(
            children: [
              Icon(icon, color: AppColors.navy),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: const TextStyle(fontWeight: FontWeight.w700)),
                    Text(subtitle, style: const TextStyle(color: AppColors.inkSoft, fontSize: 12.5)),
                    Text(note,
                        style: TextStyle(
                            color: enabled ? AppColors.riskLow : AppColors.riskMedium,
                            fontSize: 11,
                            fontWeight: FontWeight.w700)),
                  ],
                ),
              ),
              Switch(value: value, onChanged: enabled ? onChanged : null),
            ],
          ),
        ),
      ),
    );
  }
}
