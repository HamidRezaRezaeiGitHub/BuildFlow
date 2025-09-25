import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validationService } from '@/services/validation/ValidationService';
import { Mail, User } from 'lucide-react';
import React from 'react';
import { BaseAuthFieldProps, AUTH_VALIDATION_RULES } from './Auth';

// Username/Email Field Component Props
export interface UsernameEmailFieldProps extends BaseAuthFieldProps {
    placeholder?: string;
    enableValidation?: boolean;
    validationMode?: 'required' | 'optional';
    onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

export const UsernameEmailField: React.FC<UsernameEmailFieldProps> = ({
    id = 'usernameEmail',
    value,
    onChange,
    disabled = false,
    className = '',
    errors = [],
    placeholder = "username or email@company.com",
    enableValidation = false,
    validationMode = 'optional',
    onValidationChange
}) => {
    const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
    const [hasBeenTouched, setHasBeenTouched] = React.useState(false);

    // Detect if current value looks like an email
    const isEmail = value.includes('@');
    const icon = isEmail ? Mail : User;
    const IconComponent = icon;

    // Create validation configuration based on props
    const validationConfig = React.useMemo(() => {
        if (!enableValidation) return undefined;

        return {
            fieldName: 'usernameEmail',
            fieldType: 'text' as const,
            required: validationMode === 'required',
            rules: [
                ...(validationMode === 'required' ? [{
                    name: 'required',
                    message: 'Username or email is required',
                    validator: (val: string) => !!val && val.trim().length > 0
                }] : []),
                {
                    name: `minLength_${AUTH_VALIDATION_RULES.LOGIN_USERNAME_EMAIL_MIN_LENGTH}`,
                    message: `Username or email must be at least ${AUTH_VALIDATION_RULES.LOGIN_USERNAME_EMAIL_MIN_LENGTH} characters long`,
                    validator: (val: string) => !val || val.trim().length >= AUTH_VALIDATION_RULES.LOGIN_USERNAME_EMAIL_MIN_LENGTH
                },
                {
                    name: `maxLength_${AUTH_VALIDATION_RULES.LOGIN_USERNAME_EMAIL_MAX_LENGTH}`,
                    message: `Username or email must not exceed ${AUTH_VALIDATION_RULES.LOGIN_USERNAME_EMAIL_MAX_LENGTH} characters`,
                    validator: (val: string) => !val || val.length <= AUTH_VALIDATION_RULES.LOGIN_USERNAME_EMAIL_MAX_LENGTH
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

        const result = validationService.validateField('usernameEmail', fieldValue, validationConfig);
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
                Username or Email
                {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="relative">
                <IconComponent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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

export default UsernameEmailField;