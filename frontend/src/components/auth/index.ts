// Base interface for all auth field components (following address pattern)
export interface BaseAuthFieldProps {
  readonly id?: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly errors?: readonly string[];
  readonly enableValidation?: boolean;
  readonly validationMode?: ValidationMode;
  readonly onValidationChange?: (result: ValidationResult) => void;
}

// Import ValidationResult for use in interfaces
import type { ValidationResult } from '../../services/validation';

// Validation rule function type
export type ValidationRuleFn = (value: string) => boolean;

// Individual validation rule interface
export interface ValidationRule {
  readonly name: string;
  readonly message: string;
  readonly validator: ValidationRuleFn;
}

// Validation mode enum for type safety
export type ValidationMode = 'required' | 'optional';

// Field type enum for stronger typing
export type AuthFieldType = 'email' | 'password' | 'username' | 'name' | 'phone' | 'usernameEmail';

// Auth field validation configuration types
export interface AuthValidationRules {
  readonly USERNAME_MIN_LENGTH: 3;
  readonly USERNAME_MAX_LENGTH: 50;
  readonly PASSWORD_MIN_LENGTH: 8;
  readonly PASSWORD_MAX_LENGTH: 100;
  
  // Login validation rules  
  readonly LOGIN_USERNAME_EMAIL_MIN_LENGTH: 3;
  readonly LOGIN_USERNAME_EMAIL_MAX_LENGTH: 100;
  
  // Contact validation rules
  readonly EMAIL_MAX_LENGTH: 100;
  
  // Phone validation rules
  readonly PHONE_MIN_LENGTH: 10;
  readonly PHONE_MAX_LENGTH: 20;
  
  // Name validation rules
  readonly NAME_MIN_LENGTH: 1;
  readonly NAME_MAX_LENGTH: 50;
}

export const AUTH_VALIDATION_RULES: AuthValidationRules = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 100,
  LOGIN_USERNAME_EMAIL_MIN_LENGTH: 3,
  LOGIN_USERNAME_EMAIL_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 100,
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 20,
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 50,
} as const;

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
export { default as FlexibleSignUpForm } from './FlexibleSignUpForm';

// Base types and interfaces
// Re-exports for external usage
export type { ValidationResult } from '../../services/validation';
export type { EmailFieldProps } from './Email';
export type { NameFieldProps, NameType } from './Name';
export type { PhoneFieldProps } from './Phone';
export type { UsernameFieldProps } from './Username';
export type { UsernameEmailFieldProps } from './UsernameEmail';
export type { PasswordFieldProps } from './Password';
export type { ConfirmPasswordFieldProps } from './ConfirmPassword';
export type { LoginFormData, LoginFormProps } from './LoginForm';
export type { FlexibleSignUpFormData, FlexibleSignUpFormProps, SignUpFieldConfig } from './FlexibleSignUpForm';
export { signUpFieldConfigs } from './FlexibleSignUpForm';
