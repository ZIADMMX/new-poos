import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';

export async function POST(request: NextRequest) {
  return requireAdmin(request, async () => {
    try {
      const { title, description, price, platform, workflowJson } = await request.json();

      if (!title || !workflowJson || price === undefined) {
        return NextResponse.json(
          { message: 'جميع الحقول المطلوبة يجب إدخالها (العنوان، السعر، وكود الـ JSON)' },
          { status: 400 }
        );
      }

      // Validate JSON formatting
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
  });
}
