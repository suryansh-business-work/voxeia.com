import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  industry: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  contactCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    industry: { type: String, trim: true, default: '' },
    website: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, default: '' },
    address: { type: String, trim: true, default: '' },
    notes: { type: String, default: '' },
    contactCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

companySchema.index({ userId: 1, name: 1 });

const Company = mongoose.model<ICompany>('Company', companySchema);
export default Company;
