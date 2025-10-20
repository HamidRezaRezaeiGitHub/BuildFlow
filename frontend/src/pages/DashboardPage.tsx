import { StandardBottomNavbar } from '@/components/navbar';
import { ProjectList } from '@/components/project';
import { DashboardLayout, DashboardSection } from '@/components/dashboard';
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
        {/* Projects Section */}
        <DashboardSection
          title="Your Projects"
          description="View and manage all your construction projects"
        >
          <ProjectList />
        </DashboardSection>
      </DashboardLayout>

      {/* Bottom Navigation - Mobile-first design */}
      <StandardBottomNavbar />
    </>
  );
};

export default DashboardPage;