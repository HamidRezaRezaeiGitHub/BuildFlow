import React from 'react';
import { cn } from '@/utils/utils';
import { FlexibleNavbar, adaptUserForNavbar } from '@/components/navbar';
import { CompactThemeToggle } from '@/components/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from '@/contexts';

// Wrapper component to make CompactThemeToggle compatible with FlexibleNavbar
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

interface AdminLayoutProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * AdminLayout - Layout component specifically for admin pages
 * 
 * This layout provides:
 * - Admin-specific styling and structure
 * - Clean, professional layout for administrative interfaces
 * - Full-height container with admin navigation context
 * - Consistent styling for all admin pages
 */
const AdminLayout: React.FC<AdminLayoutProps> = ({ children, className }) => {
    const { user, isAuthenticated } = useAuth();
    const navigation = useNavigate();

    // Convert BuildFlow user to NavbarUser format
    const navbarUser = user ? adaptUserForNavbar(user) : null;

    return (
        <div className={cn("min-h-screen bg-background", className)}>
            <FlexibleNavbar 
                isAuthenticated={isAuthenticated}
                user={navbarUser}
                brandText="BuildFlow Admin"
                navItems={[
                    { label: 'Dashboard', onClick: () => navigation.navigateToDashboard() },
                    { label: 'Admin Panel', onClick: () => console.log('Current page') },
                    { label: 'Home', onClick: () => navigation.navigateToHome() }
                ]}
                ThemeToggleComponent={NavbarThemeToggle}
                onAvatarClick={() => console.log('Show user menu')}
                onLoginClick={() => navigation.navigateToHome()}
                onSignUpClick={() => navigation.navigateToHome()}
                mobileWidthBehavior="responsive"
            />

            {/* Main content area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>

            {/* Admin Footer */}
            <footer className="bg-card border-t border-border mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>BuildFlow Admin Panel</span>
                        <span>Restricted Access - Admin Only</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AdminLayout;