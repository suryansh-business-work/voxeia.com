import mongoose, { Schema, Document } from 'mongoose';

export interface IAgent extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  systemPrompt: string;
  voice: string;
  greeting: string;
  createdAt: Date;
  updatedAt: Date;
}

const agentSchema = new Schema<IAgent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    systemPrompt: { type: String, required: true },
    voice: { type: String, default: 'Polly.Joanna-Neural' },
    greeting: {
      type: String,
      default: 'Hello! I am your AI assistant. How can I help you today?',
    },
  },
  { timestamps: true }
);

const Agent = mongoose.model<IAgent>('Agent', agentSchema);
export default Agent;
