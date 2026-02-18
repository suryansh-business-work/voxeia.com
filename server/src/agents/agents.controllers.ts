import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { createAgentSchema, updateAgentSchema, agentListQuerySchema } from './agents.validators';
import * as agentService from './agents.services';

export const createAgent = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = createAgentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const agent = await agentService.createAgent(req.userId!, parsed.data);
    res.status(201).json({ success: true, message: 'Agent created', data: agent });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to create agent';
    res.status(500).json({ success: false, message: msg });
  }
};

export const getAgents = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = agentListQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const { agents, total } = await agentService.getAgents(req.userId!, parsed.data);
    res.status(200).json({
      success: true,
      data: agents,
      pagination: { page: parsed.data.page, pageSize: parsed.data.pageSize, total },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch agents';
    res.status(500).json({ success: false, message: msg });
  }
};

export const getAgentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const agent = await agentService.getAgentById(req.userId!, req.params.agentId);
    if (!agent) {
      res.status(404).json({ success: false, message: 'Agent not found' });
      return;
    }
    res.status(200).json({ success: true, data: agent });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch agent';
    res.status(500).json({ success: false, message: msg });
  }
};

export const updateAgent = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = updateAgentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const agent = await agentService.updateAgent(req.userId!, req.params.agentId, parsed.data);
    if (!agent) {
      res.status(404).json({ success: false, message: 'Agent not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Agent updated', data: agent });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to update agent';
    res.status(500).json({ success: false, message: msg });
  }
};

export const deleteAgent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deleted = await agentService.deleteAgent(req.userId!, req.params.agentId);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Agent not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Agent deleted' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to delete agent';
    res.status(500).json({ success: false, message: msg });
  }
};
