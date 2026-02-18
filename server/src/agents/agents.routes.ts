import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createAgent,
  getAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
} from './agents.controllers';

const router = Router();

/** POST /api/agents - Create a new call agent */
router.post('/', authMiddleware, createAgent);

/** GET /api/agents - List all agents for user */
router.get('/', authMiddleware, getAgents);

/** GET /api/agents/:agentId - Get agent by ID */
router.get('/:agentId', authMiddleware, getAgentById);

/** PUT /api/agents/:agentId - Update an agent */
router.put('/:agentId', authMiddleware, updateAgent);

/** DELETE /api/agents/:agentId - Delete an agent */
router.delete('/:agentId', authMiddleware, deleteAgent);

export default router;
