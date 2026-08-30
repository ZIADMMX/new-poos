'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getProducts, deleteProduct, removeAdminToken, Product } from '@/lib/api';
import { useAdminGuard } from '@/hooks/useAdminGuard';
import { Plus, Trash2, LogOut, PackageCheck, ExternalLink, Loader2, AlertCircle } from 'lucide-react';

export default function AdminProductsPage() {
  const router = useRouter();
  const checking = useAdminGuard();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('فشل تحميل قائمة المنتجات');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!checking) {
      fetchProducts();
    }
  }, [checking]);

  if (checking) return null;

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت تأكد من رغبتك في حذف هذا المنتج؟')) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert('حدث خطأ أثناء المحاولة لحذف المنتج');
    }
  };

  const handleLogout = () => {
    removeAdminToken();
    router.push('/admin/login');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <PackageCheck className="w-7 h-7 text-indigo-400" />
            إدارة المنتجات الرقمية
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            قائمة جميع القوالب والأدوات التي قمت بنشرها على المتجر
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة منتج جديد</span>
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 border border-slate-700 hover:border-rose-800/80 text-slate-300 text-sm px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>خروج</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
          <p className="text-sm">جاري جلب المنتجات...</p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 bg-rose-950/80 border border-rose-800 text-rose-300 p-4 rounded-xl text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <PackageCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">لا توجد منتجات بعد</h3>
          <p className="text-sm text-slate-400">
            لم تقم بإضافة أي فلو أتمتة حتى الآن. ابدأ بإضافة منتجك الأول.
          </p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة أول منتج</span>
          </Link>
        </div>
      ) : (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-[#0c111d] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">عنوان المنتج</th>
                  <th className="px-6 py-4 font-semibold">المنصة</th>
                  <th className="px-6 py-4 font-semibold">السعر</th>
                  <th className="px-6 py-4 font-semibold text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">
                      <div>
                        {product.title}
                        <span className="block text-xs text-slate-500 font-mono mt-0.5 font-normal">
                          {product.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 border border-slate-700 text-indigo-300">
                        {product.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-400">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <Link
                          href={`/products/${product.id}`}
                          target="_blank"
                          className="text-slate-400 hover:text-indigo-400 transition-colors p-1.5 hover:bg-slate-800 rounded-lg"
                          title="معاينة المنتج"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-slate-400 hover:text-rose-400 transition-colors p-1.5 hover:bg-rose-950/60 rounded-lg cursor-pointer"
                          title="حذف المنتج"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
