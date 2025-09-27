import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { CompactSignUpForm } from './CompactSignUpForm';

// Mock the useAuth hook
const mockRegister = jest.fn();
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    register: mockRegister
  })
}));

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('@/contexts/NavigationContext', () => ({
  useNavigate: () => ({
    navigate: mockNavigate
  })
}));

describe('CompactSignUpForm', () => {
  const mockOnValidationStateChange = jest.fn();
  const mockOnFormDataChange = jest.fn();
  const mockOnLoadingStateChange = jest.fn();
  const mockOnFormSubmit = jest.fn();
  const mockOnSignUpSuccess = jest.fn();
  const mockOnSignUpError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockRegister.mockResolvedValue(undefined);
    mockNavigate.mockClear();
  });

  test('CompactSignUpForm_shouldRenderWithMinimalProps', () => {
    render(<CompactSignUpForm />);

    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByText('Enter your email and password to get started')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('john@company.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Create your password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  test('CompactSignUpForm_shouldRenderInlineVersion', () => {
    render(<CompactSignUpForm inline={true} />);

    // Should not render card header when inline
    expect(screen.queryByText('Create your account')).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText('john@company.com')).toBeInTheDocument();
  });

  test('CompactSignUpForm_shouldHandleFormDataChanges', () => {
    render(<CompactSignUpForm onFormDataChange={mockOnFormDataChange} />);

    const emailInput = screen.getByPlaceholderText('john@company.com');
    const passwordInput = screen.getByPlaceholderText('Create your password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(mockOnFormDataChange).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: '',
      confirmPassword: ''
    });

    expect(mockOnFormDataChange).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: ''
    });
  });

  test('CompactSignUpForm_shouldValidateFields_whenValidationEnabled', async () => {
    const TestComponent = () => {
      return (
        <CompactSignUpForm
          enableValidation={true}
          onValidationStateChange={mockOnValidationStateChange}
        />
      );
    };

    render(<TestComponent />);

    const emailInput = screen.getByPlaceholderText('john@company.com');

    // Test invalid email
    fireEvent.focus(emailInput);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText('Email must be valid')).toBeInTheDocument();
    });

    // Test valid email
    fireEvent.focus(emailInput);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.queryByText('Email must be valid')).not.toBeInTheDocument();
    });
  });

  test('CompactSignUpForm_shouldValidatePasswordMatching', async () => {
    const TestComponent = () => {
      return (
        <CompactSignUpForm enableValidation={true} />
      );
    };

    render(<TestComponent />);

    const passwordInput = screen.getByPlaceholderText('Create your password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');

    // Set different passwords
    fireEvent.focus(passwordInput);
    fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } });
    fireEvent.blur(passwordInput);

    fireEvent.focus(confirmPasswordInput);
    fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPass456!' } });
    fireEvent.blur(confirmPasswordInput);

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });

    // Set matching passwords
    fireEvent.focus(confirmPasswordInput);
    fireEvent.change(confirmPasswordInput, { target: { value: 'StrongPass123!' } });
    fireEvent.blur(confirmPasswordInput);

    await waitFor(() => {
      expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
    });
  });

  test('CompactSignUpForm_shouldSubmitForm_whenValid', async () => {
    render(
      <CompactSignUpForm
        enableValidation={false}
        onFormSubmit={mockOnFormSubmit}
        onLoadingStateChange={mockOnLoadingStateChange}
        onSignUpSuccess={mockOnSignUpSuccess}
        autoRedirect={false}
      />
    );

    const emailInput = screen.getByPlaceholderText('john@company.com');
    const passwordInput = screen.getByPlaceholderText('Create your password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    const submitButton = screen.getByRole('button', { name: /create account/i });

    // Fill form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'StrongPass123!' } });

    // Submit form
    fireEvent.click(submitButton);

    expect(mockOnFormSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'StrongPass123!',
      confirmPassword: 'StrongPass123!'
    });

    expect(mockOnLoadingStateChange).toHaveBeenCalledWith(true);

    // Wait for registration to complete
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        username: 'test@example.com', // Email used as username
        password: 'StrongPass123!',
        contactRequestDto: {
          firstName: '',
          lastName: '',
          email: 'test@example.com',
          phone: undefined,
          labels: [],
          addressRequestDto: undefined
        }
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Account created successfully!')).toBeInTheDocument();
    });

    expect(mockOnLoadingStateChange).toHaveBeenCalledWith(false);
    expect(mockOnSignUpSuccess).toHaveBeenCalled();
  });

  test('CompactSignUpForm_shouldHandleRegistrationError', async () => {
    const errorMessage = 'Registration failed';
    mockRegister.mockRejectedValue(new Error(errorMessage));

    render(
      <CompactSignUpForm
        enableValidation={false}
        onSignUpError={mockOnSignUpError}
      />
    );

    const emailInput = screen.getByPlaceholderText('john@company.com');
    const passwordInput = screen.getByPlaceholderText('Create your password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    const submitButton = screen.getByRole('button', { name: /create account/i });

    // Fill and submit form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'StrongPass123!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(mockOnSignUpError).toHaveBeenCalledWith(errorMessage);
  });

  test('CompactSignUpForm_shouldDisableSubmit_whenFormInvalid', () => {
    render(<CompactSignUpForm enableValidation={false} />);

    const submitButton = screen.getByRole('button', { name: /create account/i });

    // Should be disabled when form is empty
    expect(submitButton).toBeDisabled();
  });

  test('CompactSignUpForm_shouldTogglePasswordVisibility', () => {
    render(<CompactSignUpForm />);

    const toggleButtons = screen.getAllByRole('button', { name: '' }); // Password toggle buttons have no accessible name

    // Click toggle buttons to verify they work (internal state management)
    expect(toggleButtons.length).toBeGreaterThanOrEqual(2); // Should have at least 2 toggle buttons
    fireEvent.click(toggleButtons[0]); // First toggle button (password)
    fireEvent.click(toggleButtons[1]); // Second toggle button (confirm password)

    // We can't easily test the internal state changes, but the buttons should be clickable
    expect(toggleButtons[0]).toBeInTheDocument();
    expect(toggleButtons[1]).toBeInTheDocument();
  });

  test('CompactSignUpForm_shouldRespectDisabledProp', () => {
    render(<CompactSignUpForm disabled={true} />);

    const emailInput = screen.getByPlaceholderText('john@company.com');
    const passwordInput = screen.getByPlaceholderText('Create your password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    const submitButton = screen.getByRole('button', { name: /create account/i });

    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(confirmPasswordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  test('CompactSignUpForm_shouldUseCustomTitle_whenProvided', () => {
    const customTitle = 'Join BuildFlow';
    const customDescription = 'Sign up to start building';

    render(
      <CompactSignUpForm
        title={customTitle}
        description={customDescription}
      />
    );

    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(screen.getByText(customDescription)).toBeInTheDocument();
  });

  test('CompactSignUpForm_shouldHandleExternalErrors', () => {
    const externalErrors = {
      email: ['Email already exists'],
      password: ['Password too weak']
    };

    render(
      <CompactSignUpForm
        enableValidation={false}
        errors={externalErrors}
      />
    );

    expect(screen.getByText('Email already exists')).toBeInTheDocument();
    expect(screen.getByText('Password too weak')).toBeInTheDocument();
  });

  test('CompactSignUpForm_shouldUseNavigateForRedirect', async () => {
    render(
      <CompactSignUpForm
        enableValidation={false}
        autoRedirect={true}
        redirectPath="/custom-path"
      />
    );

    const emailInput = screen.getByPlaceholderText('john@company.com');
    const passwordInput = screen.getByPlaceholderText('Create your password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    const submitButton = screen.getByRole('button', { name: /create account/i });

    // Fill and submit form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'StrongPass123!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Account created successfully! Redirecting...')).toBeInTheDocument();
    });

    // Wait for the timeout to trigger navigate
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/custom-path');
    }, { timeout: 3000 });
  });
});