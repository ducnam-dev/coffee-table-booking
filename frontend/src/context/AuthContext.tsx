import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserModel } from '../models/UserModel';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (u: string, p: string) => Promise<User>;
  register: (data: any) => Promise<User>;
  logout: () => Promise<void>;
  switchUser: (role: 'admin' | 'customer') => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    UserModel.getCurrentUser().then((u) => {
      setCurrentUser(u);
      setLoading(false);
    });
  }, []);

  const login = async (u: string, p: string) => {
    const user = await UserModel.login(u, p);
    setCurrentUser(user);
    return user;
  };

  const register = async (data: any) => {
    const user = await UserModel.register(data);
    setCurrentUser(user);
    return user;
  };

  const logout = async () => {
    await UserModel.logout();
    setCurrentUser(null);
  };

  const switchUser = async (role: 'admin' | 'customer') => {
    const user =
      role === 'admin'
        ? await UserModel.login('admin', 'admin123')
        : await UserModel.login('khachhang', 'user123');
    setCurrentUser(user);
    return user;
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, loading, login, register, logout, switchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;

