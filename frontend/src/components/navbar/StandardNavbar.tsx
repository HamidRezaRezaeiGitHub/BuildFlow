import { CompactThemeToggle } from '@/components';
import { useAuth, useNavigate } from '@/contexts';
import React, { useMemo } from 'react';
import { FlexibleNavbar, FlexibleNavbarProps, NavItem } from './FlexibleNavbar';

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

export interface StandardNavbarProps extends Omit<FlexibleNavbarProps, 'ThemeToggleComponent' | 'mobileWidthBehavior' | 'maxWidth' | 'onLoginClick' | 'onSignUpClick' | 'onLogoutClick' | 'navItems'> {
    // Override these props with standard defaults
    showThemeToggle?: boolean;
    mobileWidthBehavior?: 'fixed' | 'responsive';
    maxWidth?: string;

    // Navigation items configuration
    navItems?: NavItem[]; // Complete override of nav items
    additionalNavItems?: NavItem[]; // Additional items to append to standard items
    includeStandardItems?: boolean; // Whether to include standard items (default: true)

    // Optional override handlers - if not provided, will use context-based defaults
    onLoginClick?: () => void;
    onSignUpClick?: () => void;
    onLogoutClick?: () => void;
}

/**
 * Generate standard navigation items based on user authentication and role
 */
const createStandardNavItems = (
    isAuthenticated: boolean,
    role: string | null,
    navigation: {
        navigateToHome: () => void;
        navigateToDashboard: () => void;
        navigateToAdmin: () => void;
    }
): NavItem[] => {
    const items = [{ label: 'Home', onClick: navigation.navigateToHome }];

    // Add authenticated user items
    if (isAuthenticated) {
        items.push(
            { label: 'Dashboard', onClick: navigation.navigateToDashboard }
        );
    }

    // Add admin-specific items
    if (isAuthenticated && role && role.toLowerCase() === 'admin') {
        items.push({ label: 'Admin Panel', onClick: navigation.navigateToAdmin });
    }

    return items;
};

/**
 * StandardNavbar - FlexibleNavbar with consistent configuration and integrated authentication
 * 
 * This component provides:
 * - Centralized NavbarThemeToggle integration
 * - Consistent responsive behavior (max-w-7xl)
 * - Standard configuration across all pages
 * - Built-in authentication handlers with context integration
 * - Standard navigation items with override capability
 * - Additional nav items support
 * 
 * Navigation Item Configuration:
 * - If `navItems` is provided, it completely overrides standard items
 * - If `additionalNavItems` is provided, they are appended to standard items
 * - Set `includeStandardItems={false}` to disable standard items when using additionalNavItems
 * 
 * Use this instead of FlexibleNavbar directly to ensure consistency
 */
export const StandardNavbar: React.FC<StandardNavbarProps> = ({
    showThemeToggle = true,
    mobileWidthBehavior = 'responsive',
    maxWidth = 'max-w-7xl',
    navItems,
    additionalNavItems = [],
    includeStandardItems = true,
    onLoginClick,
    onSignUpClick,
    onLogoutClick,
    ...props
}) => {
    const { logout, isAuthenticated, role } = useAuth();
    const {
        navigateToLogin,
        navigateToSignup,
        navigateToHome,
        navigateToDashboard,
        navigateToAdmin
    } = useNavigate();

    // Create standard navigation items
    const standardNavItems = useMemo(() => {
        if (!includeStandardItems) return [];

        return createStandardNavItems(isAuthenticated, role, {
            navigateToHome,
            navigateToDashboard,
            navigateToAdmin
        });
    }, [isAuthenticated, role, includeStandardItems, navigateToHome, navigateToDashboard, navigateToAdmin]);

    // Determine final nav items
    const finalNavItems = useMemo(() => {
        if (navItems) {
            // Complete override - use provided navItems only
            return navItems;
        }

        // Combine standard items with additional items
        return [...standardNavItems, ...additionalNavItems];
    }, [navItems, standardNavItems, additionalNavItems]);

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
            navItems={finalNavItems}
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