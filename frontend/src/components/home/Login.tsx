import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { EmailField, PasswordField } from './Credentials';
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
    email: '',
    password: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual login logic
    console.log('Login:', loginForm);
    alert('Login functionality will be implemented with backend integration');
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
          {/* Email Field */}
          <EmailField
            id="loginEmail"
            value={loginForm.email}
            onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
          />

          {/* Password Field */}
          <PasswordField
            id="loginPassword"
            value={loginForm.password}
            onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
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

          <Button type="submit" className="w-full" size="lg">
            Sign In
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Login;