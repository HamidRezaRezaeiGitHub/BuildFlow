import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from './LoginForm';
import FlexibleSignUpForm, { SignUpFieldConfig } from './FlexibleSignUpForm';
import { AddressFieldConfig } from '@/components/address';
import React, { useState, useEffect } from 'react';

interface AuthSectionProps {
  className?: string;
}

/**
 * Authentication Section - Combined Sign Up and Login forms
 * 
 * Features:
 * - Switchable tabs between Sign Up and Login
 * - Form validation and user feedback
 * - Password visibility toggle
 * - Responsive design
 */
const Auth: React.FC<AuthSectionProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('signup');
  const [showPassword, setShowPassword] = useState(false);

  // Custom field configuration for signup form
  // Required: firstName, lastName, email, password, confirmPassword, city, stateOrProvince, country, postalOrZipCode
  const signUpFieldsConfig: SignUpFieldConfig[] = [
    { field: 'firstName', colSpan: 1, required: true, show: true },
    { field: 'lastName', colSpan: 1, required: true, show: true },
    { field: 'email', colSpan: 1, required: true, show: true },
    { field: 'phone', colSpan: 1, required: false, show: true },
    { field: 'password', colSpan: 1, required: true, show: true },
    { field: 'confirmPassword', colSpan: 1, required: true, show: true }
  ];

  // Address configuration: unitNumber, streetNumberName (combined), city, stateOrProvince, country, postalOrZipCode
  // Required: city, stateOrProvince, country, postalOrZipCode
  // Optional: unitNumber, streetNumberName
  const addressFieldsConfig: AddressFieldConfig[] = [
    { field: 'unitNumber', colSpan: 1, required: false, show: true },
    { field: 'streetNumberName' as any, colSpan: 1, required: false, show: true },
    { field: 'city', colSpan: 1, required: true, show: true },
    { field: 'stateOrProvince', colSpan: 1, required: true, show: true },
    { field: 'country', colSpan: 1, required: true, show: true },
    { field: 'postalOrZipCode', colSpan: 1, required: true, show: true }
  ];

  // Listen for URL hash changes and navigation events
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#auth') {
        // Check for stored tab preference or default to signup
        const preferredTab = sessionStorage.getItem('auth-tab') || 'signup';
        setActiveTab(preferredTab);
      }
    };

    // Custom event listener for tab navigation
    const handleTabNavigation = (event: CustomEvent) => {
      const { tab } = event.detail;
      setActiveTab(tab);
      sessionStorage.setItem('auth-tab', tab);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('navigate-to-tab' as any, handleTabNavigation);

    // Initial check
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('navigate-to-tab' as any, handleTabNavigation);
    };
  }, []); // Empty dependency array ensures this runs once on mount

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <section id="auth" className={`py-24 bg-background ${className}`}>
      <div className="mx-auto max-w-screen-2xl px-4 lg:px-8">

        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of construction professionals who trust BuildFlow to manage their projects efficiently.
          </p>
        </div>

        {/* Authentication Forms */}
        <div className="max-w-2xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger
                value="signup"
                className="text-sm font-medium"
                data-tab="signup"
              >
                Sign Up
              </TabsTrigger>
              <TabsTrigger
                value="login"
                className="text-sm font-medium"
                data-tab="login"
              >
                Login
              </TabsTrigger>
            </TabsList>

            {/* Sign Up Tab */}
            <TabsContent value="signup" className="space-y-6" id="auth-signup">
              <FlexibleSignUpForm
                fieldsConfig={signUpFieldsConfig}
                addressFieldsConfig={addressFieldsConfig}
                onSignUpSuccess={() => setActiveTab('login')}
                inline={true}
                enableValidation={true}
                includeAddress={true}
                addressCollapsible={false}
                showPersonalInfoHeader={false}
                showAddressPanelHeader={false}
              />
            </TabsContent>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-6" id="auth-login">
              <LoginForm
                showPassword={showPassword}
                onTogglePassword={togglePasswordVisibility}
                inline={true}
              />
            </TabsContent>
          </Tabs>

          {/* Social Proof */}
          <div className="text-center mt-8 space-y-2">
            <p className="text-sm text-muted-foreground">
              Join 500+ construction professionals already using BuildFlow
            </p>
            <div className="flex justify-center items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-yellow-400 text-sm">★</span>
              ))}
              <span className="text-sm text-muted-foreground ml-2">4.9/5 rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Auth;