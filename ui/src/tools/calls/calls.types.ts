export type VoiceOption = string; // Now supports any voice ID from the voices catalogue

export interface MakeCallPayload {
  to: string;
  message?: string;
  voice?: VoiceOption;
  agentId?: string;
  language?: string;
}

export interface CallData {
  callSid: string;
  status: string;
  from: string;
  to: string;
  dateCreated: string;
}

export interface CallResponse {
  success: boolean;
  message: string;
  data?: CallData;
}

export interface CallLogItem {
  _id: string;
  callSid: string;
  agentId: string | null;
  from: string;
  to: string;
  status: string;
  direction: string;
  duration: string;
  startTime: string;
  endTime: string | null;
  price: string | null;
  priceUnit: string;
  recordingUrl: string | null;
  recordingSid: string | null;
  recordingDuration: string | null;
  userReply: string | null;
  language: string;
  voice: string;
  conversationMessages?: { role: string; content: string; timestamp: string }[];
}

export interface CallLogsResponse {
  success: boolean;
  message: string;
  data: CallLogItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface CallLogsParams {
  page?: number;
  pageSize?: number;
  status?: string;
  to?: string;
  from?: string;
  agentId?: string;
}

// ─── AI Conversation Types ──────────────────────────────────────────────────

export interface AiCallPayload {
  to: string;
  message?: string;
  voice?: VoiceOption;
  systemPrompt?: string;
  agentId?: string;
  language?: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ConversationEvent {
  callSid: string;
  type: 'user_message' | 'ai_thinking' | 'ai_message' | 'call_ended' | 'silence';
  content: string;
  timestamp: string;
}

export interface ConversationTranscript {
  callSid: string;
  messages: ConversationMessage[];
}
