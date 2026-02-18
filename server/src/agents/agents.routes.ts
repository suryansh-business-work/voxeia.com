import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createAgent,
  getAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
  uploadAgentImage,
} from './agents.controllers';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

/** POST /api/agents - Create a new call agent */
router.post('/', authMiddleware, createAgent);

/** GET /api/agents - List all agents for user */
router.get('/', authMiddleware, getAgents);

/** GET /api/agents/:agentId - Get agent by ID */
router.get('/:agentId', authMiddleware, getAgentById);

/** PUT /api/agents/:agentId - Update an agent */
router.put('/:agentId', authMiddleware, updateAgent);

/** POST /api/agents/:agentId/photo - Upload agent photo */
router.post('/:agentId/photo', authMiddleware, upload.single('image'), uploadAgentImage);

/** DELETE /api/agents/:agentId - Delete an agent */
router.delete('/:agentId', authMiddleware, deleteAgent);

export default router;
