import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from '@/contexts/NavigationContext';
import { ValidationResult } from '@/services/validation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ConfirmPasswordField } from './ConfirmPassword';
import { EmailField } from './Email';
import { NameField } from './Name';
import { PasswordField } from './Password';

export interface ShortSignUpFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ShortSignUpFormProps {
    // Optional form configuration
    title?: string;
    description?: string;
    inline?: boolean;
    className?: string;

    // Form callbacks
    onValidationStateChange?: (isValid: boolean) => void;
    onFormDataChange?: (formData: ShortSignUpFormData) => void;
    onLoadingStateChange?: (isLoading: boolean) => void;
    onFormSubmit?: (formData: ShortSignUpFormData) => void;
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
    };

    /** Redirect path after successful signup (default: '/dashboard') */
    redirectPath?: string;

    /** Whether to auto-redirect after successful signup (default: true) */
    autoRedirect?: boolean;
}

export const ShortSignUpForm: React.FC<ShortSignUpFormProps> = ({
    title = "Create your account",
    description = "Enter your details to get started",
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
        confirmPassword: true
    },
    redirectPath = '/dashboard',
    autoRedirect = true
}) => {
    const [signUpForm, setSignUpForm] = useState<ShortSignUpFormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // Internal state for password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
            return signUpForm.firstName.trim().length > 0 &&
                   signUpForm.lastName.trim().length > 0 &&
                   signUpForm.email.trim().length > 0 &&
                   signUpForm.password.length > 0 &&
                   signUpForm.confirmPassword.length > 0;
        }
        return isFormValid;
    }, [enableValidation, isFormValid, signUpForm, requiredFields]);

    // Handle form data changes
    const handleFormDataChange = useCallback((field: keyof ShortSignUpFormData, value: string) => {
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
                    phone: undefined,
                    labels: [],
                    addressRequestDto: undefined // No address in short signup
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

    // Form content
    const formContent = (
        <form onSubmit={handleSignUp} className={`space-y-4 ${className}`}>
            {/* Name Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name Field */}
                <NameField
                    nameType="firstName"
                    id="shortSignUpFirstName"
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
                    id="shortSignUpLastName"
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
                id="shortSignUpEmail"
                value={signUpForm.email}
                onChange={(value) => handleFormDataChange('email', value)}
                enableValidation={enableValidation}
                validationMode={requiredFields.email ? 'required' : 'optional'}
                onValidationChange={(validationResult) => handleFieldValidationChange('email', validationResult)}
                errors={errors.email}
                placeholder="john@company.com"
                disabled={disabled}
            />

            {/* Password Field */}
            <PasswordField
                id="shortSignUpPassword"
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
                id="shortConfirmPassword"
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

export default ShortSignUpForm;