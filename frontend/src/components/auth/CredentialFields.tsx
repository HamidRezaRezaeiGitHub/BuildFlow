import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validationService } from '@/services/validation/ValidationService';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import React from 'react';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Base interface for all auth field components (following address pattern)
export interface BaseAuthFieldProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  errors?: string[];
}

/**
 * Validates email format
 */
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];

  if (!email.trim()) {
    errors.push('Email is required');
  } else {
    // Basic email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Email must be valid');
    }

    // Max length validation (from ContactRequestDto)
    if (email.length > 100) {
      errors.push('Email must not exceed 100 characters');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates password based on SignUpRequest.java requirements
 */
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];

  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }

  // Length validation (8-128 characters)
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (password.length > 128) {
    errors.push('Password must not exceed 128 characters');
  }

  // At least one lowercase letter
  if (!/.*[a-z].*/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // At least one uppercase letter
  if (!/.*[A-Z].*/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // At least one digit
  if (!/.*\d.*/.test(password)) {
    errors.push('Password must contain at least one digit');
  }

  // At least one special character
  if (!/.*[@$!%*?&_].*/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&_)');
  }

  // Only allowed characters
  if (!/^[A-Za-z\d@$!%*?&_]+$/.test(password)) {
    errors.push('Password can only contain letters, digits, and special characters (@$!%*?&_)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates password confirmation
 */
export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
  const errors: string[] = [];

  if (!confirmPassword) {
    errors.push('Password confirmation is required');
  } else if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Email Field Component Props (following address pattern)
export interface EmailFieldProps extends BaseAuthFieldProps {
  placeholder?: string;
  enableValidation?: boolean;
  validationMode?: 'required' | 'optional';
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

// Username/Email Field Component Props
export interface UsernameEmailFieldProps extends BaseAuthFieldProps {
  placeholder?: string;
  enableValidation?: boolean;
  validationMode?: 'required' | 'optional';
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

// Password Field Component Props
export interface PasswordFieldProps extends BaseAuthFieldProps {
  placeholder?: string;
  showPassword: boolean;
  onToggleVisibility: () => void;
  enableValidation?: boolean;
  validationMode?: 'required' | 'optional';
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

// Confirm Password Field Component Props
export interface ConfirmPasswordFieldProps extends BaseAuthFieldProps {
  placeholder?: string;
  showPassword: boolean;
  onToggleVisibility: () => void;
  originalPassword: string;
  enableValidation?: boolean;
  validationMode?: 'required' | 'optional';
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

// Enhanced Email Field Component (following address pattern)
export const EmailField: React.FC<EmailFieldProps> = ({
  id = 'email',
  value,
  onChange,
  disabled = false,
  className = '',
  errors = [],
  placeholder = "john@company.com",
  enableValidation = false,
  validationMode = 'optional',
  onValidationChange
}) => {
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
  const [hasBeenTouched, setHasBeenTouched] = React.useState(false);

  // Create validation configuration based on props
  const validationConfig = React.useMemo(() => {
    if (!enableValidation) return undefined;

    return {
      fieldName: 'email',
      fieldType: 'email' as const,
      required: validationMode === 'required',
      rules: [
        ...(validationMode === 'required' ? [{
          name: 'required',
          message: 'Email is required',
          validator: (val: string) => !!val && val.trim().length > 0
        }] : []),
        {
          name: 'validEmail',
          message: 'Email must be valid',
          validator: (val: string) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
        },
        {
          name: 'maxLength_100',
          message: 'Email must not exceed 100 characters',
          validator: (val: string) => !val || val.length <= 100
        }
      ]
    };
  }, [enableValidation, validationMode]);

  // Validate field when value changes
  const validateField = React.useCallback((fieldValue: string) => {
    if (!enableValidation || !validationConfig) {
      setValidationErrors([]);
      return true;
    }

    const result = validationService.validateField('email', fieldValue, validationConfig);
    setValidationErrors(result.errors);

    // Notify parent of validation changes
    if (onValidationChange) {
      onValidationChange(result.isValid, result.errors);
    }

    return result.isValid;
  }, [enableValidation, validationConfig, onValidationChange]);

  // Handle validation prop changes
  React.useEffect(() => {
    if (!enableValidation) {
      setValidationErrors([]);
      if (onValidationChange) {
        onValidationChange(true, []);
      }
    }
  }, [enableValidation, validationMode]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Validate if touched or if we want immediate validation
    if (hasBeenTouched && enableValidation) {
      validateField(newValue);
    }
  };

  // Handle input blur - Used for touch-based validation strategy
  const handleBlur = () => {
    setHasBeenTouched(true);
    if (enableValidation) {
      validateField(value);
    }
  };

  // Use validation errors if validation is enabled, otherwise use passed errors
  const displayErrors = enableValidation ? validationErrors : errors;
  const hasErrors = displayErrors.length > 0;

  // Determine if field is required for label display
  const isRequired = enableValidation && validationMode === 'required';

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="text-xs">
        Email
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id={id}
          type="email"
          placeholder={placeholder}
          className={`pl-10 ${hasErrors ? 'border-red-500 focus:border-red-500' : ''}`}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
        />
      </div>
      {hasErrors && (
        <div className="space-y-1">
          {displayErrors.map((error, index) => (
            <p key={index} className="text-xs text-red-500">{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};

// Enhanced Username/Email Field Component (following address pattern)
export const UsernameEmailField: React.FC<UsernameEmailFieldProps> = ({
  id = 'usernameEmail',
  value,
  onChange,
  disabled = false,
  className = '',
  errors = [],
  placeholder = "username or email@company.com",
  enableValidation = false,
  validationMode = 'optional',
  onValidationChange
}) => {
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
  const [hasBeenTouched, setHasBeenTouched] = React.useState(false);

  // Detect if current value looks like an email
  const isEmail = value.includes('@');
  const icon = isEmail ? Mail : User;
  const IconComponent = icon;

  // Create validation configuration based on props
  const validationConfig = React.useMemo(() => {
    if (!enableValidation) return undefined;

    return {
      fieldName: 'usernameEmail',
      fieldType: 'text' as const,
      required: validationMode === 'required',
      rules: [
        ...(validationMode === 'required' ? [{
          name: 'required',
          message: 'Username or email is required',
          validator: (val: string) => !!val && val.trim().length > 0
        }] : []),
        {
          name: 'minLength_3',
          message: 'Username or email must be at least 3 characters long',
          validator: (val: string) => !val || val.trim().length >= 3
        },
        {
          name: 'maxLength_100',
          message: 'Username or email must not exceed 100 characters',
          validator: (val: string) => !val || val.length <= 100
        }
      ]
    };
  }, [enableValidation, validationMode]);

  // Validate field when value changes
  const validateField = React.useCallback((fieldValue: string) => {
    if (!enableValidation || !validationConfig) {
      setValidationErrors([]);
      return true;
    }

    const result = validationService.validateField('usernameEmail', fieldValue, validationConfig);
    setValidationErrors(result.errors);

    // Notify parent of validation changes
    if (onValidationChange) {
      onValidationChange(result.isValid, result.errors);
    }

    return result.isValid;
  }, [enableValidation, validationConfig, onValidationChange]);

  // Handle validation prop changes
  React.useEffect(() => {
    if (!enableValidation) {
      setValidationErrors([]);
      if (onValidationChange) {
        onValidationChange(true, []);
      }
    }
  }, [enableValidation, validationMode]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Validate if touched or if we want immediate validation
    if (hasBeenTouched && enableValidation) {
      validateField(newValue);
    }
  };

  // Handle input blur - Used for touch-based validation strategy
  const handleBlur = () => {
    setHasBeenTouched(true);
    if (enableValidation) {
      validateField(value);
    }
  };

  // Use validation errors if validation is enabled, otherwise use passed errors
  const displayErrors = enableValidation ? validationErrors : errors;
  const hasErrors = displayErrors.length > 0;

  // Determine if field is required for label display
  const isRequired = enableValidation && validationMode === 'required';

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="text-xs">
        Username or Email
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative">
        <IconComponent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id={id}
          type="text"
          placeholder={placeholder}
          className={`pl-10 ${hasErrors ? 'border-red-500 focus:border-red-500' : ''}`}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
        />
      </div>
      {hasErrors && (
        <div className="space-y-1">
          {displayErrors.map((error, index) => (
            <p key={index} className="text-xs text-red-500">{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};

// Enhanced Password Field Component (following address pattern)
export const PasswordField: React.FC<PasswordFieldProps> = ({
  id = 'password',
  value,
  onChange,
  disabled = false,
  className = '',
  errors = [],
  placeholder = "Enter your password",
  showPassword,
  onToggleVisibility,
  enableValidation = false,
  validationMode = 'optional',
  onValidationChange
}) => {
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
  const [hasBeenTouched, setHasBeenTouched] = React.useState(false);

  // Create validation configuration based on props
  const validationConfig = React.useMemo(() => {
    if (!enableValidation) return undefined;

    return {
      fieldName: 'password',
      fieldType: 'password' as const,
      required: validationMode === 'required',
      rules: [
        ...(validationMode === 'required' ? [{
          name: 'required',
          message: 'Password is required',
          validator: (val: string) => !!val && val.trim().length > 0
        }] : []),
        {
          name: 'minLength_8',
          message: 'Password must be at least 8 characters long',
          validator: (val: string) => !val || val.length >= 8
        },
        {
          name: 'maxLength_128',
          message: 'Password must not exceed 128 characters',
          validator: (val: string) => !val || val.length <= 128
        },
        {
          name: 'hasLowercase',
          message: 'Password must contain at least one lowercase letter',
          validator: (val: string) => !val || /.*[a-z].*/.test(val)
        },
        {
          name: 'hasUppercase',
          message: 'Password must contain at least one uppercase letter',
          validator: (val: string) => !val || /.*[A-Z].*/.test(val)
        },
        {
          name: 'hasDigit',
          message: 'Password must contain at least one digit',
          validator: (val: string) => !val || /.*\d.*/.test(val)
        },
        {
          name: 'hasSpecialChar',
          message: 'Password must contain at least one special character (@$!%*?&_)',
          validator: (val: string) => !val || /.*[@$!%*?&_].*/.test(val)
        },
        {
          name: 'validChars',
          message: 'Password can only contain letters, digits, and special characters (@$!%*?&_)',
          validator: (val: string) => !val || /^[A-Za-z\d@$!%*?&_]+$/.test(val)
        }
      ]
    };
  }, [enableValidation, validationMode]);

  // Validate field when value changes
  const validateField = React.useCallback((fieldValue: string) => {
    if (!enableValidation || !validationConfig) {
      setValidationErrors([]);
      return true;
    }

    const result = validationService.validateField('password', fieldValue, validationConfig);
    setValidationErrors(result.errors);

    // Notify parent of validation changes
    if (onValidationChange) {
      onValidationChange(result.isValid, result.errors);
    }

    return result.isValid;
  }, [enableValidation, validationConfig, onValidationChange]);

  // Handle validation prop changes
  React.useEffect(() => {
    if (!enableValidation) {
      setValidationErrors([]);
      if (onValidationChange) {
        onValidationChange(true, []);
      }
    }
  }, [enableValidation, validationMode]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Validate if touched or if we want immediate validation
    if (hasBeenTouched && enableValidation) {
      validateField(newValue);
    }
  };

  // Handle input blur - Used for touch-based validation strategy
  const handleBlur = () => {
    setHasBeenTouched(true);
    if (enableValidation) {
      validateField(value);
    }
  };

  // Use validation errors if validation is enabled, otherwise use passed errors
  const displayErrors = enableValidation ? validationErrors : errors;
  const hasErrors = displayErrors.length > 0;

  // Determine if field is required for label display
  const isRequired = enableValidation && validationMode === 'required';

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="text-xs">
        Password
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className={`pl-10 pr-10 ${hasErrors ? 'border-red-500 focus:border-red-500' : ''}`}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {hasErrors && (
        <div className="space-y-1">
          {displayErrors.map((error, index) => (
            <p key={index} className="text-xs text-red-500">{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};

// Enhanced Confirm Password Field Component (following address pattern)
export const ConfirmPasswordField: React.FC<ConfirmPasswordFieldProps> = ({
  id = 'confirmPassword',
  value,
  onChange,
  disabled = false,
  className = '',
  errors = [],
  placeholder = "Confirm your password",
  showPassword,
  onToggleVisibility,
  originalPassword,
  enableValidation = false,
  validationMode = 'optional',
  onValidationChange
}) => {
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
  const [hasBeenTouched, setHasBeenTouched] = React.useState(false);

  // Create validation configuration based on props
  const validationConfig = React.useMemo(() => {
    if (!enableValidation) return undefined;

    return {
      fieldName: 'confirmPassword',
      fieldType: 'password' as const,  
      required: validationMode === 'required',
      rules: [
        ...(validationMode === 'required' ? [{
          name: 'required',
          message: 'Password confirmation is required',
          validator: (val: string) => !!val && val.trim().length > 0
        }] : []),
        {
          name: 'passwordMatch',
          message: 'Passwords do not match',
          validator: (val: string) => !val || val === originalPassword
        }
      ]
    };
  }, [enableValidation, validationMode, originalPassword]);

  // Validate field when value changes
  const validateField = React.useCallback((fieldValue: string) => {
    if (!enableValidation || !validationConfig) {
      setValidationErrors([]);
      return true;
    }

    const result = validationService.validateField('confirmPassword', fieldValue, validationConfig);
    setValidationErrors(result.errors);

    // Notify parent of validation changes
    if (onValidationChange) {
      onValidationChange(result.isValid, result.errors);
    }

    return result.isValid;
  }, [enableValidation, validationConfig, onValidationChange]);

  // Re-validate when original password changes
  React.useEffect(() => {
    if (hasBeenTouched && enableValidation && value) {
      validateField(value);
    }
  }, [originalPassword, hasBeenTouched, enableValidation, value, validateField]);

  // Handle validation prop changes
  React.useEffect(() => {
    if (!enableValidation) {
      setValidationErrors([]);
      if (onValidationChange) {
        onValidationChange(true, []);
      }
    }
  }, [enableValidation, validationMode]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Validate if touched or if we want immediate validation
    if (hasBeenTouched && enableValidation) {
      validateField(newValue);
    }
  };

  // Handle input blur - Used for touch-based validation strategy
  const handleBlur = () => {
    setHasBeenTouched(true);
    if (enableValidation) {
      validateField(value);
    }
  };

  // Use validation errors if validation is enabled, otherwise use passed errors
  const displayErrors = enableValidation ? validationErrors : errors;
  const hasErrors = displayErrors.length > 0;

  // Determine if field is required for label display
  const isRequired = enableValidation && validationMode === 'required';

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="text-xs">
        Confirm Password
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className={`pl-10 pr-10 ${hasErrors ? 'border-red-500 focus:border-red-500' : ''}`}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {hasErrors && (
        <div className="space-y-1">
          {displayErrors.map((error, index) => (
            <p key={index} className="text-xs text-red-500">{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default PasswordField;