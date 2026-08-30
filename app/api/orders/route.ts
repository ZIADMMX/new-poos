import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const { productId, customerEmail } = await request.json();

    if (!productId || !customerEmail) {
      return NextResponse.json(
        { message: 'يرجى اختيار المنتج وتوفير البريد الإلكتروني' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json(
        { message: 'المنتج غير موجود' },
        { status: 404 }
      );
    }

    // 1. Create Order in database
    const order = await prisma.order.create({
      data: {
        productId: product.id,
        customerEmail: customerEmail.trim().toLowerCase(),
        status: 'PENDING',
      },
    });

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // 2. Stripe Checkout Session
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (stripeSecret) {
      const stripe = new Stripe(stripeSecret);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: product.title,
                description: product.description || `قالب أتمتة ${product.platform}`,
              },
              unit_amount: Math.round(product.price * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        customer_email: customerEmail,
        metadata: {
          orderId: order.id,
          productId: product.id,
        },
        success_url: `${origin}/checkout/success?order_id=${order.id}`,
        cancel_url: `${origin}/checkout/cancel?order_id=${order.id}`,
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { stripeSessionId: session.id },
      });

      return NextResponse.json({ checkoutUrl: session.url });
    }

    // Fallback if Stripe key is not configured (Direct success flow for dev/MVP testing)
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'PAID' },
    });

    return NextResponse.json({
      checkoutUrl: `${origin}/checkout/success?order_id=${order.id}`,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء إنشاء الطلب' },
      { status: 500 }
    );
  }
}
