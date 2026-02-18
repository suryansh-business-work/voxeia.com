import { Request, Response } from 'express';
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from './auth.validators';
import * as authService from './auth.services';
import { AuthRequest } from '../middleware/auth.middleware';

export const signup = async (req: Request, res: Response): Promise<void> => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const result = await authService.signup(parsed.data.name, parsed.data.email, parsed.data.password);
    res.status(201).json({ success: true, message: 'Account created successfully', data: result });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Signup failed';
    res.status(400).json({ success: false, message: msg });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const result = await authService.login(parsed.data.email, parsed.data.password);
    res.status(200).json({ success: true, message: 'Login successful', data: result });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Login failed';
    res.status(401).json({ success: false, message: msg });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    await authService.forgotPassword(parsed.data.email);
    res.status(200).json({ success: true, message: 'If the email exists, a password reset link has been sent' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to process request';
    res.status(500).json({ success: false, message: msg });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    await authService.resetPassword(parsed.data.token, parsed.data.password);
    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Reset failed';
    res.status(400).json({ success: false, message: msg });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await authService.getProfile(req.userId!);
    res.status(200).json({ success: true, data: user });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to get profile';
    res.status(404).json({ success: false, message: msg });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const user = await authService.updateProfile(req.userId!, parsed.data);
    res.status(200).json({ success: true, message: 'Profile updated', data: user });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Update failed';
    res.status(400).json({ success: false, message: msg });
  }
};

export const uploadProfilePhoto = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }
    const user = await authService.uploadProfilePhoto(req.userId!, req.file.buffer, req.file.originalname);
    res.status(200).json({ success: true, message: 'Profile photo updated', data: user });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Upload failed';
    res.status(500).json({ success: false, message: msg });
  }
};
