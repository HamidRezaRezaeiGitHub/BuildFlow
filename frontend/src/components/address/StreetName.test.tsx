import { fireEvent, render, screen } from '@testing-library/react';
import { StreetNameField } from './StreetName';

describe('StreetNameField', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('StreetNameField_shouldRenderWithDefaultProps', () => {
        const mockOnChange = vi.fn();
        
        render(
            <StreetNameField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        const label = screen.getByText('Street Name');

        expect(input).toBeInTheDocument();
        expect(label).toBeInTheDocument();
        expect(input).toHaveAttribute('placeholder', 'Bay Street');
        expect(input).toHaveValue('');
    });

    test('StreetNameField_shouldCallOnChange_whenValueChanges', () => {
        const mockOnChange = vi.fn();
        
        render(
            <StreetNameField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Main Street' } });

        expect(mockOnChange).toHaveBeenCalledWith('Main Street');
    });

    test('StreetNameField_shouldDisplayExternalErrors_whenErrorsProvided', () => {
        const mockOnChange = vi.fn();
        const errors = ['Street name is invalid'];
        
        render(
            <StreetNameField
                value="Some Invalid Name"
                onChange={mockOnChange}
                errors={errors}
            />
        );

        const errorText = screen.getByText('Street name is invalid');
        const input = screen.getByRole('textbox');

        expect(errorText).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
    });

    test('StreetNameField_shouldBeDisabled_whenDisabledPropTrue', () => {
        const mockOnChange = vi.fn();
        
        render(
            <StreetNameField
                value=""
                onChange={mockOnChange}
                disabled={true}
            />
        );

        const input = screen.getByRole('textbox');

        expect(input).toBeDisabled();
    });

    test('StreetNameField_shouldUseCustomPlaceholder_whenPlaceholderProvided', () => {
        const mockOnChange = vi.fn();
        
        render(
            <StreetNameField
                value=""
                onChange={mockOnChange}
                placeholder="Custom Street"
            />
        );

        const input = screen.getByRole('textbox');

        expect(input).toHaveAttribute('placeholder', 'Custom Street');
    });

    test('StreetNameField_shouldDisplayValue_whenValueProvided', () => {
        const mockOnChange = vi.fn();
        
        render(
            <StreetNameField
                value="Queen Street"
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');

        expect(input).toHaveValue('Queen Street');
    });

    // === VALIDATION TESTS ===

    test('StreetNameField_shouldShowRequiredError_whenEmptyAndRequired', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        render(
            <StreetNameField
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

        expect(screen.getByText('Street name is required')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: false, errors: ['Street name is required'] });
    });

    test('StreetNameField_shouldPassValidation_whenValidNameProvided', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        const { rerender } = render(
            <StreetNameField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        // Enter valid value and trigger onChange
        fireEvent.change(input, { target: { value: 'Main Street' } });

        // Simulate the parent component updating the value prop
        rerender(
            <StreetNameField
                value="Main Street"
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
        expect(input).not.toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: true, errors: [] });
    });

    test('StreetNameField_shouldShowMaxLengthError_whenExceedsLimit', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        const longStreetName = 'A'.repeat(101); // 101 characters

        const { rerender } = render(
            <StreetNameField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        // Enter long value and trigger onChange
        fireEvent.change(input, { target: { value: longStreetName } });

        // Simulate the parent component updating the value prop
        rerender(
            <StreetNameField
                value={longStreetName}
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(screen.getByText('Street name must not exceed 100 characters')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: false, errors: ['Street name must not exceed 100 characters'] });
    });

    test('StreetNameField_shouldShowMinLengthError_whenTooShort', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        const { rerender } = render(
            <StreetNameField
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
            <StreetNameField
                value="A"
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(screen.getByText('Street name must be at least 2 characters long')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: false, errors: ['Street name must be at least 2 characters long'] });
    });

    test('StreetNameField_shouldHandleEmptyValueInOptionalMode', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        render(
            <StreetNameField
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

    test('StreetNameField_shouldNotValidateBeforeTouch_whenValidationEnabled', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        render(
            <StreetNameField
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

    test('StreetNameField_shouldValidateOnChangeAfterFirstBlur', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        const { rerender } = render(
            <StreetNameField
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
            <StreetNameField
                value="A"
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        expect(screen.getByText('Street name must be at least 2 characters long')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: false, errors: ['Street name must be at least 2 characters long'] });
    });

    test('StreetNameField_shouldPrioritizeValidationErrors_overExternalErrors_whenBothPresent', () => {
        const mockOnChange = vi.fn();
        const externalErrors = ['External error message'];

        render(
            <StreetNameField
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
        expect(screen.getByText('Street name is required')).toBeInTheDocument();
        expect(screen.queryByText('External error message')).not.toBeInTheDocument();
    });

    test('StreetNameField_shouldShowRequiredIndicator_whenRequiredModeEnabled', () => {
        const mockOnChange = vi.fn();

        render(
            <StreetNameField
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

    test('StreetNameField_shouldNotShowRequiredIndicator_whenOptionalModeEnabled', () => {
        const mockOnChange = vi.fn();

        render(
            <StreetNameField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
            />
        );

        expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    test('StreetNameField_shouldClearValidationErrors_whenValidationDisabled', () => {
        const mockOnChange = vi.fn();
        const mockOnValidationChange = vi.fn();

        const { rerender } = render(
            <StreetNameField
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
        expect(screen.getByText('Street name is required')).toBeInTheDocument();

        // Now disable validation
        rerender(
            <StreetNameField
                value=""
                onChange={mockOnChange}
                enableValidation={false}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        // Validation errors should be cleared
        expect(screen.queryByText('Street name is required')).not.toBeInTheDocument();
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: true, errors: [] });
    });
});