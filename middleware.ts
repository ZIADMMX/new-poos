import { NextRequest, NextResponse } from 'next/server';

// تخزين مؤقت في الذاكرة: IP -> [قائمة أوقات الـ requests]
const requestLog = new Map<string, number[]>();

interface RateLimitConfig {
  windowMs: number; // النافذة الزمنية بالميلي ثانية
  maxRequests: number; // أقصى عدد requests خلال النافذة دي
}

// حدود مختلفة حسب حساسية الـ route
const RATE_LIMITS: Record<string, RateLimitConfig> = {
  '/api/admin/login': { windowMs: 5 * 60 * 1000, maxRequests: 5 }, // 5 محاولات / 5 دقايق
  '/api/admin/register': { windowMs: 5 * 60 * 1000, maxRequests: 3 }, // 3 محاولات / 5 دقايق
  '/api/orders': { windowMs: 60 * 1000, maxRequests: 10 }, // 10 أوردرات / دقيقة
  default: { windowMs: 60 * 1000, maxRequests: 30 }, // باقي الـ endpoints
};

function getRateLimitConfig(pathname: string): RateLimitConfig {
  const matchedKey = Object.keys(RATE_LIMITS).find((key) => key !== 'default' && pathname.startsWith(key));
  return RATE_LIMITS[matchedKey ?? 'default'];
}

function isRateLimited(identifier: string, config: RateLimitConfig): boolean {
  const now = Date.now();
  const timestamps = requestLog.get(identifier) ?? [];

  // شيل أي timestamps أقدم من النافذة الزمنية
  const recentTimestamps = timestamps.filter((t) => now - t < config.windowMs);

  if (recentTimestamps.length >= config.maxRequests) {
    requestLog.set(identifier, recentTimestamps);
    return true;
  }

  recentTimestamps.push(now);
  requestLog.set(identifier, recentTimestamps);
  return false;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // استثناء الـ Stripe webhook بالكامل — Stripe لازم توصلها من غير أي حظر
  if (pathname.startsWith('/api/webhooks')) {
    return NextResponse.next();
  }

  // طبق الحماية بس على مسارات الـ API
  if (!pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? request.headers.get('x-real-ip') ?? 'unknown';

  const config = getRateLimitConfig(pathname);
  const identifier = `${ip}:${pathname}`;

  if (isRateLimited(identifier, config)) {
    return NextResponse.json(
      { message: 'محاولات كتير جدًا، حاول تاني بعد شوية' },
      { status: 429 },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
