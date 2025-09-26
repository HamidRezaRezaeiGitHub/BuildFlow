import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SignUpForm from './SignUpForm';

// Mock the auth context
const mockRegister = jest.fn();

jest.mock('@/contexts/AuthContext', () => ({
    useAuth: () => ({
        register: mockRegister
    })
}));

// Mock address components
jest.mock('@/components/address', () => ({
    AddressForm: ({ addressData, onAddressChange }: any) => (
        <div data-testid="address-form">
            <input
                data-testid="address-street"
                value={addressData.streetNumber}
                onChange={(e) => onAddressChange('streetNumber', e.target.value)}
            />
            <input
                data-testid="address-city"
                value={addressData.city}
                onChange={(e) => onAddressChange('city', e.target.value)}
            />
        </div>
    ),
    createEmptyAddress: () => ({
        unitNumber: '',
        streetNumber: '',
        streetName: '',
        city: '',
        stateOrProvince: '',
        postalOrZipCode: '',
        country: ''
    }),
    parseStreetNumber: (input: string) => ({
        streetNumber: input.replace(/[^0-9]/g, ''),
        streetName: input.replace(/^[0-9\s-]+/, '').trim()
    })
}));

// Mock the field components
jest.mock('./Email', () => ({
    EmailField: ({ value, onChange, id, onValidationChange }: any) => (
        <div data-testid={`${id}-container`}>
            <label htmlFor={id}>Email</label>
            <input
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={() => onValidationChange && onValidationChange(true)}
                data-testid={id}
            />
        </div>
    )
}));

jest.mock('./Username', () => ({
    UsernameField: ({ value, onChange, id, onValidationChange }: any) => (
        <div data-testid={`${id}-container`}>
            <label htmlFor={id}>Username</label>
            <input
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={() => onValidationChange && onValidationChange(true)}
                data-testid={id}
            />
        </div>
    )
}));

jest.mock('./Password', () => ({
    PasswordField: ({ value, onChange, id, showPassword, onToggleVisibility, onValidationChange }: any) => (
        <div data-testid={`${id}-container`}>
            <label htmlFor={id}>Password</label>
            <input
                id={id}
                type={showPassword ? 'text' : 'password'}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={() => onValidationChange && onValidationChange(true)}
                data-testid={id}
            />
            <button onClick={onToggleVisibility} data-testid={`${id}-toggle`}>
                {showPassword ? 'Hide' : 'Show'}
            </button>
        </div>
    )
}));

jest.mock('./ConfirmPassword', () => ({
    ConfirmPasswordField: ({ value, onChange, id, showPassword, onToggleVisibility, onValidationChange }: any) => (
        <div data-testid={`${id}-container`}>
            <label htmlFor={id}>Confirm Password</label>
            <input
                id={id}
                type={showPassword ? 'text' : 'password'}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={() => onValidationChange && onValidationChange(true)}
                data-testid={id}
            />
            <button onClick={onToggleVisibility} data-testid={`${id}-toggle`}>
                {showPassword ? 'Hide' : 'Show'}
            </button>
        </div>
    )
}));

// Mock contact labels
jest.mock('@/services/dtos/UserDtos', () => ({
    contactLabelOptions: ['Builder', 'Owner', 'Lender', 'Supplier']
}));

const renderSignUpForm = (props = {}) => {
    const defaultProps = {
        showPassword: false,
        showConfirmPassword: false,
        onTogglePassword: jest.fn(),
        onToggleConfirmPassword: jest.fn(),
        ...props
    };

    return render(<SignUpForm {...defaultProps} />);
};

describe('SignUpForm Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Basic rendering tests
    test('SignUpForm_shouldRenderWithDefaultProps', () => {
        renderSignUpForm();

        expect(screen.getByText('Create your account')).toBeInTheDocument();
        expect(screen.getByText('Enter your information to get started with BuildFlow')).toBeInTheDocument();
        expect(screen.getByTestId('signupEmail')).toBeInTheDocument();
        expect(screen.getByTestId('signupPassword')).toBeInTheDocument();
        expect(screen.getByTestId('confirmPassword')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    test('SignUpForm_shouldRenderWithCustomTitleAndDescription', () => {
        renderSignUpForm({
            title: 'Join BuildFlow',
            description: 'Sign up now to get started'
        });

        expect(screen.getByText('Join BuildFlow')).toBeInTheDocument();
        expect(screen.getByText('Sign up now to get started')).toBeInTheDocument();
    });

    test('SignUpForm_shouldRenderInlineVersion_whenInlineTrue', () => {
        renderSignUpForm({ inline: true });

        // Should not have card structure
        expect(screen.queryByText('Create your account')).not.toBeInTheDocument();
        expect(screen.queryByText('Enter your information to get started with BuildFlow')).not.toBeInTheDocument();
        
        // But should still have form elements
        expect(screen.getByTestId('signupEmail')).toBeInTheDocument();
        expect(screen.getByTestId('signupPassword')).toBeInTheDocument();
    });

    test('SignUpForm_shouldIncludeAddressSection_whenIncludeAddressTrue', () => {
        renderSignUpForm({ includeAddress: true });

        const addressButton = screen.getByText(/address information/i);
        expect(addressButton).toBeInTheDocument();
        
        // Expand address section
        fireEvent.click(addressButton);
        expect(screen.getByTestId('address-form')).toBeInTheDocument();
    });

    test('SignUpForm_shouldNotIncludeAddressSection_whenIncludeAddressFalse', () => {
        renderSignUpForm({ includeAddress: false });

        expect(screen.queryByText(/address information/i)).not.toBeInTheDocument();
    });

    // Form field tests
    test('SignUpForm_shouldUpdateFirstName_whenUserTypesFirstName', () => {
        renderSignUpForm();

        const firstNameField = screen.getByPlaceholderText('John') as HTMLInputElement;
        expect(firstNameField).toBeInTheDocument();
        
        fireEvent.change(firstNameField, { target: { value: 'John' } });
        expect(firstNameField.value).toBe('John');
    });

    test('SignUpForm_shouldUpdateLastName_whenUserTypesLastName', () => {
        renderSignUpForm();

        const lastNameField = screen.getByPlaceholderText('Smith') as HTMLInputElement;
        expect(lastNameField).toBeInTheDocument();
        
        fireEvent.change(lastNameField, { target: { value: 'Doe' } });
        expect(lastNameField.value).toBe('Doe');
    });

    test('SignUpForm_shouldUpdateEmail_whenUserTypesEmail', () => {
        renderSignUpForm();

        const emailField = screen.getByTestId('signupEmail');
        fireEvent.change(emailField, { target: { value: 'john@example.com' } });

        expect(emailField).toHaveValue('john@example.com');
    });

    test('SignUpForm_shouldUpdatePassword_whenUserTypesPassword', () => {
        renderSignUpForm();

        const passwordField = screen.getByTestId('signupPassword');
        fireEvent.change(passwordField, { target: { value: 'SecurePass123!' } });

        expect(passwordField).toHaveValue('SecurePass123!');
    });

    test('SignUpForm_shouldUpdateConfirmPassword_whenUserTypesConfirmPassword', () => {
        renderSignUpForm();

        const confirmPasswordField = screen.getByTestId('confirmPassword');
        fireEvent.change(confirmPasswordField, { target: { value: 'SecurePass123!' } });

        expect(confirmPasswordField).toHaveValue('SecurePass123!');
    });

    test('SignUpForm_shouldUpdatePhone_whenUserTypesPhone', () => {
        renderSignUpForm();

        const phoneField = screen.getByPlaceholderText('+1 (555) 123-4567') as HTMLInputElement;
        expect(phoneField).toBeInTheDocument();
        
        fireEvent.change(phoneField, { target: { value: '+1 (555) 123-4567' } });
        expect(phoneField.value).toBe('+1 (555) 123-4567');
    });

    // Password visibility tests
    test('SignUpForm_shouldTogglePasswordVisibility_whenToggleButtonClicked', () => {
        const mockOnTogglePassword = jest.fn();
        renderSignUpForm({ onTogglePassword: mockOnTogglePassword });

        const toggleButton = screen.getByTestId('signupPassword-toggle');
        fireEvent.click(toggleButton);

        expect(mockOnTogglePassword).toHaveBeenCalled();
    });

    test('SignUpForm_shouldToggleConfirmPasswordVisibility_whenToggleButtonClicked', () => {
        const mockOnToggleConfirmPassword = jest.fn();
        renderSignUpForm({ onToggleConfirmPassword: mockOnToggleConfirmPassword });

        const toggleButton = screen.getByTestId('confirmPassword-toggle');
        fireEvent.click(toggleButton);

        expect(mockOnToggleConfirmPassword).toHaveBeenCalled();
    });

    // Labels dropdown tests
    test('SignUpForm_shouldShowLabelsDropdown', () => {
        renderSignUpForm();

        const labelsButton = screen.getByText('Select labels');
        expect(labelsButton).toBeInTheDocument();
    });

    test('SignUpForm_shouldOpenLabelsDropdown_whenClicked', () => {
        renderSignUpForm();

        const labelsButton = screen.getByText('Select labels');
        fireEvent.click(labelsButton);

        // Should show dropdown options
        expect(screen.getByText('Builder')).toBeInTheDocument();
        expect(screen.getByText('Owner')).toBeInTheDocument();
        expect(screen.getByText('Lender')).toBeInTheDocument();
        expect(screen.getByText('Supplier')).toBeInTheDocument();
    });

    // Address integration tests
    test('SignUpForm_shouldToggleAddressSection_whenAddressButtonClicked', () => {
        renderSignUpForm({ includeAddress: true });

        const addressButton = screen.getByText(/address information/i);
        fireEvent.click(addressButton);

        expect(screen.getByTestId('address-form')).toBeInTheDocument();
        expect(screen.getByTestId('address-street')).toBeInTheDocument();
        expect(screen.getByTestId('address-city')).toBeInTheDocument();
    });

    test('SignUpForm_shouldUpdateAddressData_whenAddressFieldsChange', () => {
        renderSignUpForm({ includeAddress: true });

        const addressButton = screen.getByText(/address information/i);
        fireEvent.click(addressButton);

        const streetField = screen.getByTestId('address-street');
        const cityField = screen.getByTestId('address-city');

        fireEvent.change(streetField, { target: { value: '123' } });
        fireEvent.change(cityField, { target: { value: 'Toronto' } });

        expect(streetField).toHaveValue('123');
        expect(cityField).toHaveValue('Toronto');
    });

    // Form validation tests
    test('SignUpForm_shouldDisableSubmitButton_whenFormIsEmpty', () => {
        renderSignUpForm();

        const submitButton = screen.getByRole('button', { name: /create account/i });
        expect(submitButton).toBeDisabled();
    });

    test('SignUpForm_shouldEnableSubmitButton_whenRequiredFieldsAreFilled', async () => {
        renderSignUpForm();

        // Fill required fields
        const firstNameField = screen.getByPlaceholderText('John') as HTMLInputElement;
        const lastNameField = screen.getByPlaceholderText('Smith') as HTMLInputElement;
        const emailField = screen.getByTestId('signupEmail');
        const passwordField = screen.getByTestId('signupPassword');
        const confirmPasswordField = screen.getByTestId('confirmPassword');

        fireEvent.change(firstNameField, { target: { value: 'John' } });
        fireEvent.change(lastNameField, { target: { value: 'Doe' } });
        fireEvent.change(emailField, { target: { value: 'john@example.com' } });
        fireEvent.change(passwordField, { target: { value: 'SecurePass123!' } });
        fireEvent.change(confirmPasswordField, { target: { value: 'SecurePass123!' } });

        // Trigger validation
        fireEvent.blur(emailField);
        fireEvent.blur(passwordField);
        fireEvent.blur(confirmPasswordField);

        await waitFor(() => {
            const submitButton = screen.getByRole('button', { name: /create account/i });
            expect(submitButton).toBeEnabled();
        });
    });

    // Form submission tests
    test('SignUpForm_shouldCallRegister_whenFormSubmittedWithValidData', async () => {
        mockRegister.mockResolvedValueOnce({ success: true });
        renderSignUpForm();

        // Fill required fields
        const firstNameField = screen.getByPlaceholderText('John') as HTMLInputElement;
        const lastNameField = screen.getByPlaceholderText('Smith') as HTMLInputElement;
        const emailField = screen.getByTestId('signupEmail');
        const passwordField = screen.getByTestId('signupPassword');
        const confirmPasswordField = screen.getByTestId('confirmPassword');

        fireEvent.change(firstNameField, { target: { value: 'John' } });
        fireEvent.change(lastNameField, { target: { value: 'Doe' } });
        fireEvent.change(emailField, { target: { value: 'john@example.com' } });
        fireEvent.change(passwordField, { target: { value: 'SecurePass123!' } });
        fireEvent.change(confirmPasswordField, { target: { value: 'SecurePass123!' } });

        // Trigger validation
        fireEvent.blur(emailField);
        fireEvent.blur(passwordField);
        fireEvent.blur(confirmPasswordField);

        await waitFor(() => {
            const submitButton = screen.getByRole('button', { name: /create account/i });
            expect(submitButton).toBeEnabled();
        });

        const submitButton = screen.getByRole('button', { name: /create account/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith({
                username: 'john@example.com',
                password: 'SecurePass123!',
                contactRequestDto: {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    phone: undefined,
                    labels: [],
                    addressRequestDto: {
                        unitNumber: undefined,
                        streetNumber: undefined,
                        streetName: '',
                        city: '',
                        stateOrProvince: '',
                        postalOrZipCode: undefined,
                        country: ''
                    }
                }
            });
        });
    });

    test('SignUpForm_shouldDisplaySuccessMessage_whenRegistrationSuccessful', async () => {
        mockRegister.mockResolvedValueOnce({ success: true });
        renderSignUpForm();

        // Fill and submit form
        const firstNameField = screen.getByPlaceholderText('John') as HTMLInputElement;
        const lastNameField = screen.getByPlaceholderText('Smith') as HTMLInputElement;
        const emailField = screen.getByTestId('signupEmail');
        const passwordField = screen.getByTestId('signupPassword');
        const confirmPasswordField = screen.getByTestId('confirmPassword');

        fireEvent.change(firstNameField, { target: { value: 'John' } });
        fireEvent.change(lastNameField, { target: { value: 'Doe' } });
        fireEvent.change(emailField, { target: { value: 'john@example.com' } });
        fireEvent.change(passwordField, { target: { value: 'SecurePass123!' } });
        fireEvent.change(confirmPasswordField, { target: { value: 'SecurePass123!' } });

        // Trigger validation
        fireEvent.blur(emailField);
        fireEvent.blur(passwordField);
        fireEvent.blur(confirmPasswordField);

        await waitFor(() => {
            const submitButton = screen.getByRole('button', { name: /create account/i });
            expect(submitButton).toBeEnabled();
        });

        const submitButton = screen.getByRole('button', { name: /create account/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Account created successfully! Redirecting to login...')).toBeInTheDocument();
        });
    });

    test('SignUpForm_shouldDisplayErrorMessage_whenRegistrationFails', async () => {
        const errorMessage = 'Email already exists';
        mockRegister.mockRejectedValueOnce(new Error(errorMessage));
        renderSignUpForm();

        // Fill and submit form
        const firstNameField = screen.getByPlaceholderText('John') as HTMLInputElement;
        const lastNameField = screen.getByPlaceholderText('Smith') as HTMLInputElement;
        const emailField = screen.getByTestId('signupEmail');
        const passwordField = screen.getByTestId('signupPassword');
        const confirmPasswordField = screen.getByTestId('confirmPassword');

        fireEvent.change(firstNameField, { target: { value: 'John' } });
        fireEvent.change(lastNameField, { target: { value: 'Doe' } });
        fireEvent.change(emailField, { target: { value: 'john@example.com' } });
        fireEvent.change(passwordField, { target: { value: 'SecurePass123!' } });
        fireEvent.change(confirmPasswordField, { target: { value: 'SecurePass123!' } });

        // Trigger validation
        fireEvent.blur(emailField);
        fireEvent.blur(passwordField);
        fireEvent.blur(confirmPasswordField);

        await waitFor(() => {
            const submitButton = screen.getByRole('button', { name: /create account/i });
            expect(submitButton).toBeEnabled();
        });

        const submitButton = screen.getByRole('button', { name: /create account/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });

    test('SignUpForm_shouldShowLoadingState_whenSubmitting', async () => {
        // Mock register to take some time
        mockRegister.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
        renderSignUpForm();

        // Fill and submit form
        const firstNameField = screen.getByPlaceholderText('John') as HTMLInputElement;
        const lastNameField = screen.getByPlaceholderText('Smith') as HTMLInputElement;
        const emailField = screen.getByTestId('signupEmail');
        const passwordField = screen.getByTestId('signupPassword');
        const confirmPasswordField = screen.getByTestId('confirmPassword');

        fireEvent.change(firstNameField, { target: { value: 'John' } });
        fireEvent.change(lastNameField, { target: { value: 'Doe' } });
        fireEvent.change(emailField, { target: { value: 'john@example.com' } });
        fireEvent.change(passwordField, { target: { value: 'SecurePass123!' } });
        fireEvent.change(confirmPasswordField, { target: { value: 'SecurePass123!' } });

        // Trigger validation
        fireEvent.blur(emailField);
        fireEvent.blur(passwordField);
        fireEvent.blur(confirmPasswordField);

        await waitFor(() => {
            const submitButton = screen.getByRole('button', { name: /create account/i });
            expect(submitButton).toBeEnabled();
        });

        const submitButton = screen.getByRole('button', { name: /create account/i });
        fireEvent.click(submitButton);

        // Should show loading state
        expect(screen.getByRole('button', { name: /creating account/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled();
    });

    // Callback tests
    test('SignUpForm_shouldCallOnSignUpSuccess_whenRegistrationSuccessful', async () => {
        const mockOnSignUpSuccess = jest.fn();
        mockRegister.mockResolvedValueOnce({ success: true });
        renderSignUpForm({ onSignUpSuccess: mockOnSignUpSuccess });

        // Fill and submit form
        const firstNameField = screen.getByPlaceholderText('John') as HTMLInputElement;
        const lastNameField = screen.getByPlaceholderText('Smith') as HTMLInputElement;
        const emailField = screen.getByTestId('signupEmail');
        const passwordField = screen.getByTestId('signupPassword');
        const confirmPasswordField = screen.getByTestId('confirmPassword');

        fireEvent.change(firstNameField, { target: { value: 'John' } });
        fireEvent.change(lastNameField, { target: { value: 'Doe' } });
        fireEvent.change(emailField, { target: { value: 'john@example.com' } });
        fireEvent.change(passwordField, { target: { value: 'SecurePass123!' } });
        fireEvent.change(confirmPasswordField, { target: { value: 'SecurePass123!' } });

        // Trigger validation
        fireEvent.blur(emailField);
        fireEvent.blur(passwordField);
        fireEvent.blur(confirmPasswordField);

        await waitFor(() => {
            const submitButton = screen.getByRole('button', { name: /create account/i });
            expect(submitButton).toBeEnabled();
        });

        const submitButton = screen.getByRole('button', { name: /create account/i });
        fireEvent.click(submitButton);

        // Wait for success callback (after 2 second delay)
        await waitFor(() => {
            expect(mockOnSignUpSuccess).toHaveBeenCalled();
        }, { timeout: 3000 });
    });

    test('SignUpForm_shouldCallOnSignUpError_whenRegistrationFails', async () => {
        const mockOnSignUpError = jest.fn();
        const errorMessage = 'Email already exists';
        mockRegister.mockRejectedValueOnce(new Error(errorMessage));
        renderSignUpForm({ onSignUpError: mockOnSignUpError });

        // Fill and submit form
        const firstNameField = screen.getByPlaceholderText('John') as HTMLInputElement;
        const lastNameField = screen.getByPlaceholderText('Smith') as HTMLInputElement;
        const emailField = screen.getByTestId('signupEmail');
        const passwordField = screen.getByTestId('signupPassword');
        const confirmPasswordField = screen.getByTestId('confirmPassword');

        fireEvent.change(firstNameField, { target: { value: 'John' } });
        fireEvent.change(lastNameField, { target: { value: 'Doe' } });
        fireEvent.change(emailField, { target: { value: 'john@example.com' } });
        fireEvent.change(passwordField, { target: { value: 'SecurePass123!' } });
        fireEvent.change(confirmPasswordField, { target: { value: 'SecurePass123!' } });

        // Trigger validation
        fireEvent.blur(emailField);
        fireEvent.blur(passwordField);
        fireEvent.blur(confirmPasswordField);

        await waitFor(() => {
            const submitButton = screen.getByRole('button', { name: /create account/i });
            expect(submitButton).toBeEnabled();
        });

        const submitButton = screen.getByRole('button', { name: /create account/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnSignUpError).toHaveBeenCalledWith(errorMessage);
        });
    });

    // Form validation error tests
    test('SignUpForm_shouldShowErrorMessage_whenPasswordsDontMatch', async () => {
        renderSignUpForm();

        // Fill form with mismatched passwords
        const firstNameField = screen.getByPlaceholderText('John') as HTMLInputElement;
        const lastNameField = screen.getByPlaceholderText('Smith') as HTMLInputElement;
        const emailField = screen.getByTestId('signupEmail');
        const passwordField = screen.getByTestId('signupPassword');
        const confirmPasswordField = screen.getByTestId('confirmPassword');

        fireEvent.change(firstNameField, { target: { value: 'John' } });
        fireEvent.change(lastNameField, { target: { value: 'Doe' } });
        fireEvent.change(emailField, { target: { value: 'john@example.com' } });
        fireEvent.change(passwordField, { target: { value: 'SecurePass123!' } });
        fireEvent.change(confirmPasswordField, { target: { value: 'DifferentPass123!' } });

        const form = screen.getByRole('button', { name: /create account/i }).closest('form');
        fireEvent.submit(form!);

        await waitFor(() => {
            expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
        });

        expect(mockRegister).not.toHaveBeenCalled();
    });

    test('SignUpForm_shouldShowErrorMessage_whenRequiredFieldsEmpty', async () => {
        renderSignUpForm();

        const form = screen.getByRole('button', { name: /create account/i }).closest('form');
        fireEvent.submit(form!);

        await waitFor(() => {
            expect(screen.getByText('Please fill in all required fields.')).toBeInTheDocument();
        });

        expect(mockRegister).not.toHaveBeenCalled();
    });

    // Required fields configuration tests
    test('SignUpForm_shouldShowRequiredIndicators_whenFieldsAreRequired', () => {
        renderSignUpForm({
            requiredFields: {
                firstName: true,
                lastName: true,
                email: true,
                password: true,
                confirmPassword: true,
                phone: true,
                address: false
            }
        });

        // Check for required indicators (asterisks)
        expect(screen.getByText('First Name')).toBeInTheDocument();
        expect(screen.getByText('Last Name')).toBeInTheDocument();
        expect(screen.getByText('Phone Number')).toBeInTheDocument();
        
        // Required indicators should be visible (asterisks are handled by field components)
        const requiredSpans = screen.getAllByText('*');
        expect(requiredSpans.length).toBeGreaterThan(0);
    });
});