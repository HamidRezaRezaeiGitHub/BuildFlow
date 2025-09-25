// Main Auth component  
export { default as Auth } from './Auth';

// Individual field components with validation service integration
export {
  EmailField,
  UsernameField,
  UsernameEmailField, 
  PasswordField,
  ConfirmPasswordField,
  validateEmail,
  validateUsername,
  validateUsernameOrEmail,
  validatePassword,
  validateLoginPassword,
  validateConfirmPassword
} from './CredentialFields';

// Form components following address pattern
export { default as LoginForm } from './LoginForm';
export { default as SignUpForm } from './SignUpForm';

// Legacy components (deprecated - use new form components instead)
export { default as Login } from './Login';
export { default as SignUp } from './SignUp';

// Types and interfaces
export type { ValidationResult, BaseAuthFieldProps } from './CredentialFields';
export type { LoginFormData, LoginFormProps } from './LoginForm';
export type { SignUpFormData, SignUpFormProps } from './SignUpForm';
