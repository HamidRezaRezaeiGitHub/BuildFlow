import React, { createContext, useCallback, useContext, ReactNode } from 'react';
import { useNavigate as useReactRouterNavigate } from 'react-router-dom';

export interface NavigationContextType {
    // React Router navigation
    navigate: (to: string, options?: { replace?: boolean; state?: any }) => void;
    goBack: () => void;
    goForward: () => void;
    
    // Section navigation (for home page)
    scrollToSection: (sectionId: string, tabId?: string) => void;
    navigateToAuth: (tab: 'signup' | 'login') => void;
    navigateToSignup: () => void;
    navigateToLogin: () => void;
    
    // Common page navigation helpers
    navigateToHome: () => void;
    navigateToDashboard: () => void;
    navigateToAdmin: () => void;
    
    // External navigation
    openExternalLink: (url: string, newTab?: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
    children: ReactNode;
}

/**
 * NavigationProvider component that manages application navigation state.
 * 
 * Provides utilities for:
 * - React Router navigation (programmatic routing)
 * - Smooth scrolling to page sections (home page)
 * - Tab switching in Auth component
 * - URL hash handling
 * - External link handling
 * - Common page navigation helpers
 * 
 * This follows the same pattern as ThemeProvider for consistency.
 */
export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
    const reactRouterNavigate = useReactRouterNavigate();

    // React Router navigation
    const navigate = useCallback((to: string, options?: { replace?: boolean; state?: any }) => {
        reactRouterNavigate(to, options);
    }, [reactRouterNavigate]);

    const goBack = useCallback(() => {
        window.history.back();
    }, []);

    const goForward = useCallback(() => {
        window.history.forward();
    }, []);

    // Section navigation (for home page)
    const scrollToSection = useCallback((sectionId: string, tabId?: string) => {
        const element = document.getElementById(sectionId);

        if (element) {
            // Smooth scroll to the section
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });

            // Update URL hash
            window.history.pushState(null, '', `#${sectionId}`);

            // If it's the auth section and we need to switch tabs
            if (sectionId === 'auth' && tabId) {
                // Dispatch custom event for tab navigation
                setTimeout(() => {
                    const event = new CustomEvent('navigate-to-tab', {
                        detail: { tab: tabId }
                    });
                    window.dispatchEvent(event);
                }, 100); // Shorter delay since we're using events
            }
        } else {
            console.warn(`Element with ID "${sectionId}" not found`);
        }
    }, []);

    const navigateToAuth = useCallback((tab: 'signup' | 'login') => {
        scrollToSection('auth', tab);
    }, [scrollToSection]);

    const navigateToSignup = useCallback(() => {
        scrollToSection('auth', 'signup');
    }, [scrollToSection]);

    const navigateToLogin = useCallback(() => {
        scrollToSection('auth', 'login');
    }, [scrollToSection]);

    // Common page navigation helpers
    const navigateToHome = useCallback(() => {
        navigate('/');
    }, [navigate]);

    const navigateToDashboard = useCallback(() => {
        navigate('/dashboard');
    }, [navigate]);

    const navigateToAdmin = useCallback(() => {
        navigate('/admin');
    }, [navigate]);

    // External navigation
    const openExternalLink = useCallback((url: string, newTab: boolean = true) => {
        if (newTab) {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            window.location.href = url;
        }
    }, []);

    const value: NavigationContextType = {
        navigate,
        goBack,
        goForward,
        scrollToSection,
        navigateToAuth,
        navigateToSignup,
        navigateToLogin,
        navigateToHome,
        navigateToDashboard,
        navigateToAdmin,
        openExternalLink,
    };

    return (
        <NavigationContext.Provider value={value}>
            {children}
        </NavigationContext.Provider>
    );
};

/**
 * Hook to use navigation context
 * @returns NavigationContextType object with navigation methods
 * @throws Error if used outside of NavigationProvider
 */
export const useNavigate = (): NavigationContextType => {
    const context = useContext(NavigationContext);
    if (context === undefined) {
        throw new Error('useNavigate must be used within a NavigationProvider');
    }
    return context;
};

export default NavigationProvider;