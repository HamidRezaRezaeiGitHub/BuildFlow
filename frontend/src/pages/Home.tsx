import {
  AuthSection,
  Brands,
  Contact,
  Features,
  Footer,
  Hero
} from '@/components/home';
import HomeLayout from '@/components/home/HomeLayout';
import { FlexibleNavbar } from '@/components/navbar';
import { useNavigate } from '@/contexts';
import React from 'react';

/**
 * Home page - public page accessible to all users
 * 
 * Note: NavigationProvider is now provided globally through AppProviders,
 * so we don't need to wrap it here anymore.
 */
export const Home: React.FC = () => {
  const { navigateToSignup, navigateToLogin, scrollToSection } = useNavigate();

  return (
    <HomeLayout>
      <FlexibleNavbar
        brandText="BuildFlow"
        navItems={[
          { label: 'Features', onClick: () => scrollToSection('features') },
          { label: 'About', onClick: () => scrollToSection('brands') },
          { label: 'Contact', onClick: () => scrollToSection('contact') }
        ]}
        showAuthButtons={true}
        onLoginClick={() => navigateToLogin()}
        onSignUpClick={() => navigateToSignup()}
        loginButtonText="Sign In"
        signUpButtonText="Get Started"
        showThemeToggle={false}
        mobileWidthBehavior="responsive"
      />
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