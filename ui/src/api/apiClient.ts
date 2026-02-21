import axios from 'axios';

/**
 * API base URL:
 *  - Development: '/api' (proxied by Vite dev server to localhost:9004)
 *  - Docker local: '/api' (proxied by nginx to server:9004)
 *  - Production:   'https://api.voxeia.com/api' (set via VITE_API_URL build arg)
 */
const baseURL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: true,
});

export default apiClient;
