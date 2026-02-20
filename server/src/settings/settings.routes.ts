import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { getSettings, updateSettings, getResolvedConfig } from './settings.controllers';

const router = Router();

/** GET /api/settings - Get current user's settings */
router.get('/', authMiddleware, getSettings);

/** PUT /api/settings - Update current user's settings */
router.put('/', authMiddleware, updateSettings);

/** GET /api/settings/resolved - Get resolved (env or custom) config */
router.get('/resolved', authMiddleware, getResolvedConfig);

export default router;
