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

// Main configurable navbar component
export { ConfigurableNavbar } from './ConfigurableNavbar';
export type { ConfigurableNavbarProps, NavItem } from './ConfigurableNavbar';

// Default export for convenience
export { default as Navbar } from './ConfigurableNavbar';