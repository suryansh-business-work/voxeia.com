import { Router } from 'express';
import multer from 'multer';
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  uploadProfilePhoto,
} from './auth.controllers';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

/** POST /api/auth/signup */
router.post('/signup', signup);

/** POST /api/auth/login */
router.post('/login', login);

/** POST /api/auth/forgot-password */
router.post('/forgot-password', forgotPassword);

/** POST /api/auth/reset-password */
router.post('/reset-password', resetPassword);

/** GET /api/auth/profile */
router.get('/profile', authMiddleware, getProfile);

/** PUT /api/auth/profile */
router.put('/profile', authMiddleware, updateProfile);

/** POST /api/auth/profile/photo */
router.post('/profile/photo', authMiddleware, upload.single('photo'), uploadProfilePhoto);

export default router;
