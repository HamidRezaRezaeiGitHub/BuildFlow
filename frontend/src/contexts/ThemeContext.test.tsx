/**
 * Tests for ThemeContext and ThemeProvider
 * 
 * Tests theme management functionality including localStorage persistence,
 * system theme detection, and theme toggling
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock window.matchMedia
const mockMatchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
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
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      onchange: null,
      dispatchEvent: jest.fn(),
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
    expect(localStorageMock.getItem).toHaveBeenCalledWith('buildflow-theme');
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
    expect(localStorageMock.setItem).toHaveBeenCalledWith('buildflow-theme', 'dark');
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
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      onchange: null,
      dispatchEvent: jest.fn(),
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
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      onchange: null,
      dispatchEvent: jest.fn(),
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
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      onchange: null,
      dispatchEvent: jest.fn(),
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
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      onchange: null,
      dispatchEvent: jest.fn(),
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
});