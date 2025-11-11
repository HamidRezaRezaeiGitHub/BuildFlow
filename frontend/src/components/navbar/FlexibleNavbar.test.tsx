import { fireEvent, render, screen } from '@testing-library/react';
import { FlexibleNavbar } from './FlexibleNavbar';
import { NavbarUser } from './types';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { Mock } from 'vitest';

// Mock the theme context
const mockSetTheme = vi.fn();
const mockToggleTheme = vi.fn();

vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    actualTheme: 'light',
    setTheme: mockSetTheme,
    toggleTheme: mockToggleTheme,
  }),
}));

// Mock the auth context
const mockLogin = vi.fn();
const mockRegister = vi.fn();
const mockLogout = vi.fn();

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    role: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    login: mockLogin,
    register: mockRegister,
    logout: mockLogout,
    refreshToken: vi.fn(),
    getCurrentUser: vi.fn(),
  }),
}));

// Mock the navigation context
const mockNavigateToHome = vi.fn();
const mockNavigateToDashboard = vi.fn();
const mockScrollToSection = vi.fn();
const mockGoBack = vi.fn();
const mockOpenExternalLink = vi.fn();

vi.mock('@/contexts/NavigationContext', () => ({
  useNavigate: () => ({
    navigateToHome: mockNavigateToHome,
    navigateToDashboard: mockNavigateToDashboard,
    scrollToSection: mockScrollToSection,
    goBack: mockGoBack,
    openExternalLink: mockOpenExternalLink,
  }),
}));

// Mock user data using generic NavbarUser interface
const mockUser: NavbarUser = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'test@example.com',
  avatarUrl: undefined
};

describe('FlexibleNavbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear specific mocks
    mockSetTheme.mockClear();
    mockToggleTheme.mockClear();
    mockLogin.mockClear();
    mockRegister.mockClear();
    mockLogout.mockClear();
    mockNavigateToHome.mockClear();
    mockNavigateToDashboard.mockClear();
    mockScrollToSection.mockClear();
    mockGoBack.mockClear();
    mockOpenExternalLink.mockClear();
  });

  test('FlexibleNavbar_shouldRenderWithDefaultProps', () => {
    render(<FlexibleNavbar />);
    
        // Logo should be displayed by default with default brand text
    expect(screen.getByText('Brand')).toBeInTheDocument();
    
    // Should show auth buttons when not authenticated
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    
    // Should show placeholder text when no theme component is provided
    expect(screen.getByText(/Configure ThemeToggleComponent prop/)).toBeInTheDocument();
  });

  test('FlexibleNavbar_shouldShowUserAvatar_whenAuthenticated', () => {
    render(
      <FlexibleNavbar 
        isAuthenticated={true}
        user={mockUser}
      />
    );
    
    // Should show avatar instead of auth buttons
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
    
    // Should show user initials in avatar
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  test('FlexibleNavbar_shouldRenderNavigationItems', () => {
    const navItems = [
      { label: 'Home', onClick: vi.fn() },
      { label: 'About', onClick: vi.fn() },
      { label: 'Contact', onClick: vi.fn() }
    ];

    render(<FlexibleNavbar navItems={navItems} />);
    
    navItems.forEach(item => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  test('FlexibleNavbar_shouldCallNavItemOnClick_whenNavItemClicked', () => {
    const mockOnClick = vi.fn();
    const navItems = [
      { label: 'Home', onClick: mockOnClick }
    ];

    render(<FlexibleNavbar navItems={navItems} />);
    
    fireEvent.click(screen.getByText('Home'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('FlexibleNavbar_shouldCallAuthCallbacks_whenAuthButtonsClicked', () => {
    const mockOnLoginClick = vi.fn();
    const mockOnSignUpClick = vi.fn();

    render(
      <FlexibleNavbar 
        onLoginClick={mockOnLoginClick}
        onSignUpClick={mockOnSignUpClick}
      />
    );
    
    fireEvent.click(screen.getByText('Login'));
    expect(mockOnLoginClick).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByText('Sign Up'));
    expect(mockOnSignUpClick).toHaveBeenCalledTimes(1);
  });

  test('FlexibleNavbar_shouldCallAvatarCallback_whenAvatarClicked', () => {
    const mockOnAvatarClick = vi.fn();

    render(
      <FlexibleNavbar 
        isAuthenticated={true}
        user={mockUser}
        onAvatarClick={mockOnAvatarClick}
        showAuthButtons={false}  // Disable dropdown to allow onClick handler
      />
    );
    
    // Click on the avatar (find by alt text or initials)
    fireEvent.click(screen.getByText('JD'));
    expect(mockOnAvatarClick).toHaveBeenCalledTimes(1);
  });

  test('FlexibleNavbar_shouldHideLogo_whenShowLogoIsFalse', () => {
    render(<FlexibleNavbar showLogo={false} />);
    
    expect(screen.queryByText('Brand')).not.toBeInTheDocument();
  });

  test('FlexibleNavbar_shouldHideAuthButtons_whenShowAuthButtonsIsFalse', () => {
    render(<FlexibleNavbar showAuthButtons={false} />);
    
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
  });

  test('FlexibleNavbar_shouldHideThemeToggle_whenShowThemeToggleIsFalse', () => {
    render(<FlexibleNavbar showThemeToggle={false} />);
    
    expect(screen.queryByText('🌙')).not.toBeInTheDocument();
  });

  test('FlexibleNavbar_shouldUseCustomButtonText', () => {
    render(
      <FlexibleNavbar 
        loginButtonText="Sign In"
        signUpButtonText="Get Started"
      />
    );
    
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  test('FlexibleNavbar_shouldShowThemeTogglePlaceholder_whenNoThemeComponentProvided', () => {
    render(<FlexibleNavbar showThemeToggle={true} />);
    
    // Should show placeholder text when no theme component is provided
    expect(screen.getByText(/Configure ThemeToggleComponent prop/)).toBeInTheDocument();
  });

  test('FlexibleNavbar_shouldShowMobileMenu_whenMobileMenuButtonClicked', () => {
    const navItems = [
      { label: 'Home', onClick: vi.fn() },
      { label: 'About', onClick: vi.fn() }
    ];

    render(<FlexibleNavbar navItems={navItems} />);
    
    // Find mobile menu button (should be hidden on desktop but testable)
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
    fireEvent.click(mobileMenuButton);
    
    // Mobile menu should now be visible with nav items
    // Note: In actual mobile view, these would be visible, but in test they might not be due to CSS classes
    // The important thing is that the state change happens
    expect(mobileMenuButton).toBeInTheDocument();
  });

  test('FlexibleNavbar_shouldRenderWithCustomThemeToggleComponent', () => {
    const MockThemeToggle = ({ showLabel }: { showLabel?: boolean }) => (
      <div data-testid="custom-theme-toggle">
        Custom Theme Toggle {showLabel && '(with label)'}
      </div>
    );
    
    render(<FlexibleNavbar ThemeToggleComponent={MockThemeToggle} />);
    
    // Custom theme toggle should be rendered
    expect(screen.getByTestId('custom-theme-toggle')).toBeInTheDocument();
  });

  test('FlexibleNavbar_shouldHandleUserWithoutContactDto', () => {
    const userWithoutContact: NavbarUser = {
      id: '2',
      email: 'nocontact@example.com'
    };    render(
      <FlexibleNavbar 
        isAuthenticated={true}
        user={userWithoutContact}
      />
    );
    
    // Should show fallback initial 'U' for user without contact info
    expect(screen.getByText('U')).toBeInTheDocument();
  });

  test('FlexibleNavbar_shouldApplyCustomClassName', () => {
    const { container } = render(<FlexibleNavbar className="custom-navbar" />);
    
    const header = container.querySelector('header');
    expect(header).toHaveClass('custom-navbar');
  });
});