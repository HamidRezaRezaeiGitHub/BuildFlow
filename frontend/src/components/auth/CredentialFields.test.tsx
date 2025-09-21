import {
    validateConfirmPassword,
    validateEmail,
    validatePassword,
} from './CredentialFields';

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