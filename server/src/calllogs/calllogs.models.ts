import mongoose, { Schema, Document } from 'mongoose';

export interface ICallLog extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | null;
  agentId: mongoose.Types.ObjectId | null;
  callSid: string;
  from: string;
  to: string;
  status: string;
  direction: string;
  duration: string;
  startTime: string;
  endTime: string;
  price: string | null;
  priceUnit: string;
  recordingUrl: string | null;
  recordingSid: string | null;
  recordingDuration: string | null;
  recordingImageKitUrl: string | null;
  recordingImageKitFileId: string | null;
  userReply: string | null;
  conversationMessages: { role: string; content: string; timestamp: string }[];
  language: string;
  voice: string;
  createdAt: Date;
  updatedAt: Date;
}

const callLogSchema = new Schema<ICallLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    agentId: { type: Schema.Types.ObjectId, ref: 'Agent', default: null, index: true },
    callSid: { type: String, required: true, unique: true, index: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    status: { type: String, default: 'queued' },
    direction: { type: String, default: 'outbound-api' },
    duration: { type: String, default: '0' },
    startTime: { type: String, default: '' },
    endTime: { type: String, default: '' },
    price: { type: String, default: null },
    priceUnit: { type: String, default: 'USD' },
    recordingUrl: { type: String, default: null },
    recordingSid: { type: String, default: null },
    recordingDuration: { type: String, default: null },
    recordingImageKitUrl: { type: String, default: null },
    recordingImageKitFileId: { type: String, default: null },
    userReply: { type: String, default: null },
    conversationMessages: [
      {
        role: { type: String },
        content: { type: String },
        timestamp: { type: String },
      },
    ],
    language: { type: String, default: 'en-US' },
    voice: { type: String, default: 'Polly.Joanna-Neural' },
  },
  { timestamps: true }
);

const CallLog = mongoose.model<ICallLog>('CallLog', callLogSchema);
export default CallLog;
