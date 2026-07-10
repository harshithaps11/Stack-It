// src/contexts/AuthContext.tsx

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
// Import all your API functions
import * as api from '../api/api'; 

// Define a type for the User object that matches our backend
interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null; // <-- ADDED: a place to store the user object
  isAuthenticated: boolean;
  login: (email: string, password:string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null); // <-- ADDED: state for the user object

  const fetchAndSetUser = async (authToken: string) => {
    try {
      // Use our new API function to get user details
      const userData = await api.fetchUserProfile(authToken);
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('authToken', authToken);
    } catch (error) {
      // If token is invalid, log the user out
      console.error("Failed to fetch profile, logging out:", error);
      logout();
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      // If a token exists from a previous session, fetch the user's profile
      fetchAndSetUser(storedToken);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await api.login(email, password);
      if (data.access_token) {
        // After getting the token, fetch the user's profile
        await fetchAndSetUser(data.access_token);
      } else {
        throw new Error(data.msg || 'Login failed, no token received.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error; 
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      // 1. Call the register API
      await api.register(username, email, password);
      
      // 2. THIS IS THE MAGIC: If registration is successful, automatically log in
      await login(email, password);

    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null); // <-- ADDED: Clear the user object on logout
    localStorage.removeItem('authToken');
  };

  const value = {
    token,
    user, // <-- ADDED: Provide the user object to the rest of the app
    isAuthenticated: !!user, // <-- CHANGED: Base authentication status on the user object
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};