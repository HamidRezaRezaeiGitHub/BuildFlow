import { fireEvent, render, screen } from '@testing-library/react';
import { CityField } from './City';
import { beforeEach, describe, expect, test, vi } from 'vitest';

describe('CityField', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('CityField_shouldRenderWithDefaultProps', () => {
        const mockOnChange = vi.fn();
        
        render(
            <CityField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        const label = screen.getByText('City');

        expect(input).toBeInTheDocument();
        expect(label).toBeInTheDocument();
        expect(input).toHaveAttribute('placeholder', 'Toronto');
        expect(input).toHaveValue('');
    });

    test('CityField_shouldCallOnChange_whenValueChanges', () => {
        const mockOnChange = vi.fn();
        
        render(
            <CityField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Vancouver' } });

        expect(mockOnChange).toHaveBeenCalledWith('Vancouver');
    });

    test('CityField_shouldDisplayExternalErrors_whenErrorsProvided', () => {
        const mockOnChange = vi.fn();
        const errors = ['City is invalid'];
        
        render(
            <CityField
                value="Invalid City"
                onChange={mockOnChange}
                errors={errors}
            />
        );

        const errorText = screen.getByText('City is invalid');
        const input = screen.getByRole('textbox');

        expect(errorText).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
    });

    test('CityField_shouldBeDisabled_whenDisabledPropTrue', () => {
        const mockOnChange = vi.fn();
        
        render(
            <CityField
                value=""
                onChange={mockOnChange}
                disabled={true}
            />
        );

        const input = screen.getByRole('textbox');

        expect(input).toBeDisabled();
    });

    test('CityField_shouldUseCustomPlaceholder_whenPlaceholderProvided', () => {
        const mockOnChange = vi.fn();
        
        render(
            <CityField
                value=""
                onChange={mockOnChange}
                placeholder="Custom City"
            />
        );

        const input = screen.getByRole('textbox');

        expect(input).toHaveAttribute('placeholder', 'Custom City');
    });

    test('CityField_shouldDisplayValue_whenValueProvided', () => {
        const mockOnChange = vi.fn();
        
        render(
            <CityField
                value="Montreal"
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');

        expect(input).toHaveValue('Montreal');
    });

    // === VALIDATION TESTS ===

    test('CityField_shouldShowRequiredError_whenEmptyAndRequired', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        render(
            <CityField
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

        expect(screen.getByText('City is required')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: false, errors: ['City is required'] });
    });

    test('CityField_shouldPassValidation_whenValidCityProvided', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        const { rerender } = render(
            <CityField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        // Enter valid value and trigger onChange
        fireEvent.change(input, { target: { value: 'Toronto' } });

        // Simulate the parent component updating the value prop
        rerender(
            <CityField
                value="Toronto"
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
        expect(screen.queryByText(/contain only/)).not.toBeInTheDocument();
        expect(input).not.toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: true, errors: [] });
    });

    test('CityField_shouldShowMaxLengthError_whenExceedsLimit', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        const longCityName = 'A'.repeat(51); // 51 characters

        const { rerender } = render(
            <CityField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        // Enter long value and trigger onChange
        fireEvent.change(input, { target: { value: longCityName } });

        // Simulate the parent component updating the value prop
        rerender(
            <CityField
                value={longCityName}
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(screen.getByText('City name must not exceed 50 characters')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: false, errors: ['City name must not exceed 50 characters'] });
    });

    test('CityField_shouldShowMinLengthError_whenTooShort', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        const { rerender } = render(
            <CityField
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
            <CityField
                value="A"
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(screen.getByText('City name must be at least 2 characters long')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: false, errors: ['City name must be at least 2 characters long'] });
    });

    test('CityField_shouldShowInvalidCharacterError_whenContainsNumbers', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        const { rerender } = render(
            <CityField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        // Enter invalid value with numbers
        fireEvent.change(input, { target: { value: 'Toronto123' } });

        // Simulate the parent component updating the value prop
        rerender(
            <CityField
                value="Toronto123"
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(screen.getByText('City name must contain only letters, spaces, hyphens, periods, and apostrophes')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: false, errors: ['City name must contain only letters, spaces, hyphens, periods, and apostrophes'] });
    });

    test('CityField_shouldAllowValidSpecialCharacters_inCityNames', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        const { rerender } = render(
            <CityField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        // Enter valid value with allowed special characters
        fireEvent.change(input, { target: { value: "St. John's-upon-Thames" } });

        // Simulate the parent component updating the value prop
        rerender(
            <CityField
                value="St. John's-upon-Thames"
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        fireEvent.blur(input);

        // Should not show validation errors for valid special characters
        expect(screen.queryByText(/contain only/)).not.toBeInTheDocument();
        expect(input).not.toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: true, errors: [] });
    });

    test('CityField_shouldHandleEmptyValueInOptionalMode', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        render(
            <CityField
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

    test('CityField_shouldNotValidateBeforeTouch_whenValidationEnabled', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        render(
            <CityField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        fireEvent.change(input, { target: { value: 'A' } });

        expect(screen.queryByText(/required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/at least/)).not.toBeInTheDocument();
        expect(input).not.toHaveClass('border-red-500');
        // Validation is called on mount and when value changes, but errors are not displayed until touched
        expect(mockOnValidationChange).toHaveBeenCalledTimes(2);
    });

    test('CityField_shouldValidateOnChangeAfterFirstBlur', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        const { rerender } = render(
            <CityField
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

        fireEvent.change(input, { target: { value: 'A' } });

        // Simulate the parent component updating the value prop
        rerender(
            <CityField
                value="A"
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        expect(screen.getByText('City name must be at least 2 characters long')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: false, errors: ['City name must be at least 2 characters long'] });
    });

    test('CityField_shouldPrioritizeValidationErrors_overExternalErrors_whenBothPresent', () => {
        const mockOnChange = vi.fn();
        const externalErrors = ['External error message'];

        render(
            <CityField
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
        expect(screen.getByText('City is required')).toBeInTheDocument();
        expect(screen.queryByText('External error message')).not.toBeInTheDocument();
    });

    test('CityField_shouldShowRequiredIndicator_whenRequiredModeEnabled', () => {
        const mockOnChange = vi.fn();

        render(
            <CityField
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

    test('CityField_shouldNotShowRequiredIndicator_whenOptionalModeEnabled', () => {
        const mockOnChange = vi.fn();

        render(
            <CityField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
            />
        );

        expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    test('CityField_shouldClearValidationErrors_whenValidationDisabled', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        const { rerender } = render(
            <CityField
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
        expect(screen.getByText('City is required')).toBeInTheDocument();

        // Now disable validation
        rerender(
            <CityField
                value=""
                onChange={mockOnChange}
                enableValidation={false}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        // Validation errors should be cleared
        expect(screen.queryByText('City is required')).not.toBeInTheDocument();
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: true, errors: [] });
    });
});