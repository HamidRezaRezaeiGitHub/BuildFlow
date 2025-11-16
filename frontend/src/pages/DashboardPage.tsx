import { StandardBottomNavbar } from '@/components/navbar';
import { ProjectsSection } from '@/components/project';
import { DashboardLayout } from '@/components/dashboard';
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Dashboard page - protected page for authenticated users
 * Mobile-first design with bottom navigation and responsive layout
 */
export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
      <DashboardLayout
        title="Dashboard"
        subtitle={
          user && (
            <p className="text-muted-foreground">
              Welcome back, {user.username}!
            </p>
          )
        }
        variant="single"
      >
        {/* Projects Section - now uses auth-aware container component */}
        <ProjectsSection
          title="Projects"
          description="View and manage all your construction projects"
        />
      </DashboardLayout>

      {/* Bottom Navigation - Mobile-first design */}
      <StandardBottomNavbar />
    </>
  );
};

export default DashboardPage;