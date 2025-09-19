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
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
    length: Object.keys(store).length,
  };
};

/**
 * Mock window.matchMedia for tests
 */
const createMockMatchMedia = (matches = false) => {
  return jest.fn().mockImplementation(query => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
};

/**
 * Common test setup for components that use ResizeObserver
 */
const mockResizeObserver = () => {
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
};

/**
 * Common test setup for components that use IntersectionObserver
 */
const mockIntersectionObserver = () => {
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
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
  navigateToSignup: jest.fn(),
  navigateToLogin: jest.fn(),
  navigateToHome: jest.fn(),
  navigateTo: jest.fn(),
});

/**
 * Common assertions for accessibility
 */
const expectToBeAccessible = (element: HTMLElement) => {
  // Check for basic accessibility attributes
  if (element.getAttribute('role')) {
    expect(element).toHaveAttribute('role');
  }
  
  // Check for proper focus management
  if (element.matches('button, a, input, select, textarea')) {
    expect(element).not.toHaveAttribute('tabindex', '-1');
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