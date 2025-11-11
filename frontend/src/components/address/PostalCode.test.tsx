import { fireEvent, render, screen } from '@testing-library/react';
import { PostalCodeField } from './PostalCode';

describe('PostalCodeField', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('PostalCodeField_shouldRenderWithDefaultProps', () => {
        const mockOnChange = vi.fn();
        
        render(
            <PostalCodeField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        const label = screen.getByText('Postal Code');

        expect(input).toBeInTheDocument();
        expect(label).toBeInTheDocument();
        expect(input).toHaveAttribute('placeholder', 'M5H 2N2');
        expect(input).toHaveValue('');
    });

    test('PostalCodeField_shouldCallOnChange_whenValueChanges', () => {
        const mockOnChange = vi.fn();
        
        render(
            <PostalCodeField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'K1A 0A6' } });

        expect(mockOnChange).toHaveBeenCalledWith('K1A 0A6');
    });

    test('PostalCodeField_shouldDisplayExternalErrors_whenErrorsProvided', () => {
        const mockOnChange = vi.fn();
        const errors = ['Postal code is invalid'];
        
        render(
            <PostalCodeField
                value="Invalid"
                onChange={mockOnChange}
                errors={errors}
            />
        );

        const errorText = screen.getByText('Postal code is invalid');
        const input = screen.getByRole('textbox');

        expect(errorText).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
    });

    test('PostalCodeField_shouldBeDisabled_whenDisabledPropTrue', () => {
        const mockOnChange = vi.fn();
        
        render(
            <PostalCodeField
                value=""
                onChange={mockOnChange}
                disabled={true}
            />
        );

        const input = screen.getByRole('textbox');

        expect(input).toBeDisabled();
    });

    test('PostalCodeField_shouldUseCustomPlaceholder_whenPlaceholderProvided', () => {
        const mockOnChange = vi.fn();
        
        render(
            <PostalCodeField
                value=""
                onChange={mockOnChange}
                placeholder="12345"
            />
        );

        const input = screen.getByRole('textbox');

        expect(input).toHaveAttribute('placeholder', '12345');
    });

    test('PostalCodeField_shouldDisplayValue_whenValueProvided', () => {
        const mockOnChange = vi.fn();
        
        render(
            <PostalCodeField
                value="L5B 3C1"
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');

        expect(input).toHaveValue('L5B 3C1');
    });

    // === VALIDATION TESTS ===

    test('PostalCodeField_shouldShowRequiredError_whenEmptyAndRequired', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        render(
            <PostalCodeField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(screen.getByText('Postal code is required')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: false, errors: ['Postal code is required'] });
    });

    test('PostalCodeField_shouldPassValidation_whenValidCanadianPostalCodeProvided', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        const { rerender } = render(
            <PostalCodeField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        // Enter valid Canadian postal code
        fireEvent.change(input, { target: { value: 'M5H 2N2' } });

        // Simulate the parent component updating the value prop
        rerender(
            <PostalCodeField
                value="M5H 2N2"
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
        expect(screen.queryByText(/at least/)).not.toBeInTheDocument();
        expect(screen.queryByText(/format is invalid/)).not.toBeInTheDocument();
        expect(input).not.toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: true, errors: [] });
    });

    test('PostalCodeField_shouldPassValidation_whenValidUSZipCodeProvided', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        const { rerender } = render(
            <PostalCodeField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        // Enter valid US ZIP code
        fireEvent.change(input, { target: { value: '12345' } });

        // Simulate the parent component updating the value prop
        rerender(
            <PostalCodeField
                value="12345"
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
        expect(screen.queryByText(/format is invalid/)).not.toBeInTheDocument();
        expect(input).not.toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: true, errors: [] });
    });

    test('PostalCodeField_shouldPassValidation_whenValidExtendedUSZipCodeProvided', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        const { rerender } = render(
            <PostalCodeField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        // Enter valid extended US ZIP code
        fireEvent.change(input, { target: { value: '12345-6789' } });

        // Simulate the parent component updating the value prop
        rerender(
            <PostalCodeField
                value="12345-6789"
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        // Now blur to trigger validation
        fireEvent.blur(input);

        // Should not show any validation errors
        expect(screen.queryByText(/format is invalid/)).not.toBeInTheDocument();
        expect(input).not.toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: true, errors: [] });
    });

    test('PostalCodeField_shouldShowMaxLengthError_whenExceedsLimit', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        const longPostalCode = 'M5H2N2EXTRA'; // 11 characters

        const { rerender } = render(
            <PostalCodeField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        // Enter long value and trigger onChange
        fireEvent.change(input, { target: { value: longPostalCode } });

        // Simulate the parent component updating the value prop
        rerender(
            <PostalCodeField
                value={longPostalCode}
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(screen.getByText('Postal code must not exceed 10 characters')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: false, errors: [
            'Postal code must not exceed 10 characters', 
            'Postal code format is invalid (e.g., M5H 2N2 or 12345)'
        ] });
    });

    test('PostalCodeField_shouldShowMinLengthError_whenTooShort', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        const { rerender } = render(
            <PostalCodeField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        // Enter too short value and trigger onChange
        fireEvent.change(input, { target: { value: '123' } });

        // Simulate the parent component updating the value prop
        rerender(
            <PostalCodeField
                value="123"
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(screen.getByText('Postal code must be at least 5 characters long')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: false, errors: [
            'Postal code must be at least 5 characters long', 
            'Postal code format is invalid (e.g., M5H 2N2 or 12345)'
        ] });
    });

    test('PostalCodeField_shouldShowInvalidFormatError_whenInvalidFormat', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        const { rerender } = render(
            <PostalCodeField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        // Enter invalid format
        fireEvent.change(input, { target: { value: 'INVALID' } });

        // Simulate the parent component updating the value prop
        rerender(
            <PostalCodeField
                value="INVALID"
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(screen.getByText('Postal code format is invalid (e.g., M5H 2N2 or 12345)')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: false, errors: ['Postal code format is invalid (e.g., M5H 2N2 or 12345)'] });
    });

    test('PostalCodeField_shouldAcceptCanadianPostalCodeWithoutSpace', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        const { rerender } = render(
            <PostalCodeField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        // Enter Canadian postal code without space
        fireEvent.change(input, { target: { value: 'M5H2N2' } });

        // Simulate the parent component updating the value prop
        rerender(
            <PostalCodeField
                value="M5H2N2"
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        fireEvent.blur(input);

        // Should not show validation errors for valid format
        expect(screen.queryByText(/format is invalid/)).not.toBeInTheDocument();
        expect(input).not.toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: true, errors: [] });
    });

    test('PostalCodeField_shouldHandleEmptyValueInOptionalMode', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        render(
            <PostalCodeField
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

    test('PostalCodeField_shouldNotValidateBeforeTouch_whenValidationEnabled', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        render(
            <PostalCodeField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        fireEvent.change(input, { target: { value: 'INVALID' } });

        expect(screen.queryByText(/required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/format is invalid/)).not.toBeInTheDocument();
        expect(input).not.toHaveClass('border-red-500');
        // Validation is called on mount and when value changes, but errors are not displayed until touched
        expect(mockOnValidationChange).toHaveBeenCalledTimes(2);
    });

    test('PostalCodeField_shouldValidateOnChangeAfterFirstBlur', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        const { rerender } = render(
            <PostalCodeField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        fireEvent.focus(input);
        fireEvent.blur(input);
        mockOnValidationChange.mockClear();

        fireEvent.change(input, { target: { value: 'INVALID' } });

        // Simulate the parent component updating the value prop
        rerender(
            <PostalCodeField
                value="INVALID"
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        expect(screen.getByText('Postal code format is invalid (e.g., M5H 2N2 or 12345)')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: false, errors: ['Postal code format is invalid (e.g., M5H 2N2 or 12345)'] });
    });

    test('PostalCodeField_shouldPrioritizeValidationErrors_overExternalErrors_whenBothPresent', () => {
        const mockOnChange = vi.fn();
        const externalErrors = ['External error message'];

        render(
            <PostalCodeField
                value=""
                onChange={mockOnChange}
                errors={externalErrors}
                enableValidation={true}
                validationMode="required"
            />
        );

        const input = screen.getByRole('textbox');

        fireEvent.focus(input);
        fireEvent.blur(input);

        // Should show validation error, not external error
        expect(screen.getByText('Postal code is required')).toBeInTheDocument();
        expect(screen.queryByText('External error message')).not.toBeInTheDocument();
    });

    test('PostalCodeField_shouldShowRequiredIndicator_whenRequiredModeEnabled', () => {
        const mockOnChange = vi.fn();

        render(
            <PostalCodeField
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

    test('PostalCodeField_shouldNotShowRequiredIndicator_whenOptionalModeEnabled', () => {
        const mockOnChange = vi.fn();

        render(
            <PostalCodeField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
            />
        );

        expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    test('PostalCodeField_shouldClearValidationErrors_whenValidationDisabled', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        const { rerender } = render(
            <PostalCodeField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        // First trigger a validation error
        fireEvent.focus(input);
        fireEvent.blur(input);
        expect(screen.getByText('Postal code is required')).toBeInTheDocument();

        // Now disable validation
        rerender(
            <PostalCodeField
                value=""
                onChange={mockOnChange}
                enableValidation={false}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        // Validation errors should be cleared
        expect(screen.queryByText('Postal code is required')).not.toBeInTheDocument();
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: true, errors: [] });
    });
});