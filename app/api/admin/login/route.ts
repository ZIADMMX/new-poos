import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return NextResponse.json({ message: 'من فضلك أدخل الإيميل وكلمة المرور' }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { email: normalizedEmail } });

    // رسالة خطأ موحدة لأسباب أمنية (منع User Enumeration)
    if (!admin) {
      return NextResponse.json({ message: 'بيانات الدخول غير صحيحة' }, { status: 401 });
    }

    const isPasswordValid = await comparePassword(password, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'بيانات الدخول غير صحيحة' }, { status: 401 });
    }

    const accessToken = signToken({ adminId: admin.id, email: admin.email });

    return NextResponse.json({ accessToken }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'حدث خطأ أثناء تسجيل الدخول' }, { status: 500 });
  }
}
