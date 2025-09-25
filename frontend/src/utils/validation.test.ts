import {
  getAllValidationErrors,
  validateFirstName,
  validateLastName,
  validatePhone,
  validateSignUpForm,
  type SignUpFormData
} from '@/utils/validation';

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