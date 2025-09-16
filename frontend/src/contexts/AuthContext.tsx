import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ApiError, authService, StructuredApiError } from '../services';
import type {
    LoginCredentials,
    SignUpData,
    User
} from '../services/dtos';

interface AuthContextType {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (signUpData: SignUpData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('jwt_token'));
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  // Handle logout cleanup
  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setToken(null);
    setUser(null);
  };

  // Login function
  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    try {
      const authResponse = await authService.login(credentials);
      const newToken = authResponse.accessToken;

      localStorage.setItem('jwt_token', newToken);
      setToken(newToken);

      // Fetch user details after successful login
      await getCurrentUserWithToken(newToken);
    } catch (error) {
      handleLogout();
      if (error instanceof StructuredApiError) {
        throw new Error(error.getDetailedMessage());
      }
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (signUpData: SignUpData): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.register(signUpData);
      // Registration successful - user needs to login separately
    } catch (error) {
      if (error instanceof StructuredApiError) {
        throw new Error(error.getDetailedMessage());
      }
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      if (token) {
        // Call backend logout endpoint
        await authService.logout(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      handleLogout();
    }
  };

  // Get current user with specific token
  const getCurrentUserWithToken = async (specificToken: string): Promise<void> => {
    try {
      const userData = await authService.getCurrentUser(specificToken);
      setUser(userData);
    } catch (error) {
      console.error('Get current user error:', error);
      handleLogout();
      throw error;
    }
  };

  // Get current user function
  const getCurrentUser = async (): Promise<void> => {
    if (!token) {
      return;
    }

    try {
      await getCurrentUserWithToken(token);
    } catch (error) {
      console.error('Get current user error:', error);
      handleLogout();
    }
  };

  // Refresh token function
  const refreshToken = async (): Promise<void> => {
    if (!token) {
      return;
    }

    try {
      const authResponse = await authService.refreshToken(token);
      const newToken = authResponse.accessToken;

      localStorage.setItem('jwt_token', newToken);
      setToken(newToken);
    } catch (error) {
      console.error('Token refresh error:', error);
      handleLogout();
    }
  };

  // Initialize auth state on app start
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      if (token) {
        try {
          await getCurrentUser();
        } catch (error) {
          console.error('Auth initialization error:', error);
          handleLogout();
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, [token]);

  const value: AuthContextType = {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    
    // Actions
    login,
    register,
    logout,
    refreshToken,
    getCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};