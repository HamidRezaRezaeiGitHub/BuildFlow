import {
  AuthSection,
  Brands,
  Contact,
  Features,
  Footer,
  Hero
} from '@/components/home';
import HomeLayout from '@/components/home/HomeLayout';
import Navbar from '@/components/home/Navbar';
import React from 'react';

/**
 * Home page - public page accessible to all users
 * 
 * Note: NavigationProvider is now provided globally through AppProviders,
 * so we don't need to wrap it here anymore.
 */
export const Home: React.FC = () => {
  return (
    <HomeLayout>
      <Navbar />
      <Hero />
      <Features />
      <AuthSection />
      <Brands />
      <Contact />
      <Footer />
    </HomeLayout>
  );
};

export default Home;