// Base interface for all auth field components (following address pattern)
export interface BaseAuthFieldProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  errors?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Auth field validation configuration types (matching backend DTOs)
export interface AuthValidationRules {
  // SignUpRequest.java validation rules
  USERNAME_MIN_LENGTH: 3;
  USERNAME_MAX_LENGTH: 50;
  SIGNUP_PASSWORD_MIN_LENGTH: 8;
  SIGNUP_PASSWORD_MAX_LENGTH: 128;
  
  // LoginRequest.java validation rules  
  LOGIN_USERNAME_EMAIL_MIN_LENGTH: 3;
  LOGIN_USERNAME_EMAIL_MAX_LENGTH: 100;
  LOGIN_PASSWORD_MIN_LENGTH: 6;
  LOGIN_PASSWORD_MAX_LENGTH: 40;
  
  // Contact validation rules
  EMAIL_MAX_LENGTH: 100;
}

export const AUTH_VALIDATION_RULES: AuthValidationRules = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  SIGNUP_PASSWORD_MIN_LENGTH: 8,
  SIGNUP_PASSWORD_MAX_LENGTH: 128,
  LOGIN_USERNAME_EMAIL_MIN_LENGTH: 3,
  LOGIN_USERNAME_EMAIL_MAX_LENGTH: 100,
  LOGIN_PASSWORD_MIN_LENGTH: 6,
  LOGIN_PASSWORD_MAX_LENGTH: 40,
  EMAIL_MAX_LENGTH: 100,
};