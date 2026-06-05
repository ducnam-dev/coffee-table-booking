import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/authStore';
import type { UserRole } from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const [auth] = useAuth();
  const location = useLocation();

  // Đang load trạng thái đăng nhập (nếu cần xử lý bất đồng bộ trong tương lai)
  if (auth.isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-600 border-t-transparent"></div>
          <p className="text-stone-600 font-medium animate-pulse">Đang tải thông tin hệ thống...</p>
        </div>
      </div>
    );
  }

  // Nếu chưa đăng nhập -> chuyển hướng đến trang Login
  if (!auth.isAuthenticated || !auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu có danh sách roles được cho phép truy cập và role của user không nằm trong đó -> 403 Forbidden
  if (allowedRoles && !allowedRoles.includes(auth.user.role)) {
    return <Navigate to="/403" replace />;
  }

  // Nếu hợp lệ -> render trang con
  return <>{children}</>;
};

export default ProtectedRoute;
