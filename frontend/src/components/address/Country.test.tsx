import { fireEvent, render, screen } from '@testing-library/react';
import { CountryField } from './Country';

describe('CountryField', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Basic functionality tests
    test('CountryField_shouldRenderWithDefaultProps', () => {
        const mockOnChange = jest.fn();
        
        render(<CountryField value="" onChange={mockOnChange} />);

        const input = screen.getByRole('textbox');
        const label = screen.getByText('Country');

        expect(input).toBeInTheDocument();
        expect(label).toBeInTheDocument();
        expect(input).toHaveAttribute('placeholder', 'Canada');
        expect(input).toHaveValue('');
    });

    test('CountryField_shouldCallOnChange_whenValueChanges', () => {
        const mockOnChange = jest.fn();
        
        render(<CountryField value="" onChange={mockOnChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'United States' } });

        expect(mockOnChange).toHaveBeenCalledWith('United States');
    });

    test('CountryField_shouldDisplayExternalErrors_whenErrorsProvided', () => {
        const mockOnChange = jest.fn();
        const errors = ['Country is invalid'];
        
        render(<CountryField value="Invalid" onChange={mockOnChange} errors={errors} />);

        expect(screen.getByText('Country is invalid')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveClass('border-red-500');
    });

    // Validation tests
    test('CountryField_shouldShowRequiredError_whenEmptyAndRequired', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        render(
            <CountryField
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

        expect(screen.getByText('Country is required')).toBeInTheDocument();
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: false, errors: ['Country is required'] });
    });

    test('CountryField_shouldPassValidation_whenValidCountryProvided', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        const { rerender } = render(
            <CountryField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'United Kingdom' } });

        rerender(
            <CountryField
                value="United Kingdom"
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

    test('CountryField_shouldShowMaxLengthError_whenExceedsLimit', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();
        const longName = 'A'.repeat(61);

        const { rerender } = render(
            <CountryField
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
            <CountryField
                value={longName}
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(screen.getByText('Country name must not exceed 60 characters')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
    });

    test('CountryField_shouldShowMinLengthError_whenTooShort', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        const { rerender } = render(
            <CountryField
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
            <CountryField
                value="A"
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(screen.getByText('Country name must be at least 2 characters long')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
    });

    test('CountryField_shouldShowInvalidCharacterError_whenContainsNumbers', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        const { rerender } = render(
            <CountryField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Canada123' } });

        rerender(
            <CountryField
                value="Canada123"
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(screen.getByText('Country name must contain only letters, spaces, hyphens, and periods')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
    });

    test('CountryField_shouldAllowValidSpecialCharacters_inCountryNames', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        const { rerender } = render(
            <CountryField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'St. Vincent-Grenadines' } });

        rerender(
            <CountryField
                value="St. Vincent-Grenadines"
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        fireEvent.blur(input);

        expect(screen.queryByText(/contain only/)).not.toBeInTheDocument();
        expect(input).not.toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: true, errors: [] });
    });

    test('CountryField_shouldHandleEmptyValueInOptionalMode', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        render(
            <CountryField
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

    test('CountryField_shouldShowRequiredIndicator_whenRequiredModeEnabled', () => {
        const mockOnChange = jest.fn();

        render(
            <CountryField
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

    test('CountryField_shouldClearValidationErrors_whenValidationDisabled', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        const { rerender } = render(
            <CountryField
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
        expect(screen.getByText('Country is required')).toBeInTheDocument();

        rerender(
            <CountryField
                value=""
                onChange={mockOnChange}
                enableValidation={false}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        expect(screen.queryByText('Country is required')).not.toBeInTheDocument();
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: true, errors: [] });
    });
});