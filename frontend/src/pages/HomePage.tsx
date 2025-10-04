import {
    AuthSection,
    Brands,
    Contact,
    Features,
    Footer,
    Hero
} from '@/components/home';
import { StandardNavbar } from '@/components/navbar';
import { useNavigate } from '@/contexts';
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
    const { navigateToSignup, navigateToLogin, scrollToSection } = useNavigate();

    return (
        <div className={cn("min-h-screen bg-background", className)}>
            {/* Main content area */}
            <main className="flex-1">
                <StandardNavbar
                    brandText="BuildFlow"
                    navItems={[
                        { label: 'Features', onClick: () => scrollToSection('features') },
                        { label: 'About', onClick: () => scrollToSection('brands') },
                        { label: 'Contact', onClick: () => scrollToSection('contact') }
                    ]}
                    showAuthButtons={true}
                    onLoginClick={() => navigateToLogin()}
                    onSignUpClick={() => navigateToSignup()}
                    loginButtonText="Sign In"
                    signUpButtonText="Get Started"
                    showThemeToggle={true}
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