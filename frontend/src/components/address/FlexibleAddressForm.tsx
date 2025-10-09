import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ValidationResult } from '@/services/validation';
import { MapPin } from 'lucide-react';
import React from 'react';
import { AddressData } from '.';
import { CityField } from './City';
import { CountryField } from './Country';
import { PostalCodeField } from './PostalCode';
import { StateProvinceField } from './StateProvince';
import { StreetNameField } from './StreetName';
import { StreetNumberField } from './StreetNumber';
import { StreetNumberNameField } from './StreetNumberName';
import { UnitNumberField } from './UnitNumber';

/**
 * Configuration for address field display and behavior
 */
export interface AddressFieldConfig {
    /** The field name/key from AddressData */
    field: keyof AddressData;
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
export const addressFieldConfigs = {
    full: [
        { field: 'unitNumber' as keyof AddressData, colSpan: 1, required: false },
        { field: 'streetNumberAndName' as keyof AddressData, colSpan: 2, required: true },
        { field: 'city' as keyof AddressData, colSpan: 1, required: true },
        { field: 'stateOrProvince' as keyof AddressData, colSpan: 1, required: true },
        { field: 'postalOrZipCode' as keyof AddressData, colSpan: 1, required: true },
        { field: 'country' as keyof AddressData, colSpan: 1, required: true }
    ] as AddressFieldConfig[],

    minimal: [
        { field: 'streetNumberAndName' as keyof AddressData, colSpan: 2, required: true },
        { field: 'city' as keyof AddressData, colSpan: 1, required: true },
        { field: 'country' as keyof AddressData, colSpan: 1, required: true }
    ] as AddressFieldConfig[],

    shipping: [
        { field: 'streetNumberAndName' as keyof AddressData, colSpan: 2, required: true },
        { field: 'city' as keyof AddressData, colSpan: 1, required: true },
        { field: 'stateOrProvince' as keyof AddressData, colSpan: 1, required: true },
        { field: 'postalOrZipCode' as keyof AddressData, colSpan: 2, required: true }
    ] as AddressFieldConfig[],

    international: [
        { field: 'streetNumberAndName' as keyof AddressData, colSpan: 2, required: true },
        { field: 'city' as keyof AddressData, colSpan: 1, required: true },
        { field: 'stateOrProvince' as keyof AddressData, colSpan: 1, required: false },
        { field: 'postalOrZipCode' as keyof AddressData, colSpan: 1, required: false },
        { field: 'country' as keyof AddressData, colSpan: 1, required: true }
    ] as AddressFieldConfig[],

    // Legacy configuration name for backward compatibility
    combined: [
        { field: 'unitNumber' as keyof AddressData, colSpan: 1, required: false },
        { field: 'streetNumberAndName' as keyof AddressData, colSpan: 2, required: true },
        { field: 'city' as keyof AddressData, colSpan: 1, required: true },
        { field: 'stateOrProvince' as keyof AddressData, colSpan: 1, required: true },
        { field: 'postalOrZipCode' as keyof AddressData, colSpan: 1, required: true },
        { field: 'country' as keyof AddressData, colSpan: 1, required: true }
    ] as AddressFieldConfig[],

    // Configuration optimized for embedding in other forms (no form wrapper, no buttons)
    embedded: [
        { field: 'unitNumber' as keyof AddressData, colSpan: 1, required: false },
        { field: 'streetNumberAndName' as keyof AddressData, colSpan: 2, required: false },
        { field: 'city' as keyof AddressData, colSpan: 1, required: true },
        { field: 'stateOrProvince' as keyof AddressData, colSpan: 1, required: true },
        { field: 'country' as keyof AddressData, colSpan: 1, required: true },
        { field: 'postalOrZipCode' as keyof AddressData, colSpan: 1, required: true }
    ] as AddressFieldConfig[]
};

export interface FlexibleAddressFormProps {
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

    /** Configuration for which fields to show and how to display them */
    fieldsConfig?: AddressFieldConfig[] | keyof typeof addressFieldConfigs;

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

    /** Maximum columns for grid layout (default: 2) */
    maxColumns?: 1 | 2 | 3 | 4;

    /** Whether to render without form wrapper (for embedding in other forms) */
    noFormWrapper?: boolean;

    /** Whether to show submit/action buttons */
    showActionButtons?: boolean;
}

/**
 * FlexibleAddressForm - A highly customizable address form component
 * 
 * Features:
 * - Configurable field selection and layout
 * - Predefined layout presets (full, minimal, shipping, international)
 * - Dynamic validation based on selected fields
 * - Flexible grid layout with customizable column spans
 * - Optional form wrapper (can be embedded in other forms)
 * - Optional action buttons (for embedded use cases)
 * - All features from original AddressForm
 */
const FlexibleAddressForm: React.FC<FlexibleAddressFormProps> = ({
    addressData,
    onAddressChange,
    onSubmit,
    onSkip,
    onReset,
    fieldsConfig = 'full',
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
    maxColumns = 2,
    noFormWrapper = false,
    showActionButtons = true
}) => {
    // Track validation state for each field
    const [fieldValidationState, setFieldValidationState] = React.useState<{
        [key: string]: ValidationResult
    }>({});

    // Resolve field configuration
    const resolvedFieldsConfig: AddressFieldConfig[] = React.useMemo(() => {
        if (typeof fieldsConfig === 'string') {
            return addressFieldConfigs[fieldsConfig] || addressFieldConfigs.full;
        }
        return fieldsConfig.filter(config => config.show !== false);
    }, [fieldsConfig]);

    // Validation mode is determined per field based on field config and isSkippable

    // Handle field validation changes
    const handleFieldValidationChange = React.useCallback((fieldName: string, validationResult: ValidationResult) => {
        setFieldValidationState(prev => {
            // Only update if validation result has changed
            const currentState = prev[fieldName];
            if (currentState?.isValid === validationResult.isValid &&
                JSON.stringify(currentState?.errors) === JSON.stringify(validationResult.errors)) {
                return prev;
            }

            return {
                ...prev,
                [fieldName]: { isValid: validationResult.isValid, errors: validationResult.errors }
            };
        });
    }, []);

    // Get required fields from configuration
    const requiredFields: (keyof AddressData)[] = React.useMemo(() => {
        return resolvedFieldsConfig
            .filter(config => config.required === true)
            .map(config => config.field as keyof AddressData);
    }, [resolvedFieldsConfig]);

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
            const fieldValue = addressData[fieldName as keyof AddressData];
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

    // Render individual field component
    const renderField = (config: AddressFieldConfig) => {
        const { field, placeholder, required } = config;
        
        const fieldValue = addressData[field as keyof AddressData] || '';
        const fieldErrors = errors[field as keyof AddressData];
        const fieldRequired = isSkippable ? false : (required ?? true);
        const fieldValidationMode: 'required' | 'optional' = fieldRequired ? 'required' : 'optional';

        const commonProps = {
            value: fieldValue,
            onChange: (value: string) => onAddressChange(field as keyof AddressData, value),
            errors: fieldErrors,
            disabled: disabled || isSubmitting,
            enableValidation,
            validationMode: fieldValidationMode,
            onValidationChange: (validationResult: ValidationResult) =>
                handleFieldValidationChange(field as keyof AddressData, validationResult),
            placeholder
        };

        switch (field) {
            case 'unitNumber':
                return (
                    <UnitNumberField
                        key={field}
                        {...commonProps}
                    />
                );

            case 'streetNumberAndName':
                return (
                    <StreetNumberNameField
                        key={field}
                        {...commonProps}
                    />
                );

            case 'city':
                return (
                    <CityField
                        key={field}
                        {...commonProps}
                    />
                );

            case 'stateOrProvince':
                return (
                    <StateProvinceField
                        key={field}
                        {...commonProps}
                    />
                );

            case 'postalOrZipCode':
                return (
                    <PostalCodeField
                        key={field}
                        {...commonProps}
                    />
                );

            case 'country':
                return (
                    <CountryField
                        key={field}
                        {...commonProps}
                    />
                );

            default:
                return null;
        }
    };

    // Group fields by rows based on column spans
    const fieldRows = React.useMemo(() => {
        const rows: AddressFieldConfig[][] = [];
        let currentRow: AddressFieldConfig[] = [];
        let currentRowSpan = 0;

        for (const config of resolvedFieldsConfig) {
            const colSpan = Math.min(config.colSpan || 1, maxColumns) as 1 | 2;

            // If adding this field would exceed max columns, start new row
            if (currentRowSpan + colSpan > maxColumns && currentRow.length > 0) {
                rows.push(currentRow);
                currentRow = [];
                currentRowSpan = 0;
            }

            currentRow.push({ ...config, colSpan });
            currentRowSpan += colSpan;

            // If we've filled the row exactly, start new row
            if (currentRowSpan === maxColumns) {
                rows.push(currentRow);
                currentRow = [];
                currentRowSpan = 0;
            }
        }

        // Add remaining fields as the last row
        if (currentRow.length > 0) {
            rows.push(currentRow);
        }

        return rows;
    }, [resolvedFieldsConfig, maxColumns]);

    // Grid column classes mapping to ensure Tailwind includes them
    const getGridColsClass = (columns: number): string => {
        switch (columns) {
            case 1: return 'grid-cols-1';
            case 2: return 'grid-cols-2';
            case 3: return 'grid-cols-3';
            case 4: return 'grid-cols-4';
            default: return 'grid-cols-2';
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

    // Content that goes inside the form or standalone div
    const addressFieldsContent = (
        <>
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

                {/* Dynamic Field Rows */}
                {fieldRows.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className={`grid gap-4 ${getGridColsClass(maxColumns)}`}
                    >
                        {row.map((config) => (
                            <div
                                key={config.field}
                                className={getColSpanClass(config.colSpan || 1)}
                            >
                                {renderField(config)}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Action Buttons */}
            {showActionButtons && (
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
            )}
        </>
    );

    // Conditional wrapper: form or div
    const formContent = noFormWrapper ? (
        <div className={`space-y-6 ${className}`}>
            {addressFieldsContent}
        </div>
    ) : (
        <form role="form" onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
            {addressFieldsContent}
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

export default FlexibleAddressForm;