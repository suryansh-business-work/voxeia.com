import { getTunnelUrl } from '../tunnel';
import { envConfig } from '../config';

/**
 * Returns the public base URL for Twilio webhooks.
 *
 * - **Production**: `BASE_URL` (e.g. https://api.voxeia.com) — tunnel is never started.
 * - **Development**: Cloudflare tunnel URL if available, otherwise `BASE_URL`.
 */
export const getWebhookBaseUrl = (): string => {
  if (envConfig.NODE_ENV === 'production') {
    return envConfig.BASE_URL;
  }
  return getTunnelUrl() || envConfig.BASE_URL;
};
