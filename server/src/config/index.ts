import dotenv from 'dotenv';
import { EnvConfig } from './env.interface';
import { APP_PORTS, APP_URLS } from './app.config';

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

/** Resolve URLs from NODE_ENV; allow .env override only in dev/test */
const nodeEnv = (process.env.NODE_ENV || 'development') as EnvConfig['NODE_ENV'];
const urls = nodeEnv === 'production' ? APP_URLS.production : APP_URLS.development;

export const envConfig: EnvConfig = {
  TWILIO_ACCOUNT_SID: getOptionalEnvVar('TWILIO_ACCOUNT_SID'),
  TWILIO_AUTH_TOKEN: getOptionalEnvVar('TWILIO_AUTH_TOKEN'),
  TWILIO_PHONE_NUMBER: getEnvVar('TWILIO_PHONE_NUMBER'),
  NODE_ENV: nodeEnv,
  CLIENT_URL: process.env.CLIENT_URL || urls.CLIENT_URL,
  BASE_URL: process.env.BASE_URL || urls.BASE_URL,
  OPENAI_API_KEY: getOptionalEnvVar('OPENAI_API_KEY'),
  AI_SYSTEM_PROMPT: getOptionalEnvVar(
    'AI_SYSTEM_PROMPT',
    'You are a helpful, friendly AI phone assistant. Keep your responses concise and conversational, suitable for a phone call. Respond in 1-3 sentences unless more detail is needed. Be warm, natural, and professional.'
  ),

  // MongoDB
  MONGODB_URI: getEnvVar('MONGODB_URI', 'mongodb://localhost:27017/twilio_call_bot'),

  // JWT
  JWT_SECRET: getEnvVar('JWT_SECRET', 'super-secret-jwt-key-change-me'),
  JWT_EXPIRES_IN: getEnvVar('JWT_EXPIRES_IN', '7d'),

  // SMTP
  SMTP_HOST: getOptionalEnvVar('SMTP_HOST', 'smtp.gmail.com'),
  SMTP_PORT: parseInt(getOptionalEnvVar('SMTP_PORT', '587'), 10),
  SMTP_USER: getOptionalEnvVar('SMTP_USER'),
  SMTP_PASS: getOptionalEnvVar('SMTP_PASS'),
  SMTP_FROM: getOptionalEnvVar('SMTP_FROM', 'noreply@exyconn.com'),

  // ImageKit
  IMAGEKIT_PUBLIC_KEY: getOptionalEnvVar('IMAGEKIT_PUBLIC_KEY'),
  IMAGEKIT_PRIVATE_KEY: getOptionalEnvVar('IMAGEKIT_PRIVATE_KEY'),
  IMAGEKIT_URL_ENDPOINT: getOptionalEnvVar('IMAGEKIT_URL_ENDPOINT'),

  // Sarvam.ai TTS
  SARVAM_API_KEY: getOptionalEnvVar('SARVAM_API_KEY'),
};
