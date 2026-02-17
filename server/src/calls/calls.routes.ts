import { Router } from 'express';
import { initiateCall, fetchCallLogs } from './calls.controllers';

const router = Router();

/** POST /api/calls - Initiate a new outbound call */
router.post('/', initiateCall);

/** GET /api/calls/logs - Get call history/logs */
router.get('/logs', fetchCallLogs);

export default router;
