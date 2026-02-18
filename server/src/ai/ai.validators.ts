import { z } from 'zod';

const phoneRegex = /^\+[1-9]\d{1,14}$/;

export const aiCallSchema = z.object({
  to: z
    .string({ required_error: 'Phone number is required' })
    .regex(phoneRegex, 'Phone number must be in E.164 format (e.g., +911234567890)'),
  message: z
    .string()
    .min(1, 'Opening message must not be empty')
    .max(500, 'Opening message must be under 500 characters')
    .optional()
    .default('Hello! I am your AI assistant. How can I help you today?'),
  voice: z
    .string()
    .min(1)
    .optional()
    .default('Polly.Joanna-Neural'),
  systemPrompt: z
    .string()
    .max(2000, 'System prompt must be under 2000 characters')
    .optional(),
  agentId: z.string().optional(),
  language: z.string().optional().default('en-US'),
});

export type AiCallInput = z.infer<typeof aiCallSchema>;
