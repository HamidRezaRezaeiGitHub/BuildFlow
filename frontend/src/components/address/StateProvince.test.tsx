import { fireEvent, render, screen } from '@testing-library/react';
import { StateProvinceField } from './StateProvince';
import { beforeEach, describe, expect, test, vi } from 'vitest';

describe('StateProvinceField', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // Basic functionality tests
    test('StateProvinceField_shouldRenderWithDefaultProps', () => {
        const mockOnChange = vi.fn();
        
        render(<StateProvinceField value="" onChange={mockOnChange} />);

        const input = screen.getByRole('textbox');
        const label = screen.getByText('Province');

        expect(input).toBeInTheDocument();
        expect(label).toBeInTheDocument();
        expect(input).toHaveAttribute('placeholder', 'ON');
        expect(input).toHaveValue('');
    });

    test('StateProvinceField_shouldCallOnChange_whenValueChanges', () => {
        const mockOnChange = vi.fn();
        
        render(<StateProvinceField value="" onChange={mockOnChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'BC' } });

        expect(mockOnChange).toHaveBeenCalledWith('BC');
    });

    test('StateProvinceField_shouldDisplayExternalErrors_whenErrorsProvided', () => {
        const mockOnChange = vi.fn();
        const errors = ['State/Province is invalid'];
        
        render(<StateProvinceField value="Invalid" onChange={mockOnChange} errors={errors} />);

        expect(screen.getByText('State/Province is invalid')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveClass('border-red-500');
    });

    // Validation tests
    test('StateProvinceField_shouldShowRequiredError_whenEmptyAndRequired', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        render(
            <StateProvinceField
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

        expect(screen.getByText('State/Province is required')).toBeInTheDocument();
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: false, errors: ['State/Province is required'] });
    });

    test('StateProvinceField_shouldPassValidation_whenValidStateProvinceProvided', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        const { rerender } = render(
            <StateProvinceField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Ontario' } });

        rerender(
            <StateProvinceField
                value="Ontario"
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        fireEvent.blur(input);

        expect(screen.queryByText(/required/)).not.toBeInTheDocument();
        expect(input).not.toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: true, errors: [] });
    });

    test('StateProvinceField_shouldShowMaxLengthError_whenExceedsLimit', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();
        const longName = 'A'.repeat(51);

        const { rerender } = render(
            <StateProvinceField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: longName } });

        rerender(
            <StateProvinceField
                value={longName}
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(screen.getByText('State/Province must not exceed 50 characters')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
    });

    test('StateProvinceField_shouldShowMinLengthError_whenTooShort', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        const { rerender } = render(
            <StateProvinceField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'A' } });

        rerender(
            <StateProvinceField
                value="A"
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(screen.getByText('State/Province must be at least 2 characters long')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
    });

    test('StateProvinceField_shouldShowInvalidCharacterError_whenContainsNumbers', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        const { rerender } = render(
            <StateProvinceField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Ontario123' } });

        rerender(
            <StateProvinceField
                value="Ontario123"
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(screen.getByText('State/Province must contain only letters, spaces, hyphens, and periods')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
    });

    test('StateProvinceField_shouldHandleEmptyValueInOptionalMode', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        render(
            <StateProvinceField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        fireEvent.blur(screen.getByRole('textbox'));

        expect(screen.queryByText(/required/)).not.toBeInTheDocument();
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: true, errors: [] });
    });

    test('StateProvinceField_shouldShowRequiredIndicator_whenRequiredModeEnabled', () => {
        const mockOnChange = vi.fn();

        render(
            <StateProvinceField
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

    test('StateProvinceField_shouldClearValidationErrors_whenValidationDisabled', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        const { rerender } = render(
            <StateProvinceField
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
        expect(screen.getByText('State/Province is required')).toBeInTheDocument();

        rerender(
            <StateProvinceField
                value=""
                onChange={mockOnChange}
                enableValidation={false}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        expect(screen.queryByText('State/Province is required')).not.toBeInTheDocument();
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: true, errors: [] });
    });
});