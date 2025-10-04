import { FlexibleNavbar, adaptUserForNavbar } from '@/components/navbar';
import { CompactThemeToggle } from '@/components/theme';
import { useNavigate } from '@/contexts';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/utils';
import React from 'react';
import { UsersTable } from '../components/admin';

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

/**
 * AdminPage - Admin panel for managing users and system settings
 * This page is accessible only to users with admin privileges.
 * Contains administrative tools and user management functionality.
 */
const AdminPage: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const navigation = useNavigate();

    // Convert BuildFlow user to NavbarUser format
    const navbarUser = user ? adaptUserForNavbar(user) : null;

    return (
        <div className={cn("min-h-screen bg-background")}>
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
                <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        Admin Panel
                    </h1>

                    <div className="space-y-6">
                        {/* User Management Section */}
                        <div className="bg-white shadow-sm rounded-lg p-6">
                            <UsersTable />
                        </div>

                        <div className="bg-white shadow-sm rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                System Overview
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Monitor system status and performance metrics.
                            </p>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-yellow-800 text-sm">
                                    ⚠️ System monitoring components will be implemented here.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white shadow-sm rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Security Settings
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Configure security policies and access controls.
                            </p>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-green-800 text-sm">
                                    🔒 Security management components will be implemented here.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPage;