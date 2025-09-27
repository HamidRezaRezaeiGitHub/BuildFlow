import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { EmailField } from './Email';

describe('EmailField', () => {
    const mockOnChange = jest.fn();
    const mockOnValidationChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('EmailField_shouldRenderWithMinimalProps', () => {
        render(
            <EmailField
                value=""
                onChange={mockOnChange}
            />
        );

        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('john@company.com')).toBeInTheDocument();
    });

    test('EmailField_shouldShowRequiredIndicator_whenValidationModeRequired', () => {
        render(
            <EmailField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
            />
        );

        expect(screen.getByText('*')).toBeInTheDocument();
    });

    test('EmailField_shouldCallOnChange_whenValueChanges', () => {
        render(
            <EmailField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'test@example.com' } });

        expect(mockOnChange).toHaveBeenCalledWith('test@example.com');
    });

    test('EmailField_shouldValidateEmail_whenValidationEnabled', async () => {
        const TestComponent = () => {
            const [value, setValue] = React.useState('');
            return (
                <EmailField
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
        
        // Test invalid email
        fireEvent.focus(input); // Focus first to mark as touched
        fireEvent.change(input, { target: { value: 'invalid-email' } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.getByText('Email must be valid')).toBeInTheDocument();
        });

        // Test valid email
        fireEvent.focus(input); // Focus again for consistency
        fireEvent.change(input, { target: { value: 'test@example.com' } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.queryByText('Email must be valid')).not.toBeInTheDocument();
        });
    });

    test('EmailField_shouldShowError_whenExternalErrorsProvided', () => {
        render(
            <EmailField
                value=""
                onChange={mockOnChange}
                errors={['External error message']}
            />
        );

        expect(screen.getByText('External error message')).toBeInTheDocument();
    });

    test('EmailField_shouldApplyErrorStyling_whenHasErrors', () => {
        render(
            <EmailField
                value=""
                onChange={mockOnChange}
                errors={['Test error']}
            />
        );

        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('border-red-500');
    });
});