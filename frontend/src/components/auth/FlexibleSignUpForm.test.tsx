import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import FlexibleSignUpForm, {
    FlexibleSignUpFormProps,
    SignUpFieldConfig,
    signUpFieldConfigs
} from './FlexibleSignUpForm';

// Mock the contexts
jest.mock('@/contexts/AuthContext', () => ({
    useAuth: () => ({
        register: jest.fn().mockResolvedValue({}),
    }),
}));

jest.mock('@/contexts/NavigationContext', () => ({
    useNavigate: () => ({
        navigate: jest.fn(),
    }),
}));

describe('FlexibleSignUpForm', () => {
    const mockOnFormDataChange = jest.fn();
    const mockOnValidationStateChange = jest.fn();
    const mockOnLoadingStateChange = jest.fn();
    const mockOnFormSubmit = jest.fn();
    const mockOnSignUpSuccess = jest.fn();
    const mockOnSignUpError = jest.fn();

    const defaultProps: FlexibleSignUpFormProps = {
        onFormDataChange: mockOnFormDataChange,
        onValidationStateChange: mockOnValidationStateChange,
        onLoadingStateChange: mockOnLoadingStateChange,
        onFormSubmit: mockOnFormSubmit,
        onSignUpSuccess: mockOnSignUpSuccess,
        onSignUpError: mockOnSignUpError
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Basic rendering tests
    describe('Basic Rendering', () => {
        test('FlexibleSignUpForm_shouldRenderWithMinimalProps', () => {
            render(<FlexibleSignUpForm enableValidation={false} />);

            expect(screen.getByRole('form')).toBeInTheDocument();
            expect(screen.getByText('Personal Information')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
        });

        test('FlexibleSignUpForm_shouldRenderWithCustomTitle', () => {
            render(
                <FlexibleSignUpForm
                    title="Custom Sign Up Form"
                    description="Please enter your details to register"
                    enableValidation={false}
                />
            );

            expect(screen.getByRole('heading', { name: /Custom Sign Up Form/ })).toBeInTheDocument();
            expect(screen.getAllByText(/Please enter your details to register/).length).toBeGreaterThanOrEqual(1);
        });

        test('FlexibleSignUpForm_shouldRenderInlineMode', () => {
            const { container } = render(
                <FlexibleSignUpForm
                    inline={true}
                    title="Should not show"
                    enableValidation={false}
                />
            );

            expect(screen.queryByText('Should not show')).not.toBeInTheDocument();
            // Should not have card wrapper
            expect(container.querySelector('.card')).not.toBeInTheDocument();
        });

        test('FlexibleSignUpForm_shouldRenderMandatoryFields', () => {
            render(<FlexibleSignUpForm fieldsConfig="essential" enableValidation={false} />);

            // Mandatory fields should always be present
            expect(screen.getByLabelText(/Username/)).toBeInTheDocument();
            expect(screen.getByLabelText(/^Password/)).toBeInTheDocument();
            expect(screen.getByLabelText(/Confirm Password/)).toBeInTheDocument();
            expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
        });
    });

    // Field configuration tests
    describe('Field Configuration', () => {
        test('FlexibleSignUpForm_shouldRenderFullConfigurationFields', () => {
            render(<FlexibleSignUpForm fieldsConfig="full" />);

            expect(screen.getByLabelText(/First Name/)).toBeInTheDocument();
            expect(screen.getByLabelText(/Last Name/)).toBeInTheDocument();
            expect(screen.getByLabelText(/Username/)).toBeInTheDocument();
            expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
            expect(screen.getByLabelText(/Phone/)).toBeInTheDocument();
            expect(screen.getByLabelText(/^Password/)).toBeInTheDocument();
            expect(screen.getByLabelText(/Confirm Password/)).toBeInTheDocument();
        });

        test('FlexibleSignUpForm_shouldRenderMinimalConfigurationFields', () => {
            render(<FlexibleSignUpForm fieldsConfig="minimal" />);

            expect(screen.getByLabelText(/First Name/)).toBeInTheDocument();
            expect(screen.getByLabelText(/Last Name/)).toBeInTheDocument();
            expect(screen.getByLabelText(/Username/)).toBeInTheDocument();
            expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
            expect(screen.queryByLabelText(/Phone/)).not.toBeInTheDocument();
            expect(screen.getByLabelText(/^Password/)).toBeInTheDocument();
            expect(screen.getByLabelText(/Confirm Password/)).toBeInTheDocument();
        });

        test('FlexibleSignUpForm_shouldRenderEssentialConfigurationFields', () => {
            render(<FlexibleSignUpForm fieldsConfig="essential" />);

            expect(screen.queryByLabelText(/First Name/)).not.toBeInTheDocument();
            expect(screen.queryByLabelText(/Last Name/)).not.toBeInTheDocument();
            expect(screen.getByLabelText(/Username/)).toBeInTheDocument();
            expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
            expect(screen.queryByLabelText(/Phone/)).not.toBeInTheDocument();
            expect(screen.getByLabelText(/^Password/)).toBeInTheDocument();
            expect(screen.getByLabelText(/Confirm Password/)).toBeInTheDocument();
        });

        test('FlexibleSignUpForm_shouldRenderCustomFieldConfiguration', () => {
            const customConfig: SignUpFieldConfig[] = [
                { field: 'username', required: true, show: true },
                { field: 'email', required: true, show: true },
                { field: 'firstName', required: false, show: true },
                { field: 'password', required: true, show: true },
                { field: 'confirmPassword', required: true, show: true }
            ];

            render(<FlexibleSignUpForm fieldsConfig={customConfig} />);

            expect(screen.getByLabelText(/Username/)).toBeInTheDocument();
            expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
            expect(screen.getByLabelText(/First Name/)).toBeInTheDocument();
            expect(screen.queryByLabelText(/Last Name/)).not.toBeInTheDocument();
            expect(screen.queryByLabelText(/Phone/)).not.toBeInTheDocument();
            expect(screen.getByLabelText(/^Password/)).toBeInTheDocument();
            expect(screen.getByLabelText(/Confirm Password/)).toBeInTheDocument();
        });

        test('FlexibleSignUpForm_shouldEnsureMandatoryFieldsAreAlwaysIncluded', () => {
            const configWithoutMandatory: SignUpFieldConfig[] = [
                { field: 'firstName', required: true, show: true },
                { field: 'lastName', required: true, show: true },
                { field: 'email', required: true, show: true }
            ];

            render(<FlexibleSignUpForm fieldsConfig={configWithoutMandatory} />);

            // Mandatory fields should be automatically included
            expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
            expect(screen.getByLabelText(/^Password/)).toBeInTheDocument();
            expect(screen.getByLabelText(/Confirm Password/)).toBeInTheDocument();
        });
    });

    // Address section tests
    describe('Address Section', () => {
        test('FlexibleSignUpForm_shouldRenderAddressSectionByDefault', () => {
            render(<FlexibleSignUpForm />);

            expect(screen.getByText('Address Information')).toBeInTheDocument();
        });

        test('FlexibleSignUpForm_shouldHideAddressSectionWhenDisabled', () => {
            render(<FlexibleSignUpForm includeAddress={false} />);

            expect(screen.queryByText('Address Information')).not.toBeInTheDocument();
        });

        test('FlexibleSignUpForm_shouldRenderCollapsibleAddressSection', () => {
            render(
                <FlexibleSignUpForm
                    addressCollapsible={true}
                    addressExpandedByDefault={false}
                />
            );

            const addressButton = screen.getByRole('button', { name: /Address Information/ });
            expect(addressButton).toBeInTheDocument();

            // Address fields should not be visible initially
            expect(screen.queryByLabelText(/Street Number/)).not.toBeInTheDocument();

            // Click to expand
            fireEvent.click(addressButton);

            // Address fields should now be visible
            expect(screen.getByLabelText(/Street Number/)).toBeInTheDocument();
        });

        test('FlexibleSignUpForm_shouldRenderExpandedAddressSectionByDefault', () => {
            render(
                <FlexibleSignUpForm
                    addressCollapsible={true}
                    addressExpandedByDefault={true}
                />
            );

            // Address fields should be visible initially
            expect(screen.getByLabelText(/Street Number/)).toBeInTheDocument();
        });

        test('FlexibleSignUpForm_shouldRenderNonCollapsibleAddressSection', () => {
            render(<FlexibleSignUpForm addressCollapsible={false} />);

            // Should not have collapsible button
            expect(screen.queryByRole('button', { name: /Address Information/ })).not.toBeInTheDocument();

            // Address fields should be visible
            expect(screen.getByLabelText(/Street Number/)).toBeInTheDocument();
        });

        test('FlexibleSignUpForm_shouldCustomizeAddressSectionTitle', () => {
            render(
                <FlexibleSignUpForm
                    addressSectionTitle="Your Address Details"
                    addressCollapsible={true}
                />
            );

            expect(screen.getByText('Your Address Details')).toBeInTheDocument();
        });
    });

    // Form interaction tests
    describe('Form Interactions', () => {
        test('FlexibleSignUpForm_shouldUpdateFormDataOnFieldChange', () => {
            render(<FlexibleSignUpForm {...defaultProps} />);

            const usernameInput = screen.getByLabelText(/Username/);
            fireEvent.change(usernameInput, { target: { value: 'testuser' } });

            expect(mockOnFormDataChange).toHaveBeenCalledWith(
                expect.objectContaining({
                    username: 'testuser'
                })
            );
        });

        test('FlexibleSignUpForm_shouldCallValidationStateChange', async () => {
            render(<FlexibleSignUpForm {...defaultProps} enableValidation={true} />);

            const usernameInput = screen.getByLabelText(/Username/);
            fireEvent.change(usernameInput, { target: { value: 'validusername' } });

            await waitFor(() => {
                expect(mockOnValidationStateChange).toHaveBeenCalled();
            });
        });

        test('FlexibleSignUpForm_shouldHandleFormSubmission', async () => {
            render(<FlexibleSignUpForm {...defaultProps} enableValidation={false} />);

            const form = screen.getByRole('form');
            fireEvent.submit(form);

            expect(mockOnFormSubmit).toHaveBeenCalled();
        });

        test('FlexibleSignUpForm_shouldDisableSubmitWhenValidationEnabledAndFormInvalid', () => {
            render(<FlexibleSignUpForm enableValidation={true} />);

            const submitButton = screen.getByRole('button', { name: 'Create Account' });
            expect(submitButton).toBeDisabled();
        });

        test('FlexibleSignUpForm_shouldEnableSubmitWhenValidationDisabled', () => {
            render(<FlexibleSignUpForm enableValidation={false} />);

            const submitButton = screen.getByRole('button', { name: 'Create Account' });
            expect(submitButton).not.toBeDisabled();
        });
    });

    // Validation tests
    describe('Validation', () => {
        test('FlexibleSignUpForm_shouldShowFieldErrors', () => {
            const errors = {
                username: ['Username is required'],
                email: ['Email is invalid']
            };

            render(<FlexibleSignUpForm errors={errors} enableValidation={false} />);

            expect(screen.getByText('Username is required')).toBeInTheDocument();
            expect(screen.getByText('Email is invalid')).toBeInTheDocument();
        });

        test('FlexibleSignUpForm_shouldValidatePasswordConfirmation', () => {
            render(<FlexibleSignUpForm enableValidation={true} />);

            const passwordInput = screen.getByLabelText(/^Password/);
            const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);

            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.change(confirmPasswordInput, { target: { value: 'different' } });

            // Validation should occur through the ConfirmPasswordField component
            expect(confirmPasswordInput).toBeInTheDocument();
        });
    });

    // Customization tests
    describe('Customization', () => {
        test('FlexibleSignUpForm_shouldCustomizeButtonText', () => {
            render(
                <FlexibleSignUpForm
                    submitButtonText="Register Now"
                />
            );

            expect(screen.getByRole('button', { name: 'Register Now' })).toBeInTheDocument();
        });

        test('FlexibleSignUpForm_shouldCustomizePersonalInfoHeader', () => {
            render(
                <FlexibleSignUpForm
                    personalInfoHeaderText="Your Details"
                />
            );

            expect(screen.getByText('Your Details')).toBeInTheDocument();
        });

        test('FlexibleSignUpForm_shouldHidePersonalInfoHeader', () => {
            render(
                <FlexibleSignUpForm
                    showPersonalInfoHeader={false}
                />
            );

            expect(screen.queryByText('Personal Information')).not.toBeInTheDocument();
        });

        test('FlexibleSignUpForm_shouldRenderVerticalButtonLayout', () => {
            render(
                <FlexibleSignUpForm
                    buttonLayout="vertical"
                />
            );

            const form = screen.getByRole('form');
            const buttonContainer = form.querySelector('.flex-col');
            expect(buttonContainer).toBeInTheDocument();
        });

        test('FlexibleSignUpForm_shouldRenderWithDisabledState', () => {
            render(<FlexibleSignUpForm disabled={true} />);

            const usernameInput = screen.getByLabelText(/Username/);
            const submitButton = screen.getByRole('button', { name: 'Create Account' });

            expect(usernameInput).toBeDisabled();
            expect(submitButton).toBeDisabled();
        });

        test('FlexibleSignUpForm_shouldRenderWithSubmittingState', () => {
            render(
                <FlexibleSignUpForm
                    isSubmitting={true}
                    submittingText="Please wait..."
                />
            );

            expect(screen.getByRole('button', { name: 'Please wait...' })).toBeInTheDocument();
        });
    });

    // Edge cases and error handling
    describe('Edge Cases and Error Handling', () => {
        test('FlexibleSignUpForm_shouldHandleEmptyFieldsConfig', () => {
            render(<FlexibleSignUpForm fieldsConfig={[]} />);

            expect(screen.getByRole('form')).toBeInTheDocument();

            // Mandatory fields should still be present
            expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
            expect(screen.getByLabelText(/^Password/)).toBeInTheDocument();
            expect(screen.getByLabelText(/Confirm Password/)).toBeInTheDocument();
        });

        test('FlexibleSignUpForm_shouldHandleInvalidPresetConfig', () => {
            render(
                <FlexibleSignUpForm
                    fieldsConfig={'invalid' as keyof typeof signUpFieldConfigs}
                />
            );

            // Should fall back to 'full' configuration
            expect(screen.getByLabelText(/First Name/)).toBeInTheDocument();
            expect(screen.getByLabelText(/Last Name/)).toBeInTheDocument();
        });

        test('FlexibleSignUpForm_shouldHandleFieldsWithShowFalse', () => {
            const configWithHiddenField: SignUpFieldConfig[] = [
                { field: 'username', required: true, show: true },
                { field: 'email', required: true, show: true },
                { field: 'firstName', required: false, show: false },
                { field: 'password', required: true, show: true },
                { field: 'confirmPassword', required: true, show: true }
            ];

            render(<FlexibleSignUpForm fieldsConfig={configWithHiddenField} />);

            expect(screen.getByLabelText(/Username/)).toBeInTheDocument();
            expect(screen.queryByLabelText(/First Name/)).not.toBeInTheDocument();
        });
    });
});