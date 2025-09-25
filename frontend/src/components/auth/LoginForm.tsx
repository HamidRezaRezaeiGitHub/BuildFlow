import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { UsernameEmailField, PasswordField } from './CredentialFields';

export interface LoginFormData {
  usernameOrEmail: string;
  password: string;
}

export interface LoginFormProps {
  // Optional form configuration
  title?: string;
  description?: string;
  inline?: boolean;
  className?: string;
  
  // Password visibility (controlled by parent)
  showPassword: boolean;
  onTogglePassword: () => void;
  
  // Form callbacks
  onLoginSuccess?: () => void;
  onLoginError?: (error: string) => void;
  
  // Validation configuration
  enableValidation?: boolean;
  
  // External errors (from parent)
  errors?: Record<string, string[]>;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  title = "Welcome back",
  description = "Enter your credentials to sign in to your account",
  inline = false,
  className = '',
  showPassword,
  onTogglePassword,
  onLoginSuccess,
  onLoginError,
  enableValidation = true,
  errors = {}
}) => {
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    usernameOrEmail: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldValidations, setFieldValidations] = useState<Record<string, boolean>>({
    usernameOrEmail: false,
    password: false
  });
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle field validation changes
  const handleFieldValidation = (fieldName: string, isValid: boolean) => {
    setFieldValidations(prev => ({ ...prev, [fieldName]: isValid }));
  };

  // Check if form is valid
  const isFormValid = Object.values(fieldValidations).every(isValid => isValid) &&
                     loginForm.usernameOrEmail.trim() !== '' &&
                     loginForm.password.trim() !== '';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginForm.usernameOrEmail || !loginForm.password) {
      const error = 'Please fill in all fields.';
      setSubmitError(error);
      if (onLoginError) onLoginError(error);
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
      
      if (onLoginSuccess) onLoginSuccess();
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      setSubmitError(errorMessage);
      if (onLoginError) onLoginError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form content
  const formContent = (
    <form onSubmit={handleLogin} className="space-y-4">
      {/* Username or Email Field */}
      <UsernameEmailField
        id="loginUsernameEmail"
        value={loginForm.usernameOrEmail}
        onChange={(value) => {
          setLoginForm(prev => ({ ...prev, usernameOrEmail: value }));
          if (submitError) setSubmitError(null);
        }}
        enableValidation={enableValidation}
        validationMode="required"
        onValidationChange={(isValid) => handleFieldValidation('usernameOrEmail', isValid)}
        errors={errors.usernameOrEmail}
        placeholder="username or email@company.com"
      />

      {/* Password Field */}
      <PasswordField
        id="loginPassword"
        value={loginForm.password}
        onChange={(value) => {
          setLoginForm(prev => ({ ...prev, password: value }));
          if (submitError) setSubmitError(null);
        }}
        placeholder="Enter your password"
        showPassword={showPassword}
        onToggleVisibility={onTogglePassword}
        enableValidation={enableValidation}
        validationMode="required"
        validationType="login"
        onValidationChange={(isValid) => handleFieldValidation('password', isValid)}
        errors={errors.password}
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
        disabled={!isFormValid || isSubmitting}
      >
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );

  // Return inline version (just the form)
  if (inline) {
    return (
      <div className={className}>
        {formContent}
      </div>
    );
  }

  // Return card version (with header)
  return (
    <Card className={className}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">{title}</CardTitle>
        <CardDescription className="text-center">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {formContent}
      </CardContent>
    </Card>
  );
};

export default LoginForm;