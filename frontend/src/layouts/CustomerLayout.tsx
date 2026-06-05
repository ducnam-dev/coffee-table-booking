import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/authStore';
import { Coffee, User, LogOut, LayoutDashboard, Menu, X, Calendar } from 'lucide-react';
import logoImg from '../assets/logo.png';

// Wait, the path of authStore is '../store/authStore'. Let's use '../store/authStore'!
export const CustomerLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    navigate('/login');
  };

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Thực đơn', path: '/#menu' },
    { name: 'Xem bàn trống', path: '/#tables' },
    { name: 'Đặt bàn ngay', path: '/booking' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 font-sans text-stone-800 antialiased selection:bg-amber-600 selection:text-white">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logoImg} alt="Pam Coffee & Tea" className="h-10 w-10 rounded-full object-cover shadow-md transition-transform duration-300 group-hover:scale-105" />
            <span className="text-xl font-bold tracking-tight text-stone-900">
              Pam Coffee <span className="text-amber-600">& Tea</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className={`text-sm font-semibold transition-colors duration-200 hover:text-amber-600 ${
                  location.pathname === link.path ? 'text-amber-600' : 'text-stone-600'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* User Profile / Auth buttons */}
          <div className="hidden md:flex items-center gap-4">
            {auth.isAuthenticated && auth.user ? (
              <div className="flex items-center gap-4">
                {auth.user.role === 'ADMIN' && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-1.5 rounded-lg border border-amber-600/30 bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition-all"
                  >
                    <LayoutDashboard size={14} />
                    Trang Quản Trị
                  </Link>
                )}
                <div className="flex items-center gap-3 border-l border-stone-200 pl-4">
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-semibold text-stone-900">{auth.user.fullName || auth.user.username}</span>
                    <span className="text-xs text-stone-500 capitalize">{auth.user.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}</span>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-800 font-bold uppercase shadow-sm">
                    {auth.user.username.substring(0, 2)}
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Đăng xuất"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all duration-200"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-stone-600 hover:text-amber-600 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-amber-600/10 hover:bg-amber-700 hover:shadow-amber-600/20 active:scale-95 transition-all duration-200"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 md:hidden transition-colors"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-white px-4 py-3 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-sm font-medium py-1.5 transition-colors ${
                  location.pathname === link.path ? 'text-amber-600 font-semibold' : 'text-stone-600'
                }`}
              >
                {link.name}
              </a>
            ))}
            <div className="border-t border-stone-100 pt-3 flex flex-col gap-2">
              {auth.isAuthenticated && auth.user ? (
                <>
                  {auth.user.role === 'ADMIN' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-lg bg-amber-50 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition-colors"
                    >
                      <LayoutDashboard size={16} />
                      Trang Quản Trị
                    </Link>
                  )}
                  <div className="flex items-center justify-between py-2 px-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-800 font-bold uppercase text-xs">
                        {auth.user.username.substring(0, 2)}
                      </div>
                      <span className="text-sm font-semibold text-stone-800">{auth.user.fullName || auth.user.username}</span>
                    </div>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1.5 rounded-lg"
                    >
                      <LogOut size={12} />
                      Đăng xuất
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 rounded-xl border border-stone-200 py-2.5 text-center text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 rounded-xl bg-amber-600 py-2.5 text-center text-sm font-semibold text-white shadow-md hover:bg-amber-700 transition-colors"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-stone-900 text-stone-400">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src={logoImg} alt="Pam Coffee & Tea" className="h-9 w-9 rounded-full object-cover shadow-md" />
                <span className="text-lg font-bold text-white">Pam Coffee & Tea</span>
              </div>
              <p className="max-w-xs text-sm">
                Nơi những ly cà phê ấm nóng kết nối những tâm hồn đồng điệu. Hãy chọn một góc bình yên và tận hưởng khoảnh khắc của riêng bạn.
              </p>
              <div className="text-xs text-stone-500">
                &copy; {new Date().getFullYear()} Pam Coffee & Tea. All rights reserved.
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-200">Liên kết nhanh</h3>
                <ul className="mt-4 space-y-2 text-sm">
                  <li><a href="/" className="hover:text-white transition-colors">Trang chủ</a></li>
                  <li><a href="/#menu" className="hover:text-white transition-colors">Thực đơn</a></li>
                  <li><a href="/#tables" className="hover:text-white transition-colors">Xem bàn</a></li>
                  <li><Link to="/booking" className="hover:text-white transition-colors">Đặt bàn</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-200">Liên hệ</h3>
                <ul className="mt-4 space-y-2 text-sm">
                  <li>Địa chỉ: 123 Đường Cà Phê, Quận 1, TP. HCM</li>
                  <li>Điện thoại: 0961377823</li>
                  <li>Email: hello@pamcoffeetea.com</li>
                  <li>Giờ mở cửa: 06:00 - 22:30 (Hằng ngày)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;
