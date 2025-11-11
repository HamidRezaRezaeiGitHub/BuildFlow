import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { NameField } from './Name';
import { beforeEach, describe, expect, test, vi } from 'vitest';

describe('NameField', () => {
    const mockOnChange = vi.fn();
    const mockOnValidationChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('FirstName Configuration', () => {
        test('NameField_shouldRenderFirstName_withMinimalProps', () => {
            render(
                <NameField
                    nameType="firstName"
                    value=""
                    onChange={mockOnChange}
                />
            );

            expect(screen.getByLabelText('First Name')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('John')).toBeInTheDocument();
        });

        test('NameField_shouldShowRequiredIndicator_whenFirstNameValidationModeRequired', () => {
            render(
                <NameField
                    nameType="firstName"
                    value=""
                    onChange={mockOnChange}
                    enableValidation={true}
                    validationMode="required"
                />
            );

            expect(screen.getByText('*')).toBeInTheDocument();
        });

        test('NameField_shouldValidateFirstNameRequired_whenValidationEnabled', async () => {
            const TestComponent = () => {
                const [value, setValue] = React.useState('');
                return (
                    <NameField
                        nameType="firstName"
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
                expect(screen.getByText('First name is required')).toBeInTheDocument();
            });

            // Test valid value
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: 'John' } });
            fireEvent.blur(input);

            await waitFor(() => {
                expect(screen.queryByText('First name is required')).not.toBeInTheDocument();
            });
        });

        test('NameField_shouldValidateFirstNameMaxLength_whenValidationEnabled', async () => {
            const TestComponent = () => {
                const [value, setValue] = React.useState('');
                return (
                    <NameField
                        nameType="firstName"
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
            
            // Test value exceeding 100 characters
            const longName = 'A'.repeat(101);
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: longName } });
            fireEvent.blur(input);

            await waitFor(() => {
                expect(screen.getByText('First name must not exceed 100 characters')).toBeInTheDocument();
            });

            // Test valid length (exactly 100 characters)
            const validName = 'A'.repeat(100);
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: validName } });
            fireEvent.blur(input);

            await waitFor(() => {
                expect(screen.queryByText('First name must not exceed 100 characters')).not.toBeInTheDocument();
            });
        });
    });

    describe('LastName Configuration', () => {
        test('NameField_shouldRenderLastName_withMinimalProps', () => {
            render(
                <NameField
                    nameType="lastName"
                    value=""
                    onChange={mockOnChange}
                />
            );

            expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Doe')).toBeInTheDocument();
        });

        test('NameField_shouldShowRequiredIndicator_whenLastNameValidationModeRequired', () => {
            render(
                <NameField
                    nameType="lastName"
                    value=""
                    onChange={mockOnChange}
                    enableValidation={true}
                    validationMode="required"
                />
            );

            expect(screen.getByText('*')).toBeInTheDocument();
        });

        test('NameField_shouldValidateLastNameRequired_whenValidationEnabled', async () => {
            const TestComponent = () => {
                const [value, setValue] = React.useState('');
                return (
                    <NameField
                        nameType="lastName"
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
                expect(screen.getByText('Last name is required')).toBeInTheDocument();
            });

            // Test valid value
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: 'Doe' } });
            fireEvent.blur(input);

            await waitFor(() => {
                expect(screen.queryByText('Last name is required')).not.toBeInTheDocument();
            });
        });

        test('NameField_shouldValidateLastNameMaxLength_whenValidationEnabled', async () => {
            const TestComponent = () => {
                const [value, setValue] = React.useState('');
                return (
                    <NameField
                        nameType="lastName"
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
            
            // Test value exceeding 100 characters
            const longName = 'A'.repeat(101);
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: longName } });
            fireEvent.blur(input);

            await waitFor(() => {
                expect(screen.getByText('Last name must not exceed 100 characters')).toBeInTheDocument();
            });

            // Test valid length (exactly 100 characters)
            const validName = 'A'.repeat(100);
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: validName } });
            fireEvent.blur(input);

            await waitFor(() => {
                expect(screen.queryByText('Last name must not exceed 100 characters')).not.toBeInTheDocument();
            });
        });
    });

    describe('Common Functionality', () => {
        test('NameField_shouldCallOnChange_whenValueChanges', () => {
            render(
                <NameField
                    nameType="firstName"
                    value=""
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');
            fireEvent.change(input, { target: { value: 'John' } });

            expect(mockOnChange).toHaveBeenCalledWith('John');
        });

        test('NameField_shouldValidateBothRequiredAndMaxLength_whenBothApply', async () => {
            const TestComponent = () => {
                const [value, setValue] = React.useState('');
                return (
                    <NameField
                        nameType="firstName"
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
                expect(screen.getByText('First name is required')).toBeInTheDocument();
            });

            // Test value exceeding max length
            const longName = 'A'.repeat(101);
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: longName } });
            fireEvent.blur(input);

            await waitFor(() => {
                expect(screen.getByText('First name must not exceed 100 characters')).toBeInTheDocument();
            });

            // Test valid value
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: 'John' } });
            fireEvent.blur(input);

            await waitFor(() => {
                expect(screen.queryByText('First name is required')).not.toBeInTheDocument();
                expect(screen.queryByText('First name must not exceed 100 characters')).not.toBeInTheDocument();
            });
        });

        test('NameField_shouldNotValidate_whenValidationDisabled', async () => {
            const TestComponent = () => {
                const [value, setValue] = React.useState('');
                return (
                    <NameField
                        nameType="firstName"
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
            expect(screen.queryByText('First name is required')).not.toBeInTheDocument();

            // Test long value (should not show max length error when validation disabled)
            const longName = 'A'.repeat(101);
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: longName } });
            fireEvent.blur(input);

            await new Promise(resolve => setTimeout(resolve, 100));
            expect(screen.queryByText('First name must not exceed 100 characters')).not.toBeInTheDocument();
        });

        test('NameField_shouldShowError_whenExternalErrorsProvided', () => {
            render(
                <NameField
                    nameType="firstName"
                    value=""
                    onChange={mockOnChange}
                    errors={['External error message']}
                />
            );

            expect(screen.getByText('External error message')).toBeInTheDocument();
        });

        test('NameField_shouldApplyErrorStyling_whenHasErrors', () => {
            render(
                <NameField
                    nameType="firstName"
                    value=""
                    onChange={mockOnChange}
                    errors={['Test error']}
                />
            );

            const input = screen.getByRole('textbox');
            expect(input).toHaveClass('border-red-500');
        });

        test('NameField_shouldAcceptCustomPlaceholder', () => {
            render(
                <NameField
                    nameType="firstName"
                    value=""
                    onChange={mockOnChange}
                    placeholder="Enter your first name"
                />
            );

            expect(screen.getByPlaceholderText('Enter your first name')).toBeInTheDocument();
        });

        test('NameField_shouldBeDisabled_whenDisabledPropTrue', () => {
            render(
                <NameField
                    nameType="firstName"
                    value=""
                    onChange={mockOnChange}
                    disabled={true}
                />
            );

            const input = screen.getByRole('textbox');
            expect(input).toBeDisabled();
        });

        test('NameField_shouldUseDefaultIdBasedOnNameType', () => {
            render(
                <NameField
                    nameType="lastName"
                    value=""
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('id', 'lastName');
        });

        test('NameField_shouldUseCustomId_whenIdProvided', () => {
            render(
                <NameField
                    nameType="firstName"
                    id="customFirstName"
                    value=""
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('id', 'customFirstName');
        });
    });
});