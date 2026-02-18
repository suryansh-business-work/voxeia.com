import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as contactsService from './contacts.services';
import { createContactSchema, updateContactSchema, contactListQuerySchema } from './contacts.validators';

export const create = async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const parsed = createContactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: parsed.error.errors[0].message });
    return;
  }
  const contact = await contactsService.createContact(userId!, parsed.data);
  res.status(201).json({ success: true, message: 'Contact created', data: contact });
};

export const list = async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const parsed = contactListQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: parsed.error.errors[0].message });
    return;
  }
  const result = await contactsService.getContacts(userId!, parsed.data);
  res.json({ success: true, ...result });
};

export const getById = async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const contact = await contactsService.getContactById(userId!, req.params.id);
  if (!contact) {
    res.status(404).json({ success: false, message: 'Contact not found' });
    return;
  }
  res.json({ success: true, data: contact });
};

export const update = async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const parsed = updateContactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: parsed.error.errors[0].message });
    return;
  }
  const contact = await contactsService.updateContact(userId!, req.params.id, parsed.data);
  if (!contact) {
    res.status(404).json({ success: false, message: 'Contact not found' });
    return;
  }
  res.json({ success: true, message: 'Contact updated', data: contact });
};

export const remove = async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const contact = await contactsService.deleteContact(userId!, req.params.id);
  if (!contact) {
    res.status(404).json({ success: false, message: 'Contact not found' });
    return;
  }
  res.json({ success: true, message: 'Contact deleted' });
};
