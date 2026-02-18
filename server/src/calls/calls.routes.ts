import { Router } from 'express';
import {
  initiateCall,
  fetchCallLogs,
  handleRecordingStatus,
  handleTranscription,
  getCallRecording,
  proxyRecordingAudio,
  getCallDetail,
} from './calls.controllers';

const router = Router();

/** POST /api/calls - Initiate a new outbound call */
router.post('/', initiateCall);

/** GET /api/calls/logs - Get call history/logs */
router.get('/logs', fetchCallLogs);

/** GET /api/calls/recordings/:recordingSid/audio - Proxy recording audio from Twilio */
router.get('/recordings/:recordingSid/audio', proxyRecordingAudio);

/** GET /api/calls/:callSid/detail - Get full call log with conversation */
router.get('/:callSid/detail', getCallDetail);

/** GET /api/calls/:callSid/recording - Get recording metadata for a specific call */
router.get('/:callSid/recording', getCallRecording);

/** POST /api/calls/webhooks/recording-status - Twilio recording status webhook */
router.post('/webhooks/recording-status', handleRecordingStatus);

/** POST /api/calls/webhooks/transcription - Twilio transcription webhook */
router.post('/webhooks/transcription', handleTranscription);

export default router;
