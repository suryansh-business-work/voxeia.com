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
}

/* ─── Amazon Polly (Neural) voices ────────────────────────────── */
export const AMAZON_VOICES: VoiceEntry[] = [
  { id: 'Polly.Joanna-Neural', name: 'Joanna', provider: 'amazon', gender: 'feminine', tags: ['warm', 'conversational'], languages: ['english', 'us'] },
  { id: 'Polly.Matthew-Neural', name: 'Matthew', provider: 'amazon', gender: 'masculine', tags: ['clear', 'professional'], languages: ['english', 'us'] },
  { id: 'Polly.Amy-Neural', name: 'Amy', provider: 'amazon', gender: 'feminine', tags: ['clear', 'articulate'], languages: ['english', 'uk'] },
  { id: 'Polly.Brian-Neural', name: 'Brian', provider: 'amazon', gender: 'masculine', tags: ['authoritative', 'deep'], languages: ['english', 'uk'] },
  { id: 'Polly.Ruth-Neural', name: 'Ruth', provider: 'amazon', gender: 'feminine', tags: ['young', 'friendly'], languages: ['english', 'us'] },
  { id: 'Polly.Stephen-Neural', name: 'Stephen', provider: 'amazon', gender: 'masculine', tags: ['mature', 'confident'], languages: ['english', 'us'] },
  { id: 'Polly.Kajal-Neural', name: 'Kajal', provider: 'amazon', gender: 'feminine', tags: ['clear', 'professional'], languages: ['hindi', 'english', 'indian'] },
  { id: 'Polly.Niamh-Neural', name: 'Niamh', provider: 'amazon', gender: 'feminine', tags: ['warm', 'natural'], languages: ['english', 'irish'] },
  { id: 'Polly.Aria-Neural', name: 'Aria', provider: 'amazon', gender: 'feminine', tags: ['expressive', 'modern'], languages: ['english', 'nz'] },
  { id: 'Polly.Danielle-Neural', name: 'Danielle', provider: 'amazon', gender: 'feminine', tags: ['composed', 'refined'], languages: ['english', 'us'] },
  { id: 'Polly.Gregory-Neural', name: 'Gregory', provider: 'amazon', gender: 'masculine', tags: ['calm', 'natural'], languages: ['english', 'us'] },
  { id: 'Polly.Liam-Neural', name: 'Liam', provider: 'amazon', gender: 'masculine', tags: ['energetic', 'youthful'], languages: ['english', 'ca'] },
];

/* ─── Google Cloud TTS (Wavenet / Neural2) voices ─────────────── */
export const GOOGLE_VOICES: VoiceEntry[] = [
  { id: 'Google.en-US-Neural2-C', name: 'Ava', provider: 'google', gender: 'feminine', tags: ['natural', 'versatile'], languages: ['english', 'us'] },
  { id: 'Google.en-US-Neural2-D', name: 'Andrew', provider: 'google', gender: 'masculine', tags: ['deep', 'professional'], languages: ['english', 'us'] },
  { id: 'Google.en-US-Neural2-E', name: 'Luna', provider: 'google', gender: 'feminine', tags: ['warm', 'friendly'], languages: ['english', 'us'] },
  { id: 'Google.en-US-Neural2-J', name: 'Marcus', provider: 'google', gender: 'masculine', tags: ['calm', 'conversational'], languages: ['english', 'us'] },
  { id: 'Google.en-GB-Neural2-A', name: 'Olivia', provider: 'google', gender: 'feminine', tags: ['clear', 'british'], languages: ['english', 'uk'] },
  { id: 'Google.en-GB-Neural2-B', name: 'James', provider: 'google', gender: 'masculine', tags: ['authoritative', 'british'], languages: ['english', 'uk'] },
  { id: 'Google.en-IN-Neural2-A', name: 'Priya', provider: 'google', gender: 'feminine', tags: ['warm', 'clear'], languages: ['english', 'hindi', 'indian'] },
  { id: 'Google.en-IN-Neural2-B', name: 'Raj', provider: 'google', gender: 'masculine', tags: ['professional', 'natural'], languages: ['english', 'hindi', 'indian'] },
  { id: 'Google.en-AU-Neural2-A', name: 'Sophie', provider: 'google', gender: 'feminine', tags: ['friendly', 'natural'], languages: ['english', 'australian'] },
  { id: 'Google.en-AU-Neural2-B', name: 'Ethan', provider: 'google', gender: 'masculine', tags: ['casual', 'energetic'], languages: ['english', 'australian'] },
  { id: 'Google.hi-IN-Neural2-A', name: 'Ananya', provider: 'google', gender: 'feminine', tags: ['expressive', 'clear'], languages: ['hindi', 'indian'] },
  { id: 'Google.hi-IN-Neural2-B', name: 'Vikram', provider: 'google', gender: 'masculine', tags: ['deep', 'authoritative'], languages: ['hindi', 'indian'] },
];

/* ─── All voices combined ──────────────────────────────────────── */
export const ALL_VOICES: VoiceEntry[] = [...AMAZON_VOICES, ...GOOGLE_VOICES];

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
