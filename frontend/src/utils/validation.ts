import {
  type ValidationResult
} from '@/components/auth/Auth';

// Temporary validation functions for backward compatibility
// These replicate the validation logic that's now in individual auth components

/**
 * Validates email format (replicated from Email.tsx)
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
 * Validates password format (replicated from Password.tsx)
 */
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];

  if (!password.trim()) {
    errors.push('Password is required');
  } else {
    // Length validation (signup requirements)
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (password.length > 128) {
      errors.push('Password must not exceed 128 characters');
    }

    // Complexity validation (signup requirements)
    if (!/.*[a-z].*/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/.*[A-Z].*/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/.*\d.*/.test(password)) {
      errors.push('Password must contain at least one digit');
    }
    if (!/.*[@$!%*?&_].*/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&_)');
    }
    if (!/^[A-Za-z\d@$!%*?&_]+$/.test(password)) {
      errors.push('Password can only contain letters, digits, and special characters (@$!%*?&_)');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates password confirmation (replicated from ConfirmPassword.tsx)
 */
export const validateConfirmPassword = (originalPassword: string, confirmPassword: string): ValidationResult => {
  const errors: string[] = [];

  if (!confirmPassword.trim()) {
    errors.push('Password confirmation is required');
  } else if (confirmPassword !== originalPassword) {
    errors.push('Passwords do not match');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  labels: string[];
  unitNumber: string;
  streetNumber: string;
  streetName: string;
  city: string;
  stateOrProvince: string;
  postalOrZipCode: string;
  country: string;
}

/**
 * Validates phone number format
 */
export const validatePhone = (phone: string): ValidationResult => {
  const errors: string[] = [];

  // Phone is optional, so only validate if provided
  if (phone.trim()) {
    // Max length validation (from ContactRequestDto)
    if (phone.length > 30) {
      errors.push('Phone number must not exceed 30 characters');
    }

    // Basic phone format validation (allows various international formats)
    const phoneRegex = /^[\+]?[1-9][\d\-\s\(\)\.]{7,29}$/;
    if (!phoneRegex.test(phone)) {
      errors.push('Phone number must be a valid format (e.g., +1-555-123-4567)');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates first name field
 */
export const validateFirstName = (firstName: string): ValidationResult => {
  const errors: string[] = [];

  if (!firstName.trim()) {
    errors.push('First name is required');
  } else if (firstName.length > 100) {
    errors.push('First name must not exceed 100 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates last name field
 */
export const validateLastName = (lastName: string): ValidationResult => {
  const errors: string[] = [];

  if (!lastName.trim()) {
    errors.push('Last name is required');
  } else if (lastName.length > 100) {
    errors.push('Last name must not exceed 100 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates required form fields for signup
 */
export const validateRequiredFields = (formData: SignUpFormData): ValidationResult => {
  const errors: string[] = [];

  // First name validation
  if (!formData.firstName.trim()) {
    errors.push('First name is required');
  } else if (formData.firstName.length > 100) {
    errors.push('First name must not exceed 100 characters');
  }

  // Last name validation  
  if (!formData.lastName.trim()) {
    errors.push('Last name is required');
  } else if (formData.lastName.length > 100) {
    errors.push('Last name must not exceed 100 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Comprehensive validation for the entire signup form
 * Returns validation results for each field and overall form validity
 */
export const validateSignUpForm = (formData: SignUpFormData) => {
  const firstNameValidation = validateFirstName(formData.firstName);
  const lastNameValidation = validateLastName(formData.lastName);
  const emailValidation = validateEmail(formData.email);
  const passwordValidation = validatePassword(formData.password);
  const confirmPasswordValidation = validateConfirmPassword(formData.password, formData.confirmPassword);
  const phoneValidation = validatePhone(formData.phone);
  const requiredFieldsValidation = validateRequiredFields(formData);

  const isFormValid =
    firstNameValidation.isValid &&
    lastNameValidation.isValid &&
    emailValidation.isValid &&
    passwordValidation.isValid &&
    confirmPasswordValidation.isValid &&
    phoneValidation.isValid &&
    requiredFieldsValidation.isValid;

  return {
    isFormValid,
    validations: {
      firstName: firstNameValidation,
      lastName: lastNameValidation,
      email: emailValidation,
      password: passwordValidation,
      confirmPassword: confirmPasswordValidation,
      phone: phoneValidation,
      requiredFields: requiredFieldsValidation
    }
  };
};

/**
 * Helper function to get all validation errors as a flat array
 */
export const getAllValidationErrors = (formData: SignUpFormData): string[] => {
  const validation = validateSignUpForm(formData);
  const allErrors: string[] = [];

  Object.values(validation.validations).forEach(fieldValidation => {
    allErrors.push(...fieldValidation.errors);
  });

  return allErrors;
};