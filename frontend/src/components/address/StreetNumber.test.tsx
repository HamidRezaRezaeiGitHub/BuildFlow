import { render, screen, fireEvent } from '@testing-library/react';
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
});