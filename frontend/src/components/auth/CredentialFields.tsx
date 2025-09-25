import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import React from 'react';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
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

interface EmailFieldProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  errors?: string[];
  hasError?: boolean;
}

interface UsernameEmailFieldProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  errors?: string[];
  hasError?: boolean;
}

interface PasswordFieldProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  showPassword: boolean;
  onToggleVisibility: () => void;
  errors?: string[];
  hasError?: boolean;
}

// Reusable Email Field Component
export const EmailField: React.FC<EmailFieldProps> = ({
  id,
  value,
  onChange,
  placeholder = "john@company.com",
  errors = [],
  hasError = false
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>Email</Label>
    <div className="relative">
      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        id={id}
        type="email"
        placeholder={placeholder}
        className={`pl-10 ${hasError || errors.length > 0 ? 'border-red-500 focus:border-red-500' : ''}`}
        value={value}
        onChange={onChange}
        required
      />
    </div>
    {errors.length > 0 && (
      <div className="space-y-1">
        {errors.map((error, index) => (
          <p key={index} className="text-xs text-red-500">{error}</p>
        ))}
      </div>
    )}
  </div>
);

// Reusable Username/Email Field Component
export const UsernameEmailField: React.FC<UsernameEmailFieldProps> = ({
  id,
  value,
  onChange,
  placeholder = "username or email@company.com",
  errors = [],
  hasError = false
}) => {
  // Detect if current value looks like an email
  const isEmail = value.includes('@');
  const icon = isEmail ? Mail : User;
  const IconComponent = icon;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Username or Email</Label>
      <div className="relative">
        <IconComponent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id={id}
          type="text"
          placeholder={placeholder}
          className={`pl-10 ${hasError || errors.length > 0 ? 'border-red-500 focus:border-red-500' : ''}`}
          value={value}
          onChange={onChange}
          required
        />
      </div>
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <p key={index} className="text-xs text-red-500">{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};

// Reusable Password Field Component
export const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  value,
  onChange,
  placeholder,
  showPassword,
  onToggleVisibility,
  errors = [],
  hasError = false
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>Password</Label>
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className={`pl-10 pr-10 ${hasError || errors.length > 0 ? 'border-red-500 focus:border-red-500' : ''}`}
        value={value}
        onChange={onChange}
        required
      />
      <button
        type="button"
        onClick={onToggleVisibility}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
    {errors.length > 0 && (
      <div className="space-y-1">
        {errors.map((error, index) => (
          <p key={index} className="text-xs text-red-500">{error}</p>
        ))}
      </div>
    )}
  </div>
);