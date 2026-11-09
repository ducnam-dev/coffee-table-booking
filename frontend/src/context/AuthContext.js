import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserModel } from '../models/UserModel';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const { user: storedUser, token: storedToken } = await UserModel.getStoredAuth();
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
    } catch (e) {
      console.warn('Failed to load auth from storage', e);
    } finally {
      setIsLoading(false);
    }
  };

  const onAuthSuccess = (userObj, authToken) => {
    setUser(userObj);
    setToken(authToken);
  };

  const quickLogin = async (role = 'CUSTOMER') => {
    setIsLoading(true);
    const res = await UserModel.quickLoginFallback(role);
    setIsLoading(false);
    if (res.success) {
      setUser(res.user);
      setToken(res.token);
    }
    return res;
  };

  const logout = async () => {
    await UserModel.clearAuth();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        onAuthSuccess,
        quickLogin,
        logout,
        isAdmin: user?.role === 'ADMIN',
        isStaff: user?.role === 'STAFF' || user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
