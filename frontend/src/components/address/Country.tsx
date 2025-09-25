import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validationService } from '@/services/validation/ValidationService';
import React from 'react';
import { BaseFieldProps } from './Address';

// Country Field Component
export interface CountryFieldProps extends BaseFieldProps {
    placeholder?: string;
    enableValidation?: boolean;
    validationMode?: 'required' | 'optional';
    onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

export const CountryField: React.FC<CountryFieldProps> = ({
    id = 'country',
    value,
    onChange,
    disabled = false,
    className = '',
    errors = [],
    placeholder = 'Canada',
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
            fieldName: 'country',
            fieldType: 'text' as const,
            required: validationMode === 'required',
            rules: [
                ...(validationMode === 'required' ? [{
                    name: 'required',
                    message: 'Country is required',
                    validator: (val: string) => !!val && val.trim().length > 0
                }] : []),
                {
                    name: 'maxLength_60',
                    message: 'Country name must not exceed 60 characters',
                    validator: (val: string) => !val || val.length <= 60
                },
                {
                    name: 'minLength_2',
                    message: 'Country name must be at least 2 characters long',
                    validator: (val: string) => !val || val.trim().length >= 2
                },
                {
                    name: 'validCountryName',
                    message: 'Country name must contain only letters, spaces, hyphens, and periods',
                    validator: (val: string) => !val || /^[a-zA-Z\s\-.]+$/.test(val.trim())
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

        const result = validationService.validateField('country', fieldValue, validationConfig);
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
        } else if (hasBeenTouched) {
            // Re-validate current value when validation mode changes and field has been touched
            validateField(value);
        }
    }, [enableValidation, validationMode, hasBeenTouched, validateField, onValidationChange]);

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
                Country
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

export default CountryField;