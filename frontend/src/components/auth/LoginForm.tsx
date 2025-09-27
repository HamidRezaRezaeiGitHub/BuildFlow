import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PasswordField } from './Password';
import { UsernameEmailField } from './UsernameEmail';

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
  onValidationStateChange?: (isValid: boolean) => void;
  onFormDataChange?: (formData: LoginFormData) => void;
  onLoadingStateChange?: (isLoading: boolean) => void;
  onFormSubmit?: (formData: LoginFormData) => void;
  onLoginSuccess?: () => void;
  onLoginError?: (error: string) => void;

  // Validation configuration
  enableValidation?: boolean;

  // External errors (from parent)
  errors?: Record<string, string[]>;

  /** Whether the form is disabled */
  disabled?: boolean;

  /** Custom list of required fields. If not provided, uses default required fields (unitNumber is optional by default). */
  requiredFields?: (keyof LoginFormData)[];
}

export const LoginForm: React.FC<LoginFormProps> = ({
  title = "Welcome back",
  description = "Enter your credentials to sign in to your account",
  inline = false,
  className = '',
  showPassword,
  onTogglePassword,
  onValidationStateChange,
  onFormDataChange,
  onLoadingStateChange,
  onFormSubmit,
  onLoginSuccess,
  onLoginError,
  enableValidation = true,
  errors = {},
  disabled = false,
  requiredFields: customRequiredFields
}) => {
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    usernameOrEmail: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldValidationState, setFieldValidationState] = React.useState<{
    [key: string]: { isValid: boolean; errors: string[] }
  }>({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const requiredFields: (keyof LoginFormData)[] = customRequiredFields || [
    'usernameOrEmail',
    'password'
  ];

  const handleFieldValidationChange = React.useCallback((fieldName: string, isValid: boolean, fieldErrors: string[]) => {
    setFieldValidationState(prev => {
      const newState = {
        ...prev,
        [fieldName]: { isValid, errors: fieldErrors }
      };

      // Call validation state change callback with overall validity
      if (onValidationStateChange) {
        const isFormValid = Object.values(newState).every(state => state.isValid) &&
          requiredFields.every(field => {
            const fieldValue = loginForm[field];
            return fieldValue && fieldValue.trim() !== '';
          });
        onValidationStateChange(isFormValid);
      }

      return newState;
    });
  }, [onValidationStateChange, requiredFields, loginForm]);

  const isFormValidForSubmit = React.useMemo(() => {
    if (!enableValidation) return true;

    // 1. All required fields must be filled
    const allRequiredFieldsComplete = requiredFields.every(fieldName => {
      const fieldValue = loginForm[fieldName];
      return fieldValue && fieldValue.trim() !== '';
    });

    // 2. All fields that have been validated must be valid
    const allValidatedFieldsValid = Object.values(fieldValidationState).every(state => state.isValid);

    return allRequiredFieldsComplete && allValidatedFieldsValid;
  }, [enableValidation, fieldValidationState, loginForm, requiredFields]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (disabled || isSubmitting || !isFormValidForSubmit) return;

    // Call form submit callback
    if (onFormSubmit) {
      onFormSubmit(loginForm);
    }

    setIsSubmitting(true);
    setSubmitError(null);

    // Call loading state change callback
    if (onLoadingStateChange) {
      onLoadingStateChange(true);
    }

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

      // Call loading state change callback
      if (onLoadingStateChange) {
        onLoadingStateChange(false);
      }
    }
  };

  const handleLoginDataChange = (field: keyof LoginFormData, value: string) => {
    setLoginForm(prev => {
      const newFormData = { ...prev, [field]: value };

      // Call form data change callback
      if (onFormDataChange) {
        onFormDataChange(newFormData);
      }

      return newFormData;
    });
    if (submitError) setSubmitError(null);
  };

  // Form content
  const formContent = (
    <form onSubmit={handleLogin} className={`space-y-4 ${className}`}>
      {/* Username or Email Field */}
      <UsernameEmailField
        id="loginUsernameEmail"
        value={loginForm.usernameOrEmail}
        onChange={(value) => handleLoginDataChange('usernameOrEmail', value)}
        enableValidation={enableValidation}
        validationMode="required"
        onValidationChange={(isValid, fieldErrors) => handleFieldValidationChange('usernameOrEmail', isValid, fieldErrors)}
        errors={errors.usernameOrEmail}
        placeholder="username or email@company.com"
      />

      {/* Password Field */}
      <PasswordField
        id="loginPassword"
        value={loginForm.password}
        onChange={(value) => { handleLoginDataChange('password', value); }}
        disabled={disabled}
        placeholder="Enter your password"
        showPassword={showPassword}
        onToggleVisibility={onTogglePassword}
        enableValidation={enableValidation}
        validationMode="required"
        validationType="login"
        onValidationChange={(isValid, fieldErrors) => handleFieldValidationChange('password', isValid, fieldErrors)}
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
        disabled={disabled || isSubmitting || !isFormValidForSubmit}
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