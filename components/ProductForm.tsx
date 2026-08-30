'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, CreateProductInput } from '@/lib/api';
import { PlusCircle, Loader2, FileCode, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProductForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<CreateProductInput>({
    title: '',
    description: '',
    price: 10,
    platform: 'n8n',
    workflowJson: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Simple validation
    if (!formData.title.trim()) {
      setError('يرجى إدخال عنوان المنتج');
      return;
    }
    if (!formData.workflowJson.trim()) {
      setError('يرجى لصق كود الـ JSON الخاص بالأتمتة');
      return;
    }

    try {
      JSON.parse(formData.workflowJson);
    } catch {
      setError('كود الـ JSON غير صالح! يرجى التأكد من التنسيق');
      return;
    }

    setLoading(true);

    try {
      await createProduct({
        ...formData,
        price: Number(formData.price),
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/products');
      }, 1200);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('حدث خطأ أثناء إضافة المنتج');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
      {error && (
        <div className="flex items-center gap-2 bg-rose-950/80 border border-rose-800 text-rose-300 p-4 rounded-xl text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-800 text-emerald-300 p-4 rounded-xl text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>تمت إضافة المنتج بنجاح! جاري التوجيه...</span>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          عنوان المنتج / الأداة <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          placeholder="مثال: n8n Auto Lead Scraping Workflow"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full bg-[#090d16] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
          required
        />
      </div>

      {/* Grid: Price & Platform */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            السعر ($ USD) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            className="w-full bg-[#090d16] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            منصة الأتمتة (Platform) <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value as CreateProductInput['platform'] })}
            className="w-full bg-[#090d16] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          >
            <option value="n8n">n8n Workflow</option>
            <option value="zapier">Zapier Zap</option>
            <option value="make">Make (Integromat) Scenario</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          وصف المنتج والتفاصيل
        </label>
        <textarea
          rows={4}
          placeholder="شرح مختصر لكيفية عمل هذا الفلو وما هي الخدمات المتصلة به..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full bg-[#090d16] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
        />
      </div>

      {/* JSON Workflow Textarea */}
      <div>
        <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-300 mb-2">
          <FileCode className="w-4 h-4 text-indigo-400" />
          <span>محتوى الـ JSON الخاص بالأتمتة</span> <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows={8}
          placeholder="إلصق كود الـ Workflow JSON هنا..."
          value={formData.workflowJson}
          onChange={(e) => setFormData({ ...formData, workflowJson: e.target.value })}
          className="w-full bg-[#090d16] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-mono text-emerald-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
          required
        />
        <p className="text-xs text-slate-500 mt-1.5">
          سيتم حفظ الملف وتوفير رابط تحميل مباشر للعميل بعد إتمام الدفع بنجاح.
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>جاري إضافة المنتج...</span>
          </>
        ) : (
          <>
            <PlusCircle className="w-5 h-5" />
            <span>نشر المنتج الآن</span>
          </>
        )}
      </button>
    </form>
  );
}
