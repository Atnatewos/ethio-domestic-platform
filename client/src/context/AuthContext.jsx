// File path: /client/src/context/AuthContext.jsx
// Purpose: Global authentication state management

import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedTokens = localStorage.getItem('tokens');
    
    if (storedUser && storedTokens) {
      setUser(JSON.parse(storedUser));
      setTokens(JSON.parse(storedTokens));
    }
    
    setLoading(false);
  }, []);

  // Login
  const login = async (phone, password, userType) => {
    try {
      const response = await apiService.login({ phone, password, userType });
      
      if (response.success) {
        setUser(response.data.user);
        setTokens(response.data.tokens);
        
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('tokens', JSON.stringify(response.data.tokens));
        
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Register Worker
  const registerWorker = async (data) => {
    try {
      const response = await apiService.registerWorker(data);
      return response;
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  // Register Employer
  const registerEmployer = async (data) => {
    try {
      const response = await apiService.registerEmployer(data);
      return response;
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem('user');
    localStorage.removeItem('tokens');
  };

  // Check if user is authenticated
  const isAuthenticated = !!user && !!tokens;

  // Check if user has specific role
  const hasRole = (role) => user?.role === role;

  const value = {
    user,
    tokens,
    loading,
    isAuthenticated,
    hasRole,
    login,
    registerWorker,
    registerEmployer,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;