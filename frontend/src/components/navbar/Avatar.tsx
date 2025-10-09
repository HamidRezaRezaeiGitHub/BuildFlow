import React, { useState, useRef, useEffect } from 'react';
// TODO: Replace with your project's UI components and utilities  
// Example: import { Avatar as UIAvatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// Example: import { cn } from '@/lib/utils';
import { Avatar as UIAvatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/utils/utils';
import { LogoutButton } from './LogoutButton';
import { NavbarUser } from './types';

export interface AvatarProps {
  className?: string;
  user: NavbarUser | null;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  
  // Dropdown menu props
  showDropdown?: boolean;
  onLogoutClick?: () => void;
  logoutButtonText?: string;
  
  // Avatar dropdown state callbacks
  onAvatarOpen?: () => void;
  onAvatarClose?: () => void;
}

/**
 * Avatar component for navbar
 * Displays user avatar with fallback to initials and optional dropdown menu
 */
export const Avatar: React.FC<AvatarProps> = ({ 
  className = '',
  user,
  size = 'md',
  onClick,
  showDropdown = false,
  onLogoutClick,
  logoutButtonText = 'Logout',
  onAvatarOpen,
  onAvatarClose
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const getFullName = (user: NavbarUser | null): string => {
    if (!user) return 'User';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'User';
  };

  const handleAvatarClick = () => {
    if (showDropdown) {
      if (isDropdownOpen) {
        // Closing dropdown
        setIsDropdownOpen(false);
        if (onAvatarClose) {
          onAvatarClose();
        }
      } else {
        // Opening dropdown
        setIsDropdownOpen(true);
        if (onAvatarOpen) {
          onAvatarOpen();
        }
      }
    } else if (onClick) {
      onClick();
    }
  };

  const handleLogout = () => {
    if (onLogoutClick) {
      onLogoutClick();
    }
    setIsDropdownOpen(false);
    if (onAvatarClose) {
      onAvatarClose();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        if (onAvatarClose) {
          onAvatarClose();
        }
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <UIAvatar 
        className={cn(
          sizeClasses[size], 
          (onClick || showDropdown) && 'cursor-pointer hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all',
          className
        )}
        onClick={handleAvatarClick}
      >
        <AvatarImage 
          src={getAvatarImage(user)} 
          alt={getFullName(user)} 
        />
        <AvatarFallback className="bg-primary text-primary-foreground font-medium">
          {getInitials(user)}
        </AvatarFallback>
      </UIAvatar>

      {/* Dropdown Menu */}
      {showDropdown && isDropdownOpen && user && (
        <div className="absolute right-0 mt-2 w-64 bg-background/95 backdrop-blur border border-border/40 rounded-md shadow-lg z-50">
          <div className="p-4 space-y-3">
            {/* User Info Section */}
            <div className="flex items-center gap-3">
              <UIAvatar className="h-12 w-12">
                <AvatarImage src={getAvatarImage(user)} alt={getFullName(user)} />
                <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                  {getInitials(user)}
                </AvatarFallback>
              </UIAvatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {getFullName(user)}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email || 'No email'}
                </p>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-border/20"></div>

            {/* Logout Button */}
            <div className="pt-1">
              <LogoutButton
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              >
                {logoutButtonText}
              </LogoutButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Avatar;