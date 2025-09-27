import { fireEvent, render, screen } from '@testing-library/react';
import { StreetNumberField } from './StreetNumber';

describe('StreetNumberField', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('StreetNumberField_shouldRenderWithDefaultProps', () => {
        const mockOnChange = jest.fn();
        
        render(
            <StreetNumberField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        const label = screen.getByText('Street Number');

        expect(input).toBeInTheDocument();
        expect(label).toBeInTheDocument();
        expect(input).toHaveAttribute('placeholder', '123');
        expect(input).toHaveValue('');
    });

    test('StreetNumberField_shouldCallOnChange_whenValueChanges', () => {
        const mockOnChange = jest.fn();
        
        render(
            <StreetNumberField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '456' } });

        expect(mockOnChange).toHaveBeenCalledWith('456');
    });

    test('StreetNumberField_shouldDisplayExternalErrors_whenErrorsProvided', () => {
        const mockOnChange = jest.fn();
        const errors = ['Street number must contain only numbers'];
        
        render(
            <StreetNumberField
                value="123A"
                onChange={mockOnChange}
                errors={errors}
            />
        );

        const errorText = screen.getByText('Street number must contain only numbers');
        const input = screen.getByRole('textbox');

        expect(errorText).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
    });

    test('StreetNumberField_shouldBeDisabled_whenDisabledPropTrue', () => {
        const mockOnChange = jest.fn();
        
        render(
            <StreetNumberField
                value=""
                onChange={mockOnChange}
                disabled={true}
            />
        );

        const input = screen.getByRole('textbox');

        expect(input).toBeDisabled();
    });

    test('StreetNumberField_shouldUseCustomPlaceholder_whenPlaceholderProvided', () => {
        const mockOnChange = jest.fn();
        
        render(
            <StreetNumberField
                value=""
                onChange={mockOnChange}
                placeholder="999"
            />
        );

        const input = screen.getByRole('textbox');

        expect(input).toHaveAttribute('placeholder', '999');
    });

    test('StreetNumberField_shouldDisplayValue_whenValueProvided', () => {
        const mockOnChange = jest.fn();
        
        render(
            <StreetNumberField
                value="456"
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');

        expect(input).toHaveValue('456');
    });

    test('StreetNumberField_shouldAcceptNumericText_withoutValidation', () => {
        const mockOnChange = jest.fn();
        
        render(
            <StreetNumberField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        
        // Should accept numbers
        fireEvent.change(input, { target: { value: '123' } });
        expect(mockOnChange).toHaveBeenCalledWith('123');
    });

    test('StreetNumberField_shouldAcceptNonNumericText_withoutValidation', () => {
        const mockOnChange = jest.fn();
        
        render(
            <StreetNumberField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        
        // Should accept non-numeric text (no validation)
        fireEvent.change(input, { target: { value: '123A' } });
        expect(mockOnChange).toHaveBeenCalledWith('123A');
    });

    // === VALIDATION TESTS ===

    test('StreetNumberField_shouldShowRequiredError_whenEmptyAndRequired', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        render(
            <StreetNumberField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        fireEvent.blur(input);

        expect(screen.getByText('Street number is required')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: false, errors: ['Street number is required'] });
    });

    test('StreetNumberField_shouldPassValidation_whenValidNumberProvided', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        const { rerender } = render(
            <StreetNumberField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        // Enter valid value and trigger onChange
        fireEvent.change(input, { target: { value: '123' } });

        // Simulate the parent component updating the value prop
        rerender(
            <StreetNumberField
                value="123"
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        // Now blur to trigger validation
        fireEvent.blur(input);

        // Should not show any validation errors
        expect(screen.queryByText(/required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/exceed/)).not.toBeInTheDocument();
        expect(screen.queryByText(/numbers/)).not.toBeInTheDocument();
        expect(input).not.toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: true, errors: [] });
    });

    test('StreetNumberField_shouldShowMaxLengthError_whenExceedsLimit', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        const { rerender } = render(
            <StreetNumberField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        // Enter long value and trigger onChange
        fireEvent.change(input, { target: { value: '123456789012345678901' } }); // 21 characters

        // Simulate the parent component updating the value prop
        rerender(
            <StreetNumberField
                value="123456789012345678901"
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        fireEvent.blur(input);

        expect(screen.getByText('Street number must not exceed 20 characters')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: false, errors: ['Street number must not exceed 20 characters'] });
    });

    test('StreetNumberField_shouldShowNonNumericError_whenContainsLetters', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        const { rerender } = render(
            <StreetNumberField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        // Enter non-numeric value and trigger onChange
        fireEvent.change(input, { target: { value: '123A' } });

        // Simulate the parent component updating the value prop
        rerender(
            <StreetNumberField
                value="123A"
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        fireEvent.blur(input);

        expect(screen.getByText('Street number must contain only numbers')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: false, errors: ['Street number must contain only numbers'] });
    });

    test('StreetNumberField_shouldHandleEmptyValueInOptionalMode', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        render(
            <StreetNumberField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        fireEvent.blur(input);

        expect(screen.queryByText(/required/)).not.toBeInTheDocument();
        expect(input).not.toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: true, errors: [] });
    });

    test('StreetNumberField_shouldNotValidateBeforeTouch_whenValidationEnabled', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        render(
            <StreetNumberField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        fireEvent.change(input, { target: { value: 'ABC' } });

        expect(screen.queryByText(/required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/numbers/)).not.toBeInTheDocument();
        expect(input).not.toHaveClass('border-red-500');
        expect(mockOnValidationChange).not.toHaveBeenCalled();
    });

    test('StreetNumberField_shouldValidateOnChangeAfterFirstBlur', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        render(
            <StreetNumberField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        fireEvent.blur(input);
        mockOnValidationChange.mockClear();

        fireEvent.change(input, { target: { value: 'ABC123' } });

        expect(screen.getByText('Street number must contain only numbers')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: false, errors: ['Street number must contain only numbers'] });
    });

    test('StreetNumberField_shouldPrioritizeValidationErrors_overExternalErrors_whenBothPresent', () => {
        const mockOnChange = jest.fn();
        const externalErrors = ['External error message'];

        render(
            <StreetNumberField
                value=""
                onChange={mockOnChange}
                errors={externalErrors}
                enableValidation={true}
                validationMode="required"
            />
        );

        const input = screen.getByRole('textbox');

        fireEvent.blur(input);

        // Should show validation error, not external error
        expect(screen.getByText('Street number is required')).toBeInTheDocument();
        expect(screen.queryByText('External error message')).not.toBeInTheDocument();
    });

    test('StreetNumberField_shouldShowRequiredIndicator_whenRequiredModeEnabled', () => {
        const mockOnChange = jest.fn();

        render(
            <StreetNumberField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
            />
        );

        const requiredIndicator = screen.getByText('*');
        expect(requiredIndicator).toBeInTheDocument();
        expect(requiredIndicator).toHaveClass('text-red-500');
    });

    test('StreetNumberField_shouldNotShowRequiredIndicator_whenOptionalModeEnabled', () => {
        const mockOnChange = jest.fn();

        render(
            <StreetNumberField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
            />
        );

        expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    test('StreetNumberField_shouldClearValidationErrors_whenValidationDisabled', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        const { rerender } = render(
            <StreetNumberField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        // First trigger a validation error
        fireEvent.blur(input);
        expect(screen.getByText('Street number is required')).toBeInTheDocument();

        // Now disable validation
        rerender(
            <StreetNumberField
                value=""
                onChange={mockOnChange}
                enableValidation={false}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        // Validation errors should be cleared
        expect(screen.queryByText('Street number is required')).not.toBeInTheDocument();
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: true, errors: [] });
    });
});