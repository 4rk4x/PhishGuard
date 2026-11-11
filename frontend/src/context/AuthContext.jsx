
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('phishguard_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('phishguard_token');
      const storedUser = localStorage.getItem('phishguard_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));

          // Verify session with backend
          const me = await authAPI.getMe();
          setUser(me);
          localStorage.setItem('phishguard_user', JSON.stringify(me));
        } catch (err) {
          console.warn('Session expired or invalid, clearing local auth');
          localStorage.removeItem('phishguard_token');
          localStorage.removeItem('phishguard_user');
          setToken(null);
          setUser(null);
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);

    setToken(data.access_token);
    setUser(data.user);

    localStorage.setItem('phishguard_token', data.access_token);
    localStorage.setItem('phishguard_user', JSON.stringify(data.user));

    return data.user;
  };

  const register = async (fullName, email, password) => {
    const data = await authAPI.register(fullName, email, password);

    setToken(data.access_token);
    setUser(data.user);

    localStorage.setItem('phishguard_token', data.access_token);
    localStorage.setItem('phishguard_user', JSON.stringify(data.user));

    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem('phishguard_token');
    localStorage.removeItem('phishguard_user');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
