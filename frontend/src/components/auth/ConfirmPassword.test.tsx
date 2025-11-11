import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { ConfirmPasswordField } from './ConfirmPassword';
import { beforeEach, describe, expect, test, vi } from 'vitest';

describe('ConfirmPasswordField', () => {
    const mockOnChange = vi.fn();
    const mockOnToggleVisibility = vi.fn();
    const mockOnValidationChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('ConfirmPasswordField_shouldRenderWithMinimalProps', () => {
        render(
            <ConfirmPasswordField
                value=""
                onChange={mockOnChange}
                showPassword={false}
                onToggleVisibility={mockOnToggleVisibility}
                originalPassword=""
            />
        );

        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument(); // visibility toggle button
    });

    test('ConfirmPasswordField_shouldShowRequiredIndicator_whenValidationModeRequired', () => {
        render(
            <ConfirmPasswordField
                value=""
                onChange={mockOnChange}
                showPassword={false}
                onToggleVisibility={mockOnToggleVisibility}
                originalPassword=""
                enableValidation={true}
                validationMode="required"
            />
        );

        expect(screen.getByText('*')).toBeInTheDocument();
    });

    test('ConfirmPasswordField_shouldCallOnChange_whenValueChanges', () => {
        render(
            <ConfirmPasswordField
                value=""
                onChange={mockOnChange}
                showPassword={false}
                onToggleVisibility={mockOnToggleVisibility}
                originalPassword="original123"
            />
        );

        const input = screen.getByPlaceholderText('Confirm your password');
        fireEvent.change(input, { target: { value: 'newpassword' } });

        expect(mockOnChange).toHaveBeenCalledWith('newpassword');
    });

    test('ConfirmPasswordField_shouldToggleVisibility_whenToggleButtonClicked', () => {
        render(
            <ConfirmPasswordField
                value="password123"
                onChange={mockOnChange}
                showPassword={false}
                onToggleVisibility={mockOnToggleVisibility}
                originalPassword="password123"
            />
        );

        const toggleButton = screen.getByRole('button');
        fireEvent.click(toggleButton);

        expect(mockOnToggleVisibility).toHaveBeenCalled();
    });

    test('ConfirmPasswordField_shouldShowTextInput_whenShowPasswordTrue', () => {
        render(
            <ConfirmPasswordField
                value="password123"
                onChange={mockOnChange}
                showPassword={true}
                onToggleVisibility={mockOnToggleVisibility}
                originalPassword="password123"
            />
        );

        const input = screen.getByPlaceholderText('Confirm your password');
        expect(input).toHaveAttribute('type', 'text');
    });

    test('ConfirmPasswordField_shouldShowPasswordInput_whenShowPasswordFalse', () => {
        const { container } = render(
            <ConfirmPasswordField
                value="password123"
                onChange={mockOnChange}
                showPassword={false}
                onToggleVisibility={mockOnToggleVisibility}
                originalPassword="password123"
            />
        );

        const input = container.querySelector('input[type="password"]');
        expect(input).toBeInTheDocument();
    });

    test('ConfirmPasswordField_shouldShowMatchingError_whenPasswordsDontMatch', async () => {
        const TestComponent = () => {
            const [value, setValue] = React.useState('');
            return (
                <ConfirmPasswordField
                    value={value}
                    onChange={setValue}
                    showPassword={false}
                    onToggleVisibility={mockOnToggleVisibility}
                    originalPassword="original123"
                    enableValidation={true}
                    validationMode="required"
                    onValidationChange={mockOnValidationChange}
                />
            );
        };

        render(<TestComponent />);
        const input = screen.getByPlaceholderText('Confirm your password');

        // Test mismatched password
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'different456' } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
        });
    });

    test('ConfirmPasswordField_shouldNotShowError_whenPasswordsMatch', async () => {
        const TestComponent = () => {
            const [value, setValue] = React.useState('');
            return (
                <ConfirmPasswordField
                    value={value}
                    onChange={setValue}
                    showPassword={false}
                    onToggleVisibility={mockOnToggleVisibility}
                    originalPassword="matching123"
                    enableValidation={true}
                    validationMode="required"
                    onValidationChange={mockOnValidationChange}
                />
            );
        };

        render(<TestComponent />);
        const input = screen.getByPlaceholderText('Confirm your password');

        // Test matching password
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'matching123' } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
        });
    });

    test('ConfirmPasswordField_shouldShowRequiredError_whenEmpty', async () => {
        const TestComponent = () => {
            const [value, setValue] = React.useState('');
            return (
                <ConfirmPasswordField
                    value={value}
                    onChange={setValue}
                    showPassword={false}
                    onToggleVisibility={mockOnToggleVisibility}
                    originalPassword="original123"
                    enableValidation={true}
                    validationMode="required"
                    onValidationChange={mockOnValidationChange}
                />
            );
        };

        render(<TestComponent />);
        const input = screen.getByPlaceholderText('Confirm your password');

        // Test empty field
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: '' } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.getByText('Password confirmation is required')).toBeInTheDocument();
        });
    });

    test('ConfirmPasswordField_shouldRevalidate_whenOriginalPasswordChanges', async () => {
        const TestComponent = () => {
            const [confirmValue, setConfirmValue] = React.useState('password123');
            const [originalPassword, setOriginalPassword] = React.useState('password123');

            return (
                <div>
                    <ConfirmPasswordField
                        value={confirmValue}
                        onChange={setConfirmValue}
                        showPassword={false}
                        onToggleVisibility={mockOnToggleVisibility}
                        originalPassword={originalPassword}
                        enableValidation={true}
                        validationMode="required"
                        onValidationChange={mockOnValidationChange}
                    />
                    <button
                        data-testid="change-original"
                        onClick={() => setOriginalPassword('neworiginal456')}
                    >
                        Change Original
                    </button>
                </div>
            );
        };

        render(<TestComponent />);
        const input = screen.getByPlaceholderText('Confirm your password');

        // Initially passwords match - focus to mark as touched
        fireEvent.focus(input);
        fireEvent.blur(input);

        // Should not show error initially
        await waitFor(() => {
            expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
        });

        // Change the original password - now they don't match
        const changeButton = screen.getByTestId('change-original');
        fireEvent.click(changeButton);

        // Should now show mismatch error
        await waitFor(() => {
            expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
        });
    });

    test('ConfirmPasswordField_shouldShowError_whenExternalErrorsProvided', () => {
        render(
            <ConfirmPasswordField
                value=""
                onChange={mockOnChange}
                showPassword={false}
                onToggleVisibility={mockOnToggleVisibility}
                originalPassword=""
                errors={['External password error']}
            />
        );

        expect(screen.getByText('External password error')).toBeInTheDocument();
    });

    test('ConfirmPasswordField_shouldApplyErrorStyling_whenHasErrors', () => {
        const { container } = render(
            <ConfirmPasswordField
                value=""
                onChange={mockOnChange}
                showPassword={false}
                onToggleVisibility={mockOnToggleVisibility}
                originalPassword=""
                errors={['Test error']}
            />
        );

        const input = container.querySelector('input');
        expect(input).toHaveClass('border-red-500');
    });

    test('ConfirmPasswordField_shouldNotShowValidationErrors_whenValidationDisabled', async () => {
        const TestComponent = () => {
            const [value, setValue] = React.useState('');
            return (
                <ConfirmPasswordField
                    value={value}
                    onChange={setValue}
                    showPassword={false}
                    onToggleVisibility={mockOnToggleVisibility}
                    originalPassword="original123"
                    enableValidation={false}
                    validationMode="required"
                />
            );
        };

        render(<TestComponent />);
        const input = screen.getByPlaceholderText('Confirm your password');

        // Even with mismatched password, should not show errors when validation disabled
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'different456' } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
        });
    });

    test('ConfirmPasswordField_shouldHandleEmptyOriginalPassword', async () => {
        const TestComponent = () => {
            const [value, setValue] = React.useState('somevalue');
            return (
                <ConfirmPasswordField
                    value={value}
                    onChange={setValue}
                    showPassword={false}
                    onToggleVisibility={mockOnToggleVisibility}
                    originalPassword=""
                    enableValidation={true}
                    validationMode="required"
                    onValidationChange={mockOnValidationChange}
                />
            );
        };

        render(<TestComponent />);
        const input = screen.getByPlaceholderText('Confirm your password');

        // Test with empty original password
        fireEvent.focus(input);
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
        });
    });
});