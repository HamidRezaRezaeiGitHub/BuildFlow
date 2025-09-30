import { fireEvent, render, screen } from '@testing-library/react';
import { UnitNumberField } from './UnitNumber';

describe('UnitNumberField', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('UnitNumberField_shouldRenderWithDefaultProps', () => {
        const mockOnChange = jest.fn();

        render(
            <UnitNumberField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        const label = screen.getByText('Unit/Apt/Suite');

        expect(input).toBeInTheDocument();
        expect(label).toBeInTheDocument();
        expect(input).toHaveAttribute('placeholder', 'Unit 101');
        expect(input).toHaveValue('');
    });

    test('UnitNumberField_shouldCallOnChange_whenValueChanges', () => {
        const mockOnChange = jest.fn();

        render(
            <UnitNumberField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '102' } });

        expect(mockOnChange).toHaveBeenCalledWith('102');
    });

    test('UnitNumberField_shouldDisplayExternalErrors_whenErrorsProvided', () => {
        const mockOnChange = jest.fn();
        const errors = ['Unit number is invalid'];

        render(
            <UnitNumberField
                value="test"
                onChange={mockOnChange}
                errors={errors}
            />
        );

        const errorText = screen.getByText('Unit number is invalid');
        const input = screen.getByRole('textbox');

        expect(errorText).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
    });

    test('UnitNumberField_shouldBeDisabled_whenDisabledPropTrue', () => {
        const mockOnChange = jest.fn();

        render(
            <UnitNumberField
                value=""
                onChange={mockOnChange}
                disabled={true}
            />
        );

        const input = screen.getByRole('textbox');

        expect(input).toBeDisabled();
    });

    test('UnitNumberField_shouldUseCustomPlaceholder_whenPlaceholderProvided', () => {
        const mockOnChange = jest.fn();

        render(
            <UnitNumberField
                value=""
                onChange={mockOnChange}
                placeholder="Suite 123"
            />
        );

        const input = screen.getByRole('textbox');

        expect(input).toHaveAttribute('placeholder', 'Suite 123');
    });

    test('UnitNumberField_shouldNotShowValidationErrors_whenValidationDisabled', () => {
        const mockOnChange = jest.fn();

        render(
            <UnitNumberField
                value=""
                onChange={mockOnChange}
                enableValidation={false}
            />
        );

        const input = screen.getByRole('textbox');
        // Enter a long value that would normally trigger validation
        const longValue = 'This is a very long unit number that exceeds twenty characters';
        fireEvent.change(input, { target: { value: longValue } });
        // Blur the field to simulate leaving it
        fireEvent.blur(input);

        expect(screen.queryByText(/must not exceed/)).not.toBeInTheDocument();
        expect(input).not.toHaveClass('border-red-500');
    });

    test('UnitNumberField_shouldShowValidationErrors_whenValidationEnabledAndFieldTooLong', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        const { rerender } = render(
            <UnitNumberField
                value="long"
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

    const input = screen.getByRole('textbox');

    // First touch the field to enable validation
    fireEvent.focus(input);
    fireEvent.blur(input);

    // Then enter a long value
    const longValue = 'This is a very long unit number that exceeds twenty characters';
    fireEvent.change(input, { target: { value: longValue } });

    // Simulate the parent component updating the value prop
    rerender(
        <UnitNumberField
            value={longValue}
            onChange={mockOnChange}
            enableValidation={true}
            validationMode="optional"
            onValidationChange={mockOnValidationChange}
        />
    );

    // The validation should now show because field was touched
        expect(screen.getByText('Unit number must not exceed 20 characters')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: false, errors: ['Unit number must not exceed 20 characters'] });
    });

    test('UnitNumberField_shouldShowRequiredError_whenValidationRequiredAndFieldEmpty', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        render(
            <UnitNumberField
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

        expect(screen.getByText('Unit number is required')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: false, errors: ['Unit number is required'] });
    });

    test('UnitNumberField_shouldPassValidation_whenValidValueProvided', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        // Start with a value that will pass validation
        const { rerender } = render(
            <UnitNumberField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        // Enter valid value and trigger onChange
        fireEvent.change(input, { target: { value: 'Unit 101' } });

        // Simulate the parent component updating the value prop
        rerender(
            <UnitNumberField
                value="Unit 101"
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        // Now blur to trigger validation
        fireEvent
        fireEvent.blur(input);

        // Should not show any validation errors
        expect(screen.queryByText(/required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/exceed/)).not.toBeInTheDocument();
        expect(input).not.toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: true, errors: [] });
    });

    test('UnitNumberField_shouldNotValidateBeforeTouch_whenValidationEnabled', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        render(
            <UnitNumberField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        fireEvent.change(input, { target: { value: 'This is way too long for a unit number field' } });

        expect(screen.queryByText(/exceed/)).not.toBeInTheDocument();
        expect(input).not.toHaveClass('border-red-500');
    });

    test('UnitNumberField_shouldValidateOnChangeAfterFirstBlur', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        const { rerender } = render(
            <UnitNumberField
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

        fireEvent.change(input, { target: { value: 'This is way too long for a unit number field' } });

        // Simulate the parent component updating the value prop
        rerender(
            <UnitNumberField
                value="This is way too long for a unit number field"
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        expect(screen.getByText('Unit number must not exceed 20 characters')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: false, errors: ['Unit number must not exceed 20 characters'] });
    });

    test('UnitNumberField_shouldHandleEmptyValueInOptionalMode', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        render(
            <UnitNumberField
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

        expect(screen.queryByText(/required/)).not.toBeInTheDocument();
        expect(input).not.toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: true, errors: [] });
    });

    test('UnitNumberField_shouldPrioritizeValidationErrors_overExternalErrors_whenBothPresent', () => {
        const mockOnChange = jest.fn();
        const externalErrors = ['External error message'];

        render(
            <UnitNumberField
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

        expect(screen.getByText('Unit number is required')).toBeInTheDocument();
        expect(screen.queryByText('External error message')).not.toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
    });

    test('UnitNumberField_shouldShowRequiredAsterisk_whenValidationEnabledAndRequired', () => {
        const mockOnChange = jest.fn();

        render(
            <UnitNumberField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
            />
        );

        const asterisk = screen.getByText('*');
        expect(asterisk).toBeInTheDocument();
        expect(asterisk).toHaveClass('text-red-500');
        expect(asterisk).toHaveClass('ml-1');
    });

    test('UnitNumberField_shouldNotShowRequiredAsterisk_whenValidationEnabledButOptional', () => {
        const mockOnChange = jest.fn();

        render(
            <UnitNumberField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
            />
        );

        const asterisk = screen.queryByText('*');
        expect(asterisk).not.toBeInTheDocument();
    });

    test('UnitNumberField_shouldNotShowRequiredAsterisk_whenValidationDisabled', () => {
        const mockOnChange = jest.fn();

        render(
            <UnitNumberField
                value=""
                onChange={mockOnChange}
                enableValidation={false}
                validationMode="required"
            />
        );

        const asterisk = screen.queryByText('*');
        expect(asterisk).not.toBeInTheDocument();
    });

    test('UnitNumberField_shouldShowRequiredAsterisk_withCorrectLabelText', () => {
        const mockOnChange = jest.fn();

        render(
            <UnitNumberField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
            />
        );

        const label = screen.getByText((content, element) => {
            return element?.tagName.toLowerCase() === 'label' && 
                   content.includes('Unit/Apt/Suite');
        });

        expect(label).toBeInTheDocument();
        
        const asterisk = screen.getByText('*');
        expect(label).toContainElement(asterisk);
    });

    test('UnitNumberField_shouldClearValidationErrors_whenValidationDisabled', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        const { rerender } = render(
            <UnitNumberField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        // First, trigger validation error by blurring empty required field
        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(screen.getByText('Unit number is required')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');

        // Now disable validation
        rerender(
            <UnitNumberField
                value=""
                onChange={mockOnChange}
                enableValidation={false}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        // Validation errors should be cleared
        expect(screen.queryByText('Unit number is required')).not.toBeInTheDocument();
        expect(input).not.toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenLastCalledWith({ isValid: true, errors: [] });
    });

    test('UnitNumberField_shouldReValidate_whenValidationModeChanges', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        const { rerender } = render(
            <UnitNumberField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        // Touch the field first (empty value is valid in optional mode)
        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(screen.queryByText('Unit number is required')).not.toBeInTheDocument();

        // Now change to required mode
        rerender(
            <UnitNumberField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        // Should now show required error since field is empty and touched
        expect(screen.getByText('Unit number is required')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenLastCalledWith({ isValid: false, errors: ['Unit number is required'] });
    });

    test('UnitNumberField_shouldClearErrors_whenChangingFromRequiredToOptional', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        const { rerender } = render(
            <UnitNumberField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');

        // First, touch the field
        fireEvent.focus(input);
        // Trigger required validation error
        fireEvent.blur(input);

        expect(screen.getByText(/Unit number is required/)).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');

        // Change to optional mode
        rerender(
            <UnitNumberField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        // Error should be cleared since empty is valid in optional mode
        expect(screen.queryByText('Unit number is required')).not.toBeInTheDocument();
        expect(input).not.toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenLastCalledWith({ isValid: true, errors: [] });
    });
});