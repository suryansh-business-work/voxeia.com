import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { getCallLogs, getCallLogByCallSid } from './calllogs.controllers';

const router = Router();

/** GET /api/calllogs - Get paginated call logs for current user */
router.get('/', authMiddleware, getCallLogs);

/** GET /api/calllogs/:callSid - Get a specific call log */
router.get('/:callSid', authMiddleware, getCallLogByCallSid);

export default router;
