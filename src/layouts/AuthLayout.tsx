import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee } from 'lucide-react';
import logoImg from '../assets/logo.png';

export const AuthLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-stone-100 font-sans text-stone-800 antialiased selection:bg-amber-600 selection:text-white">
      {/* Container */}
      <div className="flex w-full flex-col md:flex-row">
        {/* Left Side: Art & Intro (Hidden on mobile) */}
        <div 
          className="relative hidden w-1/2 flex-col justify-between bg-stone-900 bg-cover bg-center p-12 text-white md:flex overflow-hidden"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800')" }}
        >
          {/* Background pattern/decorations with a dark overlay to make text clear */}
          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-[1px]"></div>
          <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-amber-600/10 blur-[120px]"></div>
          
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img src={logoImg} alt="Pam Coffee & Tea" className="h-10 w-10 rounded-full object-cover shadow-lg transition-transform group-hover:scale-105" />
              <span className="text-xl font-bold tracking-tight">
                Pam Coffee <span className="text-amber-500">& Tea</span>
              </span>
            </Link>
          </div>

          <div className="relative z-10 space-y-6 max-w-lg">
            <h2 className="text-4xl font-extrabold tracking-tight leading-tight text-white/95">
              Hương Vị Hoàn Hảo, <br />
              Góc Ngồi Bình Yên.
            </h2>
            <p className="text-stone-300 text-base leading-relaxed">
              Trải nghiệm không gian ấm cúng cùng thực đơn đồ uống hảo hạng. Chỉ với vài lượt click để đặt bàn trước, bạn sẽ có ngay một góc làm việc lý tưởng hoặc nơi hẹn hò lãng mạn.
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs text-stone-400">
            <span>&copy; {new Date().getFullYear()} Pam Coffee & Tea.</span>
            <div className="flex gap-4">
              <Link to="/" className="hover:text-white transition-colors">Trang chủ</Link>
              <a href="#privacy" className="hover:text-white transition-colors">Điều khoản</a>
            </div>
          </div>
        </div>

        {/* Right Side: Form Content */}
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24 bg-stone-50">
          <div className="mx-auto w-full max-w-md">
            {/* Mobile Header Logo */}
            <div className="flex justify-center md:hidden mb-8">
              <Link to="/" className="flex flex-col items-center gap-2 group">
                <img src={logoImg} alt="Pam Coffee & Tea" className="h-12 w-12 rounded-full object-cover shadow-md transition-transform group-hover:scale-105" />
                <span className="text-2xl font-bold tracking-tight text-stone-900">
                  Pam Coffee <span className="text-amber-600">& Tea</span>
                </span>
              </Link>
            </div>
            
            {/* Form wrapped content */}
            <div className="bg-white px-8 py-10 shadow-xl rounded-2xl border border-stone-200/50">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
