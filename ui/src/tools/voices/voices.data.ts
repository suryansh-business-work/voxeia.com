/* ─── Shared voice catalogue — Sarvam.ai Bulbul v3 ──────────────── */

export type VoiceProvider = 'sarvam' | 'openai';

export interface VoiceEntry {
  /** Speaker name sent to Sarvam.ai TTS */
  id: string;
  /** Human-readable name */
  name: string;
  /** Provider label */
  provider: VoiceProvider;
  /** Descriptive tags */
  tags: string[];
  /** Primary language labels */
  languages: string[];
  /** Gender label */
  gender: 'feminine' | 'masculine';
  /** BCP-47 language code */
  languageCode: string;
}

/* ─── Sarvam.ai Bulbul v3 speakers ───────────────────────────── */
export const SARVAM_VOICES: VoiceEntry[] = [
  // Feminine
  { id: 'meera', name: 'Meera', provider: 'sarvam', gender: 'feminine', tags: ['warm', 'default'], languages: ['all'], languageCode: 'hi-IN' },
  { id: 'pavithra', name: 'Pavithra', provider: 'sarvam', gender: 'feminine', tags: ['professional', 'clear'], languages: ['all'], languageCode: 'hi-IN' },
  { id: 'maitreyi', name: 'Maitreyi', provider: 'sarvam', gender: 'feminine', tags: ['soft', 'gentle'], languages: ['all'], languageCode: 'hi-IN' },

  // Masculine
  { id: 'shubh', name: 'Shubh', provider: 'sarvam', gender: 'masculine', tags: ['natural', 'default'], languages: ['all'], languageCode: 'hi-IN' },
  { id: 'aditya', name: 'Aditya', provider: 'sarvam', gender: 'masculine', tags: ['deep', 'professional'], languages: ['all'], languageCode: 'hi-IN' },
  { id: 'rahul', name: 'Rahul', provider: 'sarvam', gender: 'masculine', tags: ['friendly', 'conversational'], languages: ['all'], languageCode: 'hi-IN' },
];

/* ─── OpenAI TTS voices ──────────────────────────────────────── */
export const OPENAI_VOICES: VoiceEntry[] = [
  { id: 'openai-alloy', name: 'Alloy', provider: 'openai', gender: 'feminine', tags: ['balanced', 'versatile'], languages: ['all'], languageCode: 'en-IN' },
  { id: 'openai-echo', name: 'Echo', provider: 'openai', gender: 'masculine', tags: ['warm', 'deep'], languages: ['all'], languageCode: 'en-IN' },
  { id: 'openai-fable', name: 'Fable', provider: 'openai', gender: 'masculine', tags: ['british', 'expressive'], languages: ['all'], languageCode: 'en-IN' },
  { id: 'openai-onyx', name: 'Onyx', provider: 'openai', gender: 'masculine', tags: ['authoritative', 'deep'], languages: ['all'], languageCode: 'en-IN' },
  { id: 'openai-nova', name: 'Nova', provider: 'openai', gender: 'feminine', tags: ['energetic', 'friendly'], languages: ['all'], languageCode: 'en-IN' },
  { id: 'openai-shimmer', name: 'Shimmer', provider: 'openai', gender: 'feminine', tags: ['soft', 'calm'], languages: ['all'], languageCode: 'en-IN' },
  { id: 'openai-ash', name: 'Ash', provider: 'openai', gender: 'masculine', tags: ['natural', 'clear'], languages: ['all'], languageCode: 'en-IN' },
  { id: 'openai-coral', name: 'Coral', provider: 'openai', gender: 'feminine', tags: ['warm', 'professional'], languages: ['all'], languageCode: 'en-IN' },
  { id: 'openai-sage', name: 'Sage', provider: 'openai', gender: 'feminine', tags: ['gentle', 'wise'], languages: ['all'], languageCode: 'en-IN' },
];

/* ─── All voices combined ──────────────────────────────────────── */
export const ALL_VOICES: VoiceEntry[] = [...SARVAM_VOICES, ...OPENAI_VOICES];

/* ─── Supported languages (Sarvam.ai Bulbul v3) ──────────────── */
export interface LanguageEntry {
  code: string;
  label: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageEntry[] = [
  { code: 'en-IN', label: 'English (India)', flag: '🇮🇳' },
  { code: 'hi-IN', label: 'Hindi', flag: '🇮🇳' },
  { code: 'bn-IN', label: 'Bengali', flag: '🇮🇳' },
  { code: 'ta-IN', label: 'Tamil', flag: '🇮🇳' },
  { code: 'te-IN', label: 'Telugu', flag: '🇮🇳' },
  { code: 'kn-IN', label: 'Kannada', flag: '🇮🇳' },
  { code: 'ml-IN', label: 'Malayalam', flag: '🇮🇳' },
  { code: 'mr-IN', label: 'Marathi', flag: '🇮🇳' },
  { code: 'gu-IN', label: 'Gujarati', flag: '🇮🇳' },
  { code: 'pa-IN', label: 'Punjabi', flag: '🇮🇳' },
  { code: 'od-IN', label: 'Odia', flag: '🇮🇳' },
];

/* ─── Provider metadata ───────────────────────────────────────── */
export const VOICE_PROVIDERS: { id: VoiceProvider; label: string }[] = [
  { id: 'sarvam', label: 'Sarvam.ai' },
  { id: 'openai', label: 'OpenAI' },
];

/* ─── Helpers ──────────────────────────────────────────────────── */
export const getVoiceById = (id: string): VoiceEntry | undefined =>
  ALL_VOICES.find((v) => v.id === id);

export const getVoiceLabel = (id: string): string => {
  const v = getVoiceById(id);
  return v ? `${v.name} (${getProviderLabel(v.provider)})` : id;
};

export const getProviderLabel = (provider: VoiceProvider): string =>
  VOICE_PROVIDERS.find((p) => p.id === provider)?.label ?? provider;

/** Get the language code for a voice (for TwiML language attribute) */
export const getVoiceLanguageCode = (voiceId: string): string => {
  const v = getVoiceById(voiceId);
  return v?.languageCode || 'en-IN';
};

/** 
 * Sarvam.ai voices are multilingual — all speakers support all 11 languages.
 * So we return ALL voices regardless of language code.
 */
export const getVoicesByLanguage = (_languageCode: string): VoiceEntry[] =>
  ALL_VOICES;
