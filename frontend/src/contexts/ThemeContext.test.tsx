/**
 * Tests for ThemeContext and ThemeProvider
 * 
 * Tests theme management functionality including localStorage persistence,
 * system theme detection, theme toggling, and customization options.
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from './ThemeContext';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { Mock } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock window.matchMedia
const mockMatchMedia = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));
Object.defineProperty(window, 'matchMedia', { value: mockMatchMedia });

// Test component to use the theme context
const TestComponent = () => {
  const { theme, actualTheme, setTheme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="actual-theme">{actualTheme}</span>
      <button onClick={() => setTheme('light')}>Set Light</button>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('system')}>Set System</button>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

// Test component that throws error when used outside provider
const TestComponentWithoutProvider = () => {
  try {
    useTheme();
    return <div>Should not render</div>;
  } catch (error) {
    return <div data-testid="error">{(error as Error).message}</div>;
  }
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      onchange: null,
      dispatchEvent: vi.fn(),
    });
    // Clear document classes
    document.documentElement.className = '';
  });

  test('ThemeProvider_shouldProvideDefaultTheme_whenMounted', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme')).toHaveTextContent('system');
    expect(screen.getByTestId('actual-theme')).toHaveTextContent('light');
  });

  test('ThemeProvider_shouldUseCustomDefaultTheme_whenDefaultThemeProvided', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(screen.getByTestId('actual-theme')).toHaveTextContent('dark');
  });

  test('ThemeProvider_shouldLoadFromLocalStorage_whenSavedThemeExists', () => {
    localStorageMock.getItem.mockReturnValue('dark');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('app-theme');
  });

  test('ThemeProvider_shouldIgnoreInvalidStoredTheme_whenInvalidThemeInStorage', () => {
    localStorageMock.getItem.mockReturnValue('invalid-theme');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme')).toHaveTextContent('system');
  });

  test('setTheme_shouldUpdateThemeAndSaveToStorage_whenCalled', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    await user.click(screen.getByText('Set Dark'));
    
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(screen.getByTestId('actual-theme')).toHaveTextContent('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('app-theme', 'dark');
  });

  test('setTheme_shouldUpdateDocumentClass_whenThemeChanged', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    await user.click(screen.getByText('Set Dark'));
    
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
    
    await user.click(screen.getByText('Set Light'));
    
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  test('toggleTheme_shouldToggleBetweenLightAndDark_whenCalled', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    
    await user.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    
    await user.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  test('toggleTheme_shouldToggleFromSystemToOppositeActual_whenSystemTheme', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider defaultTheme="system">
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme')).toHaveTextContent('system');
    expect(screen.getByTestId('actual-theme')).toHaveTextContent('light');
    
    await user.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  test('ThemeProvider_shouldRespondToSystemThemeChanges_whenSystemThemeActive', () => {
    const mockMediaQuery = {
      matches: false,
      media: '(prefers-color-scheme: dark)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      onchange: null,
      dispatchEvent: vi.fn(),
    };
    mockMatchMedia.mockReturnValue(mockMediaQuery);
    
    render(
      <ThemeProvider defaultTheme="system">
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('actual-theme')).toHaveTextContent('light');
    expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  test('ThemeProvider_shouldCleanupListener_whenSystemThemeChanges', async () => {
    const user = userEvent.setup();
    const mockMediaQuery = {
      matches: false,
      media: '(prefers-color-scheme: dark)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      onchange: null,
      dispatchEvent: vi.fn(),
    };
    mockMatchMedia.mockReturnValue(mockMediaQuery);
    
    render(
      <ThemeProvider defaultTheme="system">
        <TestComponent />
      </ThemeProvider>
    );
    
    // Change to non-system theme
    await user.click(screen.getByText('Set Light'));
    
    expect(mockMediaQuery.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
});

describe('useTheme', () => {
  test('useTheme_shouldThrowError_whenUsedOutsideProvider', () => {
    render(<TestComponentWithoutProvider />);
    
    expect(screen.getByTestId('error')).toHaveTextContent(
      'useTheme must be used within a ThemeProvider'
    );
  });

  test('useTheme_shouldReturnContextValue_whenUsedInsideProvider', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Should render without error and show theme values
    expect(screen.getByTestId('theme')).toBeInTheDocument();
    expect(screen.getByTestId('actual-theme')).toBeInTheDocument();
  });
});

describe('ThemeProvider system theme detection', () => {
  test('ThemeProvider_shouldDetectDarkSystemTheme_whenSystemPrefersDark', () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      media: '(prefers-color-scheme: dark)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      onchange: null,
      dispatchEvent: vi.fn(),
    });
    
    render(
      <ThemeProvider defaultTheme="system">
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme')).toHaveTextContent('system');
    expect(screen.getByTestId('actual-theme')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  test('ThemeProvider_shouldDetectLightSystemTheme_whenSystemPrefersLight', () => {
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      onchange: null,
      dispatchEvent: vi.fn(),
    });
    
    render(
      <ThemeProvider defaultTheme="system">
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme')).toHaveTextContent('system');
    expect(screen.getByTestId('actual-theme')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  test('ThemeProvider_shouldUseCustomStorageKey_whenStorageKeyProvided', () => {
    localStorageMock.getItem.mockReturnValue('dark');
    
    render(
      <ThemeProvider storageKey="custom-theme">
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(localStorageMock.getItem).toHaveBeenCalledWith('custom-theme');
  });

  test('ThemeProvider_shouldNotManageClasses_whenClassToggleDisabled', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider enableClassToggle={false}>
        <TestComponent />
      </ThemeProvider>
    );
    
    await user.click(screen.getByText('Set Dark'));
    
    // Classes should not be added when enableClassToggle is false
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });

  test('setTheme_shouldUseCustomStorageKey_whenCustomKeyProvided', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider storageKey="my-app-theme">
        <TestComponent />
      </ThemeProvider>
    );
    
    await user.click(screen.getByText('Set Dark'));
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('my-app-theme', 'dark');
  });
});