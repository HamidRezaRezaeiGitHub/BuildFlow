import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { PhoneField } from './Phone';
import { beforeEach, describe, expect, test, vi } from 'vitest';

describe('PhoneField', () => {
    const mockOnChange = vi.fn();
    const mockOnValidationChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('PhoneField_shouldRenderWithMinimalProps', () => {
        render(
            <PhoneField
                value=""
                onChange={mockOnChange}
            />
        );

        expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('+1 (555) 123-4567')).toBeInTheDocument();
    });

    test('PhoneField_shouldShowRequiredIndicator_whenValidationModeRequired', () => {
        render(
            <PhoneField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
            />
        );

        expect(screen.getByText('*')).toBeInTheDocument();
    });

    test('PhoneField_shouldCallOnChange_whenValueChanges', () => {
        render(
            <PhoneField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '+1 (555) 123-4567' } });

        expect(mockOnChange).toHaveBeenCalledWith('+1 (555) 123-4567');
    });

    test('PhoneField_shouldValidateRequired_whenValidationEnabled', async () => {
        const TestComponent = () => {
            const [value, setValue] = React.useState('');
            return (
                <PhoneField
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
        
        // Test empty value (should show required error)
        fireEvent.focus(input);
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.getByText('Phone number is required')).toBeInTheDocument();
        });

        // Test valid value
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: '+1 (555) 123-4567' } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.queryByText('Phone number is required')).not.toBeInTheDocument();
        });
    });

    test('PhoneField_shouldValidatePhoneFormat_whenValidationEnabled', async () => {
        const TestComponent = () => {
            const [value, setValue] = React.useState('');
            return (
                <PhoneField
                    value={value}
                    onChange={setValue}
                    enableValidation={true}
                    validationMode="optional"
                    onValidationChange={mockOnValidationChange}
                />
            );
        };

        render(<TestComponent />);

        const input = screen.getByRole('textbox');
        
        // Test invalid phone (too short)
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: '123' } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.getByText('Phone number must be valid (10-15 digits)')).toBeInTheDocument();
        });

        // Test valid phone (10 digits)
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: '5551234567' } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.queryByText('Phone number must be valid (10-15 digits)')).not.toBeInTheDocument();
        });

        // Test valid phone with formatting
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: '+1 (555) 123-4567' } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.queryByText('Phone number must be valid (10-15 digits)')).not.toBeInTheDocument();
        });

        // Test international format (15 digits)
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: '+44 20 7946 0958' } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.queryByText('Phone number must be valid (10-15 digits)')).not.toBeInTheDocument();
        });

        // Test too long (16 digits - invalid)
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: '+1234567890123456' } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.getByText('Phone number must be valid (10-15 digits)')).toBeInTheDocument();
        });
    });

    test('PhoneField_shouldValidateMaxLength_whenValidationEnabled', async () => {
        const TestComponent = () => {
            const [value, setValue] = React.useState('');
            return (
                <PhoneField
                    value={value}
                    onChange={setValue}
                    enableValidation={true}
                    validationMode="optional"
                    onValidationChange={mockOnValidationChange}
                />
            );
        };

        render(<TestComponent />);

        const input = screen.getByRole('textbox');
        
        // Test value exceeding 20 characters
        const longPhone = '+1 (555) 123-4567 ext 12345';  // 26 characters
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: longPhone } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.getByText('Phone number must not exceed 20 characters')).toBeInTheDocument();
        });

        // Test valid length (exactly 20 characters)
        const validPhone = '+1 (555) 123-4567 x1';  // 20 characters
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: validPhone } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.queryByText('Phone number must not exceed 20 characters')).not.toBeInTheDocument();
        });
    });

    test('PhoneField_shouldValidateBothRequiredAndFormat_whenBothApply', async () => {
        const TestComponent = () => {
            const [value, setValue] = React.useState('');
            return (
                <PhoneField
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
        
        // Test empty value first (should show required error)
        fireEvent.focus(input);
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.getByText('Phone number is required')).toBeInTheDocument();
        });

        // Test invalid format
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: '123' } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.getByText('Phone number must be valid (10-15 digits)')).toBeInTheDocument();
        });

        // Test valid value
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: '+1 (555) 123-4567' } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.queryByText('Phone number is required')).not.toBeInTheDocument();
            expect(screen.queryByText('Phone number must be valid (10-15 digits)')).not.toBeInTheDocument();
        });
    });

    test('PhoneField_shouldNotValidate_whenValidationDisabled', async () => {
        const TestComponent = () => {
            const [value, setValue] = React.useState('');
            return (
                <PhoneField
                    value={value}
                    onChange={setValue}
                    enableValidation={false}
                    validationMode="required"
                    onValidationChange={mockOnValidationChange}
                />
            );
        };

        render(<TestComponent />);

        const input = screen.getByRole('textbox');
        
        // Test empty value (should not show required error when validation disabled)
        fireEvent.focus(input);
        fireEvent.blur(input);

        // Wait a bit and ensure no validation errors appear
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(screen.queryByText('Phone number is required')).not.toBeInTheDocument();

        // Test invalid format (should not show format error when validation disabled)
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: '123' } });
        fireEvent.blur(input);

        await new Promise(resolve => setTimeout(resolve, 100));
        expect(screen.queryByText('Phone number must be valid (10-15 digits)')).not.toBeInTheDocument();
    });

    test('PhoneField_shouldShowError_whenExternalErrorsProvided', () => {
        render(
            <PhoneField
                value=""
                onChange={mockOnChange}
                errors={['External error message']}
            />
        );

        expect(screen.getByText('External error message')).toBeInTheDocument();
    });

    test('PhoneField_shouldApplyErrorStyling_whenHasErrors', () => {
        render(
            <PhoneField
                value=""
                onChange={mockOnChange}
                errors={['Test error']}
            />
        );

        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('border-red-500');
    });

    test('PhoneField_shouldAcceptCustomPlaceholder', () => {
        render(
            <PhoneField
                value=""
                onChange={mockOnChange}
                placeholder="Enter your phone number"
            />
        );

        expect(screen.getByPlaceholderText('Enter your phone number')).toBeInTheDocument();
    });

    test('PhoneField_shouldBeDisabled_whenDisabledPropTrue', () => {
        render(
            <PhoneField
                value=""
                onChange={mockOnChange}
                disabled={true}
            />
        );

        const input = screen.getByRole('textbox');
        expect(input).toBeDisabled();
    });

    test('PhoneField_shouldValidateVariousPhoneFormats', async () => {
        const TestComponent = () => {
            const [value, setValue] = React.useState('');
            return (
                <PhoneField
                    value={value}
                    onChange={setValue}
                    enableValidation={true}
                    validationMode="optional"
                    onValidationChange={mockOnValidationChange}
                />
            );
        };

        render(<TestComponent />);

        const input = screen.getByRole('textbox');
        
        const validPhoneFormats = [
            '5551234567',           // 10 digits
            '(555) 123-4567',       // US format with parentheses
            '555-123-4567',         // US format with dashes
            '+1 555 123 4567',      // International with spaces
            '+44 20 7946 0958',     // UK format
            '+33 1 42 86 83 26',    // France format
            '15551234567890'        // 15 digits (max)
        ];

        for (const phoneFormat of validPhoneFormats) {
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: phoneFormat } });
            fireEvent.blur(input);

            await waitFor(() => {
                expect(screen.queryByText('Phone number must be valid (10-15 digits)')).not.toBeInTheDocument();
            });
        }
    });
});