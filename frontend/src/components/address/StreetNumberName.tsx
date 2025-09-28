import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ValidationResult } from '@/services/validation';
import { useSmartFieldValidation } from '@/services/validation/useSmartFieldValidation';
import { ChangeEvent, FC, useMemo } from 'react';
import { BaseFieldProps } from './Address';

/**
 * Parse combined street number and name input into separate components
 * @param input The combined input (e.g., "123 Main St")
 * @returns Object with parsed streetNumber and streetName
 */
export const parseStreetNumberName = (input: string): { streetNumber: string; streetName: string } => {
    if (!input?.trim()) {
        return { streetNumber: '', streetName: '' };
    }
    
    // If the input contains letters, try to separate number from street name
    const match = input.match(/^(\d+)\s*(.*)$/);
    if (match && match[2].trim()) {
        return {
            streetNumber: match[1],
            streetName: match[2].trim()
        };
    }
    
    // If no match or no street name part, treat as street number only
    return {
        streetNumber: input,
        streetName: ''
    };
};

// Combined Street Number and Name Field Component
export interface StreetNumberNameFieldProps extends BaseFieldProps {
    placeholder?: string;
    enableValidation?: boolean;
    validationMode?: 'required' | 'optional';
    onValidationChange?: (validationResult: ValidationResult) => void;
    onParsedChange?: (streetNumber: string, streetName: string) => void;
}

export const StreetNumberNameField: FC<StreetNumberNameFieldProps> = ({
    id = 'streetNumberName',
    value,
    onChange,
    disabled = false,
    className = '',
    errors = [],
    placeholder = '123 Main Street',
    enableValidation = false,
    validationMode = 'optional',
    onValidationChange,
    onParsedChange
}) => {
    // Memoized validation rules configuration
    const validationRules = useMemo(() => {
        if (!enableValidation) return [];

        return [
            ...(validationMode === 'required' ? [{
                name: 'required',
                message: 'Street number and name is required',
                validator: (val: string) => !!val && val.trim().length > 0
            }] : []),
            {
                name: 'maxLength_120',
                message: 'Street number and name must not exceed 120 characters',
                validator: (val: string) => !val || val.length <= 120
            },
            {
                name: 'minLength_2',
                message: 'Street number and name must be at least 2 characters long',
                validator: (val: string) => !val || val.trim().length >= 2
            },
            {
                name: 'mustContainNumber',
                message: 'Street address must contain a number',
                validator: (val: string) => {
                    if (!val) return true; // Let required rule handle empty values
                    return /\d/.test(val);
                }
            },
            {
                name: 'validFormat',
                message: 'Street address should start with a number (e.g., "123 Main St")',
                validator: (val: string) => {
                    if (!val) return true; // Let required rule handle empty values
                    const parsed = parseStreetNumberName(val);
                    return parsed.streetNumber !== '';
                }
            }
        ];
    }, [enableValidation, validationMode]);

    // Memoized config for the hook to prevent infinite re-renders
    const hookConfig = useMemo(() => ({
        fieldName: 'streetNumberName',
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

        // Parse the new value and notify parent if callback provided
        if (onParsedChange) {
            const parsed = parseStreetNumberName(newValue);
            onParsedChange(parsed.streetNumber, parsed.streetName);
        }

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
                Street Number & Name
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

export default StreetNumberNameField;