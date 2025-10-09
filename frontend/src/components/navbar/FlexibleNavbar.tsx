import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from '@/contexts/NavigationContext';
import { cn } from '@/utils/utils';
import { Menu, X } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { Avatar } from './Avatar';
import { LoginButton } from './LoginButton';
import { Logo } from './Logo';
import { SignUpButton } from './SignUpButton';
import { NavbarUser, adaptUserForNavbar } from './types';

// Type for theme toggle component
export type ThemeToggleComponent = React.ComponentType<{
  showLabel?: boolean;
}>;

export interface NavItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface FlexibleNavbarProps {
  className?: string;

  // Brand configuration
  showLogo?: boolean;
  logoSize?: 'sm' | 'md' | 'lg';
  showBrandText?: boolean;
  brandText?: string;
  logoSvg?: React.ReactNode;
  onLogoClick?: () => void;

  // Authentication state (optional - will use AuthContext if not provided)
  isAuthenticated?: boolean;
  user?: NavbarUser | null;

  // Navigation items
  navItems?: NavItem[];

  // Authentication buttons (when not authenticated)
  showAuthButtons?: boolean;
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  loginButtonText?: string;
  signUpButtonText?: string;

  // Logout button (when authenticated)
  onLogoutClick?: () => void;
  logoutButtonText?: string;

  // User menu (when authenticated)
  onAvatarClick?: () => void;

  // Theme toggle configuration
  ThemeToggleComponent?: ThemeToggleComponent;
  showThemeToggle?: boolean;

  // Mobile menu
  enableMobileMenu?: boolean;

  // Mobile width behavior
  // 'fixed' - navbar maintains fixed width on mobile (doesn't go full width)
  // 'responsive' - navbar width adapts to screen size (default)
  mobileWidthBehavior?: 'fixed' | 'responsive';

  // Maximum width when mobileWidthBehavior is 'responsive'
  // Allows parent to constrain navbar width to match other page components
  // Examples: 'max-w-7xl', 'max-w-6xl', 'max-w-5xl', etc.
  maxWidth?: string;
}

/**
 * FlexibleNavbar - A highly flexible navbar component
 * 
 * Features:
 * - Logo with customizable size and smart navigation (dashboard if authenticated, home if not)
 * - Navigation items with onClick handlers 
 * - Authentication state handling (login/signup buttons or user avatar)
 * - Automatic integration with AuthContext and NavigationContext
 * - Theme toggle with multiple styles (compact, dropdown, switch, etc.)
 * - Mobile responsive with hamburger menu
 * - Fully customizable through props
 * - Uniform height across all pages (64px / h-16)
 * - Mobile-first design with configurable width behavior
 * - Configurable maximum width for responsive behavior to match page layouts
 */
export const FlexibleNavbar: React.FC<FlexibleNavbarProps> = ({
  className = '',

  // Brand props
  showLogo = true,
  logoSize = 'md',
  showBrandText = true,
  brandText,
  logoSvg,
  onLogoClick,

  // Auth props - can be overridden by props, but will use context by default
  isAuthenticated: propIsAuthenticated,
  user: propUser,

  // Navigation props
  navItems = [],

  // Auth button props
  showAuthButtons = true,
  onLoginClick,
  onSignUpClick,
  loginButtonText = 'Login',
  signUpButtonText = 'Sign Up',

  // Logout button props
  onLogoutClick,
  logoutButtonText = 'Logout',

  // User menu props
  onAvatarClick,

  // Theme toggle props
  ThemeToggleComponent,
  showThemeToggle = true,

  // Mobile menu props
  enableMobileMenu = true,

  // Mobile width behavior
  mobileWidthBehavior = 'responsive',

  // Max width prop
  maxWidth,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Use contexts for auth and navigation
  const { isAuthenticated: contextIsAuthenticated, user: contextUser } = useAuth();
  const { navigateToHome, navigateToDashboard } = useNavigate();

  // Use prop values if provided, otherwise fall back to context
  const isAuthenticated = propIsAuthenticated ?? contextIsAuthenticated;

  // Convert AuthContext User to NavbarUser format if needed
  const contextNavbarUser = contextUser ? adaptUserForNavbar(contextUser) : null;
  const user = propUser ?? contextNavbarUser;

  // Logo click handler - use custom handler if provided, otherwise navigate based on authentication status
  const handleLogoClick = useCallback(() => {
    if (onLogoClick) {
      onLogoClick();
    } else if (isAuthenticated) {
      navigateToDashboard();
    } else {
      navigateToHome();
    }
  }, [onLogoClick, isAuthenticated, navigateToDashboard, navigateToHome]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavItemClick = (item: NavItem) => {
    if (item.onClick) {
      item.onClick();
    }
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  // Avatar dropdown handlers
  const handleAvatarOpen = useCallback(() => {
    // Close mobile menu when avatar dropdown opens
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobileMenuOpen]);

  const handleAvatarClose = () => {
    // Avatar dropdown closed - no specific action needed
    // This callback allows for future extensibility
  };

  // Helper function to render theme toggle with appropriate props
  const renderThemeToggle = (showLabel: boolean = false) => {
    if (!ThemeToggleComponent) {
      return (
        <div className="text-sm text-muted-foreground">
          (Configure ThemeToggleComponent prop)
        </div>
      );
    }
    return <ThemeToggleComponent showLabel={showLabel} />;
  };

  // Render logo section
  const renderLogoSection = () => (
    <div className="flex items-center">
      {showLogo && (
        <Logo
          size={logoSize}
          showText={showBrandText}
          brandText={brandText}
          logoSvg={logoSvg}
          onClick={handleLogoClick}
          className="flex-shrink-0"
        />
      )}
    </div>
  );

  // Render desktop navigation
  const renderDesktopNavigation = () => {
    if (navItems.length === 0) return null;

    return (
      <nav className="hidden md:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleNavItemClick(item)}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {item.label}
          </button>
        ))}
      </nav>
    );
  };

  // Render authentication section
  const renderAuthSection = () => {
    if (isAuthenticated && user) {
      return (
        <Avatar
          user={user}
          onClick={onAvatarClick}
          size="md"
          showDropdown={showAuthButtons}
          onLogoutClick={onLogoutClick}
          logoutButtonText={logoutButtonText}
          onAvatarOpen={handleAvatarOpen}
          onAvatarClose={handleAvatarClose}
        />
      );
    }

    if (showAuthButtons) {
      return (
        <div className="hidden md:flex items-center gap-2">
          <LoginButton
            onClick={onLoginClick}
            variant="ghost"
            size="sm"
          >
            {loginButtonText}
          </LoginButton>
          <SignUpButton
            onClick={onSignUpClick}
            variant="default"
            size="sm"
          >
            {signUpButtonText}
          </SignUpButton>
        </div>
      );
    }

    return null;
  };

  // Render mobile menu button
  const renderMobileMenuButton = () => {
    if (!enableMobileMenu || (navItems.length === 0 && !showAuthButtons)) {
      return null;
    }

    return (
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>
    );
  };

  // Render mobile navigation
  const renderMobileNavigation = () => {
    if (navItems.length === 0) return null;

    return (
      <nav className="space-y-1">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleNavItemClick(item)}
            className="block w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors py-2.5 px-3 rounded-md"
          >
            {item.label}
          </button>
        ))}
      </nav>
    );
  };

  // Render mobile auth buttons
  const renderMobileAuthButtons = () => {
    // Only show auth buttons when not authenticated (Avatar handles logout when authenticated)
    if (!showAuthButtons || isAuthenticated) return null;

    return (
      <div className="space-y-1 border-t border-border/20">
        <button
          onClick={() => {
            onLoginClick?.();
            setIsMobileMenuOpen(false);
          }}
          className="block w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors py-2.5 px-3 rounded-md"
        >
          {loginButtonText}
        </button>
        <button
          onClick={() => {
            onSignUpClick?.();
            setIsMobileMenuOpen(false);
          }}
          className="block w-full text-left text-sm font-medium text-primary hover:text-primary/90 bg-primary/10 hover:bg-primary/20 transition-colors py-2.5 px-3 rounded-md"
        >
          {signUpButtonText}
        </button>
      </div>
    );
  };

  // Render mobile menu overlay
  const renderMobileMenuOverlay = () => {
    if (!enableMobileMenu || !isMobileMenuOpen) return null;

    return (
      <div className="md:hidden absolute top-16 left-0 right-0 border-t border-border/20 bg-background/95 backdrop-blur shadow-lg z-50">
        <div className={cn(
          "px-4 py-4 space-y-4",
          mobileWidthBehavior === 'fixed'
            ? "container mx-auto"
            : maxWidth
              ? `${maxWidth} mx-auto`
              : "mx-auto"
        )}>
          {renderMobileNavigation()}
          {renderMobileAuthButtons()}
        </div>
      </div>
    );
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className={cn(
        "px-4 h-16 flex items-center justify-between",
        mobileWidthBehavior === 'fixed'
          ? "container mx-auto"
          : maxWidth
            ? `${maxWidth} mx-auto`
            : "mx-auto"
      )}>

        {/* Left side - Logo */}
        {renderLogoSection()}

        {/* Center - Desktop Navigation */}
        {renderDesktopNavigation()}

        {/* Right side - Theme Toggle and Auth */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          {showThemeToggle && (
            <div>
              {renderThemeToggle(false)}
            </div>
          )}

          {/* Authentication Section */}
          {renderAuthSection()}

          {/* Mobile Menu Button */}
          {renderMobileMenuButton()}
        </div>
      </div>

      {/* Mobile Menu - Overlay */}
      {renderMobileMenuOverlay()}
    </header>
  );
};

export default FlexibleNavbar;