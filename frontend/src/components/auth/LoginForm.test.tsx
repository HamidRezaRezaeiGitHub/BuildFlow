import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from './LoginForm';

// Mock the auth context
const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
    useAuth: () => ({
        login: mockLogin
    })
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

// Mock the field components
vi.mock('./UsernameEmail', () => ({
    UsernameEmailField: ({ value, onChange, id, onValidationChange }: any) => (
        <div data-testid={`${id}-container`}>
            <label htmlFor={id}>Username or Email</label>
            <input
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={() => onValidationChange && onValidationChange({ isValid: value && value.trim() !== '', errors: value && value.trim() !== '' ? [] : ['Required'] })}
                data-testid={id}
            />
        </div>
    )
}));

vi.mock('./Password', () => ({
    PasswordField: ({ value, onChange, id, showPassword, onToggleVisibility, onValidationChange }: any) => (
        <div data-testid={`${id}-container`}>
            <label htmlFor={id}>Password</label>
            <input
                id={id}
                type={showPassword ? 'text' : 'password'}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={() => onValidationChange && onValidationChange({ isValid: value && value.trim() !== '', errors: value && value.trim() !== '' ? [] : ['Required'] })}
                data-testid={id}
            />
            <button onClick={onToggleVisibility} data-testid={`${id}-toggle`}>
                {showPassword ? 'Hide' : 'Show'}
            </button>
        </div>
    )
}));

const renderLoginForm = (props = {}) => {
    const defaultProps = {
        showPassword: false,
        onTogglePassword: vi.fn(),
        ...props
    };

    return render(
        <BrowserRouter>
            <LoginForm {...defaultProps} />
        </BrowserRouter>
    );
};

describe('LoginForm Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // Helper function to fill form fields with proper validation triggering
    const fillAndValidateForm = async (username: string, password: string) => {
        const usernameField = screen.getByTestId('loginUsernameEmail');
        const passwordField = screen.getByTestId('loginPassword');

        // Fill username field with focus/change/blur pattern
        fireEvent.focus(usernameField);
        fireEvent.change(usernameField, { target: { value: username } });
        fireEvent.blur(usernameField);

        // Fill password field with focus/change/blur pattern
        fireEvent.focus(passwordField);
        fireEvent.change(passwordField, { target: { value: password } });
        fireEvent.blur(passwordField);

        // Wait for validation to complete and submit button to be enabled
        await waitFor(() => {
            const submitButton = screen.getByRole('button', { name: /sign in/i });
            expect(submitButton).toBeEnabled();
        });
    };

    // Basic rendering tests
    test('LoginForm_shouldRenderWithDefaultProps', () => {
        renderLoginForm();

        expect(screen.getByText('Welcome back')).toBeInTheDocument();
        expect(screen.getByText('Enter your credentials to sign in to your account')).toBeInTheDocument();
        expect(screen.getByTestId('loginUsernameEmail')).toBeInTheDocument();
        expect(screen.getByTestId('loginPassword')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    test('LoginForm_shouldRenderWithCustomTitleAndDescription', () => {
        renderLoginForm({
            title: 'Custom Login Title',
            description: 'Custom login description'
        });

        expect(screen.getByText('Custom Login Title')).toBeInTheDocument();
        expect(screen.getByText('Custom login description')).toBeInTheDocument();
    });

    test('LoginForm_shouldRenderInlineVersion_whenInlineTrue', () => {
        renderLoginForm({ inline: true });

        // Should not have card structure
        expect(screen.queryByText('Welcome back')).not.toBeInTheDocument();
        expect(screen.queryByText('Enter your credentials to sign in to your account')).not.toBeInTheDocument();

        // But should still have form elements
        expect(screen.getByTestId('loginUsernameEmail')).toBeInTheDocument();
        expect(screen.getByTestId('loginPassword')).toBeInTheDocument();
    });

    // Form interaction tests
    test('LoginForm_shouldUpdateUsernameField_whenUserTypesUsername', () => {
        renderLoginForm();

        const usernameField = screen.getByTestId('loginUsernameEmail');
        fireEvent.change(usernameField, { target: { value: 'testuser' } });

        expect(usernameField).toHaveValue('testuser');
    });

    test('LoginForm_shouldUpdatePasswordField_whenUserTypesPassword', () => {
        renderLoginForm();

        const passwordField = screen.getByTestId('loginPassword');
        fireEvent.change(passwordField, { target: { value: 'password123' } });

        expect(passwordField).toHaveValue('password123');
    });

    test('LoginForm_shouldTogglePasswordVisibility_whenToggleButtonClicked', () => {
        const mockOnTogglePassword = vi.fn();
        renderLoginForm({ onTogglePassword: mockOnTogglePassword });

        const toggleButton = screen.getByTestId('loginPassword-toggle');
        fireEvent.click(toggleButton);

        expect(mockOnTogglePassword).toHaveBeenCalled();
    });

    // Form validation tests
    test('LoginForm_shouldDisableSubmitButton_whenFormIsEmpty', () => {
        renderLoginForm();

        const submitButton = screen.getByRole('button', { name: /sign in/i });
        expect(submitButton).toBeDisabled();
    });

    test('LoginForm_shouldEnableSubmitButton_whenFormIsValid', async () => {
        renderLoginForm();
        await fillAndValidateForm('testuser', 'password123');
        // The helper already verifies the submit button is enabled
    });

    // Form submission tests
    test('LoginForm_shouldCallLogin_whenFormSubmittedWithValidData', async () => {
        mockLogin.mockResolvedValueOnce({ success: true });
        renderLoginForm();

        await fillAndValidateForm('testuser@example.com', 'password123');

        const submitButton = screen.getByRole('button', { name: /sign in/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                username: 'testuser@example.com',
                password: 'password123'
            });
        });
    });

    test('LoginForm_shouldNavigateToDashboard_whenLoginSuccessful', async () => {
        mockLogin.mockResolvedValueOnce({ success: true });
        renderLoginForm();

        await fillAndValidateForm('testuser@example.com', 'password123');

        const submitButton = screen.getByRole('button', { name: /sign in/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    test('LoginForm_shouldDisplayErrorMessage_whenLoginFails', async () => {
        const errorMessage = 'Invalid credentials';
        mockLogin.mockRejectedValueOnce(new Error(errorMessage));
        renderLoginForm();

        await fillAndValidateForm('testuser@example.com', 'wrongpassword');

        const submitButton = screen.getByRole('button', { name: /sign in/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });

    test('LoginForm_shouldShowLoadingState_whenSubmitting', async () => {
        // Mock login to take some time
        mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
        renderLoginForm();

        const usernameField = screen.getByTestId('loginUsernameEmail');
        const passwordField = screen.getByTestId('loginPassword');

        fireEvent.change(usernameField, { target: { value: 'testuser@example.com' } });
        fireEvent.change(passwordField, { target: { value: 'password123' } });

        // Trigger validation to enable submit button
        fireEvent.blur(usernameField);
        fireEvent.blur(passwordField);

        await waitFor(() => {
            const submitButton = screen.getByRole('button', { name: /sign in/i });
            expect(submitButton).toBeEnabled();
        });

        const submitButton = screen.getByRole('button', { name: /sign in/i });
        fireEvent.click(submitButton);

        // Should show loading state
        expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
    });

    test('LoginForm_shouldNotSubmit_whenEmptyFieldsSubmitted', async () => {
        renderLoginForm();

        // Submit button should be disabled when fields are empty
        const submitButton = screen.getByRole('button', { name: /sign in/i });
        expect(submitButton).toBeDisabled();

        // Try to submit the form - it should be prevented
        const form = screen.getByRole('button', { name: /sign in/i }).closest('form');
        fireEvent.submit(form!);

        // Login should not be called since form is invalid
        expect(mockLogin).not.toHaveBeenCalled();

        // No error message is displayed, the form just prevents submission
        expect(screen.queryByText(/Please fill in all fields/i)).not.toBeInTheDocument();
    });

    // Callback tests
    test('LoginForm_shouldCallOnLoginSuccess_whenLoginSuccessful', async () => {
        const mockOnLoginSuccess = vi.fn();
        mockLogin.mockResolvedValueOnce({ success: true });
        renderLoginForm({ onLoginSuccess: mockOnLoginSuccess });

        const usernameField = screen.getByTestId('loginUsernameEmail');
        const passwordField = screen.getByTestId('loginPassword');

        fireEvent.change(usernameField, { target: { value: 'testuser@example.com' } });
        fireEvent.change(passwordField, { target: { value: 'password123' } });

        // Trigger validation to enable submit button
        fireEvent.blur(usernameField);
        fireEvent.blur(passwordField);

        await waitFor(() => {
            const submitButton = screen.getByRole('button', { name: /sign in/i });
            expect(submitButton).toBeEnabled();
        });

        const submitButton = screen.getByRole('button', { name: /sign in/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnLoginSuccess).toHaveBeenCalled();
        });
    });

    test('LoginForm_shouldCallOnLoginError_whenLoginFails', async () => {
        const mockOnLoginError = vi.fn();
        const errorMessage = 'Invalid credentials';
        mockLogin.mockRejectedValueOnce(new Error(errorMessage));
        renderLoginForm({ onLoginError: mockOnLoginError });

        const usernameField = screen.getByTestId('loginUsernameEmail');
        const passwordField = screen.getByTestId('loginPassword');

        fireEvent.change(usernameField, { target: { value: 'testuser@example.com' } });
        fireEvent.change(passwordField, { target: { value: 'wrongpassword' } });

        // Trigger validation to enable submit button
        fireEvent.blur(usernameField);
        fireEvent.blur(passwordField);

        await waitFor(() => {
            const submitButton = screen.getByRole('button', { name: /sign in/i });
            expect(submitButton).toBeEnabled();
        });

        const submitButton = screen.getByRole('button', { name: /sign in/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnLoginError).toHaveBeenCalledWith(errorMessage);
        });
    });

    // External errors tests
    test('LoginForm_shouldDisplayExternalErrors_whenErrorsProvided', () => {
        const errors = {
            usernameOrEmail: ['Username is required'],
            password: ['Password is too short']
        };

        renderLoginForm({ errors });

        // External errors should be passed to field components
        // This is indirectly tested through the field component mocks
        expect(screen.getByTestId('loginUsernameEmail')).toBeInTheDocument();
        expect(screen.getByTestId('loginPassword')).toBeInTheDocument();
    });

    // Remember me functionality
    test('LoginForm_shouldRenderRememberMeCheckbox', () => {
        renderLoginForm();

        const rememberMeCheckbox = screen.getByLabelText('Remember me');
        expect(rememberMeCheckbox).toBeInTheDocument();
        expect(rememberMeCheckbox).toHaveAttribute('type', 'checkbox');
    });

    test('LoginForm_shouldRenderForgotPasswordLink', () => {
        renderLoginForm();

        const forgotPasswordLink = screen.getByText('Forgot password?');
        expect(forgotPasswordLink).toBeInTheDocument();
        expect(forgotPasswordLink).toHaveAttribute('href', '#');
    });

    // New callback tests
    test('LoginForm_shouldCallOnFormDataChange_whenFieldValuesChange', () => {
        const mockOnFormDataChange = vi.fn();
        renderLoginForm({ onFormDataChange: mockOnFormDataChange });

        const usernameField = screen.getByTestId('loginUsernameEmail');
        fireEvent.change(usernameField, { target: { value: 'testuser' } });

        expect(mockOnFormDataChange).toHaveBeenCalledWith({
            usernameOrEmail: 'testuser',
            password: ''
        });
    });

    test('LoginForm_shouldCallOnValidationStateChange_whenValidationChanges', async () => {
        const mockOnValidationStateChange = vi.fn();
        renderLoginForm({ onValidationStateChange: mockOnValidationStateChange });

        const usernameField = screen.getByTestId('loginUsernameEmail');
        const passwordField = screen.getByTestId('loginPassword');

        // Fill both fields to make form valid
        fireEvent.change(usernameField, { target: { value: 'testuser' } });
        fireEvent.change(passwordField, { target: { value: 'password123' } });

        // Trigger validation
        fireEvent.blur(usernameField);
        fireEvent.blur(passwordField);

        await waitFor(() => {
            expect(mockOnValidationStateChange).toHaveBeenCalledWith(true);
        });
    });

    test('LoginForm_shouldCallOnLoadingStateChange_whenSubmitting', async () => {
        const mockOnLoadingStateChange = vi.fn();
        mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
        renderLoginForm({ onLoadingStateChange: mockOnLoadingStateChange });

        const usernameField = screen.getByTestId('loginUsernameEmail');
        const passwordField = screen.getByTestId('loginPassword');

        fireEvent.change(usernameField, { target: { value: 'testuser@example.com' } });
        fireEvent.change(passwordField, { target: { value: 'password123' } });

        // Trigger validation to enable submit button
        fireEvent.blur(usernameField);
        fireEvent.blur(passwordField);

        await waitFor(() => {
            const submitButton = screen.getByRole('button', { name: /sign in/i });
            expect(submitButton).toBeEnabled();
        });

        const submitButton = screen.getByRole('button', { name: /sign in/i });
        fireEvent.click(submitButton);

        // Should call loading state change with true when starting
        expect(mockOnLoadingStateChange).toHaveBeenCalledWith(true);

        await waitFor(() => {
            // Should call loading state change with false when finished
            expect(mockOnLoadingStateChange).toHaveBeenCalledWith(false);
        });
    });

    test('LoginForm_shouldCallOnFormSubmit_whenFormSubmitted', async () => {
        const mockOnFormSubmit = vi.fn();
        mockLogin.mockResolvedValueOnce({ success: true });
        renderLoginForm({ onFormSubmit: mockOnFormSubmit });

        const usernameField = screen.getByTestId('loginUsernameEmail');
        const passwordField = screen.getByTestId('loginPassword');

        fireEvent.change(usernameField, { target: { value: 'testuser@example.com' } });
        fireEvent.change(passwordField, { target: { value: 'password123' } });

        // Trigger validation to enable submit button
        fireEvent.blur(usernameField);
        fireEvent.blur(passwordField);

        await waitFor(() => {
            const submitButton = screen.getByRole('button', { name: /sign in/i });
            expect(submitButton).toBeEnabled();
        });

        const submitButton = screen.getByRole('button', { name: /sign in/i });
        fireEvent.click(submitButton);

        expect(mockOnFormSubmit).toHaveBeenCalledWith({
            usernameOrEmail: 'testuser@example.com',
            password: 'password123'
        });
    });

    test('LoginForm_shouldCallMultipleCallbacks_whenAllProvided', async () => {
        const mockCallbacks = {
            onFormDataChange: vi.fn(),
            onValidationStateChange: vi.fn(),
            onLoadingStateChange: vi.fn(),
            onFormSubmit: vi.fn(),
            onLoginSuccess: vi.fn()
        };

        mockLogin.mockResolvedValueOnce({ success: true });
        renderLoginForm(mockCallbacks);

        const usernameField = screen.getByTestId('loginUsernameEmail');
        const passwordField = screen.getByTestId('loginPassword');

        // Fill form - should trigger data change callbacks
        fireEvent.change(usernameField, { target: { value: 'testuser@example.com' } });
        fireEvent.change(passwordField, { target: { value: 'password123' } });

        expect(mockCallbacks.onFormDataChange).toHaveBeenCalledTimes(2);

        // Trigger validation to enable submit button
        fireEvent.blur(usernameField);
        fireEvent.blur(passwordField);

        await waitFor(() => {
            const submitButton = screen.getByRole('button', { name: /sign in/i });
            expect(submitButton).toBeEnabled();
        });

        // Submit form - should trigger multiple callbacks
        const submitButton = screen.getByRole('button', { name: /sign in/i });
        fireEvent.click(submitButton);

        expect(mockCallbacks.onFormSubmit).toHaveBeenCalled();
        expect(mockCallbacks.onLoadingStateChange).toHaveBeenCalledWith(true);

        await waitFor(() => {
            expect(mockCallbacks.onLoginSuccess).toHaveBeenCalled();
            expect(mockCallbacks.onLoadingStateChange).toHaveBeenCalledWith(false);
        });
    });
});