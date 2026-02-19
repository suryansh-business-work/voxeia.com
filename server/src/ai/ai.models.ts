import { VoiceOption } from '../calls/calls.models';

/** A single message in the AI conversation */
export interface ConversationMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: string;
}

/** State of an active AI conversation (per call) */
export interface ConversationState {
  callSid: string;
  voice: VoiceOption;
  systemPrompt: string;
  messages: ConversationMessage[];
  startedAt: string;
  silenceCount: number;
  language: string;
  aiModel?: string;
}

/** Socket event payload for live UI updates */
export interface ConversationEvent {
  callSid: string;
  type: 'user_message' | 'ai_thinking' | 'ai_message' | 'call_ended' | 'silence';
  content: string;
  timestamp: string;
}

/** Request body for initiating an AI call */
export interface AiCallRequest {
  to: string;
  message: string;
  voice?: VoiceOption;
  systemPrompt?: string;
}
