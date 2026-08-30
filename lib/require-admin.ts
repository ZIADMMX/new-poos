import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export interface AdminPayload {
  adminId: string;
  email: string;
}

export function requireAdmin(
  request: NextRequest,
  handler: (adminPayload: AdminPayload) => Promise<NextResponse>
) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { message: 'غير مصرح لك بالوصول، يرجي إرسال توكن المصادقة' },
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1];
  const adminPayload = verifyToken(token);

  if (!adminPayload) {
    return NextResponse.json(
      { message: 'توكن المصادقة غير صالح أو منتهي الصلاحية' },
      { status: 401 }
    );
  }

  return handler(adminPayload);
}
