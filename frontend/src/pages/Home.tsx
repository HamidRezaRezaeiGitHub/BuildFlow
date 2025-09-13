import React from 'react';
import HomeLayout from '@/components/layouts/HomeLayout';
import HomeNavbar from '@/components/HomeNavbar';

/**
 * Home page - public page accessible to all users
 */
export const Home: React.FC = () => {
  return (
    <HomeLayout>
      <HomeNavbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-6">
            Welcome to BuildFlow
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your comprehensive construction project management platform
          </p>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Manage projects, create estimates, and streamline your construction workflow.
            </p>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default Home;