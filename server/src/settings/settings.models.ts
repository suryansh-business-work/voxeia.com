import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  useCustomCallConfig: boolean;
  useCustomAiConfig: boolean;
  useCustomTtsConfig: boolean;
  useCustomEmailConfig: boolean;
  callConfig: {
    twilioAccountSid: string;
    twilioAuthToken: string;
    twilioPhoneNumber: string;
  };
  aiConfig: {
    openaiApiKey: string;
  };
  ttsConfig: {
    sarvamApiKey: string;
  };
  emailConfig: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPass: string;
    smtpFrom: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    useCustomCallConfig: { type: Boolean, default: false },
    useCustomAiConfig: { type: Boolean, default: false },
    useCustomTtsConfig: { type: Boolean, default: false },
    useCustomEmailConfig: { type: Boolean, default: false },
    callConfig: {
      twilioAccountSid: { type: String, default: '' },
      twilioAuthToken: { type: String, default: '' },
      twilioPhoneNumber: { type: String, default: '' },
    },
    aiConfig: {
      openaiApiKey: { type: String, default: '' },
    },
    ttsConfig: {
      sarvamApiKey: { type: String, default: '' },
    },
    emailConfig: {
      smtpHost: { type: String, default: '' },
      smtpPort: { type: Number, default: 587 },
      smtpUser: { type: String, default: '' },
      smtpPass: { type: String, default: '' },
      smtpFrom: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model<ISettings>('Settings', settingsSchema);
export default Settings;
