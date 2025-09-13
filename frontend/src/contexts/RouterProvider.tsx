import React from 'react';
import { BrowserRouter } from 'react-router-dom';

interface RouterProviderProps {
  children: React.ReactNode;
}

/**
 * RouterProvider component that wraps the application with React Router's BrowserRouter.
 * 
 * Uses BrowserRouter for clean URLs without hash fragments.
 * This provider should be at the top level of your provider hierarchy.
 * 
 * Benefits:
 * - Clean URLs (e.g., /dashboard instead of /#/dashboard)
 * - Better SEO support
 * - History API integration
 * - Proper back/forward button behavior
 */
export const RouterProvider: React.FC<RouterProviderProps> = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

export default RouterProvider;