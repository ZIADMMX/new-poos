import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!order || !order.product) {
      return NextResponse.json(
        { message: 'الطلب غير موجود' },
        { status: 404 }
      );
    }

    if (order.status !== 'PAID') {
      return NextResponse.json(
        { message: 'الطلب غير مكتمل أو لم يتم تأكيد الدفع بعد' },
        { status: 403 }
      );
    }

    const jsonContent = order.product.workflowJson;
    const safeTitle = order.product.title.replace(/[^a-zA-Z0-9_-]/g, '_');

    return new NextResponse(jsonContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="workflow-${safeTitle}.json"`,
      },
    });
  } catch (error) {
    console.error('Error downloading workflow JSON:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء تنزيل الملف' },
      { status: 500 }
    );
  }
}
