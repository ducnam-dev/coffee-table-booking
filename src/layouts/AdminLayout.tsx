import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/authStore';
import {
  LayoutDashboard,
  Calendar,
  Coffee,
  Users,
  LogOut,
  Home,
  ChevronRight,
  Menu,
  Bell
} from 'lucide-react';
import logoImg from '../assets/logo.png';

export const AdminLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
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

  const menuItems = [
    {
      name: 'Tổng quan',
      path: '/admin/dashboard',
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: 'Quản lý Đặt bàn',
      path: '/admin/bookings',
      icon: <Calendar size={18} />,
    },
    {
      name: 'Quản lý Bàn',
      path: '/admin/tables',
      icon: <Home size={18} />,
    },
    {
      name: 'Quản lý Thực đơn',
      path: '/admin/menu',
      icon: <Coffee size={18} />,
    },
    {
      name: 'Khách hàng',
      path: '/admin/customers',
      icon: <Users size={18} />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-stone-100 font-sans text-stone-800 antialiased">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-stone-200 bg-stone-900 text-stone-300 transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-stone-800 bg-stone-950">
          <Link to="/" className="flex items-center gap-2 overflow-hidden">
            <img src={logoImg} alt="Pam Coffee & Tea" className="h-9 w-9 shrink-0 rounded-full object-cover shadow-md" />
            {isSidebarOpen && (
              <span className="text-lg font-bold text-white tracking-tight whitespace-nowrap animate-in fade-in duration-200">
                Pam <span className="text-amber-500">Admin</span>
              </span>
            )}
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 space-y-1.5 px-3 py-6 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/10'
                    : 'hover:bg-stone-800 hover:text-white'
                }`}
              >
                <div className={`shrink-0 transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </div>
                {isSidebarOpen && (
                  <span className="whitespace-nowrap animate-in fade-in duration-200 flex-1 flex justify-between items-center">
                    {item.name}
                    {isActive && <ChevronRight size={14} className="opacity-80" />}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-stone-800 p-4 bg-stone-950">
          {isSidebarOpen ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-600 text-white font-bold uppercase">
                  {auth.user?.username.substring(0, 2) || 'AD'}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-semibold text-white truncate">
                    {auth.user?.fullName || auth.user?.username || 'Admin User'}
                  </span>
                  <span className="text-xs text-amber-500 font-medium">Quản trị viên</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-stone-800 hover:bg-rose-950 hover:text-rose-200 py-2 text-sm font-semibold transition-all duration-200 border border-stone-700 hover:border-rose-900"
              >
                <LogOut size={16} />
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handleLogout}
                title="Đăng xuất"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-800 hover:bg-rose-950 hover:text-rose-200 transition-colors border border-stone-700 hover:border-rose-900"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ${
          isSidebarOpen ? 'pl-64' : 'pl-20'
        }`}
      >
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-stone-200 bg-white px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-stone-100 text-stone-600"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold text-stone-900 uppercase tracking-wide">
              {menuItems.find((item) => item.path === location.pathname)?.name || 'Hệ thống Quản trị'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick home view link */}
            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
            >
              Xem giao diện Khách
            </Link>

            {/* Notification Icon */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg hover:bg-stone-100 text-stone-600">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500"></span>
            </button>
          </div>
        </header>

        {/* Dashboard Pages Root */}
        <main className="flex-1 p-6 sm:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
