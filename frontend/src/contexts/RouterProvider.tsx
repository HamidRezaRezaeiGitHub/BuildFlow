import { config } from '@/config/environment';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

interface RouterProviderProps {
  children: React.ReactNode;
}

/**
 * RouterProvider component that wraps the application with React Router's BrowserRouter.
 * 
 * Uses BrowserRouter for clean URLs without hash fragments and handles base path
 * configuration automatically through the centralized environment config.
 * This provider should be at the top level of your provider hierarchy.
 * 
 * Benefits:
 * - Clean URLs (e.g., /dashboard instead of /#/dashboard)
 * - Better SEO support
 * - History API integration
 * - Proper back/forward button behavior
 * - Automatic base path handling via centralized config
 * 
 * Base Path Handling (via config.basePath):
 * - Development: Uses root path '/' 
 * - GitHub Pages: Automatically detects and uses '/BuildFlow/'
 * - Production: Uses VITE_BASE_PATH environment variable or root path
 * - All environments: Respects VITE_BASE_PATH if explicitly set
 * 
 * Future Flags:
 * - v7_startTransition: Wraps state updates in React.startTransition for better performance
 * - v7_relativeSplatPath: Updates relative route resolution within splat routes
 */
export const RouterProvider: React.FC<RouterProviderProps> = ({ children }) => {
  const basename = config.basePath;

  // Log base path in development
  if (config.isDevelopment && config.enableConsoleLogs) {
    console.log('[RouterProvider] Using basename:', basename);
  }

  return (
    <BrowserRouter
      basename={basename}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {children}
    </BrowserRouter>
  );
};

export default RouterProvider;