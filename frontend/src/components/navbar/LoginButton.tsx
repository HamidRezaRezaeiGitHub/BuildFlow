import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';

export interface LoginButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  onClick?: () => void;
  children?: React.ReactNode;
}

/**
 * LoginButton component
 * Configurable login button for navbar use
 */
export const LoginButton: React.FC<LoginButtonProps> = ({ 
  className = '',
  variant = 'ghost',
  size = 'default',
  onClick,
  children = 'Login'
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

export default LoginButton;