import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * AppProviders component that composes all application context providers.
 * This provides a single point to wrap the entire application with all necessary contexts.
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
  );
};

export default AppProviders;