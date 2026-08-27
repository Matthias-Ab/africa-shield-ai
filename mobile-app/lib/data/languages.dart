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
