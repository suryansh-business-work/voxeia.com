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

export type AppPort = (typeof APP_PORTS)[keyof typeof APP_PORTS];
export type AppDomain = (typeof APP_DOMAINS)[keyof typeof APP_DOMAINS];
