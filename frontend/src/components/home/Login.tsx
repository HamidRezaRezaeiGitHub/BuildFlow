import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { UsernameEmailField, PasswordField } from './Credentials';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

interface LoginProps {
  showPassword: boolean;
  onTogglePassword: () => void;
}

const Login: React.FC<LoginProps> = ({
  showPassword,
  onTogglePassword
}) => {
  const [loginForm, setLoginForm] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginForm.usernameOrEmail || !loginForm.password) {
      setSubmitError('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Use the flexible username/email field for login
      await login({
        username: loginForm.usernameOrEmail,
        password: loginForm.password
      });
      
      // Navigate to dashboard on successful login
      navigate('/dashboard');
      
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username or Email Field */}
          <UsernameEmailField
            id="loginUsernameEmail"
            value={loginForm.usernameOrEmail}
            onChange={(e) => {
              setLoginForm(prev => ({ ...prev, usernameOrEmail: e.target.value }));
              if (submitError) setSubmitError(null);
            }}
          />

          {/* Password Field */}
          <PasswordField
            id="loginPassword"
            value={loginForm.password}
            onChange={(e) => {
              setLoginForm(prev => ({ ...prev, password: e.target.value }));
              if (submitError) setSubmitError(null);
            }}
            placeholder="Enter your password"
            showPassword={showPassword}
            onToggleVisibility={onTogglePassword}
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="remember" className="rounded" />
              <Label htmlFor="remember" className="text-sm">Remember me</Label>
            </div>
            <a href="#" className="text-sm text-primary hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="p-4 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Login;