import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

function getAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  return verifyToken(token);
}

export async function POST(request: NextRequest) {
  try {
    const admin = getAdminAuth(request);
    if (!admin) {
      return NextResponse.json(
        { message: 'غير مصرح لك بالوصول، يرجى تسجيل الدخول كأدمن' },
        { status: 401 }
      );
    }

    const { title, description, price, platform, workflowJson } = await request.json();

    if (!title || !workflowJson || price === undefined) {
      return NextResponse.json(
        { message: 'جميع الحقول المطلوبة يجب إدخالها (العنوان، السعر، وكود الـ JSON)' },
        { status: 400 }
      );
    }

    // Validate JSON
    try {
      JSON.parse(workflowJson);
    } catch {
      return NextResponse.json(
        { message: 'كود الـ JSON غير صالح! يرجى التأكد من التنسيق' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        title: title.trim(),
        description: description?.trim() || '',
        price: Number(price),
        platform: platform || 'n8n',
        workflowJson: workflowJson.trim(),
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء إنشاء المنتج' },
      { status: 500 }
    );
  }
}
