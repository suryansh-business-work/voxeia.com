/**
 * ─── Centralized Application Configuration ──────────────────────────
 * All ports and domains are defined here as build-time constants.
 * Secrets and API keys remain in environment variables / GitHub secrets.
 */

export const APP_PORTS = {
  /** SaaS marketing website — voxeia.com */
  WEBSITE: 2000,

  /** UI dashboard — app.voxeia.com */
  UI: 2001,

  /** Backend API server — api.voxeia.com */
  SERVER: 2002,

  /** WebSocket server — ws.voxeia.com */
  WEBSOCKET: 2003,

  /** E-commerce demo — ecomm.voxeia.com */
  ECOMM: 2004,
} as const;

export const APP_DOMAINS = {
  WEBSITE: 'voxeia.com',
  WEBSITE_WWW: 'www.voxeia.com',
  UI: 'app.voxeia.com',
  API: 'api.voxeia.com',
  WS: 'ws.voxeia.com',
  ECOMM: 'ecomm.voxeia.com',
} as const;

/**
 * URLs computed from NODE_ENV.
 * In production these are always HTTPS + real domains.
 * In development they default to localhost (BASE_URL can be
 * overridden via .env for ngrok / cloudflare tunnel).
 */
export const APP_URLS = {
  development: {
    CLIENT_URL: `http://localhost:${APP_PORTS.UI}`,
    BASE_URL: `http://localhost:${APP_PORTS.SERVER}`,
  },
  production: {
    CLIENT_URL: `https://${APP_DOMAINS.UI}`,
    BASE_URL: `https://${APP_DOMAINS.API}`,
  },
} as const;

/**
 * All origins that are allowed to make credentialed requests to the
 * API server. Keep in sync with nginx reverse-proxy config.
 */
export const ALLOWED_ORIGINS: string[] = [
  // development
  `http://localhost:${APP_PORTS.UI}`,
  `http://localhost:${APP_PORTS.ECOMM}`,
  // production
  `https://${APP_DOMAINS.UI}`,
  `https://${APP_DOMAINS.ECOMM}`,
  `https://${APP_DOMAINS.WEBSITE}`,
  `https://${APP_DOMAINS.WEBSITE_WWW}`,
];

export type AppPort = (typeof APP_PORTS)[keyof typeof APP_PORTS];
export type AppDomain = (typeof APP_DOMAINS)[keyof typeof APP_DOMAINS];
