import React from 'react';
import { Avatar as UIAvatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/utils/utils';
import { User } from '@/services/dtos';

export interface AvatarProps {
  className?: string;
  user: User | null;
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

  const getInitials = (user: User | null): string => {
    if (!user?.contactDto) return 'U';
    const firstName = user.contactDto.firstName || '';
    const lastName = user.contactDto.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };

  const getAvatarImage = (_user: User | null): string | undefined => {
    // For now, return undefined as we don't have avatar URLs
    // This could be extended to support profile images in the future
    return undefined;
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
        alt={user?.contactDto ? `${user.contactDto.firstName} ${user.contactDto.lastName}` : 'User'} 
      />
      <AvatarFallback className="bg-primary text-primary-foreground font-medium">
        {getInitials(user)}
      </AvatarFallback>
    </UIAvatar>
  );
};

export default Avatar;