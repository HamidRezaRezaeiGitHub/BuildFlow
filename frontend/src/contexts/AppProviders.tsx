import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { NavigationProvider } from './NavigationContext';
import { RouterProvider } from './RouterProvider';
import { Toaster } from '@/components/ui/toaster';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * AppProviders component that composes all application context providers.
 * This provides a single point to wrap the entire application with all necessary contexts.
 * 
 * Provider hierarchy (outside to inside):
 * 1. RouterProvider - Must be outermost for routing to work
 * 2. NavigationProvider - Navigation context for routing and section scrolling
 * 3. ThemeProvider - Theme context for UI components
 * 4. AuthProvider - Authentication state and user data
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
      <NavigationProvider>
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
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </NavigationProvider>
    </RouterProvider>
  );
};

export default AppProviders;