/**
 * External dependencies configuration for navbar package
 * 
 * This file allows consuming projects to configure their own UI components
 * and utilities instead of being locked into specific implementations.
 * 
 * When using this package:
 * 1. Install your preferred UI library (shadcn/ui, radix-ui, etc.)
 * 2. Configure these interfaces to match your project's exports
 */

import { ComponentType, ReactNode } from 'react';

// UI Component interfaces - adapt these to your UI library
export interface ButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
  'aria-label'?: string;
}

export interface AvatarProps {
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
}

export interface AvatarImageProps {
  src?: string;
  alt?: string;
}

export interface AvatarFallbackProps {
  className?: string;
  children?: ReactNode;
}

// Component types - replace with your actual components
export type ButtonComponent = ComponentType<ButtonProps>;
export type AvatarComponent = ComponentType<AvatarProps>;
export type AvatarImageComponent = ComponentType<AvatarImageProps>;
export type AvatarFallbackComponent = ComponentType<AvatarFallbackProps>;

// Utility function interface
export interface UtilsConfig {
  cn: (...classes: (string | undefined | null | boolean)[]) => string;
}

// Icon components - replace with your preferred icon library
export interface IconProps {
  className?: string;
}

export type MenuIconComponent = ComponentType<IconProps>;
export type XIconComponent = ComponentType<IconProps>;

// Configuration object that consuming projects should provide
export interface NavbarDependencies {
  // UI Components
  Button: ButtonComponent;
  Avatar: AvatarComponent;
  AvatarImage: AvatarImageComponent;
  AvatarFallback: AvatarFallbackComponent;
  
  // Utils
  cn: UtilsConfig['cn'];
  
  // Icons
  MenuIcon: MenuIconComponent;
  XIcon: XIconComponent;
}

/**
 * Example usage in consuming project:
 * 
 * // Create your dependencies file
 * import { Button } from '@/components/ui/button';
 * import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
 * import { cn } from '@/lib/utils';
 * import { Menu, X } from 'lucide-react';
 * 
 * export const navbarDependencies: NavbarDependencies = {
 *   Button,
 *   Avatar,
 *   AvatarImage,
 *   AvatarFallback,
 *   cn,
 *   MenuIcon: Menu,
 *   XIcon: X,
 * };
 * 
 * // Then pass to navbar components
 * <FlexibleNavbar dependencies={navbarDependencies} ... />
 */