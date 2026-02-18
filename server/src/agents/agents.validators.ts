import { z } from 'zod';

export const createAgentSchema = z.object({
  name: z.string({ required_error: 'Agent name is required' }).min(2).max(100),
  systemPrompt: z.string({ required_error: 'System prompt is required' }).min(10).max(5000),
  voice: z.string().min(1).optional().default('Polly.Joanna-Neural'),
  greeting: z
    .string()
    .max(500)
    .optional()
    .default('Hello! I am your AI assistant. How can I help you today?'),
});

export const updateAgentSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  systemPrompt: z.string().min(10).max(5000).optional(),
  voice: z.string().min(1).optional(),
  greeting: z.string().max(500).optional(),
});

export const agentListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
  search: z.string().optional(),
});

export type CreateAgentInput = z.infer<typeof createAgentSchema>;
export type UpdateAgentInput = z.infer<typeof updateAgentSchema>;
export type AgentListQueryInput = z.infer<typeof agentListQuerySchema>;
