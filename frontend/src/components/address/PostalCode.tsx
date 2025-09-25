import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validationService } from '@/services/validation/ValidationService';
import React from 'react';
import { BaseFieldProps } from './Address';

// Postal/Zip Code Field Component
export interface PostalCodeFieldProps extends BaseFieldProps {
    placeholder?: string;
    enableValidation?: boolean;
    validationMode?: 'required' | 'optional';
    onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

export const PostalCodeField: React.FC<PostalCodeFieldProps> = ({
    id = 'postalOrZipCode',
    value,
    onChange,
    disabled = false,
    className = '',
    errors = [],
    placeholder = 'M5H 2N2',
    enableValidation = false,
    validationMode = 'optional',
    onValidationChange
}) => {
    const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
    const [hasBeenTouched, setHasBeenTouched] = React.useState(false);

    // Create validation configuration based on props
    const validationConfig = React.useMemo(() => {
        if (!enableValidation) return undefined;

        return {
            fieldName: 'postalOrZipCode',
            fieldType: 'text' as const,
            required: validationMode === 'required',
            rules: [
                ...(validationMode === 'required' ? [{
                    name: 'required',
                    message: 'Postal code is required',
                    validator: (val: string) => !!val && val.trim().length > 0
                }] : []),
                {
                    name: 'maxLength_10',
                    message: 'Postal code must not exceed 10 characters',
                    validator: (val: string) => !val || val.length <= 10
                },
                {
                    name: 'minLength_5',
                    message: 'Postal code must be at least 5 characters long',
                    validator: (val: string) => !val || val.trim().length >= 5
                },
                {
                    name: 'validPostalCode',
                    message: 'Postal code format is invalid (e.g., M5H 2N2 or 12345)',
                    validator: (val: string) => {
                        if (!val) return true;
                        const trimmed = val.trim().toUpperCase();
                        // Canadian postal code pattern: A1A 1A1 or A1A1A1
                        const canadianPattern = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/;
                        // US ZIP code pattern: 12345 or 12345-6789
                        const usPattern = /^\d{5}(-\d{4})?$/;
                        return canadianPattern.test(trimmed) || usPattern.test(trimmed);
                    }
                }
            ]
        };
    }, [enableValidation, validationMode]);

    // Validate field when value changes
    const validateField = React.useCallback((fieldValue: string) => {
        if (!enableValidation || !validationConfig) {
            setValidationErrors([]);
            return true;
        }

        const result = validationService.validateField('postalOrZipCode', fieldValue, validationConfig);
        setValidationErrors(result.errors);

        // Notify parent of validation changes
        if (onValidationChange) {
            onValidationChange(result.isValid, result.errors);
        }

        return result.isValid;
    }, [enableValidation, validationConfig, onValidationChange]);

    // Handle validation prop changes (not value changes - those are handled by handleChange)
    React.useEffect(() => {
        if (!enableValidation) {
            // Clear validation errors when validation is disabled
            setValidationErrors([]);
            if (onValidationChange) {
                onValidationChange(true, []);
            }
        }
        // Note: We don't re-validate on value changes here - that's handled in handleChange
        // We only clear errors when validation is disabled or config changes
    }, [enableValidation, validationMode]);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);

        // Validate if touched or if we want immediate validation
        if (hasBeenTouched && enableValidation) {
            validateField(newValue);
        }
    };

    // Handle input blur - Used for touch-based validation strategy
    const handleBlur = () => {
        setHasBeenTouched(true);
        if (enableValidation) {
            validateField(value);
        }
    };

    // Use validation errors if validation is enabled, otherwise use passed errors
    const displayErrors = enableValidation ? validationErrors : errors;
    const hasErrors = displayErrors.length > 0;

    // Determine if field is required for label display
    const isRequired = enableValidation && validationMode === 'required';

    return (
        <div className={`space-y-2 ${className}`}>
            <Label htmlFor={id} className="text-xs">
                Postal Code/Zip Code
                {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
                id={id}
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                className={hasErrors ? 'border-red-500 focus:border-red-500' : ''}
                disabled={disabled}
            />
            {hasErrors && (
                <div className="space-y-1">
                    {displayErrors.map((error, index) => (
                        <p key={index} className="text-xs text-red-500">{error}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostalCodeField;