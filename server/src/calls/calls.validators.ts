import { z } from 'zod';

const phoneRegex = /^\+[1-9]\d{1,14}$/;

export const makeCallSchema = z.object({
  to: z
    .string({ required_error: 'Phone number is required' })
    .regex(phoneRegex, 'Phone number must be in E.164 format (e.g., +911234567890)'),
  message: z
    .string()
    .min(1, 'Message must not be empty')
    .max(500, 'Message must be under 500 characters')
    .optional()
    .default('Hello! This is a call from Exyconn.'),
  voice: z
    .string()
    .min(1)
    .optional()
    .default('Polly.Joanna-Neural'),
  agentId: z.string().optional(),
  language: z.string().optional().default('en-US'),
});

export const callLogsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
  status: z.string().optional(),
  to: z.string().optional(),
  from: z.string().optional(),
  agentId: z.string().optional(),
});

export type MakeCallInput = z.infer<typeof makeCallSchema>;
export type CallLogsQueryInput = z.infer<typeof callLogsQuerySchema>;
