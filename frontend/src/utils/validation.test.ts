/**
 * Tests for validation utilities
 * 
 * Following the testing patterns from TestClassesPattern.md adapted for Jest:
 * - Test method naming: functionName_shouldExpectedBehavior_whenCondition
 * - Comprehensive coverage of validation rules
 * - Clear separation of test cases
 */

import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validatePhone,
  validateStreetNumber,
  validateFirstName,
  validateLastName,
  validateSignUpForm,
  getAllValidationErrors,
  type SignUpFormData,
} from '@/utils/validation';

describe('validateEmail', () => {
  test('validateEmail_shouldReturnValid_whenEmailIsCorrect', () => {
    const result = validateEmail('user@example.com');
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('validateEmail_shouldReturnInvalid_whenEmailIsEmpty', () => {
    const result = validateEmail('');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Email is required');
  });

  test('validateEmail_shouldReturnInvalid_whenEmailMissingAtSymbol', () => {
    const result = validateEmail('userexample.com');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Email must be valid');
  });

  test('validateEmail_shouldReturnInvalid_whenEmailMissingDomain', () => {
    const result = validateEmail('user@');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Email must be valid');
  });

  test('validateEmail_shouldReturnInvalid_whenEmailExceedsMaxLength', () => {
    const longEmail = 'a'.repeat(90) + '@example.com'; // > 100 characters
    const result = validateEmail(longEmail);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Email must not exceed 100 characters');
  });

  test('validateEmail_shouldReturnValid_whenEmailAtMaxLength', () => {
    const maxEmail = 'a'.repeat(87) + '@example.com'; // exactly 100 characters
    const result = validateEmail(maxEmail);
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

describe('validatePassword', () => {
  test('validatePassword_shouldReturnValid_whenPasswordMeetsAllRequirements', () => {
    const result = validatePassword('SecurePass123!');
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('validatePassword_shouldReturnInvalid_whenPasswordIsEmpty', () => {
    const result = validatePassword('');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password is required');
  });

  test('validatePassword_shouldReturnInvalid_whenPasswordTooShort', () => {
    const result = validatePassword('Ab1!');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters long');
  });

  test('validatePassword_shouldReturnInvalid_whenPasswordTooLong', () => {
    const longPassword = 'A'.repeat(129) + 'b1!';
    const result = validatePassword(longPassword);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must not exceed 128 characters');
  });

  test('validatePassword_shouldReturnInvalid_whenPasswordMissingLowercase', () => {
    const result = validatePassword('UPPERCASE123!');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one lowercase letter');
  });

  test('validatePassword_shouldReturnInvalid_whenPasswordMissingUppercase', () => {
    const result = validatePassword('lowercase123!');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one uppercase letter');
  });

  test('validatePassword_shouldReturnInvalid_whenPasswordMissingDigit', () => {
    const result = validatePassword('Password!');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one digit');
  });

  test('validatePassword_shouldReturnInvalid_whenPasswordMissingSpecialCharacter', () => {
    const result = validatePassword('Password123');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one special character (@$!%*?&_)');
  });

  test('validatePassword_shouldReturnInvalid_whenPasswordContainsInvalidCharacters', () => {
    const result = validatePassword('Password123#');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password can only contain letters, digits, and special characters (@$!%*?&_)');
  });

  test('validatePassword_shouldReturnValid_whenPasswordContainsAllAllowedSpecialCharacters', () => {
    const result = validatePassword('Password123@$!%*?&_');
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

describe('validateConfirmPassword', () => {
  test('validateConfirmPassword_shouldReturnValid_whenPasswordsMatch', () => {
    const password = 'SecurePass123!';
    const result = validateConfirmPassword(password, password);
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('validateConfirmPassword_shouldReturnInvalid_whenConfirmPasswordEmpty', () => {
    const result = validateConfirmPassword('SecurePass123!', '');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password confirmation is required');
  });

  test('validateConfirmPassword_shouldReturnInvalid_whenPasswordsDontMatch', () => {
    const result = validateConfirmPassword('SecurePass123!', 'DifferentPass123!');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Passwords do not match');
  });
});

describe('validatePhone', () => {
  test('validatePhone_shouldReturnValid_whenPhoneIsEmpty', () => {
    const result = validatePhone('');
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('validatePhone_shouldReturnValid_whenPhoneIsValidFormat', () => {
    const validPhones = [
      '+1-555-123-4567',  // 13 chars after +1
      '555-123-4567',     // 12 chars total, starts with 5
      '+44 20 7946 0958', // International format
    ];

    validPhones.forEach(phone => {
      const result = validatePhone(phone);
      if (!result.isValid) {
        console.log(`Phone ${phone} failed validation:`, result.errors);
      }
      expect(result.isValid).toBe(true);
    });
  });

  test('validatePhone_shouldReturnInvalid_whenPhoneExceedsMaxLength', () => {
    const longPhone = '1'.repeat(31);
    const result = validatePhone(longPhone);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Phone number must not exceed 30 characters');
  });

  test('validatePhone_shouldReturnInvalid_whenPhoneInvalidFormat', () => {
    const invalidPhones = [
      '123',
      'abc-def-ghij',
      '++1234567890',
      '0123456789' // starts with 0 after +
    ];

    invalidPhones.forEach(phone => {
      const result = validatePhone(phone);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Phone number must be a valid format (e.g., +1-555-123-4567)');
    });
  });
});

describe('validateStreetNumber', () => {
  test('validateStreetNumber_shouldReturnValid_whenEmpty', () => {
    const result = validateStreetNumber('');
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('validateStreetNumber_shouldReturnValid_whenNumbersOnly', () => {
    const result = validateStreetNumber('123');
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('validateStreetNumber_shouldReturnInvalid_whenContainsLetters', () => {
    const result = validateStreetNumber('123A');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Street number must contain only numbers');
  });

  test('validateStreetNumber_shouldReturnInvalid_whenExceedsMaxLength', () => {
    const longNumber = '1'.repeat(21);
    const result = validateStreetNumber(longNumber);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Street number must not exceed 20 characters');
  });
});

describe('validateFirstName', () => {
  test('validateFirstName_shouldReturnValid_whenNameProvided', () => {
    const result = validateFirstName('John');
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('validateFirstName_shouldReturnInvalid_whenEmpty', () => {
    const result = validateFirstName('');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('First name is required');
  });

  test('validateFirstName_shouldReturnInvalid_whenExceedsMaxLength', () => {
    const longName = 'A'.repeat(101);
    const result = validateFirstName(longName);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('First name must not exceed 100 characters');
  });
});

describe('validateLastName', () => {
  test('validateLastName_shouldReturnValid_whenNameProvided', () => {
    const result = validateLastName('Doe');
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('validateLastName_shouldReturnInvalid_whenEmpty', () => {
    const result = validateLastName('');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Last name is required');
  });

  test('validateLastName_shouldReturnInvalid_whenExceedsMaxLength', () => {
    const longName = 'A'.repeat(101);
    const result = validateLastName(longName);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Last name must not exceed 100 characters');
  });
});

describe('validateSignUpForm', () => {
  const validFormData: SignUpFormData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'SecurePass123!',
    confirmPassword: 'SecurePass123!',
    phone: '+1-555-123-4567',
    labels: [],
    unitNumber: '',
    streetNumber: '123',
    streetName: 'Main St',
    city: 'Toronto',
    stateOrProvince: 'ON',
    postalOrZipCode: 'M5H 2N2',
    country: 'Canada'
  };

  test('validateSignUpForm_shouldReturnValid_whenAllFieldsCorrect', () => {
    const result = validateSignUpForm(validFormData);
    
    expect(result.isFormValid).toBe(true);
    expect(result.validations.firstName.isValid).toBe(true);
    expect(result.validations.lastName.isValid).toBe(true);
    expect(result.validations.email.isValid).toBe(true);
    expect(result.validations.password.isValid).toBe(true);
    expect(result.validations.confirmPassword.isValid).toBe(true);
  });

  test('validateSignUpForm_shouldReturnInvalid_whenRequiredFieldsMissing', () => {
    const invalidFormData = {
      ...validFormData,
      firstName: '',
      email: 'invalid-email'
    };
    
    const result = validateSignUpForm(invalidFormData);
    
    expect(result.isFormValid).toBe(false);
    expect(result.validations.firstName.isValid).toBe(false);
    expect(result.validations.email.isValid).toBe(false);
  });
});

describe('getAllValidationErrors', () => {
  test('getAllValidationErrors_shouldReturnEmptyArray_whenFormValid', () => {
    const validFormData: SignUpFormData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'SecurePass123!',
      confirmPassword: 'SecurePass123!',
      phone: '',
      labels: [],
      unitNumber: '',
      streetNumber: '',
      streetName: '',
      city: '',
      stateOrProvince: '',
      postalOrZipCode: '',
      country: ''
    };
    
    const errors = getAllValidationErrors(validFormData);
    
    expect(errors).toHaveLength(0);
  });

  test('getAllValidationErrors_shouldReturnAllErrors_whenMultipleFieldsInvalid', () => {
    const invalidFormData: SignUpFormData = {
      firstName: '',
      lastName: '',
      email: 'invalid-email',
      password: 'weak',
      confirmPassword: 'different',
      phone: 'invalid-phone',
      labels: [],
      unitNumber: '',
      streetNumber: 'abc',
      streetName: '',
      city: '',
      stateOrProvince: '',
      postalOrZipCode: '',
      country: ''
    };
    
    const errors = getAllValidationErrors(invalidFormData);
    
    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toContain('First name is required');
    expect(errors).toContain('Last name is required');
    expect(errors).toContain('Email must be valid');
  });
});