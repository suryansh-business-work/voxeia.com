import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { callLogsQuerySchema } from './calllogs.validators';
import * as callLogService from './calllogs.services';

export const getCallLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = callLogsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const { logs, total } = await callLogService.getCallLogs(req.userId!, parsed.data);
    res.status(200).json({
      success: true,
      data: logs,
      pagination: { page: parsed.data.page, pageSize: parsed.data.pageSize, total },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch call logs';
    res.status(500).json({ success: false, message: msg });
  }
};

export const getCallLogByCallSid = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const log = await callLogService.getCallLogByCallSid(req.userId!, req.params.callSid);
    if (!log) {
      res.status(404).json({ success: false, message: 'Call log not found' });
      return;
    }
    res.status(200).json({ success: true, data: log });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch call log';
    res.status(500).json({ success: false, message: msg });
  }
};
