// Main Auth section component  
export { default as AuthSection } from './AuthSection';

// Individual field components following address pattern
export { EmailField } from './Email';
export { UsernameField } from './Username';
export { UsernameEmailField } from './UsernameEmail';
export { PasswordField } from './Password';
export { ConfirmPasswordField } from './ConfirmPassword';

// Form components following address pattern
export { default as LoginForm } from './LoginForm';
export { default as SignUpForm } from './SignUpForm';

// Base types and interfaces
export type { ValidationResult, BaseAuthFieldProps, AuthValidationRules } from './Auth';
export type { EmailFieldProps } from './Email';
export type { UsernameFieldProps } from './Username';
export type { UsernameEmailFieldProps } from './UsernameEmail';
export type { PasswordFieldProps } from './Password';
export type { ConfirmPasswordFieldProps } from './ConfirmPassword';
export type { LoginFormData, LoginFormProps } from './LoginForm';
export type { SignUpFormData, SignUpFormProps } from './SignUpForm';
