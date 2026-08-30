'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { getProductById, createOrder, Product } from '@/lib/api';
import { ArrowRight, ShoppingCart, Mail, Zap, Layers, Code2, ShieldCheck, Download, Loader2, AlertCircle } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [email, setEmail] = useState('');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setLoadError(err.message);
        } else {
          setLoadError('لم نتمكن من العثور على هذا المنتج');
        }
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setCheckoutError('يرجى كتابة بريد إلكتروني صحيح لتسليم المنتج');
      return;
    }

    try {
      setPurchasing(true);
      setCheckoutError(null);
      const { checkoutUrl } = await createOrder(id, email);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error('لم يتوفر رابط دفع صحيح من Stripe');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setCheckoutError(err.message);
      } else {
        setCheckoutError('حدث خطأ أثناء الاتصال ببوابة الدفع Stripe');
      }
      setPurchasing(false);
    }
  };

  const getPlatformIcon = (platform: Product['platform']) => {
    switch (platform?.toLowerCase()) {
      case 'n8n':
        return <Zap className="w-4 h-4 text-rose-400" />;
      case 'make':
        return <Layers className="w-4 h-4 text-purple-400" />;
      case 'zapier':
      default:
        return <Code2 className="w-4 h-4 text-amber-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
        <p className="text-sm">جاري تحميل تفاصيل المنتج...</p>
      </div>
    );
  }

  if (loadError || !product) {
    return (
      <div className="max-w-lg mx-auto py-12 text-center space-y-4">
        <div className="bg-rose-950/80 border border-rose-800 text-rose-300 p-6 rounded-2xl text-sm">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p className="font-semibold">{loadError || 'المنتج غير موجود'}</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 font-semibold"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة لجميع المنتجات</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Product Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-indigo-300 border border-slate-700">
                {getPlatformIcon(product.platform)}
                {product.platform.toUpperCase()} Workflow
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
              {product.title}
            </h1>

            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-line border-t border-slate-800/80 pt-6">
              {product.description || 'لا يوجد وصف مفصل متاح لهذا المنتج.'}
            </div>

            {/* Included Assets */}
            <div className="bg-[#090d16] border border-slate-800/80 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                محتويات حزمة الشراء:
              </h4>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>ملف Workflow JSON جاهز للاستيراد المباشر</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>حقوق استخدام غير محدودة في مشاريعك الخاصة</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Box */}
        <div className="sticky top-24 bg-[#111827] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs text-slate-400 block mb-1">سعر شراء المنتج:</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-400">${product.price}</span>
              <span className="text-xs text-slate-500">دفع مرة واحدة</span>
            </div>
          </div>

          <form onSubmit={handleBuy} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                بريدك الإلكتروني (لاستلام إيصال الشراء)
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#090d16] border border-slate-700/80 rounded-xl pr-10 pl-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
              </div>
            </div>

            {checkoutError && (
              <div className="text-xs text-rose-400 bg-rose-950/60 border border-rose-800 p-3 rounded-xl flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{checkoutError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={purchasing}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {purchasing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري التوجيه لـ Stripe...</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  <span>شراء الآن عبر Stripe</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <span className="text-[11px] text-slate-500 inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              دفع مشفر ومضمون 100% بواسطة Stripe
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
