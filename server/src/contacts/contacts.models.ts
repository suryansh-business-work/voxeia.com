import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  notes: string;
  tags: string[];
  lastCalledAt: Date | null;
  totalCalls: number;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', default: null, index: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    jobTitle: { type: String, trim: true, default: '' },
    notes: { type: String, default: '' },
    tags: { type: [String], default: [] },
    lastCalledAt: { type: Date, default: null },
    totalCalls: { type: Number, default: 0 },
  },
  { timestamps: true }
);

contactSchema.index({ userId: 1, companyId: 1 });
contactSchema.index({ userId: 1, phone: 1 });

const Contact = mongoose.model<IContact>('Contact', contactSchema);
export default Contact;
