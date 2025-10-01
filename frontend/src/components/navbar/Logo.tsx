import React from 'react';
// TODO: Replace with your project's utility function
// Example: import { cn } from '@/lib/utils';
import { cn } from '@/utils/utils';

export interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  brandText?: string;
  logoSvg?: React.ReactNode;
}

/**
 * Generic Logo component
 * Reusable logo that can be displayed with or without text, in different sizes
 * Supports custom brand text and SVG logo for maximum flexibility
 */
export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  showText = true,
  brandText = 'Brand',
  logoSvg
}) => {
  const sizeClasses = {
    sm: showText ? 'text-sm' : 'w-6 h-6',
    md: showText ? 'text-lg' : 'w-8 h-8', 
    lg: showText ? 'text-xl' : 'w-10 h-10'
  };

  // Default SVG logo (placeholder that can be replaced)
  const defaultLogoSvg = (
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
  );

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {logoSvg || defaultLogoSvg}
      {showText && (
        <span className={cn('font-bold text-primary', sizeClasses[size])}>
          {brandText}
        </span>
      )}
    </div>
  );
};

export default Logo;