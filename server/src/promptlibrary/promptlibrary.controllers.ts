import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import {
  createPromptSchema,
  updatePromptSchema,
  promptListQuerySchema,
  generatePromptSchema,
} from './promptlibrary.validators';
import * as promptService from './promptlibrary.services';
import { generateAgentPrompt } from '../ai/ai.services';

export const createPrompt = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = createPromptSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.flatten().fieldErrors });
    return;
  }
  try {
    const prompt = await promptService.createPrompt(req.userId!, parsed.data);
    res.status(201).json({ success: true, message: 'Prompt created', data: prompt });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to create prompt';
    res.status(500).json({ success: false, message: msg });
  }
};

export const getPrompts = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = promptListQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.flatten().fieldErrors });
    return;
  }
  try {
    const { prompts, total } = await promptService.getPrompts(req.userId!, parsed.data);
    res.status(200).json({
      success: true,
      data: prompts,
      pagination: { page: parsed.data.page, pageSize: parsed.data.pageSize, total },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch prompts';
    res.status(500).json({ success: false, message: msg });
  }
};

export const getPromptById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const prompt = await promptService.getPromptById(req.userId!, req.params.promptId);
    if (!prompt) {
      res.status(404).json({ success: false, message: 'Prompt not found' });
      return;
    }
    res.status(200).json({ success: true, data: prompt });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch prompt';
    res.status(500).json({ success: false, message: msg });
  }
};

export const updatePromptController = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = updatePromptSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.flatten().fieldErrors });
    return;
  }
  try {
    const prompt = await promptService.updatePrompt(req.userId!, req.params.promptId, parsed.data);
    if (!prompt) {
      res.status(404).json({ success: false, message: 'Prompt not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Prompt updated', data: prompt });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to update prompt';
    res.status(500).json({ success: false, message: msg });
  }
};

export const deletePromptController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deleted = await promptService.deletePrompt(req.userId!, req.params.promptId);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Prompt not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Prompt deleted' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to delete prompt';
    res.status(500).json({ success: false, message: msg });
  }
};

export const generatePromptController = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = generatePromptSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.flatten().fieldErrors });
    return;
  }
  try {
    const result = await generateAgentPrompt(parsed.data.description, parsed.data.language);
    res.status(200).json({ success: true, data: result });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to generate prompt';
    res.status(500).json({ success: false, message: msg });
  }
};
