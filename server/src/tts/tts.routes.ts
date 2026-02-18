import { Router } from 'express';
import { serveCachedAudio, previewVoice } from './tts.controllers';

const router = Router();

/** GET /api/tts/audio/:id — Serve cached Sarvam.ai TTS audio for Twilio <Play> */
router.get('/audio/:id', serveCachedAudio);

/** POST /api/tts/preview — Generate a voice preview sample via Sarvam.ai */
router.post('/preview', previewVoice);

export default router;
