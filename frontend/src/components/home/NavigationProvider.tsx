import React, { createContext, useCallback, useContext } from 'react';

interface NavigationContextType {
    scrollToSection: (sectionId: string, tabId?: string) => void;
    navigateToAuth: (tab: 'signup' | 'login') => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
    children: React.ReactNode;
}

/**
 * Navigation Provider - Handles smooth scrolling and section navigation
 * 
 * Provides utilities for:
 * - Smooth scrolling to page sections
 * - Tab switching in Auth component
 * - URL hash handling
 */
export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
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
                // Small delay to ensure the element is in view first
                setTimeout(() => {
                    const tabTrigger = document.querySelector(`[data-tab="${tabId}"]`) as HTMLButtonElement;
                    if (tabTrigger) {
                        tabTrigger.click();
                    }
                }, 300);
            }
        }
    }, []);

    const navigateToAuth = useCallback((tab: 'signup' | 'login') => {
        scrollToSection('auth', tab);
    }, [scrollToSection]);

    const value = {
        scrollToSection,
        navigateToAuth
    };

    return (
        <NavigationContext.Provider value={value}>
            {children}
        </NavigationContext.Provider>
    );
};

/**
 * Custom hook to use navigation functionality
 */
export const useNavigation = (): NavigationContextType => {
    const context = useContext(NavigationContext);
    if (context === undefined) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
};

export default NavigationProvider;