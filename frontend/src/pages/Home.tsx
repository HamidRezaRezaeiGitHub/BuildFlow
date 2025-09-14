import {
  Auth,
  Brands,
  Contact,
  Features,
  Footer,
  Hero,
  NavigationProvider
} from '@/components/home';
import Navbar from '@/components/home/Navbar';
import HomeLayout from '@/components/layouts/HomeLayout';
import React from 'react';

/**
 * Home page - public page accessible to all users
 */
export const Home: React.FC = () => {
  return (
    <HomeLayout>
      <NavigationProvider>
        <Navbar />
        <Hero />
        <Features />
        <Auth />
        <Brands />
        <Contact />
        <Footer />
      </NavigationProvider>
    </HomeLayout>
  );
};

export default Home;