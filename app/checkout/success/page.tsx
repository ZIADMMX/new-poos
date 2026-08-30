'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { downloadOrderJson } from '@/lib/api';
import { CheckCircle2, Download, Home, Loader2, FileCode, AlertCircle } from 'lucide-react';

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const { order_id } = use(searchParams);

  const [downloading, setDownloading] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (order_id) {
      setDownloadReady(true);
    }
  }, [order_id]);

  const handleDownload = async (retries = 3): Promise<void> => {
    if (!order_id) return;

    try {
      setDownloading(true);
      setError(null);
      const blob = await downloadOrderJson(order_id);
      
      // Trigger browser download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workflow-order-${order_id.slice(0, 8)}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      setDownloading(false);
    } catch (err: unknown) {
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return handleDownload(retries - 1);
      }
      
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('الطلب لا يزال قيد التأكيد، يرجى المحاولة بعد قليل');
      }
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-12 text-center">
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-3xl bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-900/30">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white mb-2">تمت عملية الدفع بنجاح!</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            شكراً لثقتك بنا. تم تأكيد طلبك ويمكنك الآن تحميل ملف الـ JSON الخاص بك مباشرة.
          </p>
        </div>

        {order_id ? (
          <div className="bg-[#090d16] border border-slate-800/80 rounded-xl p-3 text-xs text-slate-400 font-mono">
            رقم الطلب: <span className="text-emerald-400 font-semibold">{order_id}</span>
          </div>
        ) : (
          <p className="text-xs text-amber-400 bg-amber-950/20 border border-amber-900/50 py-3 rounded-xl">لم يتم العثور على رقم الطلب في الرابط</p>
        )}

        {error && (
          <div className="flex items-center gap-2 bg-rose-950/80 border border-rose-800 text-rose-300 p-4 rounded-xl text-xs text-right">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="pt-2 space-y-3">
          {downloadReady && (
            <button
              onClick={() => handleDownload()}
              disabled={downloading}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري إعداد الملف...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>تحميل ملف الـ JSON الآن</span>
                </>
              )}
            </button>
          )}

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 px-4 rounded-xl border border-slate-700/80 transition-all text-sm"
          >
            <Home className="w-4 h-4" />
            <span>العودة للمتجر الرئيسي</span>
          </Link>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 pt-2">
          <FileCode className="w-4 h-4 text-emerald-400" />
          <span>الملف بصيغة .json جاهز للاستيراد المباشر</span>
        </div>
      </div>
    </div>
  );
}
