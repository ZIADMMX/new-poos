import ProductCard from '@/components/ProductCard';
import { getProducts, Product } from '@/lib/api';
import { Cpu, Zap, ShieldCheck, Download, Sparkles, AlertCircle } from 'lucide-react';

export default async function HomePage() {
  let products: Product[] = [];
  let error: string | null = null;

  try {
    products = await getProducts();
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل المنتجات';
  }

  return (
    <div className="space-y-12 py-4">
      {/* Hero Banner */}
      <section className="relative rounded-3xl bg-gradient-to-b from-indigo-950/40 via-slate-900/60 to-slate-900/80 border border-slate-800/80 p-8 sm:p-12 text-center overflow-hidden shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          أتمتة الأعمال الجاهزة للتنشيط
        </span>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto mb-4">
          وفّر مئات الساعات مع قوالب{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
            n8n & Zapier & Make
          </span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          حمل ملفات الـ JSON الجاهزة مباشرة وقم باستيرادها في بيئة الأتمتة الخاصة بك بنقرة واحدة بعد الدفع عبر Stripe.
        </p>

        <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400 pt-4 border-t border-slate-800/80 max-w-xl mx-auto">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-400" />
            <span>تحميل فوري بعد الدفع</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>أكواد JSON جاهزة</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>دفع آمن مع Stripe</span>
          </div>
        </div>
      </section>

      {/* Product Showcase Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            أحدث قوالب الأتمتة
          </h2>
          <p className="text-xs text-slate-400 mt-1">اختر الأداة المناسبة لاحتياجات عملك</p>
        </div>
      </div>

      {/* Product Grid */}
      {error ? (
        <div className="flex items-center gap-3 bg-rose-950/80 border border-rose-800 text-rose-300 p-4 rounded-xl text-sm max-w-lg mx-auto">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-12 text-center max-w-md mx-auto">
          <p className="text-slate-400 text-sm">لا توجد منتجات متاحة في المتجر حالياً.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
