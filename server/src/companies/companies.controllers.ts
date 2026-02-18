import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as companiesService from './companies.services';
import { createCompanySchema, updateCompanySchema, companyListQuerySchema } from './companies.validators';

export const create = async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const parsed = createCompanySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: parsed.error.errors[0].message });
    return;
  }
  const company = await companiesService.createCompany(userId!, parsed.data);
  res.status(201).json({ success: true, message: 'Company created', data: company });
};

export const list = async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const parsed = companyListQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: parsed.error.errors[0].message });
    return;
  }
  const result = await companiesService.getCompanies(userId!, parsed.data);
  res.json({ success: true, ...result });
};

export const getById = async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const company = await companiesService.getCompanyById(userId!, req.params.id);
  if (!company) {
    res.status(404).json({ success: false, message: 'Company not found' });
    return;
  }
  res.json({ success: true, data: company });
};

export const update = async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const parsed = updateCompanySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: parsed.error.errors[0].message });
    return;
  }
  const company = await companiesService.updateCompany(userId!, req.params.id, parsed.data);
  if (!company) {
    res.status(404).json({ success: false, message: 'Company not found' });
    return;
  }
  res.json({ success: true, message: 'Company updated', data: company });
};

export const remove = async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const company = await companiesService.deleteCompany(userId!, req.params.id);
  if (!company) {
    res.status(404).json({ success: false, message: 'Company not found' });
    return;
  }
  res.json({ success: true, message: 'Company deleted' });
};
