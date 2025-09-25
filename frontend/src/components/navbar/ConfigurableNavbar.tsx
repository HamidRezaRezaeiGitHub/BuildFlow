import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { LoginButton } from './LoginButton';
import { SignUpButton } from './SignUpButton';
import { Avatar } from './Avatar';
import {
  DropdownThemeToggle,
  SwitchThemeToggle,
  SingleChangingIconThemeToggle,
  ToggleGroupThemeToggle,
  ButtonThemeToggle,
  SegmentedThemeToggle,
  CompactThemeToggle
} from '@/components/theme';
import { User } from '@/services/dtos';

// Theme toggle component mapping
const themeToggleComponents = {
  compact: CompactThemeToggle,
  dropdown: DropdownThemeToggle,
  switch: SwitchThemeToggle,
  singleIcon: SingleChangingIconThemeToggle,
  toggleGroup: ToggleGroupThemeToggle,
  button: ButtonThemeToggle,
  segmented: SegmentedThemeToggle,
} as const;

export interface NavItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface ConfigurableNavbarProps {
  className?: string;
  
  // Brand configuration
  showLogo?: boolean;
  logoSize?: 'sm' | 'md' | 'lg';
  showBrandText?: boolean;
  
  // Authentication state
  isAuthenticated?: boolean;
  user?: User | null;
  
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
  themeToggleType?: keyof typeof themeToggleComponents;
  showThemeToggle?: boolean;
  
  // Mobile menu
  enableMobileMenu?: boolean;
}

/**
 * ConfigurableNavbar - A highly configurable navbar component
 * 
 * Features:
 * - Configurable logo and branding
 * - Authentication state handling (login/signup buttons vs user avatar)
 * - Flexible navigation items
 * - Multiple theme toggle options
 * - Responsive mobile menu
 * - Customizable styling
 */
export const ConfigurableNavbar: React.FC<ConfigurableNavbarProps> = ({
  className = '',
  
  // Brand props
  showLogo = true,
  logoSize = 'md',
  showBrandText = true,
  
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
  themeToggleType = 'compact',
  showThemeToggle = true,
  
  // Mobile menu props
  enableMobileMenu = true,
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
    if (themeToggleType === 'dropdown') {
      return <DropdownThemeToggle showLabel={showLabel} />;
    } else if (themeToggleType === 'switch') {
      return <SwitchThemeToggle showLabel={showLabel} />;
    } else if (themeToggleType === 'button') {
      return <ButtonThemeToggle showLabel={showLabel} />;
    } else if (themeToggleType === 'singleIcon') {
      return <SingleChangingIconThemeToggle />;
    } else if (themeToggleType === 'toggleGroup') {
      return <ToggleGroupThemeToggle />;
    } else if (themeToggleType === 'segmented') {
      return <SegmentedThemeToggle />;
    } else {
      // Default to compact
      return <CompactThemeToggle />;
    }
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Left side - Logo and Brand */}
        <div className="flex items-center gap-8">
          {showLogo && (
            <Logo 
              size={logoSize}
              showText={showBrandText}
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
          <div className="container mx-auto px-4 py-4 space-y-4">
            
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

export default ConfigurableNavbar;