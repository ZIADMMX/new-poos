import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdmin(request, async () => {
    try {
      const { id } = await params;
      const { title, description, price, platform, workflowJson } = await request.json();

      const existingProduct = await prisma.product.findUnique({ where: { id } });
      if (!existingProduct) {
        return NextResponse.json(
          { message: 'المنتج غير موجود' },
          { status: 404 }
        );
      }

      if (workflowJson) {
        try {
          JSON.parse(workflowJson);
        } catch {
          return NextResponse.json(
            { message: 'كود الـ JSON غير صالح! يرجى التأكد من التنسيق' },
            { status: 400 }
          );
        }
      }

      const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
          ...(title && { title: title.trim() }),
          ...(description !== undefined && { description: description.trim() }),
          ...(price !== undefined && { price: Number(price) }),
          ...(platform && { platform }),
          ...(workflowJson && { workflowJson: workflowJson.trim() }),
        },
      });

      return NextResponse.json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      return NextResponse.json(
        { message: 'حدث خطأ أثناء تعديل المنتج' },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdmin(request, async () => {
    try {
      const { id } = await params;

      const existingProduct = await prisma.product.findUnique({ where: { id } });
      if (!existingProduct) {
        return NextResponse.json(
          { message: 'المنتج غير موجود' },
          { status: 404 }
        );
      }

      await prisma.product.delete({ where: { id } });

      return NextResponse.json({ success: true, message: 'تم حذف المنتج بنجاح' });
    } catch (error) {
      console.error('Error deleting product:', error);
      return NextResponse.json(
        { message: 'حدث خطأ أثناء حذف المنتج' },
        { status: 500 }
      );
    }
  });
}
