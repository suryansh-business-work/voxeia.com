import OpenAI from 'openai';
import twilio from 'twilio';
import { envConfig } from '../config';
import { ConversationState, ConversationMessage } from './ai.models';
import { VoiceOption } from '../calls/calls.models';
import { emitToCall } from '../websocket';
import { getTunnelUrl } from '../tunnel';

// ─── In-memory conversation store ───────────────────────────────────────────
const conversations = new Map<string, ConversationState>();

const MAX_SILENCE = 3; // hang up after 3 consecutive silences
const CONVERSATION_TTL_MS = 30 * 60 * 1000; // 30 min auto-cleanup

// ─── Lazy-loaded clients ────────────────────────────────────────────────────
let openaiClient: OpenAI | null = null;
let twilioClient: ReturnType<typeof twilio> | null = null;

const getOpenAI = (): OpenAI => {
  if (!openaiClient) {
    if (!envConfig.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured in .env');
    }
    openaiClient = new OpenAI({ apiKey: envConfig.OPENAI_API_KEY });
  }
  return openaiClient;
};

const getTwilioClient = () => {
  if (!twilioClient) {
    if (!envConfig.TWILIO_ACCOUNT_SID || !envConfig.TWILIO_AUTH_TOKEN) {
      throw new Error('Twilio credentials are not configured');
    }
    twilioClient = twilio(envConfig.TWILIO_ACCOUNT_SID, envConfig.TWILIO_AUTH_TOKEN);
  }
  return twilioClient;
};

// ─── Escape XML ─────────────────────────────────────────────────────────────
const escapeXml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// ─── Webhook URL helper ─────────────────────────────────────────────────────

/** Returns the tunnel URL if available, else falls back to env BASE_URL. */
const getWebhookBaseUrl = (): string => {
  return getTunnelUrl() || envConfig.BASE_URL;
};

// ─── Conversation management ────────────────────────────────────────────────

export const createConversation = (
  callSid: string,
  voice: VoiceOption,
  systemPrompt?: string
): ConversationState => {
  const state: ConversationState = {
    callSid,
    voice,
    systemPrompt: systemPrompt || envConfig.AI_SYSTEM_PROMPT,
    messages: [
      {
        role: 'system',
        content: systemPrompt || envConfig.AI_SYSTEM_PROMPT,
        timestamp: new Date().toISOString(),
      },
    ],
    startedAt: new Date().toISOString(),
    silenceCount: 0,
  };
  conversations.set(callSid, state);
  return state;
};

export const getConversation = (callSid: string): ConversationState | undefined =>
  conversations.get(callSid);

export const deleteConversation = (callSid: string): void => {
  conversations.delete(callSid);
};

export const getAllConversations = (): ConversationState[] =>
  Array.from(conversations.values());

// ─── Initiate AI call ───────────────────────────────────────────────────────

export const initiateAiCall = async (
  to: string,
  message: string,
  voice: VoiceOption,
  systemPrompt?: string
) => {
  const baseUrl = getWebhookBaseUrl();

  if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
    throw new Error(
      'AI conversation requires a public URL. The auto-tunnel could not start. ' +
      'Ensure cloudflared is installed (npm install -g cloudflared) or set a public BASE_URL in .env.'
    );
  }

  const client = getTwilioClient();

  // TwiML: Speak opening message, then Gather user's speech
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${voice}" language="en-US">${escapeXml(message)}</Say>
  <Gather input="speech" action="${baseUrl}/api/ai/conversation/respond" method="POST" speechTimeout="auto" language="en-US" actionOnEmptyResult="true">
    <Say voice="${voice}" language="en-US">I am listening.</Say>
  </Gather>
  <Say voice="${voice}" language="en-US">I did not hear anything. Goodbye!</Say>
</Response>`;

  const call = await client.calls.create({
    to,
    from: envConfig.TWILIO_PHONE_NUMBER,
    twiml,
    record: true,
    statusCallback: `${baseUrl}/api/ai/conversation/status`,
    statusCallbackEvent: ['completed', 'failed', 'busy', 'no-answer'],
  });

  // Create conversation state
  const convo = createConversation(call.sid, voice, systemPrompt);

  // Add the opening message as assistant's first message
  convo.messages.push({
    role: 'assistant',
    content: message,
    timestamp: new Date().toISOString(),
  });

  // Emit to UI
  emitToCall(call.sid, 'conversation:update', {
    callSid: call.sid,
    type: 'ai_message',
    content: message,
    timestamp: new Date().toISOString(),
  });

  return {
    success: true,
    message: 'AI call initiated successfully',
    data: {
      callSid: call.sid,
      status: call.status,
      from: call.from,
      to: call.to,
      dateCreated: call.dateCreated?.toISOString() || new Date().toISOString(),
    },
  };
};

// ─── Handle user speech → OpenAI → TwiML response ──────────────────────────

export const handleUserSpeech = async (
  callSid: string,
  speechResult: string | null
): Promise<string> => {
  const convo = conversations.get(callSid);
  const voice = convo?.voice || 'Polly.Joanna-Neural';
  const baseUrl = getWebhookBaseUrl();

  // If no conversation state, start a basic one
  if (!convo) {
    const fallback = createConversation(callSid, voice);
    return handleUserSpeech(callSid, speechResult);
  }

  // Handle silence / empty result
  if (!speechResult || speechResult.trim() === '') {
    convo.silenceCount++;

    emitToCall(callSid, 'conversation:update', {
      callSid,
      type: 'silence',
      content: `Silence detected (${convo.silenceCount}/${MAX_SILENCE})`,
      timestamp: new Date().toISOString(),
    });

    if (convo.silenceCount >= MAX_SILENCE) {
      // Too many silences, end call
      emitToCall(callSid, 'conversation:update', {
        callSid,
        type: 'call_ended',
        content: 'Call ended due to inactivity.',
        timestamp: new Date().toISOString(),
      });
      deleteConversation(callSid);
      return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${voice}" language="en-US">I have not heard anything for a while. Thank you for calling. Goodbye!</Say>
  <Hangup/>
</Response>`;
    }

    // Ask if still there, re-gather
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${baseUrl}/api/ai/conversation/respond" method="POST" speechTimeout="auto" language="en-US" actionOnEmptyResult="true">
    <Say voice="${voice}" language="en-US">Are you still there? Please go ahead, I am listening.</Say>
  </Gather>
  <Say voice="${voice}" language="en-US">Goodbye!</Say>
</Response>`;
  }

  // Reset silence counter on valid speech
  convo.silenceCount = 0;

  // Emit user message to UI
  emitToCall(callSid, 'conversation:update', {
    callSid,
    type: 'user_message',
    content: speechResult,
    timestamp: new Date().toISOString(),
  });

  // Add user message to history
  const userMsg: ConversationMessage = {
    role: 'user',
    content: speechResult,
    timestamp: new Date().toISOString(),
  };
  convo.messages.push(userMsg);

  // Emit "AI thinking" to UI
  emitToCall(callSid, 'conversation:update', {
    callSid,
    type: 'ai_thinking',
    content: 'AI is generating a response...',
    timestamp: new Date().toISOString(),
  });

  // Call OpenAI
  let aiReply: string;
  try {
    const openai = getOpenAI();
    const chatMessages = convo.messages.map((m) => ({
      role: m.role as 'system' | 'user' | 'assistant',
      content: m.content,
    }));

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: chatMessages,
      max_tokens: 200,
      temperature: 0.7,
    });

    aiReply = completion.choices[0]?.message?.content?.trim() || 'I apologize, I could not generate a response.';
  } catch (err) {
    console.error('[AI Service] OpenAI error:', err);
    aiReply = 'I apologize, I am having trouble processing your request right now.';
  }

  // Add assistant response to history
  convo.messages.push({
    role: 'assistant',
    content: aiReply,
    timestamp: new Date().toISOString(),
  });

  // Emit AI response to UI
  emitToCall(callSid, 'conversation:update', {
    callSid,
    type: 'ai_message',
    content: aiReply,
    timestamp: new Date().toISOString(),
  });

  // Return TwiML: Say the response, then Gather again for next turn
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${voice}" language="en-US">${escapeXml(aiReply)}</Say>
  <Gather input="speech" action="${baseUrl}/api/ai/conversation/respond" method="POST" speechTimeout="auto" language="en-US" actionOnEmptyResult="true">
  </Gather>
  <Redirect>${baseUrl}/api/ai/conversation/respond?timeout=true</Redirect>
</Response>`;
};

// ─── Handle call status changes ─────────────────────────────────────────────

export const handleCallStatus = (callSid: string, status: string): void => {
  console.log(`[AI] Call ${callSid} status: ${status}`);

  if (['completed', 'failed', 'busy', 'no-answer', 'canceled'].includes(status)) {
    const convo = conversations.get(callSid);

    emitToCall(callSid, 'conversation:update', {
      callSid,
      type: 'call_ended',
      content: `Call ${status}.`,
      timestamp: new Date().toISOString(),
    });

    // Send full transcript to UI before cleanup
    if (convo) {
      emitToCall(callSid, 'conversation:transcript', {
        callSid,
        messages: convo.messages.filter((m) => m.role !== 'system'),
      });
    }

    deleteConversation(callSid);
  }
};

// ─── Get conversation history for a call ────────────────────────────────────

export const getConversationHistory = (callSid: string) => {
  const convo = conversations.get(callSid);
  if (!convo) return null;
  return {
    callSid: convo.callSid,
    voice: convo.voice,
    startedAt: convo.startedAt,
    messages: convo.messages.filter((m) => m.role !== 'system'),
  };
};

// ─── Periodic cleanup of stale conversations ────────────────────────────────

setInterval(() => {
  const now = Date.now();
  for (const [callSid, convo] of conversations.entries()) {
    if (now - new Date(convo.startedAt).getTime() > CONVERSATION_TTL_MS) {
      console.log(`[AI] Cleaning up stale conversation: ${callSid}`);
      deleteConversation(callSid);
    }
  }
}, 5 * 60 * 1000); // every 5 minutes
