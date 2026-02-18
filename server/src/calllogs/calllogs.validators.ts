import { z } from 'zod';

export const callLogsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
  status: z.string().optional(),
  to: z.string().optional(),
  from: z.string().optional(),
  agentId: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CallLogsQueryInput = z.infer<typeof callLogsQuerySchema>;
