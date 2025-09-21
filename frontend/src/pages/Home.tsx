import { Auth } from '@/components/auth';
import {
  Brands,
  Contact,
  Features,
  Footer,
  Hero,
  NavigationProvider
} from '@/components/home';
import HomeLayout from '@/components/home/HomeLayout';
import Navbar from '@/components/home/Navbar';
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