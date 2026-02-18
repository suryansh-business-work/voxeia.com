import mongoose from 'mongoose';
import { envConfig } from './index';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(envConfig.MONGODB_URI);
    console.log('[DB] MongoDB connected successfully');
  } catch (error) {
    console.error('[DB] MongoDB connection error:', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[DB] MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('[DB] MongoDB error:', err);
});
