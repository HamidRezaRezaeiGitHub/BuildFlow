// Small navbar components
export { Avatar } from './Avatar';
export { LoginButton } from './LoginButton';
export { Logo } from './Logo';
export { LogoutButton } from './LogoutButton';
export { SignUpButton } from './SignUpButton';

// Component prop types
export type { AvatarProps } from './Avatar';
export type { LoginButtonProps } from './LoginButton';
export type { LogoProps } from './Logo';
export type { LogoutButtonProps } from './LogoutButton';
export type { SignUpButtonProps } from './SignUpButton';

// Generic types for cross-project compatibility
export { adaptUserForNavbar } from './types';
export type { GenericContact, GenericUser, NavbarUser } from './types';

// Dependency interfaces for external libraries
export type { NavbarDependencies } from './dependencies';

// Main flexible navbar component
export { FlexibleNavbar } from './FlexibleNavbar';
export type { FlexibleNavbarProps, NavItem, ThemeToggleComponent } from './FlexibleNavbar';

// Flexible bottom navbar component
export { FlexibleBottomNavbar } from './FlexibleBottomNavbar';
export type { 
  FlexibleBottomNavbarProps, 
  BottomNavItem, 
  FloatingActionButton
} from './FlexibleBottomNavbar';

// Standard navbar with consistent configuration
export { StandardNavbar, StandardBottomNavbar } from './StandardNavbar';
export type { StandardNavbarProps, StandardBottomNavbarProps } from './StandardNavbar';

// Default export for convenience
export { default as Navbar } from './FlexibleNavbar';

// Legacy export for backwards compatibility (deprecated)
export { FlexibleNavbar as ConfigurableNavbar } from './FlexibleNavbar';
export type { FlexibleNavbarProps as ConfigurableNavbarProps } from './FlexibleNavbar';
