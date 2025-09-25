import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validationService } from '@/services/validation/ValidationService';
import { Eye, EyeOff, Lock } from 'lucide-react';
import React from 'react';
import { BaseAuthFieldProps, AUTH_VALIDATION_RULES } from './Auth';

// Password Field Component Props
export interface PasswordFieldProps extends BaseAuthFieldProps {
    placeholder?: string;
    showPassword: boolean;
    onToggleVisibility: () => void;
    enableValidation?: boolean;
    validationMode?: 'required' | 'optional';
    validationType?: 'signup' | 'login'; // Different validation rules for signup vs login
    onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
    id = 'password',
    value,
    onChange,
    disabled = false,
    className = '',
    errors = [],
    placeholder = "Enter your password",
    showPassword,
    onToggleVisibility,
    enableValidation = false,
    validationMode = 'optional',
    validationType = 'signup',
    onValidationChange
}) => {
    const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
    const [hasBeenTouched, setHasBeenTouched] = React.useState(false);

    // Create validation configuration based on props and validation type
    const validationConfig = React.useMemo(() => {
        if (!enableValidation) return undefined;

        const isSignup = validationType === 'signup';
        const minLength = isSignup ? AUTH_VALIDATION_RULES.SIGNUP_PASSWORD_MIN_LENGTH : AUTH_VALIDATION_RULES.LOGIN_PASSWORD_MIN_LENGTH;
        const maxLength = isSignup ? AUTH_VALIDATION_RULES.SIGNUP_PASSWORD_MAX_LENGTH : AUTH_VALIDATION_RULES.LOGIN_PASSWORD_MAX_LENGTH;

        const baseRules = [
            ...(validationMode === 'required' ? [{
                name: 'required',
                message: 'Password is required',
                validator: (val: string) => !!val && val.trim().length > 0
            }] : []),
            {
                name: `minLength_${minLength}`,
                message: `Password must be at least ${minLength} characters long`,
                validator: (val: string) => !val || val.length >= minLength
            },
            {
                name: `maxLength_${maxLength}`,
                message: `Password must not exceed ${maxLength} characters`,
                validator: (val: string) => !val || val.length <= maxLength
            }
        ];

        // Add complex validation rules only for signup
        if (isSignup) {
            baseRules.push(
                {
                    name: 'hasLowercase',
                    message: 'Password must contain at least one lowercase letter',
                    validator: (val: string) => !val || /.*[a-z].*/.test(val)
                },
                {
                    name: 'hasUppercase',
                    message: 'Password must contain at least one uppercase letter',
                    validator: (val: string) => !val || /.*[A-Z].*/.test(val)
                },
                {
                    name: 'hasDigit',
                    message: 'Password must contain at least one digit',
                    validator: (val: string) => !val || /.*\d.*/.test(val)
                },
                {
                    name: 'hasSpecialChar',
                    message: 'Password must contain at least one special character (@$!%*?&_)',
                    validator: (val: string) => !val || /.*[@$!%*?&_].*/.test(val)
                },
                {
                    name: 'validChars',
                    message: 'Password can only contain letters, digits, and special characters (@$!%*?&_)',
                    validator: (val: string) => !val || /^[A-Za-z\d@$!%*?&_]+$/.test(val)
                }
            );
        }

        return {
            fieldName: 'password',
            fieldType: 'password' as const,
            required: validationMode === 'required',
            rules: baseRules
        };
    }, [enableValidation, validationMode, validationType]);

    // Validate field when value changes
    const validateField = React.useCallback((fieldValue: string) => {
        if (!enableValidation || !validationConfig) {
            setValidationErrors([]);
            return true;
        }

        const result = validationService.validateField('password', fieldValue, validationConfig);
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
    }, [enableValidation, validationMode, validationType]);

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
                Password
                {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    id={id}
                    type={showPassword ? "text" : "password"}
                    placeholder={placeholder}
                    className={`pl-10 pr-10 ${hasErrors ? 'border-red-500 focus:border-red-500' : ''}`}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={disabled}
                />
                <button
                    type="button"
                    onClick={onToggleVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
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

export default PasswordField;