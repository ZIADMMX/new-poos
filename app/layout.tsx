import type { Metadata } from "next";
import Link from "next/link";
import { Cpu, Lock, ShoppingBag } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoMarket — متجر أدوات الأتمتة الرقمية",
  description: "احصل على أفضل قوالب وتدفقات العمل البرمجية لـ n8n و Zapier و Make",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased flex flex-col min-h-screen bg-[#090d16] text-slate-100">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-[#090d16]/80 border-b border-slate-800/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white block">AutoMarket</span>
                <span className="text-[10px] text-emerald-400 font-medium tracking-wide uppercase">Automation Workflows</span>
              </div>
            </Link>

            <nav className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800/50"
              >
                <ShoppingBag className="w-4 h-4 text-slate-400" />
                <span>المنتجات</span>
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-950/60 border border-indigo-800/50 px-3 py-1.5 rounded-lg hover:bg-indigo-900/60 transition-all shadow-sm"
              >
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>لوحة الأدمن</span>
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-[#070a11] py-6 text-center text-xs text-slate-500">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} AutoMarket — متجر الأتمتة الرقمية (MVP)</p>
            <div className="flex gap-4">
              <span className="inline-flex items-center gap-1 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Stripe Checkout Secured
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
