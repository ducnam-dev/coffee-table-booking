import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export const ForbiddenPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4 font-sans text-stone-850 antialiased selection:bg-amber-600 selection:text-white">
      <div className="mx-auto max-w-md text-center space-y-6 animate-in fade-in duration-300">
        {/* Shield Icon Decoration */}
        <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-amber-50 text-amber-600 shadow-md">
          <div className="absolute inset-0 rounded-3xl bg-amber-100 animate-ping opacity-20"></div>
          <ShieldAlert size={48} className="animate-bounce duration-1000" />
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-stone-900 tracking-tight">403</h1>
          <h2 className="text-xl font-extrabold text-stone-800 uppercase tracking-wide">Truy Cập Bị Từ Chối</h2>
          <p className="text-stone-500 text-sm leading-relaxed max-w-xs mx-auto">
            Rất tiếc! Tài khoản của bạn không có đủ thẩm quyền để truy cập vào phân vùng hành chính này.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-600 hover:bg-stone-50 active:scale-95 transition-all shadow-sm"
          >
            <ArrowLeft size={16} />
            Quay lại trang trước
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-amber-600/10 hover:bg-amber-700 active:scale-95 transition-all"
          >
            <Home size={16} />
            Về Trang Chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage;
