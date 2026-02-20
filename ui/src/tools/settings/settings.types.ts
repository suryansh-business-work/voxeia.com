export interface CallConfig {
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioPhoneNumber: string;
}

export interface AiConfig {
  openaiApiKey: string;
}

export interface TtsConfig {
  sarvamApiKey: string;
}

export interface SettingsData {
  _id: string;
  userId: string;
  useGlobalConfig: boolean;
  callConfig: CallConfig;
  aiConfig: AiConfig;
  ttsConfig: TtsConfig;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsResponse {
  success: boolean;
  data: SettingsData;
}

export interface UpdateSettingsPayload {
  useGlobalConfig?: boolean;
  callConfig?: Partial<CallConfig>;
  aiConfig?: Partial<AiConfig>;
  ttsConfig?: Partial<TtsConfig>;
}
