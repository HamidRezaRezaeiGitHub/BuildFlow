import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { authService, handleApiError } from '../services';
import type {
  AuthResponse,
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
}const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
  const [refreshTimer, setRefreshTimer] = useState<NodeJS.Timeout | null>(null);

  const isAuthenticated = !!token && !!user; // User is authenticated if token and user info are present

  // Handle logout cleanup
  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setToken(null);
    setUser(null);

    // Clear any scheduled refresh timer
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      setRefreshTimer(null);
    }
  };

  // Schedule automatic token refresh 30 seconds before expiry
  const scheduleTokenRefresh = (expiresInSeconds: number) => {
    // Clear any existing timer
    if (refreshTimer) {
      clearTimeout(refreshTimer);
    }

    // Calculate delay: refresh 30 seconds before expiry
    const refreshDelayMs = Math.max(0, (expiresInSeconds - 30) * 1000);

    // Only schedule if there's enough time (more than 30 seconds)
    if (expiresInSeconds > 30) {
      const timerId = setTimeout(async () => {
        try {
          console.log('Auto-refreshing token...');
          await refreshToken();
        } catch (error) {
          console.error('Auto token refresh failed:', error);
          // If refresh fails, logout user
          handleLogout();
        }
      }, refreshDelayMs);

      setRefreshTimer(timerId);

      console.log(`Token refresh scheduled in ${Math.floor(refreshDelayMs / 1000)} seconds`);
    } else {
      console.warn('Token expires too soon to schedule refresh');
    }
  };

  // Login function
  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    try {
      const authResponse: AuthResponse = await authService.login(credentials);
      const newToken = authResponse.accessToken;

      localStorage.setItem('jwt_token', newToken);
      setToken(newToken);

      // Fetch user details after successful login
      await getCurrentUserWithToken(newToken);

      // Schedule automatic token refresh 30 seconds before expiry
      scheduleTokenRefresh(authResponse.expiresInSeconds);
    } catch (error) {
      handleLogout();
      handleApiError(error, 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (signUpData: SignUpData): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.register(signUpData);
      // Note: User is not automatically logged in - they need to login separately
    } catch (error) {
      handleApiError(error, 'Registration failed');
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
      const authResponse: AuthResponse = await authService.refreshToken(token);
      const newToken = authResponse.accessToken;

      localStorage.setItem('jwt_token', newToken);
      setToken(newToken);

      // Schedule the next automatic refresh
      scheduleTokenRefresh(authResponse.expiresInSeconds);
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
  }, [token]); // Run on token change and initialization

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
    };
  }, []);

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