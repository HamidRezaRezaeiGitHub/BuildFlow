import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { UsernameEmailField } from './UsernameEmail';
import { beforeEach, describe, expect, test, vi } from 'vitest';

describe('UsernameEmailField', () => {
    const mockOnChange = vi.fn();
    const mockOnValidationChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('UsernameEmailField_shouldRenderWithMinimalProps', () => {
        render(
            <UsernameEmailField
                value=""
                onChange={mockOnChange}
            />
        );

        expect(screen.getByLabelText('Username or Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('username or email@company.com')).toBeInTheDocument();
    });

    test('UsernameEmailField_shouldShowRequiredIndicator_whenValidationModeRequired', () => {
        render(
            <UsernameEmailField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
            />
        );

        expect(screen.getByText('*')).toBeInTheDocument();
    });

    test('UsernameEmailField_shouldCallOnChange_whenValueChanges', () => {
        render(
            <UsernameEmailField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'test@example.com' } });

        expect(mockOnChange).toHaveBeenCalledWith('test@example.com');
    });

    test('UsernameEmailField_shouldValidateUsernameEmail_whenValidationEnabled', async () => {
        const TestComponent = () => {
            const [value, setValue] = React.useState('');
            return (
                <UsernameEmailField
                    value={value}
                    onChange={setValue}
                    enableValidation={true}
                    validationMode="required"
                    onValidationChange={mockOnValidationChange}
                />
            );
        };

        render(<TestComponent />);

        const input = screen.getByRole('textbox');
        
        // Test too short username/email
        fireEvent.focus(input); // Focus first to mark as touched
        fireEvent.change(input, { target: { value: 'ab' } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.getByText('Username or email must be at least 3 characters long')).toBeInTheDocument();
        });

        // Test valid username
        fireEvent.focus(input); // Focus again for consistency
        fireEvent.change(input, { target: { value: 'validuser' } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.queryByText('Username or email must be at least 3 characters long')).not.toBeInTheDocument();
        });

        // Test valid email
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'test@example.com' } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.queryByText('Username or email must be at least 3 characters long')).not.toBeInTheDocument();
        });
    });

    test('UsernameEmailField_shouldShowError_whenExternalErrorsProvided', () => {
        render(
            <UsernameEmailField
                value=""
                onChange={mockOnChange}
                errors={['External error message']}
            />
        );

        expect(screen.getByText('External error message')).toBeInTheDocument();
    });

    test('UsernameEmailField_shouldApplyErrorStyling_whenHasErrors', () => {
        render(
            <UsernameEmailField
                value=""
                onChange={mockOnChange}
                errors={['Test error']}
            />
        );

        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('border-red-500');
    });

    test('UsernameEmailField_shouldAcceptCustomPlaceholder', () => {
        render(
            <UsernameEmailField
                value=""
                onChange={mockOnChange}
                placeholder="Enter username or email"
            />
        );

        expect(screen.getByPlaceholderText('Enter username or email')).toBeInTheDocument();
    });

    test('UsernameEmailField_shouldBeDisabled_whenDisabledPropTrue', () => {
        render(
            <UsernameEmailField
                value=""
                onChange={mockOnChange}
                disabled={true}
            />
        );

        const input = screen.getByRole('textbox');
        expect(input).toBeDisabled();
    });

    test('UsernameEmailField_shouldShowUserIcon_forUsernameInput', () => {
        render(
            <UsernameEmailField
                value="testuser"
                onChange={mockOnChange}
            />
        );

        // The User icon should be present when the value doesn't contain @
        const userIcon = document.querySelector('.lucide-user');
        expect(userIcon).toBeInTheDocument();
    });

    test('UsernameEmailField_shouldShowMailIcon_forEmailInput', () => {
        render(
            <UsernameEmailField
                value="test@example.com"
                onChange={mockOnChange}
            />
        );

        // The Mail icon should be present when the value contains @
        const mailIcon = document.querySelector('.lucide-mail');
        expect(mailIcon).toBeInTheDocument();
    });

    test('UsernameEmailField_shouldUseCustomId_whenIdProvided', () => {
        render(
            <UsernameEmailField
                id="customUsernameEmail"
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('id', 'customUsernameEmail');
    });

    test('UsernameEmailField_shouldNotValidate_whenValidationDisabled', async () => {
        const TestComponent = () => {
            const [value, setValue] = React.useState('');
            return (
                <UsernameEmailField
                    value={value}
                    onChange={setValue}
                    enableValidation={false}
                    onValidationChange={mockOnValidationChange}
                />
            );
        };

        render(<TestComponent />);

        const input = screen.getByRole('textbox');
        
        // Even with short input, should not show validation errors
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'ab' } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.queryByText('Username or email must be at least 3 characters long')).not.toBeInTheDocument();
        });
    });
});