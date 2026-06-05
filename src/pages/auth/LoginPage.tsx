import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/authStore';
import type { UserRole } from '../../store/authStore';
import { Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Xem đường dẫn cần quay lại sau đăng nhập
  const from = (location.state as any)?.from?.pathname || '/';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mô phỏng API login thành công với vai trò Customer mặc định từ form tự gõ
    setTimeout(() => {
      const mockUser = {
        id: 'cust-123',
        username: username || 'khachhang',
        email: `${username || 'customer'}@example.com`,
        role: 'CUSTOMER' as UserRole,
        fullName: 'Nguyễn Văn Khách',
      };
      const mockToken = 'mock-jwt-token-customer';

      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));

      setAuth({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });

      setIsSubmitting(false);
      navigate(from, { replace: true });
    }, 1000);
  };

  // Tính năng giả lập Đăng nhập nhanh hỗ trợ Tester/Developer
  const simulateLogin = (role: UserRole) => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      const is_admin = role === 'ADMIN';
      const mockUser = {
        id: is_admin ? 'admin-999' : 'cust-777',
        username: is_admin ? 'admin_quanly' : 'khach_vip',
        email: is_admin ? 'admin@pamcoffeetea.com' : 'vip_customer@gmail.com',
        role: role,
        fullName: is_admin ? 'Trần Quản Trị Viên' : 'Lê Hoàng Khách VIP',
      };
      const mockToken = is_admin ? 'mock-jwt-token-admin' : 'mock-jwt-token-customer-vip';

      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));

      setAuth({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });

      setIsSubmitting(false);
      
      // Admin chuyển thẳng tới Dashboard, Customer về trang đích trước đó
      if (is_admin) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-extrabold text-stone-900">Đăng Nhập Hệ Thống</h2>
        <p className="text-xs text-stone-500">
          Hãy nhập tài khoản của bạn hoặc sử dụng chức năng Đăng nhập nhanh bên dưới.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Username/Email */}
        <div className="space-y-1.5">
          <label htmlFor="username" className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            Tên đăng nhập hoặc Email
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
              <Mail size={16} />
            </div>
            <input
              type="text"
              id="username"
              required
              placeholder="VD: nguyenvanan"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-4 text-sm focus:border-amber-600 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Mật khẩu
            </label>
            <a href="#forgot" className="text-xs text-amber-600 hover:text-amber-700 transition-colors">
              Quên mật khẩu?
            </a>
          </div>
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
              className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-4 text-sm focus:border-amber-600 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
          />
          <label htmlFor="remember-me" className="ml-2 block text-xs text-stone-500">
            Duy trì đăng nhập trên thiết bị này
          </label>
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
              Đăng nhập bằng form
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      {/* Developer quick login panels */}
      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-stone-200"></div>
        <span className="flex-shrink mx-4 text-xs font-semibold text-stone-400 uppercase tracking-widest">Dành Cho Kiểm Thử</span>
        <div className="flex-grow border-t border-stone-200"></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => simulateLogin('CUSTOMER')}
          disabled={isSubmitting}
          className="flex flex-col items-center justify-center rounded-xl border border-stone-200 bg-amber-50/50 hover:bg-amber-50 p-3 text-center transition-all duration-200 hover:-translate-y-0.5"
        >
          <UserCheck size={18} className="text-amber-700 mb-1" />
          <span className="text-xs font-bold text-amber-900">Vào vai Khách Hàng</span>
          <span className="text-[9px] text-stone-400 mt-0.5">Đặt bàn, xem menu</span>
        </button>
        <button
          onClick={() => simulateLogin('ADMIN')}
          disabled={isSubmitting}
          className="flex flex-col items-center justify-center rounded-xl border border-stone-200 bg-stone-900 hover:bg-stone-950 p-3 text-center text-white transition-all duration-200 hover:-translate-y-0.5"
        >
          <UserCheck size={18} className="text-amber-500 mb-1" />
          <span className="text-xs font-bold text-amber-400">Vào vai Admin</span>
          <span className="text-[9px] text-stone-400 mt-0.5">Quản trị hệ thống</span>
        </button>
      </div>

      <div className="text-center text-xs text-stone-500">
        Bạn chưa có tài khoản?{' '}
        <Link to="/register" className="font-bold text-amber-600 hover:text-amber-700 transition-colors">
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
