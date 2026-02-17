export interface EnvConfig {
  /** Twilio Account SID - Found in Twilio Console Dashboard */
  TWILIO_ACCOUNT_SID: string;

  /** Twilio Auth Token - Found in Twilio Console Dashboard */
  TWILIO_AUTH_TOKEN: string;

  /** Twilio Phone Number - Your purchased Twilio number (E.164 format: +1234567890) */
  TWILIO_PHONE_NUMBER: string;

  /** Server port */
  PORT: number;

  /** Node environment */
  NODE_ENV: 'development' | 'production' | 'test';

  /** Client URL for CORS */
  CLIENT_URL: string;
}
