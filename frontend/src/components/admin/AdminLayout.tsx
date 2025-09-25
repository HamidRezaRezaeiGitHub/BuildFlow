import React from 'react';
import { cn } from '@/utils/utils';
import { ConfigurableNavbar } from '@/components/navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from '@/contexts';

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

    return (
        <div className={cn("min-h-screen bg-background", className)}>
            <ConfigurableNavbar 
                isAuthenticated={isAuthenticated}
                user={user}
                navItems={[
                    { label: 'Dashboard', onClick: () => navigation.navigateToDashboard() },
                    { label: 'Admin Panel', onClick: () => console.log('Current page') },
                    { label: 'Home', onClick: () => navigation.navigateToHome() }
                ]}
                themeToggleType="compact"
                onAvatarClick={() => console.log('Show user menu')}
                onLoginClick={() => navigation.navigateToHome()}
                onSignUpClick={() => navigation.navigateToHome()}
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