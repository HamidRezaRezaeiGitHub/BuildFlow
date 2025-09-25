import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AddressData } from '@/services/dtos';
import AddressForm from './AddressForm';

describe('AddressForm', () => {
    const mockOnAddressChange = jest.fn();
    const mockOnSubmit = jest.fn();
    const mockOnSkip = jest.fn();
    const mockOnReset = jest.fn();

    const defaultAddressData: AddressData = {
        unitNumber: '',
        streetNumber: '',
        streetName: '',
        city: '',
        stateOrProvince: '',
        postalOrZipCode: '',
        country: ''
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Basic rendering tests
    test('AddressForm_shouldRenderWithMinimalProps', () => {
        render(
            <AddressForm
                addressData={defaultAddressData}
                onAddressChange={mockOnAddressChange}
                onSubmit={mockOnSubmit}
            />
        );

        expect(screen.getByRole('form')).toBeInTheDocument();
        expect(screen.getByText('Address Information')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    test('AddressForm_shouldRenderAllAddressFields', () => {
        render(
            <AddressForm
                addressData={defaultAddressData}
                onAddressChange={mockOnAddressChange}
                onSubmit={mockOnSubmit}
            />
        );

        expect(screen.getByLabelText(/Unit\/Apt\/Suite/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Street Number/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Street Name/)).toBeInTheDocument();
        expect(screen.getByLabelText(/City/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Province\/State/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Postal Code\/Zip Code/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Country/)).toBeInTheDocument();
    });

    test('AddressForm_shouldShowOptionalButtons_whenCallbacksProvided', () => {
        render(
            <AddressForm
                addressData={defaultAddressData}
                onAddressChange={mockOnAddressChange}
                onSubmit={mockOnSubmit}
                onSkip={mockOnSkip}
                onReset={mockOnReset}
            />
        );

        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Skip' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
    });

    // Field interaction tests
    test('AddressForm_shouldCallOnAddressChange_whenFieldValuesChange', () => {
        render(
            <AddressForm
                addressData={defaultAddressData}
                onAddressChange={mockOnAddressChange}
                onSubmit={mockOnSubmit}
            />
        );

        const unitNumberInput = screen.getByLabelText(/Unit\/Apt\/Suite/);
        fireEvent.change(unitNumberInput, { target: { value: '101' } });

        expect(mockOnAddressChange).toHaveBeenCalledWith('unitNumber', '101');
    });

    test('AddressForm_shouldDisplayFieldValues_whenAddressDataProvided', () => {
        const populatedAddressData: AddressData = {
            unitNumber: '101',
            streetNumber: '123',
            streetName: 'Main Street',
            city: 'Toronto',
            stateOrProvince: 'ON',
            postalOrZipCode: 'M5H 2N2',
            country: 'Canada'
        };

        render(
            <AddressForm
                addressData={populatedAddressData}
                onAddressChange={mockOnAddressChange}
                onSubmit={mockOnSubmit}
            />
        );

        expect(screen.getByDisplayValue('101')).toBeInTheDocument();
        expect(screen.getByDisplayValue('123')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Main Street')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Toronto')).toBeInTheDocument();
        expect(screen.getByDisplayValue('ON')).toBeInTheDocument();
        expect(screen.getByDisplayValue('M5H 2N2')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Canada')).toBeInTheDocument();
    });

    // Form submission tests
    test('AddressForm_shouldCallOnSubmit_whenFormSubmitted', async () => {
        render(
            <AddressForm
                addressData={defaultAddressData}
                onAddressChange={mockOnAddressChange}
                onSubmit={mockOnSubmit}
            />
        );

        const submitButton = screen.getByRole('button', { name: 'Submit' });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(defaultAddressData);
        });
    });

    test('AddressForm_shouldCallOnSkip_whenSkipButtonClicked', () => {
        render(
            <AddressForm
                addressData={defaultAddressData}
                onAddressChange={mockOnAddressChange}
                onSubmit={mockOnSubmit}
                onSkip={mockOnSkip}
            />
        );

        const skipButton = screen.getByRole('button', { name: 'Skip' });
        fireEvent.click(skipButton);

        expect(mockOnSkip).toHaveBeenCalled();
    });

    test('AddressForm_shouldCallOnReset_whenResetButtonClicked', () => {
        render(
            <AddressForm
                addressData={defaultAddressData}
                onAddressChange={mockOnAddressChange}
                onSubmit={mockOnSubmit}
                onReset={mockOnReset}
            />
        );

        const resetButton = screen.getByRole('button', { name: 'Reset' });
        fireEvent.click(resetButton);

        expect(mockOnReset).toHaveBeenCalled();
    });

    // Validation tests
    test('AddressForm_shouldShowRequiredIndicators_whenValidationEnabledAndRequired', () => {
        render(
            <AddressForm
                addressData={defaultAddressData}
                onAddressChange={mockOnAddressChange}
                onSubmit={mockOnSubmit}
                enableValidation={true}
                isSkippable={false}
            />
        );

        // All fields should show required indicators
        const requiredIndicators = screen.getAllByText('*');
        expect(requiredIndicators).toHaveLength(7); // All 7 address fields
    });

    test('AddressForm_shouldNotShowRequiredIndicators_whenValidationEnabledButOptional', () => {
        render(
            <AddressForm
                addressData={defaultAddressData}
                onAddressChange={mockOnAddressChange}
                onSubmit={mockOnSubmit}
                enableValidation={true}
                isSkippable={true}
            />
        );

        // No required indicators should be shown
        expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    test('AddressForm_shouldDisableSubmitButton_whenValidationEnabledAndFormInvalid', async () => {
        render(
            <AddressForm
                addressData={defaultAddressData}
                onAddressChange={mockOnAddressChange}
                onSubmit={mockOnSubmit}
                enableValidation={true}
                isSkippable={false}
            />
        );

        const submitButton = screen.getByRole('button', { name: 'Submit' });
        
        // Form should be invalid initially (empty required fields)
        expect(submitButton).toBeDisabled();
    });

    test('AddressForm_shouldEnableSubmitButton_whenValidationDisabled', () => {
        render(
            <AddressForm
                addressData={defaultAddressData}
                onAddressChange={mockOnAddressChange}
                onSubmit={mockOnSubmit}
                enableValidation={false}
            />
        );

        const submitButton = screen.getByRole('button', { name: 'Submit' });
        
        // Form should be valid when validation is disabled
        expect(submitButton).not.toBeDisabled();
    });

    // Disabled state tests
    test('AddressForm_shouldDisableAllFields_whenDisabledPropTrue', () => {
        render(
            <AddressForm
                addressData={defaultAddressData}
                onAddressChange={mockOnAddressChange}
                onSubmit={mockOnSubmit}
                disabled={true}
            />
        );

        const inputs = screen.getAllByRole('textbox');
        inputs.forEach(input => {
            expect(input).toBeDisabled();
        });

        const buttons = screen.getAllByRole('button');
        buttons.forEach(button => {
            expect(button).toBeDisabled();
        });
    });

    test('AddressForm_shouldShowSubmittingState_whenIsSubmittingTrue', () => {
        render(
            <AddressForm
                addressData={defaultAddressData}
                onAddressChange={mockOnAddressChange}
                onSubmit={mockOnSubmit}
                isSubmitting={true}
                submittingText="Saving..."
            />
        );

        expect(screen.getByRole('button', { name: 'Saving...' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();
    });

    // Custom text and styling tests
    test('AddressForm_shouldUseCustomButtonTexts_whenProvided', () => {
        render(
            <AddressForm
                addressData={defaultAddressData}
                onAddressChange={mockOnAddressChange}
                onSubmit={mockOnSubmit}
                onSkip={mockOnSkip}
                onReset={mockOnReset}
                submitButtonText="Save Address"
                skipButtonText="Skip This Step"
                resetButtonText="Clear Form"
            />
        );

        expect(screen.getByRole('button', { name: 'Save Address' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Skip This Step' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Clear Form' })).toBeInTheDocument();
    });

    test('AddressForm_shouldShowCustomHeaderAndDescription_whenProvided', () => {
        render(
            <AddressForm
                addressData={defaultAddressData}
                onAddressChange={mockOnAddressChange}
                onSubmit={mockOnSubmit}
                title="Custom Address Title"
                description="Please enter your address details below."
                inline={false}
            />
        );

        expect(screen.getByText('Custom Address Title')).toBeInTheDocument();
        expect(screen.getByText('Please enter your address details below.')).toBeInTheDocument();
    });

    test('AddressForm_shouldDisplayExternalErrors_whenErrorsProvided', () => {
        const addressErrors = {
            city: ['City is required'],
            postalOrZipCode: ['Invalid postal code format']
        };

        render(
            <AddressForm
                addressData={defaultAddressData}
                onAddressChange={mockOnAddressChange}
                onSubmit={mockOnSubmit}
                errors={addressErrors}
            />
        );

        expect(screen.getByText('City is required')).toBeInTheDocument();
        expect(screen.getByText('Invalid postal code format')).toBeInTheDocument();
    });

    // Layout tests
    test('AddressForm_shouldRenderInline_whenInlinePropTrue', () => {
        const { container } = render(
            <AddressForm
                addressData={defaultAddressData}
                onAddressChange={mockOnAddressChange}
                onSubmit={mockOnSubmit}
                inline={true}
                title="Should Not Show"
                description="Should Not Show"
            />
        );

        // When inline, title and description should not be shown
        expect(screen.queryByText('Should Not Show')).not.toBeInTheDocument();
        
        // Form should not be wrapped in the container div
        expect(container.querySelector('.max-w-2xl')).not.toBeInTheDocument();
    });

    test('AddressForm_shouldUseVerticalButtonLayout_whenSpecified', () => {
        render(
            <AddressForm
                addressData={defaultAddressData}
                onAddressChange={mockOnAddressChange}
                onSubmit={mockOnSubmit}
                onSkip={mockOnSkip}
                buttonLayout="vertical"
            />
        );

        const buttonContainer = screen.getByRole('button', { name: 'Submit' }).closest('div');
        expect(buttonContainer).toHaveClass('flex-col');
    });
});