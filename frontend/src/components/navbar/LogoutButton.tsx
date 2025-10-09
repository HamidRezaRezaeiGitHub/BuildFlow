import React from 'react';
// TODO: Replace with your project's UI components and utilities
// Example: import { Button } from '@/components/ui/button';
// Example: import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';

export interface LogoutButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  onClick?: () => void;
  children?: React.ReactNode;
}

/**
 * LogoutButton component
 * Configurable logout button for navbar use
 */
export const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  className = '',
  variant = 'ghost',
  size = 'default',
  onClick,
  children = 'Logout'
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={cn('font-medium', className)}
    >
      {children}
    </Button>
  );
};

export default LogoutButton;