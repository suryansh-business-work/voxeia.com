import { z } from 'zod';

export const createCompanySchema = z.object({
  name: z.string({ required_error: 'Company name is required' }).min(1).max(200),
  industry: z.string().max(100).optional().default(''),
  website: z.string().url('Invalid URL').or(z.literal('')).optional().default(''),
  phone: z.string().max(20).optional().default(''),
  email: z.string().email('Invalid email').or(z.literal('')).optional().default(''),
  address: z.string().max(500).optional().default(''),
  notes: z.string().max(2000).optional().default(''),
});

export const updateCompanySchema = z.object({
  name: z.string().min(1).max(200).optional(),
  industry: z.string().max(100).optional(),
  website: z.string().url('Invalid URL').or(z.literal('')).optional(),
  phone: z.string().max(20).optional(),
  email: z.string().email('Invalid email').or(z.literal('')).optional(),
  address: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
});

export const companyListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'industry', 'createdAt', 'contactCount']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
export type CompanyListQueryInput = z.infer<typeof companyListQuerySchema>;
