import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { NavigationProvider, useNavigate } from './NavigationContext';

// Test component that uses the navigation context
const TestNavigationComponent: React.FC = () => {
  const navigation = useNavigate();

  return (
    <div>
      <button onClick={() => navigation.navigateToHome()}>Go Home</button>
      <button onClick={() => navigation.navigateToDashboard()}>Go Dashboard</button>
      <button onClick={() => navigation.navigateToAdmin()}>Go Admin</button>
      <button onClick={() => navigation.scrollToSection('test-section')}>Scroll to Section</button>
      <button onClick={() => navigation.navigateToAuth('login')}>Navigate to Login</button>
      <button onClick={() => navigation.goBack()}>Go Back</button>
      <button onClick={() => navigation.openExternalLink('https://example.com')}>External Link</button>
    </div>
  );
};

// Mock React Router's useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

// Mock window methods
Object.defineProperty(window, 'history', {
  writable: true,
  value: {
    back: vi.fn(),
    forward: vi.fn(),
    pushState: vi.fn(),
  },
});

Object.defineProperty(window, 'open', {
  writable: true,
  value: vi.fn(),
});

// Mock scroll methods
Element.prototype.scrollIntoView = vi.fn();

// Mock getElementById
const mockGetElementById = vi.fn();
Object.defineProperty(document, 'getElementById', {
  writable: true,
  value: mockGetElementById,
});

describe('NavigationContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithNavigationProvider = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        <NavigationProvider>
          {component}
        </NavigationProvider>
      </BrowserRouter>
    );
  };

  test('NavigationContext_shouldThrowError_whenUsedOutsideProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

    expect(() => {
      render(<TestNavigationComponent />);
    }).toThrow('useNavigate must be used within a NavigationProvider');

    consoleSpy.mockRestore();
  });

  test('NavigationContext_shouldProvideNavigationMethods_whenUsedWithinProvider', () => {
    renderWithNavigationProvider(<TestNavigationComponent />);

    expect(screen.getByText('Go Home')).toBeInTheDocument();
    expect(screen.getByText('Go Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Go Admin')).toBeInTheDocument();
    expect(screen.getByText('Scroll to Section')).toBeInTheDocument();
  });

  test('NavigationContext_shouldCallReactRouterNavigate_whenNavigatingToPages', () => {
    renderWithNavigationProvider(<TestNavigationComponent />);

    fireEvent.click(screen.getByText('Go Home'));
    expect(mockNavigate).toHaveBeenCalledWith('/', undefined);

    fireEvent.click(screen.getByText('Go Dashboard'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', undefined);

    fireEvent.click(screen.getByText('Go Admin'));
    expect(mockNavigate).toHaveBeenCalledWith('/admin', undefined);
  });

  test('NavigationContext_shouldCallScrollIntoView_whenScrollingToSection', () => {
    const mockElement = { scrollIntoView: vi.fn() };
    mockGetElementById.mockReturnValue(mockElement);

    renderWithNavigationProvider(<TestNavigationComponent />);

    fireEvent.click(screen.getByText('Scroll to Section'));

    expect(mockGetElementById).toHaveBeenCalledWith('test-section');
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
    expect(window.history.pushState).toHaveBeenCalledWith(null, '', '#test-section');
  });

  test('NavigationContext_shouldCallWindowHistory_whenGoingBack', () => {
    renderWithNavigationProvider(<TestNavigationComponent />);

    fireEvent.click(screen.getByText('Go Back'));
    expect(window.history.back).toHaveBeenCalled();
  });

  test('NavigationContext_shouldCallWindowOpen_whenOpeningExternalLink', () => {
    renderWithNavigationProvider(<TestNavigationComponent />);

    fireEvent.click(screen.getByText('External Link'));
    expect(window.open).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer');
  });

  test('NavigationContext_shouldHandleAuthNavigation_withTabId', () => {
    const mockElement = { scrollIntoView: vi.fn() };
    mockGetElementById.mockReturnValue(mockElement);

    renderWithNavigationProvider(<TestNavigationComponent />);

    fireEvent.click(screen.getByText('Navigate to Login'));

    expect(mockGetElementById).toHaveBeenCalledWith('auth');
    expect(mockElement.scrollIntoView).toHaveBeenCalled();
  });

  test('NavigationContext_shouldWarnWhenElementNotFound', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
    mockGetElementById.mockReturnValue(null);

    renderWithNavigationProvider(<TestNavigationComponent />);

    fireEvent.click(screen.getByText('Scroll to Section'));

    expect(consoleSpy).toHaveBeenCalledWith('Element with ID "test-section" not found');
    consoleSpy.mockRestore();
  });
});