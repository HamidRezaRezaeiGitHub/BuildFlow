/**
 * Validation utilities for form fields
 * Based on backend validation rules from SignUpRequest.java and related DTOs
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

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
 * Validates street number (should only contain numbers)
 */
export const validateStreetNumber = (streetNumber: string): ValidationResult => {
  const errors: string[] = [];
  
  // Street number is optional, so only validate if provided
  if (streetNumber.trim()) {
    // Max length validation (from BaseAddressDto)
    if (streetNumber.length > 20) {
      errors.push('Street number must not exceed 20 characters');
    }
    
    // Should only contain numbers
    if (!/^\d+$/.test(streetNumber)) {
      errors.push('Street number must contain only numbers');
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
  const streetNumberValidation = validateStreetNumber(formData.streetNumber);
  const requiredFieldsValidation = validateRequiredFields(formData);
  
  const isFormValid = 
    firstNameValidation.isValid &&
    lastNameValidation.isValid &&
    emailValidation.isValid &&
    passwordValidation.isValid &&
    confirmPasswordValidation.isValid &&
    phoneValidation.isValid &&
    streetNumberValidation.isValid &&
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
      streetNumber: streetNumberValidation,
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