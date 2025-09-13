import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import React, { useState } from 'react';

interface HomeNavbarProps {
    className?: string;
    onSignInClick?: () => void;
    onGetStartedClick?: () => void;
}

// Simple BuildFlow logo component
const BuildFlowLogo = (props: React.SVGAttributes<SVGElement>) => {
    return (
        <svg
            width='1em'
            height='1em'
            viewBox='0 0 324 323'
            fill='currentColor'
            xmlns='http://www.w3.org/2000/svg'
            {...props}
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
};

/**
 * HomeNavbar - Navigation component for public/unauthenticated users
 * 
 * This navbar is specifically designed for the home page and provides:
 * - Clean, minimal navigation for unauthenticated users
 * - Responsive design with mobile hamburger menu
 * - Sign In and Get Started call-to-action buttons
 * - BuildFlow branding and logo
 */
const HomeNavbar: React.FC<HomeNavbarProps> = ({
    className,
    onSignInClick,
    onGetStartedClick
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSignIn = () => {
        if (onSignInClick) {
            onSignInClick();
        } else {
            // Default behavior - redirect to login
            window.location.href = '/login';
        }
    };

    const handleGetStarted = () => {
        if (onGetStartedClick) {
            onGetStartedClick();
        } else {
            // Default behavior - redirect to registration
            window.location.href = '/register';
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Navigation links for public pages
    const navigationLinks = [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'About', href: '#about' },
        { label: 'Contact', href: '#contact' },
    ];

    return (
        <header className={cn(
            "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
            className
        )}>
            <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 lg:px-8">

                {/* Logo and Brand */}
                <div className="flex items-center space-x-3">
                    <div className="text-3xl text-primary">
                        <BuildFlowLogo />
                    </div>
                    <span className="text-xl font-bold text-foreground">BuildFlow</span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navigationLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* Desktop Action Buttons */}
                <div className="hidden md:flex items-center space-x-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-sm font-medium"
                        onClick={handleSignIn}
                    >
                        Sign In
                    </Button>
                    <Button
                        size="sm"
                        className="text-sm font-medium px-4 h-9"
                        onClick={handleGetStarted}
                    >
                        Get Started
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </Button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
                    <div className="px-4 py-4 space-y-4">
                        {/* Mobile Navigation Links */}
                        <nav className="space-y-3">
                            {navigationLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>

                        {/* Mobile Action Buttons */}
                        <div className="flex flex-col space-y-3 pt-4 border-t border-border/20">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start text-sm font-medium"
                                onClick={() => {
                                    handleSignIn();
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                Sign In
                            </Button>
                            <Button
                                size="sm"
                                className="justify-start text-sm font-medium"
                                onClick={() => {
                                    handleGetStarted();
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                Get Started
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default HomeNavbar;