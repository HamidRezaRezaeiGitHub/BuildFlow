// Base interface for all auth field components (following address pattern)
export interface BaseAuthFieldProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  errors?: string[];
}

// Auth field validation configuration types (matching backend DTOs)
export interface AuthValidationRules {
  // SignUpRequest.java validation rules
  USERNAME_MIN_LENGTH: 3;
  USERNAME_MAX_LENGTH: 50;
  PASSWORD_MIN_LENGTH: 8;
  PASSWORD_MAX_LENGTH: 100;
  
  // LoginRequest.java validation rules  
  LOGIN_USERNAME_EMAIL_MIN_LENGTH: 3;
  LOGIN_USERNAME_EMAIL_MAX_LENGTH: 100;
  
  // Contact validation rules
  EMAIL_MAX_LENGTH: 100;
}

export const AUTH_VALIDATION_RULES: AuthValidationRules = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 100,
  LOGIN_USERNAME_EMAIL_MIN_LENGTH: 3,
  LOGIN_USERNAME_EMAIL_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 100,
};

// Main Auth section component  
export { default as AuthSection } from './AuthSection';

// Individual field components following address pattern
export { EmailField } from './Email';
export { NameField } from './Name';
export { PhoneField } from './Phone';
export { UsernameField } from './Username';
export { UsernameEmailField } from './UsernameEmail';
export { PasswordField } from './Password';
export { ConfirmPasswordField } from './ConfirmPassword';

// Form components following address pattern
export { default as LoginForm } from './LoginForm';
export { default as SignUpForm } from './SignUpForm';
export { CompactSignUpForm } from './CompactSignUpForm';
export { ShortSignUpForm } from './ShortSignUpForm';
export { LongSignUpForm } from './LongSignUpForm';

// Base types and interfaces
export type { ValidationResult } from '@/services/validation';
export type { EmailFieldProps } from './Email';
export type { NameFieldProps, NameType } from './Name';
export type { PhoneFieldProps } from './Phone';
export type { UsernameFieldProps } from './Username';
export type { UsernameEmailFieldProps } from './UsernameEmail';
export type { PasswordFieldProps } from './Password';
export type { ConfirmPasswordFieldProps } from './ConfirmPassword';
export type { LoginFormData, LoginFormProps } from './LoginForm';
export type { SignUpFormData, SignUpFormProps } from './SignUpForm';
export type { CompactSignUpFormData, CompactSignUpFormProps } from './CompactSignUpForm';
export type { ShortSignUpFormData, ShortSignUpFormProps } from './ShortSignUpForm';
export type { LongSignUpFormData, LongSignUpFormProps } from './LongSignUpForm';
