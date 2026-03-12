'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, getAuthToken, setAuthToken } from '../app/lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Owner' | 'Employee' | 'Member';
  status: string;
  position?: string;
  customer_type?: string;
  plan?: string;
  expiration_date?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const response = await authApi.me();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            setAuthToken(null);
          }
        } catch (error) {
          setAuthToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authApi.login(email, password);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true };
      }
      
      return { success: false, message: 'Login failed' };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Invalid credentials' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Ignore logout errors
    } finally {
      setUser(null);
      setAuthToken(null);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authApi.me();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      // Ignore refresh errors
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}