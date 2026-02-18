import { Request, Response } from 'express';
import { getCachedAudio, generatePreviewSpeech } from './tts.services';

/** Serve cached TTS audio to Twilio <Play> */
export const serveCachedAudio = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const cached = getCachedAudio(id);

  if (!cached) {
    res.status(404).send('Audio not found or expired');
    return;
  }

  res.set({
    'Content-Type': cached.contentType,
    'Content-Length': String(cached.buffer.length),
    'Cache-Control': 'no-cache',
  });
  res.send(cached.buffer);
};

/** Generate a preview TTS sample for the UI voice selector */
export const previewVoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { speaker, text, language } = req.body as {
      speaker?: string;
      text?: string;
      language?: string;
    };

    if (!speaker) {
      res.status(400).json({ error: 'speaker is required' });
      return;
    }

    const base64Audio = await generatePreviewSpeech(
      speaker,
      text || `Hello, I am ${speaker}. How can I help you today?`,
      language || 'en-IN'
    );

    res.json({ audio: base64Audio });
  } catch (err) {
    console.error('[TTS Preview] Error:', err);
    res.status(500).json({ error: 'Failed to generate voice preview' });
  }
};
