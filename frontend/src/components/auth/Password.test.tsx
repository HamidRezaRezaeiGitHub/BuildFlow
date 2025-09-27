import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { PasswordField } from './Password';

describe('PasswordField', () => {
    const mockOnChange = jest.fn();
    const mockOnToggleVisibility = jest.fn();
    const mockOnValidationChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('PasswordField_shouldRenderWithMinimalProps', () => {
        render(
            <PasswordField
                value=""
                onChange={mockOnChange}
                showPassword={false}
                onToggleVisibility={mockOnToggleVisibility}
            />
        );

        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument(); // visibility toggle button
    });

    test('PasswordField_shouldShowRequiredIndicator_whenValidationModeRequired', () => {
        render(
            <PasswordField
                value=""
                onChange={mockOnChange}
                showPassword={false}
                onToggleVisibility={mockOnToggleVisibility}
                enableValidation={true}
                validationMode="required"
            />
        );

        expect(screen.getByText('*')).toBeInTheDocument();
    });

    test('PasswordField_shouldCallOnChange_whenValueChanges', () => {
        render(
            <PasswordField
                value=""
                onChange={mockOnChange}
                showPassword={false}
                onToggleVisibility={mockOnToggleVisibility}
            />
        );

        const input = screen.getByPlaceholderText('Enter your password');
        fireEvent.change(input, { target: { value: 'newpassword' } });

        expect(mockOnChange).toHaveBeenCalledWith('newpassword');
    });

    test('PasswordField_shouldToggleVisibility_whenToggleButtonClicked', () => {
        render(
            <PasswordField
                value="password123"
                onChange={mockOnChange}
                showPassword={false}
                onToggleVisibility={mockOnToggleVisibility}
            />
        );

        const toggleButton = screen.getByRole('button');
        fireEvent.click(toggleButton);

        expect(mockOnToggleVisibility).toHaveBeenCalled();
    });

    test('PasswordField_shouldShowTextInput_whenShowPasswordTrue', () => {
        render(
            <PasswordField
                value="password123"
                onChange={mockOnChange}
                showPassword={true}
                onToggleVisibility={mockOnToggleVisibility}
            />
        );

        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('type', 'text');
    });

    test('PasswordField_shouldShowPasswordInput_whenShowPasswordFalse', () => {
        const { container } = render(
            <PasswordField
                value="password123"
                onChange={mockOnChange}
                showPassword={false}
                onToggleVisibility={mockOnToggleVisibility}
            />
        );

        const input = container.querySelector('input[type="password"]');
        expect(input).toBeInTheDocument();
    });

    test('PasswordField_shouldValidateSignupPassword_whenValidationEnabled', async () => {
        const TestComponent = () => {
            const [value, setValue] = React.useState('');
            return (
                <PasswordField
                    value={value}
                    onChange={setValue}
                    showPassword={false}
                    onToggleVisibility={mockOnToggleVisibility}
                    enableValidation={true}
                    validationMode="required"
                    validationType="signup"
                    onValidationChange={mockOnValidationChange}
                />
            );
        };

        render(<TestComponent />);
        const input = screen.getByPlaceholderText('Enter your password');

        // Test weak password (should show multiple errors)
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'weak' } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.getByText(/Password must be at least \d+ characters long/)).toBeInTheDocument();
        });
    });

    test('PasswordField_shouldValidateLoginPassword_whenValidationEnabled', async () => {
        const TestComponent = () => {
            const [value, setValue] = React.useState('');
            return (
                <PasswordField
                    value={value}
                    onChange={setValue}
                    showPassword={false}
                    onToggleVisibility={mockOnToggleVisibility}
                    enableValidation={true}
                    validationMode="required"
                    validationType="login"
                    onValidationChange={mockOnValidationChange}
                />
            );
        };

        render(<TestComponent />);
        const input = screen.getByPlaceholderText('Enter your password');

        // Test empty password
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: '' } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.getByText('Password is required')).toBeInTheDocument();
        });

        // Test valid length for login (should not show complex validation errors)
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'simplepass' } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.queryByText(/Password must contain/)).not.toBeInTheDocument();
        });
    });

    test('PasswordField_shouldAcceptStrongPassword_forSignup', async () => {
        const TestComponent = () => {
            const [value, setValue] = React.useState('');
            return (
                <PasswordField
                    value={value}
                    onChange={setValue}
                    showPassword={false}
                    onToggleVisibility={mockOnToggleVisibility}
                    enableValidation={true}
                    validationMode="required"
                    validationType="signup"
                    onValidationChange={mockOnValidationChange}
                />
            );
        };

        render(<TestComponent />);
        const input = screen.getByPlaceholderText('Enter your password');

        // Test strong password
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'StrongPass123!' } });
        fireEvent.blur(input);

        await waitFor(() => {
            // Should not show any error messages for a strong password
            expect(screen.queryByText(/Password must/)).not.toBeInTheDocument();
        });
    });

    test('PasswordField_shouldShowError_whenExternalErrorsProvided', () => {
        render(
            <PasswordField
                value=""
                onChange={mockOnChange}
                showPassword={false}
                onToggleVisibility={mockOnToggleVisibility}
                errors={['External password error']}
            />
        );

        expect(screen.getByText('External password error')).toBeInTheDocument();
    });

    test('PasswordField_shouldApplyErrorStyling_whenHasErrors', () => {
        const { container } = render(
            <PasswordField
                value=""
                onChange={mockOnChange}
                showPassword={false}
                onToggleVisibility={mockOnToggleVisibility}
                errors={['Test error']}
            />
        );

        const input = container.querySelector('input');
        expect(input).toHaveClass('border-red-500');
    });

    test('PasswordField_shouldNotShowValidationErrors_whenValidationDisabled', async () => {
        const TestComponent = () => {
            const [value, setValue] = React.useState('');
            return (
                <PasswordField
                    value={value}
                    onChange={setValue}
                    showPassword={false}
                    onToggleVisibility={mockOnToggleVisibility}
                    enableValidation={false}
                    validationMode="required"
                />
            );
        };

        render(<TestComponent />);
        const input = screen.getByPlaceholderText('Enter your password');

        // Even with weak password, should not show errors when validation disabled
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'weak' } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.queryByText(/Password must/)).not.toBeInTheDocument();
        });
    });
});