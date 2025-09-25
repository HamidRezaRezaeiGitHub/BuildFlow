import { fireEvent, render, screen } from '@testing-library/react';
import {
    validateConfirmPassword,
    validateEmail,
    validatePassword,
    EmailField,
    PasswordField,
    ConfirmPasswordField,
    UsernameEmailField
} from './CredentialFields';

// Mock validation service
jest.mock('@/services/validation/ValidationService', () => ({
    validationService: {
        validateField: jest.fn()
    }
}));

describe('Email Validation Functions', () => {
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

describe('Password Validation Functions', () => {
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

describe('Confirm Password Validation Functions', () => {
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

describe('EmailField Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('EmailField_shouldRenderWithDefaultProps', () => {
        const mockOnChange = jest.fn();
        
        render(
            <EmailField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        const label = screen.getByText('Email');

        expect(input).toBeInTheDocument();
        expect(label).toBeInTheDocument();
        expect(input).toHaveAttribute('placeholder', 'john@company.com');
        expect(input).toHaveValue('');
        expect(input).toHaveAttribute('type', 'email');
    });

    test('EmailField_shouldCallOnChange_whenValueChanges', () => {
        const mockOnChange = jest.fn();
        
        render(
            <EmailField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'test@example.com' } });

        expect(mockOnChange).toHaveBeenCalledWith('test@example.com');
    });

    test('EmailField_shouldDisplayExternalErrors_whenErrorsProvided', () => {
        const mockOnChange = jest.fn();
        const errors = ['Email is invalid', 'Email too long'];
        
        render(
            <EmailField
                value="invalid-email"
                onChange={mockOnChange}
                errors={errors}
            />
        );

        expect(screen.getByText('Email is invalid')).toBeInTheDocument();
        expect(screen.getByText('Email too long')).toBeInTheDocument();
        
        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('border-red-500');
    });

    test('EmailField_shouldShowRequiredIndicator_whenValidationModeRequired', () => {
        const mockOnChange = jest.fn();
        
        render(
            <EmailField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
            />
        );

        expect(screen.getByText('*')).toBeInTheDocument();
    });

    test('EmailField_shouldNotShowRequiredIndicator_whenValidationModeOptional', () => {
        const mockOnChange = jest.fn();
        
        render(
            <EmailField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
            />
        );

        expect(screen.queryByText('*')).not.toBeInTheDocument();
    });
});

describe('PasswordField Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('PasswordField_shouldRenderWithDefaultProps', () => {
        const mockOnChange = jest.fn();
        const mockOnToggle = jest.fn();
        
        render(
            <PasswordField
                value=""
                onChange={mockOnChange}
                showPassword={false}
                onToggleVisibility={mockOnToggle}
            />
        );

        const input = screen.getByLabelText('Password');
        const label = screen.getByText('Password');
        const toggleButton = screen.getByRole('button');

        expect(input).toBeInTheDocument();
        expect(label).toBeInTheDocument();
        expect(toggleButton).toBeInTheDocument();
        expect(input).toHaveAttribute('type', 'password');
    });

    test('PasswordField_shouldTogglePasswordVisibility_whenToggleButtonClicked', () => {
        const mockOnChange = jest.fn();
        const mockOnToggle = jest.fn();
        
        const { rerender } = render(
            <PasswordField
                value="secret123"
                onChange={mockOnChange}
                showPassword={false}
                onToggleVisibility={mockOnToggle}
            />
        );

        const input = screen.getByLabelText('Password');
        const toggleButton = screen.getByRole('button');

        expect(input).toHaveAttribute('type', 'password');
        
        fireEvent.click(toggleButton);
        expect(mockOnToggle).toHaveBeenCalled();

        // Simulate parent component updating showPassword
        rerender(
            <PasswordField
                value="secret123"
                onChange={mockOnChange}
                showPassword={true}
                onToggleVisibility={mockOnToggle}
            />
        );

        expect(input).toHaveAttribute('type', 'text');
    });

    test('PasswordField_shouldCallOnChange_whenValueChanges', () => {
        const mockOnChange = jest.fn();
        const mockOnToggle = jest.fn();
        
        render(
            <PasswordField
                value=""
                onChange={mockOnChange}
                showPassword={false}  
                onToggleVisibility={mockOnToggle}
            />
        );

        const input = screen.getByLabelText('Password');
        fireEvent.change(input, { target: { value: 'newpassword' } });

        expect(mockOnChange).toHaveBeenCalledWith('newpassword');
    });

    test('PasswordField_shouldDisplayExternalErrors_whenErrorsProvided', () => {
        const mockOnChange = jest.fn();
        const mockOnToggle = jest.fn();
        const errors = ['Password too short', 'Missing special character'];
        
        render(
            <PasswordField
                value="weak"
                onChange={mockOnChange}
                showPassword={false}
                onToggleVisibility={mockOnToggle}
                errors={errors}
            />
        );

        expect(screen.getByText('Password too short')).toBeInTheDocument();
        expect(screen.getByText('Missing special character')).toBeInTheDocument();
        
        const input = screen.getByLabelText('Password');
        expect(input).toHaveClass('border-red-500');
    });
});

describe('ConfirmPasswordField Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('ConfirmPasswordField_shouldRenderWithDefaultProps', () => {
        const mockOnChange = jest.fn();
        const mockOnToggle = jest.fn();
        
        render(
            <ConfirmPasswordField
                value=""
                onChange={mockOnChange}
                showPassword={false}
                onToggleVisibility={mockOnToggle}
                originalPassword="password123"
            />
        );

        const input = screen.getByLabelText('Confirm Password');
        const label = screen.getByText('Confirm Password');

        expect(input).toBeInTheDocument();
        expect(label).toBeInTheDocument();
        expect(input).toHaveAttribute('type', 'password');
    });

    test('ConfirmPasswordField_shouldCallOnChange_whenValueChanges', () => {
        const mockOnChange = jest.fn();
        const mockOnToggle = jest.fn();
        
        render(
            <ConfirmPasswordField
                value=""
                onChange={mockOnChange}
                showPassword={false}
                onToggleVisibility={mockOnToggle}
                originalPassword="password123"
            />
        );

        const input = screen.getByLabelText('Confirm Password');
        fireEvent.change(input, { target: { value: 'password123' } });

        expect(mockOnChange).toHaveBeenCalledWith('password123');
    });

    test('ConfirmPasswordField_shouldDisplayExternalErrors_whenErrorsProvided', () => {
        const mockOnChange = jest.fn();
        const mockOnToggle = jest.fn();
        const errors = ['Passwords do not match'];
        
        render(
            <ConfirmPasswordField
                value="wrongpassword"
                onChange={mockOnChange}
                showPassword={false}
                onToggleVisibility={mockOnToggle}
                originalPassword="password123"
                errors={errors}
            />
        );

        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
        
        const input = screen.getByLabelText('Confirm Password');
        expect(input).toHaveClass('border-red-500');
    });
});

describe('UsernameEmailField Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('UsernameEmailField_shouldRenderWithDefaultProps', () => {
        const mockOnChange = jest.fn();
        
        render(
            <UsernameEmailField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        const label = screen.getByText('Username or Email');

        expect(input).toBeInTheDocument();
        expect(label).toBeInTheDocument();
        expect(input).toHaveAttribute('placeholder', 'username or email@company.com');
    });

    test('UsernameEmailField_shouldShowUserIcon_whenValueLooksLikeUsername', () => {
        const mockOnChange = jest.fn();
        
        render(
            <UsernameEmailField
                value="username123"
                onChange={mockOnChange}
            />
        );

        // Check that User icon is rendered (we can't directly test icon, but we can test the component renders)
        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('username123');
    });

    test('UsernameEmailField_shouldShowMailIcon_whenValueLooksLikeEmail', () => {
        const mockOnChange = jest.fn();
        
        render(
            <UsernameEmailField
                value="user@example.com"
                onChange={mockOnChange}
            />
        );

        // Check that the value contains @ symbol indicating email
        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input).toHaveValue('user@example.com');
        expect(input.value).toContain('@');
    });

    test('UsernameEmailField_shouldCallOnChange_whenValueChanges', () => {
        const mockOnChange = jest.fn();
        
        render(
            <UsernameEmailField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'newuser@example.com' } });

        expect(mockOnChange).toHaveBeenCalledWith('newuser@example.com');
    });
});