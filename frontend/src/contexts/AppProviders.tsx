import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';

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
    <AuthProvider>
      {/* Add other providers here as the app grows, e.g.:
      <ThemeProvider>
        <NotificationProvider>
          <UserPreferencesProvider>
            {children}
          </UserPreferencesProvider>
        </NotificationProvider>
      </ThemeProvider>
      */}
      {children}
    </AuthProvider>
  );
};

export default AppProviders;