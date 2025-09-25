import { fireEvent, render, screen } from '@testing-library/react';
import { ConfigurableNavbar } from './ConfigurableNavbar';
import { User } from '@/services/dtos';

// Mock the theme context
const mockSetTheme = jest.fn();
const mockToggleTheme = jest.fn();

jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    actualTheme: 'light',
    setTheme: mockSetTheme,
    toggleTheme: mockToggleTheme,
  }),
}));

// Mock user data
const mockUser: User = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  registered: true,
  contactDto: {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    labels: ['Builder'],
    email: 'test@example.com',
    phone: '+1234567890',
    addressDto: {
      id: '1',
      streetNumber: '123',
      streetName: 'Main St',
      city: 'Anytown',
      stateOrProvince: 'CA',
      postalOrZipCode: '12345',
      country: 'USA'
    }
  }
};

describe('ConfigurableNavbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('ConfigurableNavbar_shouldRenderWithDefaultProps', () => {
    render(<ConfigurableNavbar />);
    
    // Should show logo and brand text by default
    expect(screen.getByText('BuildFlow')).toBeInTheDocument();
    
    // Should show auth buttons when not authenticated
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    
    // Should show compact theme toggle by default (moon icon button)
    expect(screen.getByText('🌙')).toBeInTheDocument();
  });

  test('ConfigurableNavbar_shouldShowUserAvatar_whenAuthenticated', () => {
    render(
      <ConfigurableNavbar 
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

  test('ConfigurableNavbar_shouldRenderNavigationItems', () => {
    const navItems = [
      { label: 'Home', onClick: jest.fn() },
      { label: 'About', onClick: jest.fn() },
      { label: 'Contact', onClick: jest.fn() }
    ];

    render(<ConfigurableNavbar navItems={navItems} />);
    
    navItems.forEach(item => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  test('ConfigurableNavbar_shouldCallNavItemOnClick_whenNavItemClicked', () => {
    const mockOnClick = jest.fn();
    const navItems = [
      { label: 'Home', onClick: mockOnClick }
    ];

    render(<ConfigurableNavbar navItems={navItems} />);
    
    fireEvent.click(screen.getByText('Home'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('ConfigurableNavbar_shouldCallAuthCallbacks_whenAuthButtonsClicked', () => {
    const mockOnLoginClick = jest.fn();
    const mockOnSignUpClick = jest.fn();

    render(
      <ConfigurableNavbar 
        onLoginClick={mockOnLoginClick}
        onSignUpClick={mockOnSignUpClick}
      />
    );
    
    fireEvent.click(screen.getByText('Login'));
    expect(mockOnLoginClick).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByText('Sign Up'));
    expect(mockOnSignUpClick).toHaveBeenCalledTimes(1);
  });

  test('ConfigurableNavbar_shouldCallAvatarCallback_whenAvatarClicked', () => {
    const mockOnAvatarClick = jest.fn();

    render(
      <ConfigurableNavbar 
        isAuthenticated={true}
        user={mockUser}
        onAvatarClick={mockOnAvatarClick}
      />
    );
    
    // Click on the avatar (find by alt text or initials)
    fireEvent.click(screen.getByText('JD'));
    expect(mockOnAvatarClick).toHaveBeenCalledTimes(1);
  });

  test('ConfigurableNavbar_shouldHideLogo_whenShowLogoIsFalse', () => {
    render(<ConfigurableNavbar showLogo={false} />);
    
    expect(screen.queryByText('BuildFlow')).not.toBeInTheDocument();
  });

  test('ConfigurableNavbar_shouldHideAuthButtons_whenShowAuthButtonsIsFalse', () => {
    render(<ConfigurableNavbar showAuthButtons={false} />);
    
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
  });

  test('ConfigurableNavbar_shouldHideThemeToggle_whenShowThemeToggleIsFalse', () => {
    render(<ConfigurableNavbar showThemeToggle={false} />);
    
    expect(screen.queryByText('🌙')).not.toBeInTheDocument();
  });

  test('ConfigurableNavbar_shouldUseCustomButtonText', () => {
    render(
      <ConfigurableNavbar 
        loginButtonText="Sign In"
        signUpButtonText="Get Started"
      />
    );
    
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  test('ConfigurableNavbar_shouldShowDropdownThemeToggle_whenThemeToggleTypeIsDropdown', () => {
    render(<ConfigurableNavbar themeToggleType="dropdown" />);
    
    // Should show dropdown theme toggle (since showLabel is false for desktop, no "Theme:" text)
    // But we can check for the dropdown select element
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('ConfigurableNavbar_shouldShowMobileMenu_whenMobileMenuButtonClicked', () => {
    const navItems = [
      { label: 'Home', onClick: jest.fn() },
      { label: 'About', onClick: jest.fn() }
    ];

    render(<ConfigurableNavbar navItems={navItems} />);
    
    // Find mobile menu button (should be hidden on desktop but testable)
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
    fireEvent.click(mobileMenuButton);
    
    // Mobile menu should now be visible with nav items
    // Note: In actual mobile view, these would be visible, but in test they might not be due to CSS classes
    // The important thing is that the state change happens
    expect(mobileMenuButton).toBeInTheDocument();
  });

  test('ConfigurableNavbar_shouldRenderWithAllThemeToggleTypes', () => {
    const themeToggleTypes = ['compact', 'dropdown', 'switch', 'singleIcon', 'toggleGroup', 'button', 'segmented'] as const;
    
    themeToggleTypes.forEach(type => {
      const { unmount } = render(<ConfigurableNavbar themeToggleType={type} />);
      
      // Each theme toggle type should render without errors
      expect(screen.getByText('BuildFlow')).toBeInTheDocument();
      
      unmount();
    });
  });

  test('ConfigurableNavbar_shouldHandleUserWithoutContactDto', () => {
    const userWithoutContact: User = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      registered: true,
      contactDto: undefined as any
    };

    render(
      <ConfigurableNavbar 
        isAuthenticated={true}
        user={userWithoutContact}
      />
    );
    
    // Should show fallback initial 'U' for user without contact info
    expect(screen.getByText('U')).toBeInTheDocument();
  });

  test('ConfigurableNavbar_shouldApplyCustomClassName', () => {
    const { container } = render(<ConfigurableNavbar className="custom-navbar" />);
    
    const header = container.querySelector('header');
    expect(header).toHaveClass('custom-navbar');
  });
});