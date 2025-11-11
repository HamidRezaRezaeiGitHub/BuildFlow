import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ValidationResult } from '@/services/validation';
import { useSmartFieldValidation } from '@/services/validation/useSmartFieldValidation';
import { ChangeEvent, FC, useMemo } from 'react';
import { BaseFieldProps } from '.';

// Postal/Zip Code Field Component
export interface PostalCodeFieldProps extends BaseFieldProps {
    placeholder?: string;
    enableValidation?: boolean;
    validationMode?: 'required' | 'optional';
    onValidationChange?: (validationResult: ValidationResult) => void;
}

export const PostalCodeField: FC<PostalCodeFieldProps> = ({
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
    // Memoized validation rules configuration
    const validationRules = useMemo(() => {
        if (!enableValidation) return [];

        return [
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
        ];
    }, [enableValidation, validationMode]);

    // Memoized config for the hook to prevent infinite re-renders
    const hookConfig = useMemo(() => ({
        fieldName: 'postalOrZipCode',
        fieldType: 'text' as const,
        required: validationMode === 'required',
        validationRules
    }), [validationMode, validationRules]);

    // Use the smart field validation hook
    const { state, handlers } = useSmartFieldValidation({
        value,
        config: hookConfig,
        enableValidation,
        onValidationChange
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const oldValue = value;
        const newValue = e.target.value;

        // Use the hook's change handler for autofill detection
        handlers.handleChange(newValue, oldValue);

        onChange(newValue);
    };

    const handleFocus = () => {
        handlers.handleFocus();
    };

    const handleBlur = () => {
        handlers.handleBlur();
    };

    // Determine which errors to display - use hook's computed displayErrors or fallback to external errors
    const displayErrors = enableValidation ? state.displayErrors : errors;
    const hasErrors = displayErrors.length > 0;

    // Determine if field is required for label display
    const isRequired = enableValidation && validationMode === 'required';

    return (
        <div className={`space-y-2 ${className}`}>
            <Label htmlFor={id} className="text-xs">
                Postal Code
                {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
                id={id}
                type="text"
                placeholder={placeholder}
                value={value}
                onFocus={handleFocus}
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