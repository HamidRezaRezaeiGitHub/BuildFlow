import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignUp from './SignUp';
import Login from './Login';
import React, { useState } from 'react';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

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
        <div className="max-w-md mx-auto">
          <Tabs defaultValue="signup" className="w-full">
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
            <TabsContent value="signup" className="space-y-6">
              <SignUp
                showPassword={showPassword}
                showConfirmPassword={showConfirmPassword}
                onTogglePassword={togglePasswordVisibility}
                onToggleConfirmPassword={toggleConfirmPasswordVisibility}
              />
            </TabsContent>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-6">
              <Login
                showPassword={showPassword}
                onTogglePassword={togglePasswordVisibility}
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