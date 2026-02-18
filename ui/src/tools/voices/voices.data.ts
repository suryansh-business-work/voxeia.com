/* ─── Shared voice catalogue used across the entire app ─────────── */

export type VoiceProvider = 'amazon' | 'google';

export interface VoiceEntry {
  /** Unique voice ID sent to Twilio / TTS engine */
  id: string;
  /** Human-readable name */
  name: string;
  /** Provider label */
  provider: VoiceProvider;
  /** Descriptive tags */
  tags: string[];
  /** Primary language codes */
  languages: string[];
  /** Gender label */
  gender: 'feminine' | 'masculine';
  /** BCP-47 language code for TwiML */
  languageCode: string;
}

/* ─── Amazon Polly (Neural) voices ────────────────────────────── */
export const AMAZON_VOICES: VoiceEntry[] = [
  // English (US)
  { id: 'Polly.Joanna-Neural', name: 'Joanna', provider: 'amazon', gender: 'feminine', tags: ['warm', 'conversational'], languages: ['english', 'us'], languageCode: 'en-US' },
  { id: 'Polly.Matthew-Neural', name: 'Matthew', provider: 'amazon', gender: 'masculine', tags: ['clear', 'professional'], languages: ['english', 'us'], languageCode: 'en-US' },
  { id: 'Polly.Ruth-Neural', name: 'Ruth', provider: 'amazon', gender: 'feminine', tags: ['young', 'friendly'], languages: ['english', 'us'], languageCode: 'en-US' },
  { id: 'Polly.Stephen-Neural', name: 'Stephen', provider: 'amazon', gender: 'masculine', tags: ['mature', 'confident'], languages: ['english', 'us'], languageCode: 'en-US' },
  { id: 'Polly.Danielle-Neural', name: 'Danielle', provider: 'amazon', gender: 'feminine', tags: ['composed', 'refined'], languages: ['english', 'us'], languageCode: 'en-US' },
  { id: 'Polly.Gregory-Neural', name: 'Gregory', provider: 'amazon', gender: 'masculine', tags: ['calm', 'natural'], languages: ['english', 'us'], languageCode: 'en-US' },
  // English (UK)
  { id: 'Polly.Amy-Neural', name: 'Amy', provider: 'amazon', gender: 'feminine', tags: ['clear', 'articulate'], languages: ['english', 'uk'], languageCode: 'en-GB' },
  { id: 'Polly.Brian-Neural', name: 'Brian', provider: 'amazon', gender: 'masculine', tags: ['authoritative', 'deep'], languages: ['english', 'uk'], languageCode: 'en-GB' },
  // English (Other)
  { id: 'Polly.Niamh-Neural', name: 'Niamh', provider: 'amazon', gender: 'feminine', tags: ['warm', 'natural'], languages: ['english', 'irish'], languageCode: 'en-IE' },
  { id: 'Polly.Aria-Neural', name: 'Aria', provider: 'amazon', gender: 'feminine', tags: ['expressive', 'modern'], languages: ['english', 'nz'], languageCode: 'en-NZ' },
  { id: 'Polly.Liam-Neural', name: 'Liam', provider: 'amazon', gender: 'masculine', tags: ['energetic', 'youthful'], languages: ['english', 'ca'], languageCode: 'en-AU' },
  // Hindi
  { id: 'Polly.Kajal-Neural', name: 'Kajal', provider: 'amazon', gender: 'feminine', tags: ['clear', 'professional'], languages: ['hindi'], languageCode: 'hi-IN' },
  // Spanish
  { id: 'Polly.Lupe-Neural', name: 'Lupe', provider: 'amazon', gender: 'feminine', tags: ['warm', 'expressive'], languages: ['spanish', 'us'], languageCode: 'es-US' },
  { id: 'Polly.Pedro-Neural', name: 'Pedro', provider: 'amazon', gender: 'masculine', tags: ['clear', 'friendly'], languages: ['spanish', 'us'], languageCode: 'es-US' },
  // French
  { id: 'Polly.Lea-Neural', name: 'Léa', provider: 'amazon', gender: 'feminine', tags: ['elegant', 'smooth'], languages: ['french'], languageCode: 'fr-FR' },
  { id: 'Polly.Remi-Neural', name: 'Rémi', provider: 'amazon', gender: 'masculine', tags: ['natural', 'warm'], languages: ['french'], languageCode: 'fr-FR' },
  // German
  { id: 'Polly.Vicki-Neural', name: 'Vicki', provider: 'amazon', gender: 'feminine', tags: ['clear', 'professional'], languages: ['german'], languageCode: 'de-DE' },
  { id: 'Polly.Daniel-Neural', name: 'Daniel', provider: 'amazon', gender: 'masculine', tags: ['authoritative', 'calm'], languages: ['german'], languageCode: 'de-DE' },
  // Japanese
  { id: 'Polly.Kazuha-Neural', name: 'Kazuha', provider: 'amazon', gender: 'feminine', tags: ['smooth', 'natural'], languages: ['japanese'], languageCode: 'ja-JP' },
  { id: 'Polly.Tomoko-Neural', name: 'Tomoko', provider: 'amazon', gender: 'feminine', tags: ['clear', 'formal'], languages: ['japanese'], languageCode: 'ja-JP' },
  // Portuguese
  { id: 'Polly.Camila-Neural', name: 'Camila', provider: 'amazon', gender: 'feminine', tags: ['warm', 'expressive'], languages: ['portuguese', 'br'], languageCode: 'pt-BR' },
  // Arabic
  { id: 'Polly.Hala-Neural', name: 'Hala', provider: 'amazon', gender: 'feminine', tags: ['clear', 'professional'], languages: ['arabic'], languageCode: 'ar-AE' },
  // Korean
  { id: 'Polly.Seoyeon-Neural', name: 'Seoyeon', provider: 'amazon', gender: 'feminine', tags: ['natural', 'warm'], languages: ['korean'], languageCode: 'ko-KR' },
  // Italian
  { id: 'Polly.Bianca-Neural', name: 'Bianca', provider: 'amazon', gender: 'feminine', tags: ['expressive', 'melodic'], languages: ['italian'], languageCode: 'it-IT' },
  { id: 'Polly.Adriano-Neural', name: 'Adriano', provider: 'amazon', gender: 'masculine', tags: ['deep', 'natural'], languages: ['italian'], languageCode: 'it-IT' },
];

/* ─── Google Cloud TTS (Neural2) voices ─────────────── */
export const GOOGLE_VOICES: VoiceEntry[] = [
  // English (US)
  { id: 'Google.en-US-Neural2-C', name: 'Ava', provider: 'google', gender: 'feminine', tags: ['natural', 'versatile'], languages: ['english', 'us'], languageCode: 'en-US' },
  { id: 'Google.en-US-Neural2-D', name: 'Andrew', provider: 'google', gender: 'masculine', tags: ['deep', 'professional'], languages: ['english', 'us'], languageCode: 'en-US' },
  { id: 'Google.en-US-Neural2-E', name: 'Luna', provider: 'google', gender: 'feminine', tags: ['warm', 'friendly'], languages: ['english', 'us'], languageCode: 'en-US' },
  { id: 'Google.en-US-Neural2-J', name: 'Marcus', provider: 'google', gender: 'masculine', tags: ['calm', 'conversational'], languages: ['english', 'us'], languageCode: 'en-US' },
  // English (UK)
  { id: 'Google.en-GB-Neural2-A', name: 'Olivia', provider: 'google', gender: 'feminine', tags: ['clear', 'british'], languages: ['english', 'uk'], languageCode: 'en-GB' },
  { id: 'Google.en-GB-Neural2-B', name: 'James', provider: 'google', gender: 'masculine', tags: ['authoritative', 'british'], languages: ['english', 'uk'], languageCode: 'en-GB' },
  // English (India)
  { id: 'Google.en-IN-Neural2-A', name: 'Priya', provider: 'google', gender: 'feminine', tags: ['warm', 'clear'], languages: ['english', 'indian'], languageCode: 'en-IN' },
  { id: 'Google.en-IN-Neural2-B', name: 'Raj', provider: 'google', gender: 'masculine', tags: ['professional', 'natural'], languages: ['english', 'indian'], languageCode: 'en-IN' },
  // English (Australia)
  { id: 'Google.en-AU-Neural2-A', name: 'Sophie', provider: 'google', gender: 'feminine', tags: ['friendly', 'natural'], languages: ['english', 'australian'], languageCode: 'en-AU' },
  { id: 'Google.en-AU-Neural2-B', name: 'Ethan', provider: 'google', gender: 'masculine', tags: ['casual', 'energetic'], languages: ['english', 'australian'], languageCode: 'en-AU' },
  // Hindi
  { id: 'Google.hi-IN-Neural2-A', name: 'Ananya', provider: 'google', gender: 'feminine', tags: ['expressive', 'clear'], languages: ['hindi'], languageCode: 'hi-IN' },
  { id: 'Google.hi-IN-Neural2-B', name: 'Vikram', provider: 'google', gender: 'masculine', tags: ['deep', 'authoritative'], languages: ['hindi'], languageCode: 'hi-IN' },
  { id: 'Google.hi-IN-Neural2-C', name: 'Meera', provider: 'google', gender: 'feminine', tags: ['warm', 'natural'], languages: ['hindi'], languageCode: 'hi-IN' },
  { id: 'Google.hi-IN-Neural2-D', name: 'Arjun', provider: 'google', gender: 'masculine', tags: ['calm', 'professional'], languages: ['hindi'], languageCode: 'hi-IN' },
  // Spanish
  { id: 'Google.es-US-Neural2-A', name: 'Isabella', provider: 'google', gender: 'feminine', tags: ['warm', 'expressive'], languages: ['spanish', 'us'], languageCode: 'es-US' },
  { id: 'Google.es-US-Neural2-B', name: 'Miguel', provider: 'google', gender: 'masculine', tags: ['clear', 'natural'], languages: ['spanish', 'us'], languageCode: 'es-US' },
  { id: 'Google.es-ES-Neural2-A', name: 'Carmen', provider: 'google', gender: 'feminine', tags: ['elegant', 'clear'], languages: ['spanish', 'es'], languageCode: 'es-ES' },
  // French
  { id: 'Google.fr-FR-Neural2-A', name: 'Camille', provider: 'google', gender: 'feminine', tags: ['smooth', 'elegant'], languages: ['french'], languageCode: 'fr-FR' },
  { id: 'Google.fr-FR-Neural2-D', name: 'Antoine', provider: 'google', gender: 'masculine', tags: ['natural', 'warm'], languages: ['french'], languageCode: 'fr-FR' },
  // German
  { id: 'Google.de-DE-Neural2-A', name: 'Elke', provider: 'google', gender: 'feminine', tags: ['clear', 'professional'], languages: ['german'], languageCode: 'de-DE' },
  { id: 'Google.de-DE-Neural2-B', name: 'Klaus', provider: 'google', gender: 'masculine', tags: ['deep', 'authoritative'], languages: ['german'], languageCode: 'de-DE' },
  // Japanese
  { id: 'Google.ja-JP-Neural2-B', name: 'Sakura', provider: 'google', gender: 'feminine', tags: ['natural', 'smooth'], languages: ['japanese'], languageCode: 'ja-JP' },
  { id: 'Google.ja-JP-Neural2-C', name: 'Haruki', provider: 'google', gender: 'masculine', tags: ['calm', 'clear'], languages: ['japanese'], languageCode: 'ja-JP' },
  // Portuguese (Brazil)
  { id: 'Google.pt-BR-Neural2-A', name: 'Ana', provider: 'google', gender: 'feminine', tags: ['warm', 'friendly'], languages: ['portuguese', 'br'], languageCode: 'pt-BR' },
  { id: 'Google.pt-BR-Neural2-B', name: 'Lucas', provider: 'google', gender: 'masculine', tags: ['clear', 'natural'], languages: ['portuguese', 'br'], languageCode: 'pt-BR' },
  // Arabic
  { id: 'Google.ar-XA-Wavenet-A', name: 'Fatima', provider: 'google', gender: 'feminine', tags: ['clear', 'professional'], languages: ['arabic'], languageCode: 'ar-XA' },
  { id: 'Google.ar-XA-Wavenet-B', name: 'Omar', provider: 'google', gender: 'masculine', tags: ['deep', 'authoritative'], languages: ['arabic'], languageCode: 'ar-XA' },
  // Korean
  { id: 'Google.ko-KR-Neural2-A', name: 'Jihye', provider: 'google', gender: 'feminine', tags: ['natural', 'clear'], languages: ['korean'], languageCode: 'ko-KR' },
  { id: 'Google.ko-KR-Neural2-C', name: 'Dohyun', provider: 'google', gender: 'masculine', tags: ['calm', 'professional'], languages: ['korean'], languageCode: 'ko-KR' },
  // Italian
  { id: 'Google.it-IT-Neural2-A', name: 'Giulia', provider: 'google', gender: 'feminine', tags: ['expressive', 'warm'], languages: ['italian'], languageCode: 'it-IT' },
  { id: 'Google.it-IT-Neural2-C', name: 'Marco', provider: 'google', gender: 'masculine', tags: ['deep', 'natural'], languages: ['italian'], languageCode: 'it-IT' },
  // Chinese (Mandarin)
  { id: 'Google.cmn-CN-Neural2-A', name: 'Xiaomei', provider: 'google', gender: 'feminine', tags: ['clear', 'natural'], languages: ['chinese', 'mandarin'], languageCode: 'zh-CN' },
  { id: 'Google.cmn-CN-Neural2-B', name: 'Wei', provider: 'google', gender: 'masculine', tags: ['calm', 'professional'], languages: ['chinese', 'mandarin'], languageCode: 'zh-CN' },
];

/* ─── All voices combined ──────────────────────────────────────── */
export const ALL_VOICES: VoiceEntry[] = [...AMAZON_VOICES, ...GOOGLE_VOICES];

/* ─── Supported languages for calls ───────────────────────────── */
export interface LanguageEntry {
  code: string;
  label: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageEntry[] = [
  { code: 'en-US', label: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', label: 'English (UK)', flag: '🇬🇧' },
  { code: 'en-IN', label: 'English (India)', flag: '🇮🇳' },
  { code: 'en-AU', label: 'English (Australia)', flag: '🇦🇺' },
  { code: 'hi-IN', label: 'Hindi', flag: '🇮🇳' },
  { code: 'es-US', label: 'Spanish (US)', flag: '🇺🇸' },
  { code: 'es-ES', label: 'Spanish (Spain)', flag: '🇪🇸' },
  { code: 'fr-FR', label: 'French', flag: '🇫🇷' },
  { code: 'de-DE', label: 'German', flag: '🇩🇪' },
  { code: 'ja-JP', label: 'Japanese', flag: '🇯🇵' },
  { code: 'pt-BR', label: 'Portuguese (Brazil)', flag: '🇧🇷' },
  { code: 'ar-XA', label: 'Arabic', flag: '🇸🇦' },
  { code: 'ko-KR', label: 'Korean', flag: '🇰🇷' },
  { code: 'it-IT', label: 'Italian', flag: '🇮🇹' },
  { code: 'zh-CN', label: 'Chinese (Mandarin)', flag: '🇨🇳' },
];

/* ─── Provider metadata ───────────────────────────────────────── */
export const VOICE_PROVIDERS: { id: VoiceProvider; label: string }[] = [
  { id: 'amazon', label: 'Amazon Polly' },
  { id: 'google', label: 'Google Cloud' },
];

/* ─── Helpers ──────────────────────────────────────────────────── */
export const getVoiceById = (id: string): VoiceEntry | undefined =>
  ALL_VOICES.find((v) => v.id === id);

export const getVoiceLabel = (id: string): string => {
  const v = getVoiceById(id);
  return v ? `${v.name} (${v.provider === 'amazon' ? 'Polly' : 'Google'})` : id;
};

export const getProviderLabel = (provider: VoiceProvider): string =>
  VOICE_PROVIDERS.find((p) => p.id === provider)?.label ?? provider;

/** Get the language code for a voice (for TwiML language attribute) */
export const getVoiceLanguageCode = (voiceId: string): string => {
  const v = getVoiceById(voiceId);
  return v?.languageCode || 'en-US';
};

/** Get voices filtered by language code */
export const getVoicesByLanguage = (languageCode: string): VoiceEntry[] =>
  ALL_VOICES.filter((v) => v.languageCode === languageCode);
