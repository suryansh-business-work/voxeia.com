import { envConfig } from '../config';
import { getTunnelUrl } from '../tunnel';

// ─── In-memory audio cache ──────────────────────────────────────────────────
interface CachedAudio {
  buffer: Buffer;
  contentType: string;
  createdAt: number;
}

const audioCache = new Map<string, CachedAudio>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 min

// ─── Sarvam.ai TTS API ─────────────────────────────────────────────────────

const SARVAM_API_URL = 'https://api.sarvam.ai/text-to-speech';

/**
 * Convert text to speech using Sarvam.ai Bulbul v3.
 * Returns a Buffer of WAV audio.
 */
export const generateSpeech = async (
  text: string,
  targetLanguageCode: string = 'en-IN',
  speaker: string = 'meera',
  pace: number = 1.0
): Promise<Buffer> => {
  const apiKey = envConfig.SARVAM_API_KEY;
  if (!apiKey) {
    throw new Error('SARVAM_API_KEY is not configured in .env');
  }

  // Sarvam.ai supports max 2500 chars for bulbul:v3
  const truncatedText = text.slice(0, 2400);

  const response = await fetch(SARVAM_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-subscription-key': apiKey,
    },
    body: JSON.stringify({
      text: truncatedText,
      target_language_code: targetLanguageCode,
      speaker,
      model: 'bulbul:v3',
      pace,
      speech_sample_rate: 8000,
      output_audio_codec: 'mulaw',
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    console.error('[Sarvam TTS] API error:', response.status, errBody);
    throw new Error(`Sarvam TTS API error: ${response.status}`);
  }

  const data = (await response.json()) as { request_id: string; audios: string[] };

  if (!data.audios || data.audios.length === 0) {
    throw new Error('Sarvam TTS returned no audio');
  }

  return Buffer.from(data.audios[0], 'base64');
};

/**
 * Generate TTS audio, cache it, and return a publicly accessible URL
 * that Twilio can <Play>.
 */
export const generateAndCacheAudio = async (
  text: string,
  languageCode: string,
  speaker: string,
  pace: number = 1.0
): Promise<string> => {
  // Generate unique ID for this audio
  const id = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

  const buffer = await generateSpeech(text, languageCode, speaker, pace);

  audioCache.set(id, {
    buffer,
    contentType: 'audio/basic', // mulaw
    createdAt: Date.now(),
  });

  // Build public URL
  const baseUrl = getTunnelUrl() || envConfig.BASE_URL;
  return `${baseUrl}/api/tts/audio/${id}`;
};

/**
 * Generate a preview-quality TTS clip for the UI voice sample player.
 * Uses WAV codec at 22050 Hz (browser-friendly, not Twilio mulaw).
 */
export const generatePreviewSpeech = async (
  speaker: string,
  text: string = 'Hello, how can I help you today?',
  languageCode: string = 'en-IN'
): Promise<string> => {
  const apiKey = envConfig.SARVAM_API_KEY;
  if (!apiKey) throw new Error('SARVAM_API_KEY is not configured');

  const response = await fetch(SARVAM_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-subscription-key': apiKey,
    },
    body: JSON.stringify({
      text: text.slice(0, 500),
      target_language_code: languageCode,
      speaker,
      model: 'bulbul:v3',
      pace: 1.0,
      speech_sample_rate: 22050,
      output_audio_codec: 'wav',
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    console.error('[Sarvam TTS Preview] API error:', response.status, errBody);
    throw new Error(`Sarvam TTS preview error: ${response.status}`);
  }

  const data = (await response.json()) as { request_id: string; audios: string[] };
  if (!data.audios?.length) throw new Error('No preview audio returned');

  return data.audios[0]; // base64 WAV
};

/**
 * Retrieve cached audio by ID.
 */
export const getCachedAudio = (id: string): CachedAudio | undefined => {
  return audioCache.get(id);
};

// ─── Periodic cleanup ───────────────────────────────────────────────────────
setInterval(() => {
  const now = Date.now();
  for (const [id, entry] of audioCache.entries()) {
    if (now - entry.createdAt > CACHE_TTL_MS) {
      audioCache.delete(id);
    }
  }
}, 2 * 60 * 1000);
