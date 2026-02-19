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
    .default('meera'),
  systemPrompt: z
    .string()
    .max(2000, 'System prompt must be under 2000 characters')
    .optional(),
  agentId: z.string().optional(),
  language: z.string().optional().default('en-IN'),
  aiModel: z.string().optional(),
});

export type AiCallInput = z.infer<typeof aiCallSchema>;

export const translateSchema = z.object({
  text: z.string().min(1, 'Text is required').max(5000, 'Text must be under 5000 characters'),
  targetLanguage: z.string().min(2, 'Target language code is required'),
});

export type TranslateInput = z.infer<typeof translateSchema>;
