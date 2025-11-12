import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { StructuredApiError } from '@/services';
import { ValidationResult } from '../../services/validation';
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

  // Context alternatives - provide either contexts or callback functions
  onLogin?: (credentials: { username: string; password: string }) => Promise<void>;
  onNavigate?: (path: string) => void;

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
  onLogin,
  onNavigate,
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
    [key: string]: ValidationResult
  }>({});
  
  // Try to use contexts, but allow optional usage via callbacks
  let authLogin: ((credentials: { username: string; password: string }) => Promise<void>) | undefined;
  let navigationNavigate: ((path: string) => void) | undefined;
  
  try {
    const authContext = useAuth?.();
    authLogin = authContext?.login;
  } catch {
    // Context not available, rely on callbacks
  }
  
  try {
    const navigateFunction = useNavigate?.();
    navigationNavigate = navigateFunction;
  } catch {
    // Context not available, rely on callbacks
  }
  
  // Use provided callbacks or context functions
  const loginFunction = onLogin || authLogin;
  const navigateFunction = onNavigate || navigationNavigate;

  const requiredFields: (keyof LoginFormData)[] = customRequiredFields || [
    'usernameOrEmail',
    'password'
  ];

  const isFormValid = React.useMemo(() => {
    if (!enableValidation) {
      // Without validation, just check that required fields have content
      return requiredFields.every(fieldName => {
        const fieldValue = loginForm[fieldName];
        return fieldValue && fieldValue.trim() !== '';
      });
    }

    // 1. All required fields must be filled
    const allRequiredFieldsComplete = requiredFields.every(fieldName => {
      const fieldValue = loginForm[fieldName];
      return fieldValue && fieldValue.trim() !== '';
    });

    // 2. All fields that have been validated must be valid
    // If a field has no validation state, it means it hasn't been touched, so we consider it neutral (valid)
    const allValidatedFieldsValid = requiredFields.every(fieldName => {
      const validation = fieldValidationState[fieldName];
      return validation ? validation.isValid : true; // Consider untouched fields as valid for form enabling
    });

    return allRequiredFieldsComplete && allValidatedFieldsValid;
  }, [enableValidation, fieldValidationState, loginForm, requiredFields]);

  const handleFieldValidationChange = React.useCallback((fieldName: string, validationResult: ValidationResult) => {
    setFieldValidationState(prev => {
      const newState = {
        ...prev,
        [fieldName]: validationResult
      };

      // Call validation state change callback with overall validity
      if (onValidationStateChange) {
        onValidationStateChange(isFormValid);
      }

      return newState;
    });
  }, [onValidationStateChange, isFormValid]);

  // Create memoized validation change handlers per field to prevent infinite re-renders
  const validationHandlers = React.useMemo(() => {
    const handlers: Record<string, ((result: ValidationResult) => void) | undefined> = {};

    return (fieldName: string) => {
      if (!enableValidation) return undefined;

      if (!handlers[fieldName]) {
        handlers[fieldName] = (result: ValidationResult) => handleFieldValidationChange(fieldName, result);
      }
      return handlers[fieldName];
    };
  }, [enableValidation, handleFieldValidationChange]);

  const isFormValidForSubmit = React.useMemo(() => {
    if (!enableValidation) {
      // Without validation, just check that fields have content
      return requiredFields.every(fieldName => {
        const fieldValue = loginForm[fieldName];
        return fieldValue && fieldValue.trim() !== '';
      });
    }
    return isFormValid;
  }, [enableValidation, isFormValid, loginForm, requiredFields]);

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
      // Ensure we have a login function available
      if (!loginFunction) {
        throw new Error('No login function available. Please provide either useAuth context or onLogin callback.');
      }
      
      // Use the flexible username/email field for login
      await loginFunction({
        username: loginForm.usernameOrEmail,
        password: loginForm.password
      });

      // Navigate to dashboard on successful login if navigation function is available
      if (navigateFunction) {
        navigateFunction('/dashboard');
      }

      if (onLoginSuccess) onLoginSuccess();

    } catch (error) {
      // Extract detailed error message from StructuredApiError if available
      const errorMessage = error instanceof StructuredApiError
        ? (error.apiErrorResponse?.errors?.join(', ') || error.message)
        : (error instanceof Error ? error.message : 'Login failed. Please try again.');
      
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
    // Defensive programming: validate parameters
    if (!field || typeof field !== 'string') {
      console.warn('LoginForm: Invalid field name provided to handleLoginDataChange');
      return;
    }
    
    const safeValue = value ?? '';
    
    setLoginForm(prev => {
      const safePrev = prev || { usernameOrEmail: '', password: '' };
      const newFormData = { ...safePrev, [field]: safeValue };

      // Call form data change callback
      if (onFormDataChange && typeof onFormDataChange === 'function') {
        try {
          onFormDataChange(newFormData);
        } catch (error) {
          console.error('LoginForm: Error in onFormDataChange callback:', error);
        }
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
        onValidationChange={validationHandlers('usernameOrEmail')}
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
        onValidationChange={validationHandlers('password')}
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
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
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