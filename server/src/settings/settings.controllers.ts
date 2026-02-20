import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { updateSettingsSchema } from './settings.validators';
import * as settingsService from './settings.services';

/**
 * GET /api/settings - Get current user's settings
 */
export const getSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const settings = await settingsService.getSettings(req.userId!);
    res.status(200).json({ success: true, data: settings });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch settings';
    res.status(500).json({ success: false, message: msg });
  }
};

/**
 * PUT /api/settings - Update current user's settings
 */
export const updateSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = updateSettingsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const settings = await settingsService.updateSettings(req.userId!, parsed.data);
    res.status(200).json({ success: true, data: settings });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to update settings';
    res.status(500).json({ success: false, message: msg });
  }
};

/**
 * GET /api/settings/resolved - Get resolved config (env or custom based on switch)
 */
export const getResolvedConfig = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const config = await settingsService.getResolvedConfig(req.userId!);
    res.status(200).json({ success: true, data: config });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch resolved config';
    res.status(500).json({ success: false, message: msg });
  }
};
