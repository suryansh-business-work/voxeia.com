import Settings, { ISettings } from './settings.models';
import { UpdateSettingsInput } from './settings.validators';
import { envConfig } from '../config';

/**
 * Get settings for a user. If none exist, create default settings.
 */
export const getSettings = async (userId: string): Promise<ISettings> => {
  let settings = await Settings.findOne({ userId });
  if (!settings) {
    settings = await Settings.create({ userId });
  }
  return settings;
};

/**
 * Update settings for a user.
 */
export const updateSettings = async (
  userId: string,
  data: UpdateSettingsInput
): Promise<ISettings> => {
  const update: Record<string, unknown> = {};

  if (data.useGlobalConfig !== undefined) {
    update.useGlobalConfig = data.useGlobalConfig;
  }
  if (data.callConfig) {
    if (data.callConfig.twilioAccountSid !== undefined)
      update['callConfig.twilioAccountSid'] = data.callConfig.twilioAccountSid;
    if (data.callConfig.twilioAuthToken !== undefined)
      update['callConfig.twilioAuthToken'] = data.callConfig.twilioAuthToken;
    if (data.callConfig.twilioPhoneNumber !== undefined)
      update['callConfig.twilioPhoneNumber'] = data.callConfig.twilioPhoneNumber;
  }
  if (data.aiConfig) {
    if (data.aiConfig.openaiApiKey !== undefined)
      update['aiConfig.openaiApiKey'] = data.aiConfig.openaiApiKey;
  }
  if (data.ttsConfig) {
    if (data.ttsConfig.sarvamApiKey !== undefined)
      update['ttsConfig.sarvamApiKey'] = data.ttsConfig.sarvamApiKey;
  }

  const settings = await Settings.findOneAndUpdate(
    { userId },
    { $set: update },
    { new: true, upsert: true }
  );

  return settings!;
};

/**
 * Get the resolved config for a user.
 * If useGlobalConfig is false, return .env values.
 * If useGlobalConfig is true, return the user's custom values.
 */
export const getResolvedConfig = async (
  userId: string
): Promise<{
  callConfig: { twilioAccountSid: string; twilioAuthToken: string; twilioPhoneNumber: string };
  aiConfig: { openaiApiKey: string };
  ttsConfig: { sarvamApiKey: string };
}> => {
  const settings = await getSettings(userId);

  if (!settings.useGlobalConfig) {
    return {
      callConfig: {
        twilioAccountSid: envConfig.TWILIO_ACCOUNT_SID,
        twilioAuthToken: envConfig.TWILIO_AUTH_TOKEN,
        twilioPhoneNumber: envConfig.TWILIO_PHONE_NUMBER,
      },
      aiConfig: {
        openaiApiKey: envConfig.OPENAI_API_KEY,
      },
      ttsConfig: {
        sarvamApiKey: envConfig.SARVAM_API_KEY,
      },
    };
  }

  return {
    callConfig: {
      twilioAccountSid: settings.callConfig.twilioAccountSid || envConfig.TWILIO_ACCOUNT_SID,
      twilioAuthToken: settings.callConfig.twilioAuthToken || envConfig.TWILIO_AUTH_TOKEN,
      twilioPhoneNumber: settings.callConfig.twilioPhoneNumber || envConfig.TWILIO_PHONE_NUMBER,
    },
    aiConfig: {
      openaiApiKey: settings.aiConfig.openaiApiKey || envConfig.OPENAI_API_KEY,
    },
    ttsConfig: {
      sarvamApiKey: settings.ttsConfig.sarvamApiKey || envConfig.SARVAM_API_KEY,
    },
  };
};
