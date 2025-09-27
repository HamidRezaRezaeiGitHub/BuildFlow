import { AddressForm, createEmptyAddress } from '@/components/address';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from '@/contexts/NavigationContext';
import { AddressData } from '@/services/dtos';
import { ValidationResult } from '@/services/validation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ConfirmPasswordField } from './ConfirmPassword';
import { EmailField } from './Email';
import { NameField } from './Name';
import { PasswordField } from './Password';
import { PhoneField } from './Phone';

export interface LongSignUpFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    // Address fields
    unitNumber: string;
    streetNumber: string;
    streetName: string;
    city: string;
    stateOrProvince: string;
    postalOrZipCode: string;
    country: string;
}

export interface LongSignUpFormProps {
    // Optional form configuration
    title?: string;
    description?: string;
    inline?: boolean;
    className?: string;

    // Form callbacks
    onValidationStateChange?: (isValid: boolean) => void;
    onFormDataChange?: (formData: LongSignUpFormData) => void;
    onLoadingStateChange?: (isLoading: boolean) => void;
    onFormSubmit?: (formData: LongSignUpFormData) => void;
    onSignUpSuccess?: () => void;
    onSignUpError?: (error: string) => void;

    // Validation configuration
    enableValidation?: boolean;

    // External errors (from parent)
    errors?: Record<string, string[]>;

    /** Whether the form is disabled */
    disabled?: boolean;

    /** Custom required fields configuration */
    requiredFields?: {
        firstName?: boolean;
        lastName?: boolean;
        email?: boolean;
        password?: boolean;
        confirmPassword?: boolean;
        phone?: boolean;
        address?: boolean;
    };

    /** Redirect path after successful signup (default: '/dashboard') */
    redirectPath?: string;

    /** Whether to auto-redirect after successful signup (default: true) */
    autoRedirect?: boolean;

    /** Whether to include address section (default: true) */
    includeAddress?: boolean;

    /** Whether address section is expanded by default (default: false) */
    addressExpandedByDefault?: boolean;

    /** Whether address is skippable/optional (default: true) */
    addressIsSkippable?: boolean;

    /** Custom address section title */
    addressSectionTitle?: string;
}

export const LongSignUpForm: React.FC<LongSignUpFormProps> = ({
    title = "Create your account",
    description = "Enter your complete information to get started",
    inline = false,
    className = '',
    onValidationStateChange,
    onFormDataChange,
    onLoadingStateChange,
    onFormSubmit,
    onSignUpSuccess,
    onSignUpError,
    enableValidation = true,
    errors = {},
    disabled = false,
    requiredFields = {
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        confirmPassword: true,
        phone: false,
        address: false
    },
    redirectPath = '/dashboard',
    autoRedirect = true,
    includeAddress = true,
    addressExpandedByDefault = false,
    addressIsSkippable = true,
    addressSectionTitle = "Address Information (Optional)"
}) => {
    // Initialize form data with empty address
    const [signUpForm, setSignUpForm] = useState<LongSignUpFormData>(() => {
        const emptyAddress = createEmptyAddress();
        return {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            // Address fields
            unitNumber: emptyAddress.unitNumber || '',
            streetNumber: emptyAddress.streetNumber || '',
            streetName: emptyAddress.streetName,
            city: emptyAddress.city,
            stateOrProvince: emptyAddress.stateOrProvince,
            postalOrZipCode: emptyAddress.postalOrZipCode || '',
            country: emptyAddress.country
        };
    });

    // Internal state for password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Address section state
    const [addressExpanded, setAddressExpanded] = useState(addressExpandedByDefault);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [fieldValidationState, setFieldValidationState] = useState<{
        [key: string]: ValidationResult
    }>({});

    const { register } = useAuth();
    const { navigate } = useNavigate();

    // Password visibility toggle functions
    const handleTogglePassword = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const handleToggleConfirmPassword = useCallback(() => {
        setShowConfirmPassword(prev => !prev);
    }, []);

    // Handle field validation changes
    const handleFieldValidationChange = useCallback((fieldName: string, validationResult: ValidationResult) => {
        setFieldValidationState(prev => {
            // Only update if validation result has changed
            const currentState = prev[fieldName];
            if (currentState?.isValid === validationResult.isValid &&
                JSON.stringify(currentState?.errors) === JSON.stringify(validationResult.errors)) {
                return prev;
            }

            return {
                ...prev,
                [fieldName]: validationResult
            };
        });
    }, []);

    // Check if all fields are valid
    const isFormValid = useMemo(() => {
        if (!enableValidation) return true;

        const fieldsToValidate = Object.keys(requiredFields).filter(
            (field) => requiredFields[field as keyof typeof requiredFields]
        );

        return fieldsToValidate.every(field => {
            const validation = fieldValidationState[field];
            return validation ? validation.isValid : false;
        });
    }, [fieldValidationState, enableValidation, requiredFields]);

    // Check if form has sufficient data to submit
    const isFormValidForSubmit = useMemo(() => {
        if (!enableValidation) {
            // Without validation, check basic required fields have content
            const basicFieldsValid = signUpForm.firstName.trim().length > 0 &&
                signUpForm.lastName.trim().length > 0 &&
                signUpForm.email.trim().length > 0 &&
                signUpForm.password.length > 0 &&
                signUpForm.confirmPassword.length > 0;

            // If address is required, check address fields too
            if (requiredFields.address && includeAddress && !addressIsSkippable) {
                const addressValid = signUpForm.streetNumber.trim().length > 0 &&
                    signUpForm.streetName.trim().length > 0 &&
                    signUpForm.city.trim().length > 0 &&
                    signUpForm.stateOrProvince.trim().length > 0 &&
                    signUpForm.postalOrZipCode.trim().length > 0 &&
                    signUpForm.country.trim().length > 0;
                return basicFieldsValid && addressValid;
            }

            return basicFieldsValid;
        }
        return isFormValid;
    }, [enableValidation, isFormValid, signUpForm, requiredFields, includeAddress, addressIsSkippable]);

    // Handle form data changes
    const handleFormDataChange = useCallback((field: keyof LongSignUpFormData, value: string) => {
        setSignUpForm(prev => {
            const newFormData = { ...prev, [field]: value };

            // Call form data change callback
            if (onFormDataChange) {
                onFormDataChange(newFormData);
            }

            return newFormData;
        });
        if (submitError) setSubmitError(null);
    }, [onFormDataChange, submitError]);

    // Handle address data changes
    const handleAddressChange = useCallback((field: keyof AddressData, value: string) => {
        handleFormDataChange(field, value);
    }, [handleFormDataChange]);

    // Notify parent of validation state changes
    useEffect(() => {
        if (onValidationStateChange) {
            onValidationStateChange(isFormValid);
        }
    }, [isFormValid, onValidationStateChange]);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (disabled || isSubmitting || !isFormValidForSubmit) return;

        // Call form submit callback
        if (onFormSubmit) {
            onFormSubmit(signUpForm);
        }

        setIsSubmitting(true);
        setSubmitError(null);

        // Call loading state change callback
        if (onLoadingStateChange) {
            onLoadingStateChange(true);
        }

        try {
            // Use email as username for signup
            await register({
                username: signUpForm.email, // Use email as username
                password: signUpForm.password,
                contactRequestDto: {
                    firstName: signUpForm.firstName,
                    lastName: signUpForm.lastName,
                    email: signUpForm.email,
                    phone: signUpForm.phone || undefined,
                    labels: [], // Could be extended to support labels
                    addressRequestDto: includeAddress && (
                        signUpForm.streetName.trim() ||
                        signUpForm.city.trim() ||
                        signUpForm.stateOrProvince.trim() ||
                        signUpForm.country.trim()
                    ) ? {
                        unitNumber: signUpForm.unitNumber || undefined,
                        streetNumber: signUpForm.streetNumber || undefined,
                        streetName: signUpForm.streetName.trim(),
                        city: signUpForm.city.trim(),
                        stateOrProvince: signUpForm.stateOrProvince.trim(),
                        postalOrZipCode: signUpForm.postalOrZipCode || undefined,
                        country: signUpForm.country.trim()
                    } : undefined
                }
            });

            setSubmitSuccess(true);

            // Auto-redirect after success if enabled
            if (autoRedirect) {
                setTimeout(() => {
                    if (onSignUpSuccess) {
                        onSignUpSuccess();
                    } else {
                        // Default redirect behavior using navigate
                        navigate(redirectPath);
                    }
                }, 2000);
            } else if (onSignUpSuccess) {
                onSignUpSuccess();
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
            setSubmitError(errorMessage);
            if (onSignUpError) onSignUpError(errorMessage);
        } finally {
            setIsSubmitting(false);

            // Call loading state change callback
            if (onLoadingStateChange) {
                onLoadingStateChange(false);
            }
        }
    };

    // Get address data for AddressForm
    const addressData: AddressData = useMemo(() => ({
        unitNumber: signUpForm.unitNumber,
        streetNumber: signUpForm.streetNumber,
        streetName: signUpForm.streetName,
        city: signUpForm.city,
        stateOrProvince: signUpForm.stateOrProvince,
        postalOrZipCode: signUpForm.postalOrZipCode,
        country: signUpForm.country
    }), [signUpForm]);

    // Form content
    const formContent = (
        <form onSubmit={handleSignUp} className={`space-y-6 ${className}`}>
            {/* Name Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name Field */}
                <NameField
                    nameType="firstName"
                    id="longSignUpFirstName"
                    value={signUpForm.firstName}
                    onChange={(value) => handleFormDataChange('firstName', value)}
                    enableValidation={enableValidation}
                    validationMode={requiredFields.firstName ? 'required' : 'optional'}
                    onValidationChange={(validationResult) => handleFieldValidationChange('firstName', validationResult)}
                    errors={errors.firstName}
                    disabled={disabled}
                />

                {/* Last Name Field */}
                <NameField
                    nameType="lastName"
                    id="longSignUpLastName"
                    value={signUpForm.lastName}
                    onChange={(value) => handleFormDataChange('lastName', value)}
                    enableValidation={enableValidation}
                    validationMode={requiredFields.lastName ? 'required' : 'optional'}
                    onValidationChange={(validationResult) => handleFieldValidationChange('lastName', validationResult)}
                    errors={errors.lastName}
                    disabled={disabled}
                />
            </div>

            {/* Email Field */}
            <EmailField
                id="longSignUpEmail"
                value={signUpForm.email}
                onChange={(value) => handleFormDataChange('email', value)}
                enableValidation={enableValidation}
                validationMode={requiredFields.email ? 'required' : 'optional'}
                onValidationChange={(validationResult) => handleFieldValidationChange('email', validationResult)}
                errors={errors.email}
                placeholder="john@company.com"
                disabled={disabled}
            />

            {/* Phone Field */}
            <PhoneField
                id="longSignUpPhone"
                value={signUpForm.phone}
                onChange={(value) => handleFormDataChange('phone', value)}
                enableValidation={enableValidation}
                validationMode={requiredFields.phone ? 'required' : 'optional'}
                onValidationChange={(validationResult) => handleFieldValidationChange('phone', validationResult)}
                errors={errors.phone}
                placeholder="+1 (416) 123-4567"
                disabled={disabled}
            />

            {/* Password Field */}
            <PasswordField
                id="longSignUpPassword"
                value={signUpForm.password}
                onChange={(value) => handleFormDataChange('password', value)}
                disabled={disabled}
                placeholder="Create your password"
                showPassword={showPassword}
                onToggleVisibility={handleTogglePassword}
                enableValidation={enableValidation}
                validationMode={requiredFields.password ? 'required' : 'optional'}
                validationType="signup"
                onValidationChange={(validationResult) => handleFieldValidationChange('password', validationResult)}
                errors={errors.password}
            />

            {/* Confirm Password Field */}
            <ConfirmPasswordField
                id="longConfirmPassword"
                value={signUpForm.confirmPassword}
                onChange={(value) => handleFormDataChange('confirmPassword', value)}
                placeholder="Confirm your password"
                showPassword={showConfirmPassword}
                onToggleVisibility={handleToggleConfirmPassword}
                originalPassword={signUpForm.password}
                enableValidation={enableValidation}
                validationMode={requiredFields.confirmPassword ? 'required' : 'optional'}
                onValidationChange={(validationResult) => handleFieldValidationChange('confirmPassword', validationResult)}
                errors={errors.confirmPassword}
                disabled={disabled}
            />

            {/* Address Section - Collapsible */}
            {includeAddress && (
                <Collapsible open={addressExpanded} onOpenChange={setAddressExpanded}>
                    <CollapsibleTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-between"
                            disabled={disabled || isSubmitting}
                        >
                            <span className="flex items-center">
                                {addressSectionTitle}
                                {requiredFields.address && !addressIsSkippable && (
                                    <span className="text-red-500 ml-1">*</span>
                                )}
                            </span>
                            {addressExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 mt-4">
                        <AddressForm
                            addressData={addressData}
                            onAddressChange={handleAddressChange}
                            onSubmit={() => { }} // No-op since this is integrated
                            inline={true}
                            enableValidation={enableValidation}
                            isSkippable={addressIsSkippable}
                            showAddressPanelHeader={false} // Already have collapsible header
                            disabled={disabled || isSubmitting}
                            errors={{
                                unitNumber: errors.unitNumber,
                                streetNumber: errors.streetNumber,
                                streetName: errors.streetName,
                                city: errors.city,
                                stateOrProvince: errors.stateOrProvince,
                                postalOrZipCode: errors.postalOrZipCode,
                                country: errors.country
                            }}
                        />
                    </CollapsibleContent>
                </Collapsible>
            )}

            {/* Error Message */}
            {submitError && (
                <div className="p-4 rounded-md bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600">{submitError}</p>
                </div>
            )}

            {/* Success Message */}
            {submitSuccess && (
                <div className="p-4 rounded-md bg-green-50 border border-green-200">
                    <p className="text-sm text-green-600">
                        Account created successfully! Redirecting you to your dashboard...
                    </p>
                </div>
            )}

            <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={disabled || isSubmitting || !isFormValidForSubmit}
            >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
        </form>
    );

    // Return inline version (just the form)
    if (inline) {
        return (
            <div className={className}>
                {formContent}
            </div>
        );
    }

    // Return card version (with header)
    return (
        <Card className={className}>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">{title}</CardTitle>
                <CardDescription className="text-center">
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {formContent}
            </CardContent>
        </Card>
    );
};

export default LongSignUpForm;