import React from 'react';
// TODO: Replace with your project's UI components and utilities  
// Example: import { Avatar as UIAvatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// Example: import { cn } from '@/lib/utils';
import { Avatar as UIAvatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/utils/utils';
import { NavbarUser } from './types';

export interface AvatarProps {
  className?: string;
  user: NavbarUser | null;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

/**
 * Avatar component for navbar
 * Displays user avatar with fallback to initials
 */
export const Avatar: React.FC<AvatarProps> = ({ 
  className = '',
  user,
  size = 'md',
  onClick
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10', 
    lg: 'h-12 w-12'
  };

  const getInitials = (user: NavbarUser | null): string => {
    if (!user) return 'U';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };

  const getAvatarImage = (user: NavbarUser | null): string | undefined => {
    return user?.avatarUrl;
  };

  return (
    <UIAvatar 
      className={cn(
        sizeClasses[size], 
        onClick && 'cursor-pointer hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all',
        className
      )}
      onClick={onClick}
    >
      <AvatarImage 
        src={getAvatarImage(user)} 
        alt={user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User' : 'User'} 
      />
      <AvatarFallback className="bg-primary text-primary-foreground font-medium">
        {getInitials(user)}
      </AvatarFallback>
    </UIAvatar>
  );
};

export default Avatar;