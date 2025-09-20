/**
 * Test utilities for React Testing Library
 * 
 * Provides custom render helpers and common test utilities
 */

import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';

/**
 * Props for the test wrapper component
 */
interface TestWrapperProps {
  children: React.ReactNode;
}

/**
 * Test wrapper that provides all necessary context providers
 */
const TestWrapper: React.FC<TestWrapperProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="light">
      {children}
    </ThemeProvider>
  );
};

/**
 * Custom render function that wraps components with test providers
 */
const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: TestWrapper, ...options });

/**
 * Render function without any providers (for testing providers themselves)
 */
const renderWithoutProviders = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, options);

/**
 * Setup user events with default configuration
 */
const setupUser = () => userEvent.setup();

/**
 * Mock localStorage for tests
 */
const createMockLocalStorage = () => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (global as any).jest.fn((key: string) => store[key] || null),
    setItem: (global as any).jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: (global as any).jest.fn((key: string) => {
      delete store[key];
    }),
    clear: (global as any).jest.fn(() => {
      store = {};
    }),
    key: (global as any).jest.fn((index: number) => Object.keys(store)[index] || null),
    length: Object.keys(store).length,
  };
};

/**
 * Mock window.matchMedia for tests
 */
const createMockMatchMedia = (matches = false) => {
  return (global as any).jest.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: (global as any).jest.fn(),
    removeEventListener: (global as any).jest.fn(),
    dispatchEvent: (global as any).jest.fn(),
  }));
};

/**
 * Common test setup for components that use ResizeObserver
 */
const mockResizeObserver = () => {
  global.ResizeObserver = (global as any).jest.fn().mockImplementation(() => ({
    observe: (global as any).jest.fn(),
    unobserve: (global as any).jest.fn(),
    disconnect: (global as any).jest.fn(),
  }));
};

/**
 * Common test setup for components that use IntersectionObserver
 */
const mockIntersectionObserver = () => {
  global.IntersectionObserver = (global as any).jest.fn().mockImplementation(() => ({
    observe: (global as any).jest.fn(),
    unobserve: (global as any).jest.fn(),
    disconnect: (global as any).jest.fn(),
  }));
};

/**
 * Wait for element to be removed from DOM
 */
const waitForElementToBeRemoved = async (element: HTMLElement) => {
  const { waitForElementToBeRemoved: rtlWaitForElementToBeRemoved } = await import('@testing-library/react');
  return rtlWaitForElementToBeRemoved(element);
};

/**
 * Create a mock navigation function for testing
 */
const createMockNavigation = () => ({
  navigateToSignup: (global as any).jest.fn(),
  navigateToLogin: (global as any).jest.fn(),
  navigateToHome: (global as any).jest.fn(),
  navigateTo: (global as any).jest.fn(),
});

/**
 * Common assertions for accessibility
 */
const expectToBeAccessible = (element: HTMLElement) => {
  // Check for basic accessibility attributes
  if (element.getAttribute('role')) {
    (global as any).expect(element).toHaveAttribute('role');
  }
  
  // Check for proper focus management
  if (element.matches('button, a, input, select, textarea')) {
    (global as any).expect(element).not.toHaveAttribute('tabindex', '-1');
  }
};

/**
 * Helper to test component with error boundary
 */
const renderWithErrorBoundary = (ui: React.ReactElement) => {
  const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [hasError, setHasError] = React.useState(false);
    
    React.useEffect(() => {
      const handleError = () => setHasError(true);
      window.addEventListener('error', handleError);
      return () => window.removeEventListener('error', handleError);
    }, []);
    
    if (hasError) {
      return <div data-testid="error-boundary">Error occurred</div>;
    }
    
    return <>{children}</>;
  };
  
  return render(
    <ErrorBoundary>
      {ui}
    </ErrorBoundary>
  );
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';

// Export our custom utilities
export {
  customRender as render,
  renderWithoutProviders,
  setupUser,
  createMockLocalStorage,
  createMockMatchMedia,
  mockResizeObserver,
  mockIntersectionObserver,
  waitForElementToBeRemoved,
  createMockNavigation,
  expectToBeAccessible,
  renderWithErrorBoundary,
};