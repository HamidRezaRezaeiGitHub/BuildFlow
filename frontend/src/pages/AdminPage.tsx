import { StandardNavbar } from '@/components/navbar';
import { useNavigate } from '@/contexts';
import { cn } from '@/utils/utils';
import React from 'react';
import { UsersTable } from '../components/admin';

/**
 * PageHeader - Admin page header component
 */
const PageHeader: React.FC = () => (
    <h1 className="text-3xl font-bold text-primary mb-6">
        Admin Panel
    </h1>
);

/**
 * UserManagementSection - Wrapper for the UsersTable component
 */
const UserManagementSection: React.FC = () => (
    <div className="bg-card border border-border rounded-lg p-6">
        <UsersTable />
    </div>
);

/**
 * SystemOverviewSection - System monitoring placeholder section
 */
const SystemOverviewSection: React.FC = () => (
    <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">
            System Overview
        </h2>
        <p className="text-muted-foreground mb-4">
            Monitor system status and performance metrics.
        </p>
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <p className="text-warning-foreground text-sm">
                ⚠️ System monitoring components will be implemented here.
            </p>
        </div>
    </div>
);

/**
 * SecuritySettingsSection - Security configuration placeholder section
 */
const SecuritySettingsSection: React.FC = () => (
    <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">
            Security Settings
        </h2>
        <p className="text-muted-foreground mb-4">
            Configure security policies and access controls.
        </p>
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <p className="text-success-foreground text-sm">
                🔒 Security management components will be implemented here.
            </p>
        </div>
    </div>
);

/**
 * AdminPage - Admin panel for managing users and system settings
 * This page is accessible only to users with admin privileges.
 * Contains administrative tools and user management functionality.
 */
const AdminPage: React.FC = () => {
    const navigation = useNavigate();

    return (
        <div className={cn("min-h-screen bg-background")}>
            <StandardNavbar
                navItems={[
                    { label: 'Dashboard', onClick: () => navigation.navigateToDashboard() },
                    { label: 'Home', onClick: () => navigation.navigateToHome() }
                ]}
            />

            {/* Main content area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="p-6">
                    <PageHeader />

                    <div className="space-y-6">
                        <UserManagementSection />
                        <SystemOverviewSection />
                        <SecuritySettingsSection />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPage;