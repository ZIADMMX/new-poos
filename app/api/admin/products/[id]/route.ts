import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';

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
