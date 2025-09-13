import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { RouterProvider } from './RouterProvider';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * AppProviders component that composes all application context providers.
 * This provides a single point to wrap the entire application with all necessary contexts.
 * 
 * Provider hierarchy (outside to inside):
 * 1. RouterProvider - Must be outermost for routing to work
 * 2. ThemeProvider - Theme context for UI components
 * 3. AuthProvider - Authentication state and user data
 * 
 * Benefits:
 * - Clean separation of concerns
 * - Easy to add new providers
 * - Centralized provider management
 * - Better testing (can wrap individual providers)
 * - Cleaner App.tsx
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <RouterProvider>
      <ThemeProvider>
        <AuthProvider>
          {/* Add other providers here as the app grows, e.g.:
          <NotificationProvider>
            <UserPreferencesProvider>
              {children}
            </UserPreferencesProvider>
          </NotificationProvider>
          */}
          {children}
        </AuthProvider>
      </ThemeProvider>
    </RouterProvider>
  );
};

export default AppProviders;