import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken, validateCredentials } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const normalizedEmail = email?.trim().toLowerCase();

    // 1. Validation أساسي
    const validationError = validateCredentials(normalizedEmail, password);
    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    // 2. الأهم: قفل التسجيل بعد أول أدمن — ده مش اختياري
    const adminCount = await prisma.admin.count();
    if (adminCount > 0) {
      return NextResponse.json(
        { message: 'التسجيل مغلق، يوجد حساب أدمن بالفعل' },
        { status: 403 },
      );
    }

    // 3. تأكد إن الإيميل مش مستخدم قبل كده
    const existing = await prisma.admin.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json({ message: 'الإيميل ده مستخدم بالفعل' }, { status: 409 });
    }

    // 4. تشفير الباسورد وإنشاء الحساب
    const hashedPassword = await hashPassword(password);
    const admin = await prisma.admin.create({
      data: { email: normalizedEmail, password: hashedPassword },
    });

    // 5. توليد التوكن
    const accessToken = signToken({ adminId: admin.id, email: admin.email });

    return NextResponse.json({ accessToken }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ message: 'حدث خطأ أثناء إنشاء الحساب' }, { status: 500 });
  }
}
