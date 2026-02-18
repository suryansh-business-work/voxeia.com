export type VoiceOption = string;

export interface MakeCallRequest {
  to: string;
  message?: string;
  voice?: VoiceOption;
  agentId?: string;
  userId?: string;
  language?: string;
}

export interface CallResponse {
  success: boolean;
  message: string;
  data?: {
    callSid: string;
    status: string;
    from: string;
    to: string;
    dateCreated: string;
  };
}

/** Serialized call log item for API responses */
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

export interface CallLogsQuery {
  page?: number;
  pageSize?: number;
  status?: string;
  to?: string;
  from?: string;
  agentId?: string;
}
