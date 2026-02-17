import dotenv from 'dotenv';
import { EnvConfig } from './env.interface';

dotenv.config();

const getEnvVar = (key: string, fallback?: string): string => {
  const value = process.env[key] || fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const getOptionalEnvVar = (key: string, fallback?: string): string => {
  return process.env[key] || fallback || '';
};

export const envConfig: EnvConfig = {
  TWILIO_ACCOUNT_SID: getOptionalEnvVar('TWILIO_ACCOUNT_SID'),
  TWILIO_AUTH_TOKEN: getOptionalEnvVar('TWILIO_AUTH_TOKEN'),
  TWILIO_PHONE_NUMBER: getEnvVar('TWILIO_PHONE_NUMBER'),
  PORT: parseInt(getEnvVar('PORT', '5000'), 10),
  NODE_ENV: getEnvVar('NODE_ENV', 'development') as EnvConfig['NODE_ENV'],
  CLIENT_URL: getEnvVar('CLIENT_URL', 'http://localhost:3000'),
};
