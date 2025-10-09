import { CompactThemeToggle } from '@/components';
import { useAuth, useNavigate } from '@/contexts';
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

export interface StandardNavbarProps extends Omit<FlexibleNavbarProps, 'ThemeToggleComponent' | 'mobileWidthBehavior' | 'maxWidth' | 'onLoginClick' | 'onSignUpClick' | 'onLogoutClick'> {
    // Override these props with standard defaults
    showThemeToggle?: boolean;
    mobileWidthBehavior?: 'fixed' | 'responsive';
    maxWidth?: string;

    // Optional override handlers - if not provided, will use context-based defaults
    onLoginClick?: () => void;
    onSignUpClick?: () => void;
    onLogoutClick?: () => void;
}

/**
 * StandardNavbar - FlexibleNavbar with consistent configuration and integrated authentication
 * 
 * This component provides:
 * - Centralized NavbarThemeToggle integration
 * - Consistent responsive behavior (max-w-7xl)
 * - Standard configuration across all pages
 * - Built-in authentication handlers with context integration
 * - Optional override capability for custom auth behavior
 * 
 * Use this instead of FlexibleNavbar directly to ensure consistency
 */
export const StandardNavbar: React.FC<StandardNavbarProps> = ({
    showThemeToggle = true,
    mobileWidthBehavior = 'responsive',
    maxWidth = 'max-w-7xl',
    onLoginClick,
    onSignUpClick,
    onLogoutClick,
    ...props
}) => {
    const { logout } = useAuth();
    const { navigateToLogin, navigateToSignup } = useNavigate();

    // Default auth handlers using contexts
    const handleDefaultLogin = () => {
        navigateToLogin();
    };

    const handleDefaultSignup = () => {
        navigateToSignup();
    };

    const handleDefaultLogout = () => {
        logout();
    };

    return (
        <FlexibleNavbar
            {...props}
            brandText="BuildFlow"
            showThemeToggle={showThemeToggle}
            ThemeToggleComponent={showThemeToggle ? NavbarThemeToggle : undefined}
            mobileWidthBehavior={mobileWidthBehavior}
            maxWidth={maxWidth}
            onLoginClick={onLoginClick || handleDefaultLogin}
            onSignUpClick={onSignUpClick || handleDefaultSignup}
            onLogoutClick={onLogoutClick || handleDefaultLogout}
        />
    );
};

export default StandardNavbar;