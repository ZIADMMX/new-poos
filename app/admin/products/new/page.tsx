'use client';

import Link from 'next/link';
import ProductForm from '@/components/ProductForm';
import { useAdminGuard } from '@/hooks/useAdminGuard';
import { ArrowRight, Sparkles, Loader2 } from 'lucide-react';

export default function NewProductPage() {
  const checking = useAdminGuard();

  if (checking) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الرجوع لقائمة المنتجات</span>
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-400" />
          إضافة أداة أتمتة جديدة
        </h1>
        <p className="text-sm text-slate-400">
          قم بتعبئة تفاصيل الفلو ولصق ملف الـ JSON المقترن به لنشره فورًا للعملاء
        </p>
      </div>

      {/* Product Form */}
      <ProductForm />
    </div>
  );
}
