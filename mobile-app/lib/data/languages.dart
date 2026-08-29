/// The 9 languages listed in the Figma language-selection screen.
///
/// Important gap: the backend (`backend/app/models/translations.py`) only
/// actually generates alert text in 7 of these — English, Arabic, French,
/// Portuguese, Swahili, Amharic, Somali. **Yoruba and Hausa are in the
/// Figma design but not yet supported by the backend.** Picking one of
/// those two here won't get translated alert text yet; `isBackendSupported`
/// exists so the UI can be honest about that rather than silently falling
/// back to English with no explanation.
class AppLanguage {
  final String name;
  final bool isBackendSupported;
  const AppLanguage(this.name, {required this.isBackendSupported});
}

const List<AppLanguage> supportedLanguages = [
  AppLanguage('English', isBackendSupported: true),
  AppLanguage('French', isBackendSupported: true),
  AppLanguage('Swahili', isBackendSupported: true),
  AppLanguage('Somali', isBackendSupported: true),
  AppLanguage('Arabic', isBackendSupported: true),
  AppLanguage('Portuguese', isBackendSupported: true),
  AppLanguage('Yoruba', isBackendSupported: false),
  AppLanguage('Hausa', isBackendSupported: false),
  AppLanguage('Amharic', isBackendSupported: true),
];

/// Maps a language's display name to the locale code its UI chrome is
/// translated into (`lib/l10n/*.arb`) — the same 7 languages the backend
/// generates alert text in. Yoruba and Hausa have neither an alert
/// translation nor a UI-chrome one yet, so they fall back to English for
/// the app's own strings; that's a separate gap from the "alerts not
/// translated yet" tag those two already show in the language picker,
/// not the same thing.
const Map<String, String> languageLocaleCodes = {
  'English': 'en',
  'Swahili': 'sw',
  'Arabic': 'ar',
  'Somali': 'so',
  'French': 'fr',
  'Portuguese': 'pt',
  'Amharic': 'am',
};
