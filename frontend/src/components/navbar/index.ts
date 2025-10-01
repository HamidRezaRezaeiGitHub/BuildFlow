// Small navbar components
export { Logo } from './Logo';
export { LoginButton } from './LoginButton';
export { SignUpButton } from './SignUpButton';
export { Avatar } from './Avatar';

// Component prop types
export type { LogoProps } from './Logo';
export type { LoginButtonProps } from './LoginButton';
export type { SignUpButtonProps } from './SignUpButton';
export type { AvatarProps } from './Avatar';

// Generic types for cross-project compatibility
export type { NavbarUser, GenericUser, GenericContact } from './types';
export { adaptUserForNavbar } from './types';

// Dependency interfaces for external libraries
export type { NavbarDependencies } from './dependencies';

// Main flexible navbar component
export { FlexibleNavbar } from './FlexibleNavbar';
export type { FlexibleNavbarProps, NavItem, ThemeToggleComponent } from './FlexibleNavbar';

// Default export for convenience
export { default as Navbar } from './FlexibleNavbar';

// Legacy export for backwards compatibility (deprecated)
export { FlexibleNavbar as ConfigurableNavbar } from './FlexibleNavbar';
export type { FlexibleNavbarProps as ConfigurableNavbarProps } from './FlexibleNavbar';