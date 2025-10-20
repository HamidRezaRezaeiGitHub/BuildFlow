import { StandardBottomNavbar } from '@/components/navbar';
import { ProjectList } from '@/components/project';
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Dashboard page - protected page for authenticated users
 * Mobile-first design with bottom navigation
 */
export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Content container with bottom padding to avoid overlap with bottom nav */}
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

        {/* Projects Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-primary mb-6">
            Your Projects
          </h2>
          <ProjectList />
        </div>
      </div>

      {/* Bottom Navigation - Mobile-first design */}
      <StandardBottomNavbar />
    </div>
  );
};

export default DashboardPage;