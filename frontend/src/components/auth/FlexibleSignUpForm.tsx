import { FlexibleAddressForm, createEmptyAddress, AddressFieldConfig, addressFieldConfigs } from '@/components/address';
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
import { UsernameField } from './Username';

/**
 * Configuration for signup field display and behavior
 */
export interface SignUpFieldConfig {
    /** The field name/key from SignUpFormData */
    field: keyof FlexibleSignUpFormData;
    /** Display label for the field */
    label?: string;
    /** Custom placeholder text */
    placeholder?: string;
    /** Whether this field is required */
    required?: boolean;
    /** Column span (1-2) for grid layout */
    colSpan?: 1 | 2;
    /** Whether to show this field */
    show?: boolean;
}

/**
 * Predefined field configurations for common layouts
 */
export const signUpFieldConfigs = {
    full: [
        { field: 'firstName' as keyof FlexibleSignUpFormData, colSpan: 1, required: true },
        { field: 'lastName' as keyof FlexibleSignUpFormData, colSpan: 1, required: true },
        { field: 'username' as keyof FlexibleSignUpFormData, colSpan: 1, required: true },
        { field: 'email' as keyof FlexibleSignUpFormData, colSpan: 1, required: true },
        { field: 'phone' as keyof FlexibleSignUpFormData, colSpan: 2, required: false },
        { field: 'password' as keyof FlexibleSignUpFormData, colSpan: 1, required: true },
        { field: 'confirmPassword' as keyof FlexibleSignUpFormData, colSpan: 1, required: true }
    ] as SignUpFieldConfig[],

    minimal: [
        { field: 'firstName' as keyof FlexibleSignUpFormData, colSpan: 1, required: true },
        { field: 'lastName' as keyof FlexibleSignUpFormData, colSpan: 1, required: true },
        { field: 'username' as keyof FlexibleSignUpFormData, colSpan: 1, required: true },
        { field: 'email' as keyof FlexibleSignUpFormData, colSpan: 1, required: true },
        { field: 'password' as keyof FlexibleSignUpFormData, colSpan: 1, required: true },
        { field: 'confirmPassword' as keyof FlexibleSignUpFormData, colSpan: 1, required: true }
    ] as SignUpFieldConfig[],

    essential: [
        { field: 'username' as keyof FlexibleSignUpFormData, colSpan: 1, required: true },
        { field: 'email' as keyof FlexibleSignUpFormData, colSpan: 1, required: true },
        { field: 'password' as keyof FlexibleSignUpFormData, colSpan: 1, required: true },
        { field: 'confirmPassword' as keyof FlexibleSignUpFormData, colSpan: 1, required: true }
    ] as SignUpFieldConfig[],

    extended: [
        { field: 'firstName' as keyof FlexibleSignUpFormData, colSpan: 1, required: true },
        { field: 'lastName' as keyof FlexibleSignUpFormData, colSpan: 1, required: true },
        { field: 'username' as keyof FlexibleSignUpFormData, colSpan: 2, required: true },
        { field: 'email' as keyof FlexibleSignUpFormData, colSpan: 2, required: true },
        { field: 'phone' as keyof FlexibleSignUpFormData, colSpan: 2, required: false },
        { field: 'password' as keyof FlexibleSignUpFormData, colSpan: 1, required: true },
        { field: 'confirmPassword' as keyof FlexibleSignUpFormData, colSpan: 1, required: true }
    ] as SignUpFieldConfig[]
};

export interface FlexibleSignUpFormData {
    firstName: string;
    lastName: string;
    username: string;
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

export interface FlexibleSignUpFormProps {
    /** Personal info fields configuration */
    fieldsConfig?: SignUpFieldConfig[] | keyof typeof signUpFieldConfigs;

    /** Address fields configuration */
    addressFieldsConfig?: AddressFieldConfig[] | keyof typeof addressFieldConfigs;

    /** Form header/title text */
    title?: string;

    /** Form description/subtitle text */
    description?: string;

    /** Submit button text */
    submitButtonText?: string;

    /** Whether to show the personal info panel header */
    showPersonalInfoHeader?: boolean;

    /** Personal info panel header text */
    personalInfoHeaderText?: string;

    /** Whether to include address section */
    includeAddress?: boolean;

    /** Whether address section is in a collapsible */
    addressCollapsible?: boolean;

    /** Whether address collapsible is open by default */
    addressExpandedByDefault?: boolean;

    /** Address section title */
    addressSectionTitle?: string;

    /** Whether to show the address panel header */
    showAddressPanelHeader?: boolean;

    /** Address panel header text */
    addressPanelHeaderText?: string;

    /** Whether the form is currently submitting */
    isSubmitting?: boolean;

    /** Loading text to show when submitting */
    submittingText?: string;

    /** Validation errors for fields */
    errors?: { [K in keyof FlexibleSignUpFormData]?: string[] };

    /** Whether the form is disabled */
    disabled?: boolean;

    /** Additional CSS classes for the form container */
    className?: string;

    /** Whether to show form as inline (no card wrapper) */
    inline?: boolean;

    /** Custom button layout - 'horizontal' (default) or 'vertical' */
    buttonLayout?: 'horizontal' | 'vertical';

    /** Submit button variant */
    submitButtonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

    /** Whether to enable validation for form fields */
    enableValidation?: boolean;

    /** Maximum columns for grid layout (default: 2) */
    maxColumns?: 1 | 2 | 3 | 4;

    /** Form callbacks */
    onFormDataChange?: (formData: FlexibleSignUpFormData) => void;
    onValidationStateChange?: (isValid: boolean) => void;
    onLoadingStateChange?: (isLoading: boolean) => void;
    onFormSubmit?: (formData: FlexibleSignUpFormData) => void;
    onSignUpSuccess?: () => void;
    onSignUpError?: (error: string) => void;

    /** Redirect configuration */
    redirectPath?: string;
    autoRedirect?: boolean;
}

/**
 * FlexibleSignUpForm - A highly customizable sign up form component
 * 
 * Features:
 * - Configurable field selection and layout for personal info section
 * - Predefined layout presets (full, minimal, essential, extended)
 * - Mandatory fields: email, password, confirmPassword (always included)
 * - Optional address section with FlexibleAddressForm integration
 * - Collapsible address section with configurable default state
 * - Dynamic validation based on selected fields
 * - Flexible grid layout with customizable column spans
 * - Two main sections: Personal Info + Address (optional)
 */
const FlexibleSignUpForm: React.FC<FlexibleSignUpFormProps> = ({
    fieldsConfig = 'full',
    addressFieldsConfig = 'full',
    title,
    description,
    submitButtonText = 'Create Account',
    showPersonalInfoHeader = true,
    personalInfoHeaderText = 'Personal Information',
    includeAddress = true,
    addressCollapsible = true,
    addressExpandedByDefault = false,
    addressSectionTitle = 'Address Information',
    showAddressPanelHeader = false,
    addressPanelHeaderText = 'Address Details',
    isSubmitting = false,
    submittingText = 'Creating Account...',
    errors = {},
    disabled = false,
    className = '',
    inline = false,
    buttonLayout = 'horizontal',
    submitButtonVariant = 'default',
    enableValidation = true,
    maxColumns = 2,
    onFormDataChange,
    onValidationStateChange,
    onLoadingStateChange,
    onFormSubmit,
    onSignUpSuccess,
    onSignUpError,
    redirectPath = '/dashboard',
    autoRedirect = true
}) => {
    const { register } = useAuth();
    const navigation = useNavigate();

    // Initialize form data with empty address
    const [signUpForm, setSignUpForm] = useState<FlexibleSignUpFormData>(() => {
        const emptyAddress = createEmptyAddress();
        return {
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            unitNumber: emptyAddress.unitNumber || '',
            streetNumber: emptyAddress.streetNumber || '',
            streetName: emptyAddress.streetName,
            city: emptyAddress.city,
            stateOrProvince: emptyAddress.stateOrProvince,
            postalOrZipCode: emptyAddress.postalOrZipCode || '',
            country: emptyAddress.country
        };
    });

    // Address section state
    const [addressExpanded, setAddressExpanded] = useState(addressExpandedByDefault);

    // Password visibility state
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Validation states
    const [personalInfoValidation, setPersonalInfoValidation] = useState<Record<string, ValidationResult>>({});
    const [isFormValid, setIsFormValid] = useState(false);

    // Determine which fields to show based on configuration
    const fieldsToShow = useMemo(() => {
        if (typeof fieldsConfig === 'string') {
            const preset = signUpFieldConfigs[fieldsConfig];
            if (!preset) {
                console.warn(`Unknown preset "${fieldsConfig}", falling back to "full"`);
                return signUpFieldConfigs.full;
            }
            return preset;
        }
        return fieldsConfig;
    }, [fieldsConfig]);

    // Ensure mandatory fields are always included
    const processedFields = useMemo(() => {
        const mandatoryFields: (keyof FlexibleSignUpFormData)[] = ['email', 'password', 'confirmPassword'];
        const fieldMap = new Map(fieldsToShow.map(field => [field.field, field]));

        // Add mandatory fields if not present
        mandatoryFields.forEach(fieldName => {
            if (!fieldMap.has(fieldName)) {
                fieldMap.set(fieldName, {
                    field: fieldName,
                    required: true,
                    colSpan: 1,
                    show: true
                });
            } else {
                // Ensure mandatory fields are marked as required
                const field = fieldMap.get(fieldName);
                if (field) {
                    field.required = true;
                }
            }
        });

        return Array.from(fieldMap.values());
    }, [fieldsToShow]);

    // Handle form data changes
    const handleFieldChange = useCallback((field: keyof FlexibleSignUpFormData, value: string) => {
        setSignUpForm(prev => {
            const updated = { ...prev, [field]: value };
            onFormDataChange?.(updated);
            return updated;
        });
    }, [onFormDataChange]);

    // Handle address changes
    const handleAddressChange = useCallback((field: keyof AddressData, value: string) => {
        handleFieldChange(field as keyof FlexibleSignUpFormData, value);
    }, [handleFieldChange]);

    // Handle field validation changes
    const handleFieldValidation = useCallback((field: string, validationResult: ValidationResult) => {
        setPersonalInfoValidation(prev => ({
            ...prev,
            [field]: validationResult
        }));
    }, []);

    // Calculate overall form validity
    useEffect(() => {
        const personalInfoValid = Object.values(personalInfoValidation).every(validation => validation.isValid);
        const newIsValid = personalInfoValid;

        setIsFormValid(newIsValid);
        onValidationStateChange?.(newIsValid);
    }, [personalInfoValidation, onValidationStateChange]);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid && enableValidation) {
            return;
        }

        setIsFormValid(false);
        onLoadingStateChange?.(true);

        try {
            onFormSubmit?.(signUpForm);

            // Call the signup API
            await register({
                username: signUpForm.username,
                password: signUpForm.password,
                contactRequestDto: {
                    firstName: signUpForm.firstName,
                    lastName: signUpForm.lastName,
                    labels: [],
                    email: signUpForm.email,
                    phone: signUpForm.phone || undefined,
                    addressRequestDto: includeAddress ? {
                        unitNumber: signUpForm.unitNumber || undefined,
                        streetNumber: signUpForm.streetNumber,
                        streetName: signUpForm.streetName,
                        city: signUpForm.city,
                        stateOrProvince: signUpForm.stateOrProvince,
                        postalOrZipCode: signUpForm.postalOrZipCode,
                        country: signUpForm.country
                    } : undefined
                }
            });

            onSignUpSuccess?.();

            if (autoRedirect) {
                navigation.navigate(redirectPath);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred during signup';
            onSignUpError?.(errorMessage);
        } finally {
            onLoadingStateChange?.(false);
        }
    };

    // Column span classes mapping to ensure Tailwind includes them
    const getColSpanClass = (span: number): string => {
        switch (span) {
            case 1: return 'col-span-1';
            case 2: return 'col-span-2';
            case 3: return 'col-span-3';
            case 4: return 'col-span-4';
            default: return 'col-span-1';
        }
    };

    // Helper function to generate grid column classes
    const getGridColsClass = (maxColumns: number): string => {
        switch (maxColumns) {
            case 1: return 'grid-cols-1';
            case 3: return 'grid-cols-3';
            case 4: return 'grid-cols-4';
            default: return 'grid-cols-2';
        }
    };

    // Create memoized validation change handler per field, so each field gets a stable reference
    const validationHandlers = useMemo(() => {
        const handlers: Record<string, ((result: ValidationResult) => void) | undefined> = {};

        return (fieldName: keyof FlexibleSignUpFormData) => {
            if (!enableValidation) return undefined;

            if (!handlers[fieldName]) {
                handlers[fieldName] = (result: ValidationResult) => handleFieldValidation(fieldName, result);
            }
            return handlers[fieldName];
        };
    }, [enableValidation, handleFieldValidation]);

    // Render individual field
    const renderField = (fieldConfig: SignUpFieldConfig) => {
        if (fieldConfig.show === false) return null;

        const fieldProps = {
            value: signUpForm[fieldConfig.field],
            onChange: (value: string) => handleFieldChange(fieldConfig.field, value),
            disabled: disabled || isSubmitting,
            errors: errors[fieldConfig.field] || [],
            enableValidation,
            validationMode: fieldConfig.required ? 'required' as const : 'optional' as const,
            onValidationChange: validationHandlers(fieldConfig.field),
            placeholder: fieldConfig.placeholder
        };

        const colSpanClass = getColSpanClass(fieldConfig.colSpan || 1);

        switch (fieldConfig.field) {
            case 'firstName':
                return (
                    <div key={fieldConfig.field} className={colSpanClass}>
                        <NameField
                            nameType="firstName"
                            id="firstName"
                            {...fieldProps}
                        />
                    </div>
                );
            case 'lastName':
                return (
                    <div key={fieldConfig.field} className={colSpanClass}>
                        <NameField
                            nameType="lastName"
                            id="lastName"
                            {...fieldProps}
                        />
                    </div>
                );
            case 'username':
                return (
                    <div key={fieldConfig.field} className={colSpanClass}>
                        <UsernameField
                            id="username"
                            {...fieldProps}
                        />
                    </div>
                );
            case 'email':
                return (
                    <div key={fieldConfig.field} className={colSpanClass}>
                        <EmailField
                            id="email"
                            {...fieldProps}
                        />
                    </div>
                );
            case 'phone':
                return (
                    <div key={fieldConfig.field} className={colSpanClass}>
                        <PhoneField
                            id="phone"
                            {...fieldProps}
                        />
                    </div>
                );
            case 'password':
                return (
                    <div key={fieldConfig.field} className={colSpanClass}>
                        <PasswordField
                            id="password"
                            showPassword={showPassword}
                            onToggleVisibility={() => setShowPassword(!showPassword)}
                            {...fieldProps}
                        />
                    </div>
                );
            case 'confirmPassword':
                return (
                    <div key={fieldConfig.field} className={colSpanClass}>
                        <ConfirmPasswordField
                            id="confirmPassword"
                            originalPassword={signUpForm.password}
                            showPassword={showConfirmPassword}
                            onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
                            {...fieldProps}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    const formContent = (
        <form role="form" onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
            {/* Optional Form Header */}
            {(title || description) && !inline && (
                <div className="text-center space-y-2">
                    {title && (
                        <h2 className="text-2xl font-bold">{title}</h2>
                    )}
                    {description && (
                        <p className="text-muted-foreground">{description}</p>
                    )}
                </div>
            )}

            {/* Personal Information Section */}
            <div className="space-y-4">
                {/* Personal Info Section Header */}
                {showPersonalInfoHeader && (
                    <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold">{personalInfoHeaderText}</h3>
                    </div>
                )}

                {/* Personal Info Fields Grid */}
                <div className={`grid gap-4 ${getGridColsClass(maxColumns)}`}>
                    {processedFields.map(renderField)}
                </div>
            </div>

            {/* Address Section */}
            {includeAddress && (
                <div className="space-y-4">
                    {addressCollapsible ? (
                        <Collapsible open={addressExpanded} onOpenChange={setAddressExpanded}>
                            <CollapsibleTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full justify-between"
                                    disabled={disabled || isSubmitting}
                                >
                                    <span>{addressSectionTitle}</span>
                                    {addressExpanded ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4 mt-4">
                                <FlexibleAddressForm
                                    addressData={{
                                        unitNumber: signUpForm.unitNumber,
                                        streetNumber: signUpForm.streetNumber,
                                        streetName: signUpForm.streetName,
                                        city: signUpForm.city,
                                        stateOrProvince: signUpForm.stateOrProvince,
                                        postalOrZipCode: signUpForm.postalOrZipCode,
                                        country: signUpForm.country
                                    }}
                                    onAddressChange={handleAddressChange}
                                    onSubmit={() => { }} // No-op since this is integrated
                                    fieldsConfig={addressFieldsConfig}
                                    showAddressPanelHeader={showAddressPanelHeader}
                                    addressPanelHeaderText={addressPanelHeaderText}
                                    inline={true}
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
                                    enableValidation={enableValidation}
                                    noFormWrapper={true}
                                    showActionButtons={false}
                                />
                            </CollapsibleContent>
                        </Collapsible>
                    ) : (
                        <div>
                            <h3 className="text-lg font-semibold mb-4">{addressSectionTitle}</h3>
                            <FlexibleAddressForm
                                addressData={{
                                    unitNumber: signUpForm.unitNumber,
                                    streetNumber: signUpForm.streetNumber,
                                    streetName: signUpForm.streetName,
                                    city: signUpForm.city,
                                    stateOrProvince: signUpForm.stateOrProvince,
                                    postalOrZipCode: signUpForm.postalOrZipCode,
                                    country: signUpForm.country
                                }}
                                onAddressChange={handleAddressChange}
                                onSubmit={() => { }} // No-op since this is integrated
                                fieldsConfig={addressFieldsConfig}
                                showAddressPanelHeader={showAddressPanelHeader}
                                addressPanelHeaderText={addressPanelHeaderText}
                                inline={true}
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
                                enableValidation={enableValidation}
                                noFormWrapper={true}
                                showActionButtons={false}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Submit Button */}
            <div className={`flex ${buttonLayout === 'vertical' ? 'flex-col' : 'flex-row'} gap-4`}>
                <Button
                    type="submit"
                    variant={submitButtonVariant}
                    disabled={(!isFormValid && enableValidation) || disabled || isSubmitting}
                    className="w-full"
                >
                    {isSubmitting ? submittingText : submitButtonText}
                </Button>
            </div>
        </form>
    );

    // Wrap with card if not inline
    if (!inline) {
        return (
            <Card className={className}>
                <CardHeader>
                    {title && <CardTitle>{title}</CardTitle>}
                    {description && <CardDescription>{description}</CardDescription>}
                </CardHeader>
                <CardContent>
                    {formContent}
                </CardContent>
            </Card>
        );
    }

    return formContent;
};

export default FlexibleSignUpForm;