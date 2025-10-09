import {
    AuthSection,
    Brands,
    Contact,
    Features,
    Footer,
    Hero
} from '@/components/home';
import { StandardNavbar } from '@/components/navbar';
import { useAuth, useNavigate } from '@/contexts';
import { cn } from '@/utils/utils';
import React from 'react';

interface HomePageProps {
    className?: string;
}

/**
 * HomePage - Public home page accessible to all users
 * 
 * This page serves as the main landing page for unauthenticated users and provides:
 * - Full-height responsive container
 * - Clean, minimal structure for landing/marketing content
 * - Navigation, hero, features, auth section, brands, contact, and footer
 * 
 * Note: NavigationProvider is now provided globally through AppProviders,
 * so we don't need to wrap it here anymore.
 */
export const HomePage: React.FC<HomePageProps> = ({ className }) => {
    const { isAuthenticated } = useAuth();
    const { navigateToLogin, navigateToDashboard, navigateToHome, scrollToSection } = useNavigate();

    // Dashboard navigation handler - conditional based on authentication
    const handleDashboardClick = () => {
        if (isAuthenticated) {
            navigateToDashboard();
        } else {
            navigateToLogin();
        }
    };

    return (
        <div className={cn("min-h-screen bg-background", className)}>
            {/* Main content area */}
            <main className="flex-1">
                <StandardNavbar
                    onLogoClick={navigateToHome}
                    navItems={[
                        { label: 'Features', onClick: () => scrollToSection('features') },
                        { label: 'About', onClick: () => scrollToSection('brands') },
                        { label: 'Contact', onClick: () => scrollToSection('contact') },
                        { label: 'Dashboard', onClick: handleDashboardClick }
                    ]}
                    loginButtonText="Sign In"
                    signUpButtonText="Get Started"
                />
                <Hero />
                <Features />
                <AuthSection />
                <Brands />
                <Contact />
                <Footer />
            </main>
        </div>
    );
};

export default HomePage;