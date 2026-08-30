import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET مش موجود في ملف .env — حط قيمة عشوائية طويلة قبل ما تشغل السيرفر');
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: { adminId: string; email: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): { adminId: string; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { adminId: string; email: string };
  } catch {
    return null;
  }
}

// التحقق الأساسي من شكل الإيميل والباسورد
export function validateCredentials(email: string, password: string): string | null {
  const normalizedEmail = email?.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
    return 'صيغة البريد الإلكتروني غير صحيحة';
  }
  if (!password || password.length < 8) {
    return 'كلمة المرور لازم تكون 8 أحرف على الأقل';
  }
  if (password.length > 72) {
    return 'كلمة المرور طويلة جدًا (الحد الأقصى 72 حرف)';
  }
  return null;
}
