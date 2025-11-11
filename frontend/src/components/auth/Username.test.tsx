import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { UsernameField } from './Username';
import { beforeEach, describe, expect, test, vi } from 'vitest';

describe('UsernameField', () => {
    const mockOnChange = vi.fn();
    const mockOnValidationChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('UsernameField_shouldRenderWithMinimalProps', () => {
        render(
            <UsernameField
                value=""
                onChange={mockOnChange}
            />
        );

        expect(screen.getByLabelText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('john_doe')).toBeInTheDocument();
    });

    test('UsernameField_shouldShowRequiredIndicator_whenValidationModeRequired', () => {
        render(
            <UsernameField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
            />
        );

        expect(screen.getByText('*')).toBeInTheDocument();
    });

    test('UsernameField_shouldCallOnChange_whenValueChanges', () => {
        render(
            <UsernameField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'testuser' } });

        expect(mockOnChange).toHaveBeenCalledWith('testuser');
    });

    test('UsernameField_shouldValidateUsername_whenValidationEnabled', async () => {
        const TestComponent = () => {
            const [value, setValue] = React.useState('');
            return (
                <UsernameField
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
        
        // Test too short username
        fireEvent.focus(input); // Focus first to mark as touched
        fireEvent.change(input, { target: { value: 'ab' } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.getByText('Username must be at least 3 characters long')).toBeInTheDocument();
        });

        // Test valid username
        fireEvent.focus(input); // Focus again for consistency
        fireEvent.change(input, { target: { value: 'validuser' } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.queryByText('Username must be at least 3 characters long')).not.toBeInTheDocument();
        });
    });

    test('UsernameField_shouldShowError_whenExternalErrorsProvided', () => {
        render(
            <UsernameField
                value=""
                onChange={mockOnChange}
                errors={['External error message']}
            />
        );

        expect(screen.getByText('External error message')).toBeInTheDocument();
    });

    test('UsernameField_shouldApplyErrorStyling_whenHasErrors', () => {
        render(
            <UsernameField
                value=""
                onChange={mockOnChange}
                errors={['Test error']}
            />
        );

        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('border-red-500');
    });
});