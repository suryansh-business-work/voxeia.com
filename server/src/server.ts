import http from 'http';
import app from './app';
import { envConfig } from './config';
import { APP_PORTS } from './config/app.config';
import { connectDB } from './config/db';
import { initSocketIO } from './websocket';
import { startTunnel, getTunnelUrl, stopTunnel } from './tunnel';
import { initAllSchedules, stopAllSchedules } from './agents/agents.scheduler';
import { initRecurringScheduledCalls, stopAllRecurringTasks, processPendingScheduledCalls } from './scheduledcalls/scheduledcalls.services';

const start = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    const httpServer = http.createServer(app);

    // Attach Socket.io on dedicated WebSocket port
    initSocketIO(APP_PORTS.WEBSOCKET);

    httpServer.listen(APP_PORTS.SERVER, async () => {
      console.log(`Server running on http://localhost:${APP_PORTS.SERVER}`);
      console.log(`WebSocket running on ws://localhost:${APP_PORTS.WEBSOCKET}`);
      console.log(`Environment: ${envConfig.NODE_ENV}`);

      if (envConfig.OPENAI_API_KEY) {
        console.log('OpenAI: configured ✓');
      } else {
        console.log('OpenAI: not configured (set OPENAI_API_KEY in .env for AI calls)');
      }

      // In production, BASE_URL is already a public domain (e.g. https://api.voxeia.com)
      // so no tunnel is needed. Only start Cloudflare tunnel in development.
      const isPublicBaseUrl =
        !envConfig.BASE_URL.includes('localhost') &&
        !envConfig.BASE_URL.includes('127.0.0.1');

      if (isPublicBaseUrl) {
        console.log(`[Tunnel] Skipped — using production BASE_URL: ${envConfig.BASE_URL}`);
      } else {
        try {
          const url = await startTunnel(APP_PORTS.SERVER);
          console.log(`[Tunnel] Public URL ready: ${url}`);
          console.log('[Tunnel] AI conversation calls are now available ✓');
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          console.warn(`[Tunnel] Could not start: ${msg}`);
          console.warn('[Tunnel] AI conversation calls will not work without a public URL');
          console.warn('[Tunnel] Ensure cloudflared is installed: npm install -g cloudflared');
        }
      }

      // Initialize agent CRON schedules
      await initAllSchedules();
      await initRecurringScheduledCalls();

      // Check for pending scheduled calls every 30 seconds
      setInterval(() => {
        processPendingScheduledCalls().catch((err) =>
          console.error('[ScheduledCalls] Process error:', err)
        );
      }, 30_000);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', () => {
  stopTunnel();
  stopAllSchedules();
  stopAllRecurringTasks();
  process.exit(0);
});

start();
