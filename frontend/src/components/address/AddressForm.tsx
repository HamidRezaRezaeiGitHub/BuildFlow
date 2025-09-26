import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AddressData } from '@/services/dtos';
import { MapPin } from 'lucide-react';
import React from 'react';
import { CityField } from './City';
import { CountryField } from './Country';
import { PostalCodeField } from './PostalCode';
import { StateProvinceField } from './StateProvince';
import { StreetNameField } from './StreetName';
import { StreetNumberField } from './StreetNumber';
import { UnitNumberField } from './UnitNumber';

/**
 * Utility function to parse street number input and extract street name if present
 * @param input The street number input (e.g., "123 Main St")
 * @returns Object with parsed streetNumber and streetName
 */
export const parseStreetNumber = (input: string): { streetNumber: string; streetName: string } => {
  // If the input contains letters, try to separate number from street name
  const match = input.match(/^(\d+)\s*(.*)$/);
  if (match && match[2].trim()) {
    return {
      streetNumber: match[1],
      streetName: match[2].trim()
    };
  }
  return {
    streetNumber: input,
    streetName: ''
  };
};

export interface AddressFormProps {
    /** Address data to populate the form */
    addressData: AddressData;

    /** Callback when address data changes */
    onAddressChange: (field: keyof AddressData, value: string) => void;

    /** Callback when form is submitted */
    onSubmit: (addressData: AddressData) => void | Promise<void>;

    /** Optional callback when skip button is clicked */
    onSkip?: () => void;

    /** Optional callback when form is reset */
    onReset?: () => void;

    /** Form header/title text */
    title?: string;

    /** Form description/subtitle text */
    description?: string;

    /** Submit button text */
    submitButtonText?: string;

    /** Skip button text (only shown if onSkip is provided) */
    skipButtonText?: string;

    /** Reset button text (only shown if onReset is provided) */
    resetButtonText?: string;

    /** Whether to show the address panel header */
    showAddressPanelHeader?: boolean;

    /** Address panel header text */
    addressPanelHeaderText?: string;

    /** Whether the form is currently submitting */
    isSubmitting?: boolean;

    /** Loading text to show when submitting */
    submittingText?: string;

    /** Validation errors for address fields */
    errors?: { [K in keyof AddressData]?: string[] };

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

    /** Skip button variant */
    skipButtonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

    /** Reset button variant */
    resetButtonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

    /** Whether the form is skippable (affects validation behavior) */
    isSkippable?: boolean;

    /** Whether to enable validation for form fields */
    enableValidation?: boolean;

    /** Custom list of required fields. If not provided, uses default required fields (unitNumber is optional by default). */
    requiredFields?: (keyof AddressData)[];
}

/**
 * Flexible AddressForm component that provides a complete address input form
 * with customizable features for different use cases.
 * 
 * Features:
 * - Customizable header and description
 * - Optional skip button for multi-step flows
 * - Configurable submit/skip/reset button text and variants
 * - Inline or card-wrapped display modes
 * - Flexible button layouts (horizontal/vertical)
 * - Validation error display
 * - Loading states
 * - Full AddressPanel integration
 */
const AddressForm: React.FC<AddressFormProps> = ({
    addressData,
    onAddressChange,
    onSubmit,
    onSkip,
    onReset,
    title,
    description,
    submitButtonText = 'Submit',
    skipButtonText = 'Skip',
    resetButtonText = 'Reset',
    showAddressPanelHeader = true,
    addressPanelHeaderText = 'Address Information',
    isSubmitting = false,
    submittingText = 'Submitting...',
    errors = {},
    disabled = false,
    className = '',
    inline = false,
    buttonLayout = 'horizontal',
    submitButtonVariant = 'default',
    skipButtonVariant = 'outline',
    resetButtonVariant = 'secondary',
    isSkippable = false,
    enableValidation = false,
    requiredFields: customRequiredFields
}) => {
    // Track validation state for each field
    const [fieldValidationState, setFieldValidationState] = React.useState<{
        [key: string]: { isValid: boolean; errors: string[] }
    }>({});

    // Determine validation mode based on skippable setting
    const validationMode = isSkippable ? 'optional' : 'required';

    // Handle field validation changes
    const handleFieldValidationChange = React.useCallback((fieldName: string, isValid: boolean, fieldErrors: string[]) => {
        setFieldValidationState(prev => ({
            ...prev,
            [fieldName]: { isValid, errors: fieldErrors }
        }));
    }, []);

    // Define required fields (fields that must have values when form is not skippable)
    // Default: unitNumber is optional, other fields are required
    const requiredFields: (keyof AddressData)[] = customRequiredFields || [
        'streetNumber',
        'streetName', 
        'city',
        'stateOrProvince',
        'postalOrZipCode',
        'country'
    ];

    // Check if form is valid for submission
    const isFormValidForSubmit = React.useMemo(() => {
        if (!enableValidation) return true;

        // For skippable forms: only validate fields that have values
        if (isSkippable) {
            return Object.entries(fieldValidationState).every(([fieldName, state]) => {
                const fieldValue = addressData[fieldName as keyof AddressData];
                // If field is empty, it's valid (skippable)
                if (!fieldValue || fieldValue.trim() === '') return true;
                // If field has value, it must be valid
                return state.isValid;
            });
        }

        // For non-skippable forms: check both completeness and validity
        // 1. All required fields must have values
        const allRequiredFieldsComplete = requiredFields.every(fieldName => {
            const fieldValue = addressData[fieldName];
            return fieldValue && fieldValue.trim() !== '';
        });

        // 2. All fields that have been validated must be valid
        const allValidatedFieldsValid = Object.values(fieldValidationState).every(state => state.isValid);

        return allRequiredFieldsComplete && allValidatedFieldsValid;
    }, [enableValidation, isSkippable, fieldValidationState, addressData, requiredFields]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!disabled && !isSubmitting && (isFormValidForSubmit || !enableValidation)) {
            await onSubmit(addressData);
        }
    };

    const handleSkip = () => {
        if (onSkip && !disabled && !isSubmitting) {
            onSkip();
        }
    };

    const handleReset = () => {
        if (onReset && !disabled && !isSubmitting) {
            onReset();
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

            {/* Address Panel */}
            <div className="space-y-4">
                {/* Address Section Header */}
                {showAddressPanelHeader && (
                    <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <Label className="text-sm font-medium">{addressPanelHeaderText}</Label>
                    </div>
                )}

                {/* Unit Number and Street Number Row */}
                <div className="grid grid-cols-2 gap-4">
                    <UnitNumberField
                        value={addressData.unitNumber || ''}
                        onChange={(value) => onAddressChange('unitNumber', value)}
                        errors={errors.unitNumber}
                        disabled={disabled || isSubmitting}
                        enableValidation={enableValidation}
                        validationMode={validationMode}
                        onValidationChange={(isValid, fieldErrors) =>
                            handleFieldValidationChange('unitNumber', isValid, fieldErrors)
                        }
                    />

                    <StreetNumberField
                        value={addressData.streetNumber || ''}
                        onChange={(value) => {
                            // Auto-parse street number when it contains alphabetic parts and street name is empty
                            if (value && !addressData.streetName.trim()) {
                                const parsed = parseStreetNumber(value);
                                if (parsed.streetName) {
                                    // Auto-fill street name if parsing found one
                                    onAddressChange('streetNumber', parsed.streetNumber);
                                    onAddressChange('streetName', parsed.streetName);
                                    return;
                                }
                            }
                            onAddressChange('streetNumber', value);
                        }}
                        errors={errors.streetNumber}
                        disabled={disabled || isSubmitting}
                        enableValidation={enableValidation}
                        validationMode={validationMode}
                        onValidationChange={(isValid, fieldErrors) =>
                            handleFieldValidationChange('streetNumber', isValid, fieldErrors)
                        }
                    />
                </div>

                {/* Street Name */}
                <StreetNameField
                    value={addressData.streetName}
                    onChange={(value) => onAddressChange('streetName', value)}
                    errors={errors.streetName}
                    disabled={disabled || isSubmitting}
                    enableValidation={enableValidation}
                    validationMode={validationMode}
                    onValidationChange={(isValid, fieldErrors) =>
                        handleFieldValidationChange('streetName', isValid, fieldErrors)
                    }
                />

                {/* City and Province Row */}
                <div className="grid grid-cols-2 gap-4">
                    <CityField
                        value={addressData.city}
                        onChange={(value) => onAddressChange('city', value)}
                        errors={errors.city}
                        disabled={disabled || isSubmitting}
                        enableValidation={enableValidation}
                        validationMode={validationMode}
                        onValidationChange={(isValid, fieldErrors) =>
                            handleFieldValidationChange('city', isValid, fieldErrors)
                        }
                    />

                    <StateProvinceField
                        value={addressData.stateOrProvince}
                        onChange={(value) => onAddressChange('stateOrProvince', value)}
                        errors={errors.stateOrProvince}
                        disabled={disabled || isSubmitting}
                        enableValidation={enableValidation}
                        validationMode={validationMode}
                        onValidationChange={(isValid, fieldErrors) =>
                            handleFieldValidationChange('stateOrProvince', isValid, fieldErrors)
                        }
                    />
                </div>

                {/* Postal Code and Country Row */}
                <div className="grid grid-cols-2 gap-4">
                    <PostalCodeField
                        value={addressData.postalOrZipCode || ''}
                        onChange={(value) => onAddressChange('postalOrZipCode', value)}
                        errors={errors.postalOrZipCode}
                        disabled={disabled || isSubmitting}
                        enableValidation={enableValidation}
                        validationMode={validationMode}
                        onValidationChange={(isValid, fieldErrors) =>
                            handleFieldValidationChange('postalOrZipCode', isValid, fieldErrors)
                        }
                    />

                    <CountryField
                        value={addressData.country}
                        onChange={(value) => onAddressChange('country', value)}
                        errors={errors.country}
                        disabled={disabled || isSubmitting}
                        enableValidation={enableValidation}
                        validationMode={validationMode}
                        onValidationChange={(isValid, fieldErrors) =>
                            handleFieldValidationChange('country', isValid, fieldErrors)
                        }
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex gap-3 ${buttonLayout === 'vertical'
                ? 'flex-col'
                : 'flex-col sm:flex-row'
                }`}>
                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={disabled || isSubmitting || (enableValidation && !isFormValidForSubmit)}
                    variant={submitButtonVariant}
                    className="flex-1"
                >
                    {isSubmitting ? submittingText : submitButtonText}
                </Button>

                {/* Skip Button */}
                {onSkip && (
                    <Button
                        type="button"
                        variant={skipButtonVariant}
                        onClick={handleSkip}
                        disabled={disabled || isSubmitting}
                        className="flex-1"
                    >
                        {skipButtonText}
                    </Button>
                )}

                {/* Reset Button */}
                {onReset && (
                    <Button
                        type="button"
                        variant={resetButtonVariant}
                        onClick={handleReset}
                        disabled={disabled || isSubmitting}
                        className="flex-1"
                    >
                        {resetButtonText}
                    </Button>
                )}
            </div>
        </form>
    );

    // Return inline form or wrapped in container
    if (inline) {
        return formContent;
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            {formContent}
        </div>
    );
};

export default AddressForm;