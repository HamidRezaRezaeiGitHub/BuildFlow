import { CompactThemeToggle } from '@/components';
import React from 'react';
import { FlexibleNavbar, FlexibleNavbarProps } from './FlexibleNavbar';

/**
 * NavbarThemeToggle - Wrapper component for CompactThemeToggle to be compatible with FlexibleNavbar
 * This centralizes the theme toggle integration pattern used across pages
 */
const NavbarThemeToggle: React.FC<{ showLabel?: boolean }> = ({ showLabel }) => {
    return (
        <div className="flex items-center gap-2">
            <CompactThemeToggle />
            {showLabel && (
                <span className="text-sm font-medium text-muted-foreground">
                    Theme
                </span>
            )}
        </div>
    );
};

export interface StandardNavbarProps extends Omit<FlexibleNavbarProps, 'ThemeToggleComponent' | 'mobileWidthBehavior' | 'maxWidth'> {
    // Override these props with standard defaults
    showThemeToggle?: boolean;
    mobileWidthBehavior?: 'fixed' | 'responsive';
    maxWidth?: string;
}

/**
 * StandardNavbar - FlexibleNavbar with consistent configuration and integrated theme toggle
 * 
 * This component provides:
 * - Centralized NavbarThemeToggle integration
 * - Consistent responsive behavior (max-w-7xl)
 * - Standard configuration across all pages
 * 
 * Use this instead of FlexibleNavbar directly to ensure consistency
 */
export const StandardNavbar: React.FC<StandardNavbarProps> = ({
    showThemeToggle = true,
    mobileWidthBehavior = 'responsive',
    maxWidth = 'max-w-7xl',
    ...props
}) => {
    return (
        <FlexibleNavbar
            {...props}
            showThemeToggle={showThemeToggle}
            ThemeToggleComponent={showThemeToggle ? NavbarThemeToggle : undefined}
            mobileWidthBehavior={mobileWidthBehavior}
            maxWidth={maxWidth}
        />
    );
};

export default StandardNavbar;