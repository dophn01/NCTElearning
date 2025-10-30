'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  gradeLevel?: '10' | '11' | '12';
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}
interface AuthResponse {
  accessToken: string;
  user: User;
}


interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  gradeLevel?: '10' | '11' | '12';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults and migrate any existing token in sessionStorage to localStorage
  useEffect(() => {
    // Only use localStorage for persistence
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post<AuthResponse>('http://localhost:3001/api/auth/login', {
        email,
        password,
      });
      const { accessToken, user: userData } = response.data;
      localStorage.setItem('accessToken', accessToken); // Use only localStorage
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setUser(userData);
    } catch (error: any) {
      if (error.response) {
        console.error('Login error: ', error.response.data);
      } else {
        console.error('Login error:', error.message);
      }
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await axios.post<AuthResponse>('http://localhost:3001/api/auth/register', userData);
      const { accessToken, user: newUser } = response.data;
      localStorage.setItem('accessToken', accessToken); // Use only localStorage
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setUser(newUser);
    } catch (error: any) {
      if (error.response) {
        console.error('Register error: ', error.response.data);
      } else {
        console.error('Register error:', error.message);
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken'); // Remove from localStorage only
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken'); // Only check localStorage
      if (!token) {
        setLoading(false);
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get<User>('http://localhost:3001/api/auth/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Auth check error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
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
