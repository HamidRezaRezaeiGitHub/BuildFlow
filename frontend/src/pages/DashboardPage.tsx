import { StandardNavbar } from '@/components/navbar';
import { useNavigate } from '@/contexts';
import React, { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Dashboard page - protected page for authenticated users
 */
export const DashboardPage: React.FC = () => {
  const { user, role, isAuthenticated } = useAuth();
  const navigation = useNavigate();

  const showAdminItems = useMemo(() => {
    return isAuthenticated && role && role.toLowerCase() === 'admin';
  }, [isAuthenticated, role]);

  const navItems = useMemo(() => {
    const items = [
      { label: 'Home', onClick: () => navigation.navigateToHome() }
    ];
    if (showAdminItems) {
      items.push({ label: 'Admin Panel', onClick: () => navigation.navigateToAdmin() });
    }
    return items;
  }, [navigation, showAdminItems]);

  return (
    <div className="min-h-screen bg-background">
      <StandardNavbar
        navItems={navItems}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4">
            Dashboard
          </h1>
          {user && (
            <p className="text-muted-foreground">
              Welcome back, {user.username}!
            </p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-card rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-primary mb-2">
              Projects
            </h3>
            <p className="text-muted-foreground">
              Manage your construction projects
            </p>
          </div>

          <div className="p-6 bg-card rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-primary mb-2">
              Estimates
            </h3>
            <p className="text-muted-foreground">
              Create and manage project estimates
            </p>
          </div>

          <div className="p-6 bg-card rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-primary mb-2">
              Reports
            </h3>
            <p className="text-muted-foreground">
              View project insights and analytics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;