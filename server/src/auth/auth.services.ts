import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';
import crypto from 'crypto';
import User, { IUser } from './auth.models';
import { envConfig } from '../config';
import { sendMail } from '../config/mail';
import { getImageKit } from '../config/imagekit';

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, envConfig.JWT_SECRET, {
    expiresIn: envConfig.JWT_EXPIRES_IN as StringValue,
  });
};

const sanitizeUser = (user: IUser) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  profilePhoto: user.profilePhoto,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const signup = async (name: string, email: string, password: string) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error('Email already registered');
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashed });

  const token = generateToken(user._id.toString());

  // Send welcome email
  try {
    await sendMail({
      to: email,
      subject: 'Welcome to Twilio Call Bot!',
      html: `<h2>Welcome, ${name}!</h2><p>Your account has been created successfully. You can now log in and start using Twilio Call Bot.</p>`,
    });
  } catch (err) {
    console.warn('[Auth] Could not send welcome email:', err);
  }

  return { token, user: sanitizeUser(user) };
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id.toString());
  return { token, user: sanitizeUser(user) };
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if email exists
    return;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  const resetUrl = `${envConfig.CLIENT_URL}/reset-password/${resetToken}`;

  await sendMail({
    to: email,
    subject: 'Password Reset - Twilio Call Bot',
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#F22F46;color:white;text-decoration:none;border-radius:8px;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
};

export const resetPassword = async (token: string, newPassword: string) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new Error('Invalid or expired reset token');
  }

  user.password = await bcrypt.hash(newPassword, 12);
  user.resetPasswordToken = '';
  user.resetPasswordExpires = null;
  await user.save();

  // Notify user
  try {
    await sendMail({
      to: user.email,
      subject: 'Password Changed - Twilio Call Bot',
      html: `<h2>Password Changed</h2><p>Your password has been successfully changed. If you didn't make this change, contact support immediately.</p>`,
    });
  } catch (err) {
    console.warn('[Auth] Could not send password change email:', err);
  }
};

export const getProfile = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return sanitizeUser(user);
};

export const updateProfile = async (userId: string, data: { name?: string }) => {
  const user = await User.findByIdAndUpdate(userId, data, { returnDocument: 'after', runValidators: true });
  if (!user) {
    throw new Error('User not found');
  }
  return sanitizeUser(user);
};

export const uploadProfilePhoto = async (userId: string, fileBuffer: Buffer, fileName: string) => {
  const imagekit = getImageKit();
  if (!imagekit) {
    throw new Error('ImageKit is not configured. Set IMAGEKIT_PRIVATE_KEY in .env');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Delete old photo if exists
  if (user.profilePhotoFileId) {
    try {
      await imagekit.files.delete(user.profilePhotoFileId);
    } catch {
      // ignore deletion errors
    }
  }

  const uploaded = await imagekit.files.upload({
    file: fileBuffer.toString('base64'),
    fileName: `profile_${userId}_${fileName}`,
    folder: '/twilio-call-bot/profiles',
  });

  user.profilePhoto = uploaded.url ?? '';
  user.profilePhotoFileId = uploaded.fileId ?? '';
  await user.save();

  return sanitizeUser(user);
};
