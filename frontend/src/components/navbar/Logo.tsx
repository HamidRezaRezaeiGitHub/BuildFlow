import React from 'react';
import { cn } from '@/utils/utils';

export interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

/**
 * BuildFlow Logo component
 * Reusable logo that can be displayed with or without text, in different sizes
 */
export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  showText = true 
}) => {
  const sizeClasses = {
    sm: showText ? 'text-sm' : 'w-6 h-6',
    md: showText ? 'text-lg' : 'w-8 h-8', 
    lg: showText ? 'text-xl' : 'w-10 h-10'
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg
        width='1em'
        height='1em'
        viewBox='0 0 324 323'
        fill='currentColor'
        xmlns='http://www.w3.org/2000/svg'
        className={cn('text-primary', sizeClasses[size])}
      >
        <rect
          x='88.1023'
          y='144.792'
          width='151.802'
          height='36.5788'
          rx='18.2894'
          transform='rotate(-38.5799 88.1023 144.792)'
          fill='currentColor'
        />
        <rect
          x='85.3459'
          y='244.537'
          width='151.802'
          height='36.5788'
          rx='18.2894'
          transform='rotate(-38.5799 85.3459 244.537)'
          fill='currentColor'
        />
      </svg>
      {showText && (
        <span className={cn('font-bold text-primary', sizeClasses[size])}>
          BuildFlow
        </span>
      )}
    </div>
  );
};

export default Logo;