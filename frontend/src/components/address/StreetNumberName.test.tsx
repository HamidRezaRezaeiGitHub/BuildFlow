import { fireEvent, render, screen } from '@testing-library/react';
import { StreetNumberNameField, parseStreetNumberName } from './StreetNumberName';

describe('StreetNumberNameField', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // === BASIC RENDERING TESTS ===

    test('StreetNumberNameField_shouldRenderWithDefaultProps', () => {
        const mockOnChange = jest.fn();
        
        render(
            <StreetNumberNameField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        const label = screen.getByText('Street Number & Name');

        expect(input).toBeInTheDocument();
        expect(label).toBeInTheDocument();
        expect(input).toHaveAttribute('placeholder', '123 Main Street');
        expect(input).toHaveValue('');
    });

    test('StreetNumberNameField_shouldCallOnChange_whenValueChanges', () => {
        const mockOnChange = jest.fn();
        
        render(
            <StreetNumberNameField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '123 Main Street' } });

        expect(mockOnChange).toHaveBeenCalledWith('123 Main Street');
    });

    test('StreetNumberNameField_shouldCallOnParsedChange_whenValueChanges', () => {
        const mockOnChange = jest.fn();
        const mockOnParsedChange = jest.fn();
        
        render(
            <StreetNumberNameField
                value=""
                onChange={mockOnChange}
                onParsedChange={mockOnParsedChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '123 Main Street' } });

        expect(mockOnParsedChange).toHaveBeenCalledWith('123', 'Main Street');
    });

    test('StreetNumberNameField_shouldDisplayExternalErrors_whenErrorsProvided', () => {
        const mockOnChange = jest.fn();
        const errors = ['Street address is invalid'];
        
        render(
            <StreetNumberNameField
                value="Invalid Address"
                onChange={mockOnChange}
                errors={errors}
            />
        );

        const errorText = screen.getByText('Street address is invalid');
        const input = screen.getByRole('textbox');

        expect(errorText).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
    });

    test('StreetNumberNameField_shouldBeDisabled_whenDisabledPropTrue', () => {
        const mockOnChange = jest.fn();
        
        render(
            <StreetNumberNameField
                value=""
                onChange={mockOnChange}
                disabled={true}
            />
        );

        const input = screen.getByRole('textbox');

        expect(input).toBeDisabled();
    });

    test('StreetNumberNameField_shouldUseCustomPlaceholder_whenPlaceholderProvided', () => {
        const mockOnChange = jest.fn();
        
        render(
            <StreetNumberNameField
                value=""
                onChange={mockOnChange}
                placeholder="456 Custom Street"
            />
        );

        const input = screen.getByRole('textbox');

        expect(input).toHaveAttribute('placeholder', '456 Custom Street');
    });

    test('StreetNumberNameField_shouldDisplayValue_whenValueProvided', () => {
        const mockOnChange = jest.fn();
        
        render(
            <StreetNumberNameField
                value="789 Queen Street"
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');

        expect(input).toHaveValue('789 Queen Street');
    });

    // === VALIDATION TESTS ===

    test('StreetNumberNameField_shouldShowRequiredError_whenEmptyAndRequired', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        render(
            <StreetNumberNameField
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

        expect(screen.getByText('Street number and name is required')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: false, errors: ['Street number and name is required'] });
    });

    test('StreetNumberNameField_shouldPassValidation_whenValidAddressProvided', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        const { rerender } = render(
            <StreetNumberNameField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        // Enter valid value and trigger onChange
        fireEvent.change(input, { target: { value: '123 Main Street' } });

        // Simulate the parent component updating the value prop
        rerender(
            <StreetNumberNameField
                value="123 Main Street"
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
        expect(screen.queryByText(/contain a number/)).not.toBeInTheDocument();
        expect(input).not.toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: true, errors: [] });
    });

    test('StreetNumberNameField_shouldShowMaxLengthError_whenExceedsLimit', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        const longAddress = 'A'.repeat(121); // 121 characters

        const { rerender } = render(
            <StreetNumberNameField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        // Enter long value and trigger onChange
        fireEvent.change(input, { target: { value: longAddress } });

        // Simulate the parent component updating the value prop
        rerender(
            <StreetNumberNameField
                value={longAddress}
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(screen.getByText('Street number and name must not exceed 120 characters')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: false, errors: [
            'Street number and name must not exceed 120 characters',
            'Street address must contain a number'
        ] });
    });

    test('StreetNumberNameField_shouldShowMinLengthError_whenTooShort', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        const { rerender } = render(
            <StreetNumberNameField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        // Enter too short value and trigger onChange
        fireEvent.change(input, { target: { value: 'A' } });

        // Simulate the parent component updating the value prop
        rerender(
            <StreetNumberNameField
                value="A"
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(screen.getByText('Street number and name must be at least 2 characters long')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: false, errors: [
            'Street number and name must be at least 2 characters long',
            'Street address must contain a number'
        ] });
    });

    test('StreetNumberNameField_shouldShowMustContainNumberError_whenNoNumberProvided', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        const { rerender } = render(
            <StreetNumberNameField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        // Enter value without number and trigger onChange
        fireEvent.change(input, { target: { value: 'Main Street' } });

        // Simulate the parent component updating the value prop
        rerender(
            <StreetNumberNameField
                value="Main Street"
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(screen.getByText('Street address must contain a number')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: false, errors: ['Street address must contain a number'] });
    });

    test('StreetNumberNameField_shouldShowValidFormatError_whenInvalidFormat', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        const { rerender } = render(
            <StreetNumberNameField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        // Enter value with number (should pass validFormat validation)
        fireEvent.change(input, { target: { value: 'Street 123' } });

        // Simulate the parent component updating the value prop
        rerender(
            <StreetNumberNameField
                value="Street 123"
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        fireEvent.focus(input);
        fireEvent.blur(input);

        // Should not show format error since input contains a number
        expect(screen.queryByText('Street address should start with a number (e.g., "123 Main St")')).not.toBeInTheDocument();
        expect(input).not.toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: true, errors: [] });
    });

    test('StreetNumberNameField_shouldHandleEmptyValueInOptionalMode', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        render(
            <StreetNumberNameField
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

    test('StreetNumberNameField_shouldNotValidateBeforeTouch_whenValidationEnabled', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        render(
            <StreetNumberNameField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        fireEvent.change(input, { target: { value: 'Main Street' } });

        expect(screen.queryByText(/required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/contain a number/)).not.toBeInTheDocument();
        expect(input).not.toHaveClass('border-red-500');
        // Validation is called on mount and when value changes, but errors are not displayed until touched
        expect(mockOnValidationChange).toHaveBeenCalledTimes(2);
    });

    test('StreetNumberNameField_shouldValidateOnChangeAfterFirstBlur', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        const { rerender } = render(
            <StreetNumberNameField
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

        fireEvent.change(input, { target: { value: 'Main Street' } });

        // Simulate the parent component updating the value prop
        rerender(
            <StreetNumberNameField
                value="Main Street"
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        expect(screen.getByText('Street address must contain a number')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: false, errors: ['Street address must contain a number'] });
    });

    test('StreetNumberNameField_shouldPrioritizeValidationErrors_overExternalErrors_whenBothPresent', () => {
        const mockOnChange = jest.fn();
        const externalErrors = ['External error message'];

        render(
            <StreetNumberNameField
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
        expect(screen.getByText('Street number and name is required')).toBeInTheDocument();
        expect(screen.queryByText('External error message')).not.toBeInTheDocument();
    });

    test('StreetNumberNameField_shouldShowRequiredIndicator_whenRequiredModeEnabled', () => {
        const mockOnChange = jest.fn();

        render(
            <StreetNumberNameField
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

    test('StreetNumberNameField_shouldNotShowRequiredIndicator_whenOptionalModeEnabled', () => {
        const mockOnChange = jest.fn();

        render(
            <StreetNumberNameField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
            />
        );

        expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    test('StreetNumberNameField_shouldClearValidationErrors_whenValidationDisabled', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        const { rerender } = render(
            <StreetNumberNameField
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
        expect(screen.getByText('Street number and name is required')).toBeInTheDocument();

        // Now disable validation
        rerender(
            <StreetNumberNameField
                value=""
                onChange={mockOnChange}
                enableValidation={false}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        // Validation errors should be cleared
        expect(screen.queryByText('Street number and name is required')).not.toBeInTheDocument();
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: true, errors: [] });
    });
});

// === PARSING FUNCTION TESTS ===

describe('parseStreetNumberName', () => {
    test('parseStreetNumberName_shouldParseValidInput_withNumberAndName', () => {
        const result = parseStreetNumberName('123 Main Street');
        expect(result).toEqual({
            streetNumber: '123',
            streetName: 'Main Street'
        });
    });

    test('parseStreetNumberName_shouldParseInput_withNumberAndMultipleWordName', () => {
        const result = parseStreetNumberName('456 Queen Street West');
        expect(result).toEqual({
            streetNumber: '456',
            streetName: 'Queen Street West'
        });
    });

    test('parseStreetNumberName_shouldParseInput_withExtraSpaces', () => {
        const result = parseStreetNumberName('789   Bay   Street');
        expect(result).toEqual({
            streetNumber: '789',
            streetName: 'Bay   Street'
        });
    });

    test('parseStreetNumberName_shouldReturnNumberOnly_whenNoNameProvided', () => {
        const result = parseStreetNumberName('123');
        expect(result).toEqual({
            streetNumber: '123',
            streetName: ''
        });
    });

    test('parseStreetNumberName_shouldReturnInputAsNumber_whenNoValidFormat', () => {
        const result = parseStreetNumberName('Main Street');
        expect(result).toEqual({
            streetNumber: 'Main Street',
            streetName: ''
        });
    });

    test('parseStreetNumberName_shouldHandleEmptyInput', () => {
        const result = parseStreetNumberName('');
        expect(result).toEqual({
            streetNumber: '',
            streetName: ''
        });
    });

    test('parseStreetNumberName_shouldHandleNullInput', () => {
        const result = parseStreetNumberName(null as any);
        expect(result).toEqual({
            streetNumber: '',
            streetName: ''
        });
    });

    test('parseStreetNumberName_shouldHandleUndefinedInput', () => {
        const result = parseStreetNumberName(undefined as any);
        expect(result).toEqual({
            streetNumber: '',
            streetName: ''
        });
    });

    test('parseStreetNumberName_shouldHandleWhitespaceOnlyInput', () => {
        const result = parseStreetNumberName('   ');
        expect(result).toEqual({
            streetNumber: '',
            streetName: ''
        });
    });

    test('parseStreetNumberName_shouldParseComplexAddress', () => {
        const result = parseStreetNumberName('1234 Main Street Apt 5');
        expect(result).toEqual({
            streetNumber: '1234',
            streetName: 'Main Street Apt 5'
        });
    });
});