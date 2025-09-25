import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validationService } from '@/services/validation/ValidationService';
import { User } from 'lucide-react';
import React from 'react';
import { BaseAuthFieldProps, AUTH_VALIDATION_RULES } from './Auth';

// Username Field Component Props
export interface UsernameFieldProps extends BaseAuthFieldProps {
    placeholder?: string;
    enableValidation?: boolean;
    validationMode?: 'required' | 'optional';
    onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

export const UsernameField: React.FC<UsernameFieldProps> = ({
    id = 'username',
    value,
    onChange,
    disabled = false,
    className = '',
    errors = [],
    placeholder = "john_doe",
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
            fieldName: 'username',
            fieldType: 'text' as const,
            required: validationMode === 'required',
            rules: [
                ...(validationMode === 'required' ? [{
                    name: 'required',
                    message: 'Username is required',
                    validator: (val: string) => !!val && val.trim().length > 0
                }] : []),
                {
                    name: `minLength_${AUTH_VALIDATION_RULES.USERNAME_MIN_LENGTH}`,
                    message: `Username must be at least ${AUTH_VALIDATION_RULES.USERNAME_MIN_LENGTH} characters long`,
                    validator: (val: string) => !val || val.trim().length >= AUTH_VALIDATION_RULES.USERNAME_MIN_LENGTH
                },
                {
                    name: `maxLength_${AUTH_VALIDATION_RULES.USERNAME_MAX_LENGTH}`,
                    message: `Username must not exceed ${AUTH_VALIDATION_RULES.USERNAME_MAX_LENGTH} characters`,
                    validator: (val: string) => !val || val.length <= AUTH_VALIDATION_RULES.USERNAME_MAX_LENGTH
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

        const result = validationService.validateField('username', fieldValue, validationConfig);
        setValidationErrors(result.errors);

        // Notify parent of validation changes
        if (onValidationChange) {
            onValidationChange(result.isValid, result.errors);
        }

        return result.isValid;
    }, [enableValidation, validationConfig, onValidationChange]);

    // Handle validation prop changes
    React.useEffect(() => {
        if (!enableValidation) {
            setValidationErrors([]);
            if (onValidationChange) {
                onValidationChange(true, []);
            }
        }
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
                Username
                {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    id={id}
                    type="text"
                    placeholder={placeholder}
                    className={`pl-10 ${hasErrors ? 'border-red-500 focus:border-red-500' : ''}`}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={disabled}
                />
            </div>
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

export default UsernameField;