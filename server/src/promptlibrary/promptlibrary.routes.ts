import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createPrompt,
  getPrompts,
  getPromptById,
  updatePromptController,
  deletePromptController,
  generatePromptController,
} from './promptlibrary.controllers';

const router = Router();

/** POST /api/prompts - Create a new prompt template */
router.post('/', authMiddleware, createPrompt);

/** POST /api/prompts/generate - AI generate a prompt from description */
router.post('/generate', authMiddleware, generatePromptController);

/** GET /api/prompts - List all prompt templates for user */
router.get('/', authMiddleware, getPrompts);

/** GET /api/prompts/:promptId - Get prompt by ID */
router.get('/:promptId', authMiddleware, getPromptById);

/** PUT /api/prompts/:promptId - Update a prompt template */
router.put('/:promptId', authMiddleware, updatePromptController);

/** DELETE /api/prompts/:promptId - Delete a prompt template */
router.delete('/:promptId', authMiddleware, deletePromptController);

export default router;
