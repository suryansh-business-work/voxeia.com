import { Router } from 'express';
import {
  initiateAiCall,
  handleConversationRespond,
  handleCallStatusWebhook,
  getConversationHistory,
  getActiveConversations,
  translateTextController,
} from './ai.controllers';

const router = Router();

/** POST /api/ai/call - Initiate AI conversation call */
router.post('/call', initiateAiCall);

/** POST /api/ai/translate - Translate text to target language */
router.post('/translate', translateTextController);

/** GET /api/ai/conversations - List all active conversations */
router.get('/conversations', getActiveConversations);

/** GET /api/ai/conversation/:callSid - Get conversation history */
router.get('/conversation/:callSid', getConversationHistory);

/** POST /api/ai/conversation/respond - Twilio speech webhook */
router.post('/conversation/respond', handleConversationRespond);

/** POST /api/ai/conversation/status - Twilio call status webhook */
router.post('/conversation/status', handleCallStatusWebhook);

export default router;
