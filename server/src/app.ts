import express from 'express';
import cors from 'cors';
import { envConfig } from './config';
import callsRoutes from './calls/calls.routes';
import aiRoutes from './ai/ai.routes';
import authRoutes from './auth/auth.routes';
import agentsRoutes from './agents/agents.routes';
import callLogsRoutes from './calllogs/calllogs.routes';
import companiesRoutes from './companies/companies.routes';
import contactsRoutes from './contacts/contacts.routes';

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
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentsRoutes);
app.use('/api/calllogs', callLogsRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/calls', callsRoutes);
app.use('/api/ai', aiRoutes);

export default app;
