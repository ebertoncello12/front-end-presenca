import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';


interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  studentName: string;
  course: string;
  semester: number;
  registration: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);



export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);



  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            setIsAuthenticated(true);
            setUser(currentUser);
          } else {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({email, password});
      setIsAuthenticated(true);
      setUser(response?.user);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };


  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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