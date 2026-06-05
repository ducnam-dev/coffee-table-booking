import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import CustomerLayout from '../layouts/CustomerLayout';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';

// Pages
import LandingPage from '../pages/customer/LandingPage';
import BookingPage from '../pages/customer/BookingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/admin/DashboardPage';
import ForbiddenPage from '../pages/errors/ForbiddenPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. PUBLIC ROUTES (Mọi người đều truy cập được) */}
      <Route
        path="/"
        element={
          <CustomerLayout>
            <LandingPage />
          </CustomerLayout>
        }
      />
      <Route
        path="/login"
        element={
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        }
      />
      <Route
        path="/register"
        element={
          <AuthLayout>
            <RegisterPage />
          </AuthLayout>
        }
      />
      <Route path="/403" element={<ForbiddenPage />} />

      {/* 2. PROTECTED CUSTOMER ROUTES (Bắt buộc Login, Khách và Admin đều vào được) */}
      <Route
        path="/booking"
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
            <CustomerLayout>
              <BookingPage />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />

      {/* 3. PROTECTED ADMIN ROUTES (Bắt buộc Login và phải là ADMIN) */}
      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />
      
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout>
              <DashboardPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Các tuyến đường quản lý khác của Admin (trang boilerplate hiển thị Coming Soon) */}
      {['bookings', 'tables', 'menu', 'customers'].map((module) => (
        <Route
          key={module}
          path={`/admin/${module}`}
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout>
                <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center space-y-4 shadow-sm animate-in fade-in duration-300">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    <span className="text-2xl font-bold uppercase">{module.substring(0, 2)}</span>
                  </div>
                  <h2 className="text-xl font-bold text-stone-900 capitalize">
                    Quản lý {module === 'bookings' ? 'Đặt Bàn' : module === 'tables' ? 'Bàn' : module === 'menu' ? 'Thực Đơn' : 'Khách Hàng'}
                  </h2>
                  <p className="text-sm text-stone-500 max-w-sm mx-auto">
                    Tính năng đang được phát triển nâng cao để kết nối với cơ sở dữ liệu Spring Boot.
                  </p>
                </div>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      ))}

      {/* 4. FALLBACK ROUTE (Chuyển hướng trang không tồn tại về Home) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
