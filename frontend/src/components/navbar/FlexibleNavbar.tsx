import React, { useState } from 'react';
// Note: These imports should be configured by the consuming project
// See dependencies.ts for interface requirements
// Example: import { Button } from '@/components/ui/button';
// Example: import { cn } from '@/lib/utils';  
// Example: import { Menu, X } from 'lucide-react';

// TODO: Replace these with your project's actual imports
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';
import { Menu, X } from 'lucide-react';
import { Avatar } from './Avatar';
import { LoginButton } from './LoginButton';
import { Logo } from './Logo';
import { SignUpButton } from './SignUpButton';
import { NavbarUser } from './types';

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

  // Authentication state
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
 * - Logo with customizable size
 * - Navigation items with onClick handlers 
 * - Authentication state handling (login/signup buttons or user avatar)
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

  // Auth props
  isAuthenticated = false,
  user = null,

  // Navigation props
  navItems = [],

  // Auth button props
  showAuthButtons = true,
  onLoginClick,
  onSignUpClick,
  loginButtonText = 'Login',
  signUpButtonText = 'Sign Up',

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

  // Helper function to render theme toggle with appropriate props
  const renderThemeToggle = (showLabel: boolean = false) => {
    if (!ThemeToggleComponent) {
      return (
        <div className="text-sm text-muted-foreground">
          Theme Toggle (Configure ThemeToggleComponent prop)
        </div>
      );
    }
    return <ThemeToggleComponent showLabel={showLabel} />;
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

        {/* Left side - Logo and Brand */}
        <div className="flex items-center gap-8">
          {showLogo && (
            <Logo
              size={logoSize}
              showText={showBrandText}
              brandText={brandText}
              logoSvg={logoSvg}
              className="flex-shrink-0"
            />
          )}

          {/* Desktop Navigation */}
          {navItems.length > 0 && (
            <nav className="hidden md:flex items-center gap-6">
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
          )}
        </div>

        {/* Right side - Theme Toggle and Auth */}
        <div className="flex items-center gap-4">

          {/* Theme Toggle */}
          {showThemeToggle && (
            <div className="hidden sm:block">
              {renderThemeToggle(false)}
            </div>
          )}

          {/* Authentication Section */}
          {isAuthenticated && user ? (
            // Authenticated: Show Avatar
            <Avatar
              user={user}
              onClick={onAvatarClick}
              size="md"
            />
          ) : showAuthButtons ? (
            // Not Authenticated: Show Login/SignUp buttons
            <div className="hidden sm:flex items-center gap-2">
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
          ) : null}

          {/* Mobile Menu Button */}
          {enableMobileMenu && (navItems.length > 0 || showAuthButtons) && (
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
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {enableMobileMenu && isMobileMenuOpen && (
        <div className="md:hidden border-t border-border/20 bg-background/95 backdrop-blur">
          <div className={cn(
            "px-4 py-4 space-y-4",
            mobileWidthBehavior === 'fixed'
              ? "container mx-auto"
              : maxWidth
                ? `${maxWidth} mx-auto`
                : "mx-auto"
          )}>

            {/* Mobile Navigation */}
            {navItems.length > 0 && (
              <nav className="space-y-2">
                {navItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleNavItemClick(item)}
                    className="block w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            )}

            {/* Mobile Theme Toggle */}
            {showThemeToggle && (
              <div className="py-2">
                {renderThemeToggle(true)}
              </div>
            )}

            {/* Mobile Auth Buttons */}
            {!isAuthenticated && showAuthButtons && (
              <div className="flex flex-col space-y-2 pt-2 border-t border-border/20">
                <LoginButton
                  onClick={() => {
                    onLoginClick?.();
                    setIsMobileMenuOpen(false);
                  }}
                  variant="ghost"
                  className="justify-start w-full"
                >
                  {loginButtonText}
                </LoginButton>
                <SignUpButton
                  onClick={() => {
                    onSignUpClick?.();
                    setIsMobileMenuOpen(false);
                  }}
                  variant="default"
                  className="justify-start w-full"
                >
                  {signUpButtonText}
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default FlexibleNavbar;