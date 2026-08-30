import Link from 'next/link';
import { XCircle, ArrowRight, RefreshCw } from 'lucide-react';

export default async function CheckoutCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ productId?: string }>;
}) {
  const { productId } = await searchParams;
  const backHref = productId ? `/products/${productId}` : '/';

  return (
    <div className="max-w-md mx-auto py-16 text-center">
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-3xl bg-amber-950/80 border border-amber-800/80 flex items-center justify-center mx-auto text-amber-400 shadow-xl shadow-amber-900/30">
          <XCircle className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white mb-2">تم إلغاء عملية الدفع</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            يبدو أنه تم إلغاء عملية الدفع قبل إكمالها. لم يتم خصم أي مبالغ من حسابك.
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <Link
            href={backHref}
            className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all text-sm group"
          >
            <RefreshCw className="w-4 h-4 transition-transform group-hover:-rotate-180 duration-500" />
            <span>{productId ? 'العودة للمنتج والمحاولة مجدداً' : 'تصفح المنتجات والمحاولة مجدداً'}</span>
          </Link>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <a
              href="mailto:support@yourstore.com"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-slate-300 bg-slate-800/50 hover:bg-slate-800 py-2.5 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-all"
            >
              <span>المساعدة والدعم</span>
            </a>
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-1.5 text-xs font-medium text-slate-300 bg-slate-800/50 hover:bg-slate-800 py-2.5 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-all"
            >
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              <span>الرئيسية</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
