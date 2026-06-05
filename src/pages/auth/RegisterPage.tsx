import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/authStore';
import type { UserRole } from '../../store/authStore';
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [, setAuth] = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu nhập lại không trùng khớp!');
      return;
    }

    setIsSubmitting(true);

    // Giả lập API Đăng ký
    setTimeout(() => {
      const mockUser = {
        id: 'cust-new-' + Math.floor(Math.random() * 1000),
        username: email.split('@')[0],
        email: email,
        role: 'CUSTOMER' as UserRole,
        fullName: fullName,
        phoneNumber: phoneNumber,
      };
      const mockToken = 'mock-jwt-token-new';

      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));

      setAuth({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });

      setIsSubmitting(false);
      navigate('/booking'); // Chuyển thẳng đến trang đặt bàn sau đăng ký thành công
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-extrabold text-stone-900">Đăng Ký Tài Khoản</h2>
        <p className="text-xs text-stone-500">
          Chỉ mất 30 giây đăng ký để đặt bàn và tích lũy điểm thưởng thành viên.
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-600">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            Họ và tên
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
              <User size={16} />
            </div>
            <input
              type="text"
              id="fullName"
              required
              placeholder="VD: Nguyễn Văn A"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-stone-200 py-2 pl-10 pr-4 text-sm focus:border-amber-600 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Email
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
                <Mail size={16} />
              </div>
              <input
                type="email"
                id="email"
                required
                placeholder="VD: an@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-stone-200 py-2 pl-10 pr-4 text-sm focus:border-amber-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Số điện thoại
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
                <Phone size={16} />
              </div>
              <input
                type="tel"
                id="phone"
                required
                placeholder="VD: 0912345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full rounded-xl border border-stone-200 py-2 pl-10 pr-4 text-sm focus:border-amber-600 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Mật khẩu
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
                <Lock size={16} />
              </div>
              <input
                type="password"
                id="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-stone-200 py-2 pl-10 pr-4 text-sm focus:border-amber-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Nhập lại mật khẩu
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
                <Lock size={16} />
              </div>
              <input
                type="password"
                id="confirmPassword"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-stone-200 py-2 pl-10 pr-4 text-sm focus:border-amber-600 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-amber-600 py-2.5 text-sm font-bold text-white shadow-md hover:bg-amber-700 active:scale-95 transition-all duration-200 disabled:bg-stone-300 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
        >
          {isSubmitting ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          ) : (
            <>
              Đăng ký tài khoản
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-stone-500">
        Bạn đã có tài khoản?{' '}
        <Link to="/login" className="font-bold text-amber-600 hover:text-amber-700 transition-colors">
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
