import Link from "next/link";
import { Product } from "@/lib/api";
import { ArrowLeft, Zap, Layers, Code2 } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const getPlatformBadge = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case 'n8n':
        return {
          bg: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
          icon: <Zap className="w-3.5 h-3.5 text-rose-400" />,
          label: 'n8n Workflow',
        };
      case 'make':
        return {
          bg: 'bg-purple-950/80 text-purple-300 border-purple-800/60',
          icon: <Layers className="w-3.5 h-3.5 text-purple-400" />,
          label: 'Make Scenario',
        };
      case 'zapier':
      default:
        return {
          bg: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
          icon: <Code2 className="w-3.5 h-3.5 text-amber-400" />,
          label: 'Zapier Zap',
        };
    }
  };

  const badge = getPlatformBadge(product.platform);

  return (
    <div className="group relative bg-[#111827] border border-slate-800/80 rounded-2xl p-6 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Top Tag & Price */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}
          >
            {badge.icon}
            {badge.label}
          </span>
          <span className="text-xl font-bold text-emerald-400 tracking-tight">
            ${product.price}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-indigo-400 transition-colors">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Footer Link Button */}
      <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-mono">ID: {product.id.slice(0, 8)}</span>
        <Link
          href={`/products/${product.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors"
        >
          <span>عرض التفاصيل والشراء</span>
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
