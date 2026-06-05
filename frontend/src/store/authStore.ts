import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'ADMIN' | 'CUSTOMER';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  fullName?: string;
  phoneNumber?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const getInitialState = (): AuthState => {
  try {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    
    if (token && userJson) {
      const user = JSON.parse(userJson) as User;
      return {
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      };
    }
  } catch (error) {
    console.error('Lỗi khi phân tích thông tin xác thực từ localStorage:', error);
  }

  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
  };
};

interface AuthContextType {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(getInitialState());

  return React.createElement(
    AuthContext.Provider,
    { value: { auth, setAuth } },
    children
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return [context.auth, context.setAuth] as const;
};
