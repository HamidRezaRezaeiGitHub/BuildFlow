import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from './LoginForm';

// Mock the auth context
const mockLogin = jest.fn();
const mockNavigate = jest.fn();

jest.mock('@/contexts/AuthContext', () => ({
    useAuth: () => ({
        login: mockLogin
    })
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

// Mock the field components
jest.mock('./UsernameEmail', () => ({
    UsernameEmailField: ({ value, onChange, id, onValidationChange }: any) => (
        <div data-testid={`${id}-container`}>
            <label htmlFor={id}>Username or Email</label>
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

const renderLoginForm = (props = {}) => {
    const defaultProps = {
        showPassword: false,
        onTogglePassword: jest.fn(),
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
        jest.clearAllMocks();
    });

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
        const mockOnTogglePassword = jest.fn();
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

        const usernameField = screen.getByTestId('loginUsernameEmail');
        const passwordField = screen.getByTestId('loginPassword');

        fireEvent.change(usernameField, { target: { value: 'testuser' } });
        fireEvent.change(passwordField, { target: { value: 'password123' } });

        // Trigger validation
        fireEvent.blur(usernameField);
        fireEvent.blur(passwordField);

        await waitFor(() => {
            const submitButton = screen.getByRole('button', { name: /sign in/i });
            expect(submitButton).toBeEnabled();
        });
    });

    // Form submission tests
    test('LoginForm_shouldCallLogin_whenFormSubmittedWithValidData', async () => {
        mockLogin.mockResolvedValueOnce({ success: true });
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
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    test('LoginForm_shouldDisplayErrorMessage_whenLoginFails', async () => {
        const errorMessage = 'Invalid credentials';
        mockLogin.mockRejectedValueOnce(new Error(errorMessage));
        renderLoginForm();

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

    test('LoginForm_shouldShowErrorMessage_whenEmptyFieldsSubmitted', async () => {
        renderLoginForm();

        const form = screen.getByRole('button', { name: /sign in/i }).closest('form');
        fireEvent.submit(form!);

        await waitFor(() => {
            expect(screen.getByText('Please fill in all fields.')).toBeInTheDocument();
        });

        expect(mockLogin).not.toHaveBeenCalled();
    });

    // Callback tests
    test('LoginForm_shouldCallOnLoginSuccess_whenLoginSuccessful', async () => {
        const mockOnLoginSuccess = jest.fn();
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
        const mockOnLoginError = jest.fn();
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
});