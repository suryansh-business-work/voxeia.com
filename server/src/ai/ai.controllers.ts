import { Request, Response } from 'express';
import { aiCallSchema, translateSchema } from './ai.validators';
import * as aiService from './ai.services';

/**
 * POST /api/ai/call - Initiate an AI-powered conversation call
 */
export const initiateAiCall = async (req: Request, res: Response): Promise<void> => {
  const parsed = aiCallSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const { to, message, voice, systemPrompt, agentId, language } = parsed.data;
    const result = await aiService.initiateAiCall(to, message, voice, systemPrompt, agentId, undefined, language);

    if (!result.success) {
      res.status(500).json(result);
      return;
    }

    res.status(200).json(result);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Failed to initiate AI call';
    res.status(500).json({ success: false, message: errMsg });
  }
};

/**
 * POST /api/ai/conversation/respond - Twilio webhook: receives user speech, returns AI TwiML
 */
export const handleConversationRespond = async (req: Request, res: Response): Promise<void> => {
  try {
    const callSid = req.body.CallSid as string;
    const speechResult = req.body.SpeechResult as string | undefined;

    console.log(`[AI Webhook] CallSid: ${callSid}, Speech: "${speechResult || '(empty)'}"`);

    const twiml = await aiService.handleUserSpeech(callSid, speechResult || null);

    res.status(200).type('text/xml').send(twiml);
  } catch (error) {
    console.error('[AI Webhook Error]', error);
    // Return a safe TwiML on error so Twilio doesn't play the generic error
    res.status(200).type('text/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="en-IN">I apologize, something went wrong. Please try again later. Goodbye!</Say>
  <Hangup/>
</Response>`);
  }
};

/**
 * POST /api/ai/conversation/status - Twilio webhook: call status updates
 */
export const handleCallStatusWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const callSid = req.body.CallSid as string;
    const callStatus = req.body.CallStatus as string;

    console.log(`[AI Status Webhook] CallSid: ${callSid}, Status: ${callStatus}`);

      await aiService.handleCallStatus(callSid, callStatus);
  } catch (error) {
    console.error('[AI Status Webhook Error]', error);
    res.status(200).type('text/xml').send('<Response/>');
  }
};

/**
 * GET /api/ai/conversation/:callSid - Get live conversation history
 */
export const getConversationHistory = async (req: Request, res: Response): Promise<void> => {
  const { callSid } = req.params;
  const history = aiService.getConversationHistory(callSid);

  if (!history) {
    res.status(404).json({
      success: false,
      message: 'No active conversation found for this call',
    });
    return;
  }

  res.status(200).json({ success: true, data: history });
};

/**
 * GET /api/ai/conversations - Get all active conversations
 */
export const getActiveConversations = async (_req: Request, res: Response): Promise<void> => {
  const conversations = aiService.getAllConversations();
  res.status(200).json({
    success: true,
    data: conversations.map((c) => ({
      callSid: c.callSid,
      voice: c.voice,
      startedAt: c.startedAt,
      messageCount: c.messages.filter((m) => m.role !== 'system').length,
    })),
  });
};

/**
 * POST /api/ai/translate - Translate text to target language using OpenAI
 */
export const translateTextController = async (req: Request, res: Response): Promise<void> => {
  const parsed = translateSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const { text, targetLanguage } = parsed.data;
    const translated = await aiService.translateText(text, targetLanguage);
    res.status(200).json({ success: true, data: { translated } });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Translation failed';
    res.status(500).json({ success: false, message: errMsg });
  }
};
