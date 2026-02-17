import express from 'express';
import cors from 'cors';
import { envConfig } from './config';
import callsRoutes from './calls/calls.routes';

const app = express();

// Middleware
app.use(cors({ origin: envConfig.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/calls', callsRoutes);

export default app;
