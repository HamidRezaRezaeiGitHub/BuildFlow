import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ValidationResult } from '@/services/validation';
import { validationService } from '@/services/validation/ValidationService';
import { Eye, EyeOff, Lock } from 'lucide-react';
import React from 'react';
import { BaseAuthFieldProps } from './Auth';

// Confirm Password Field Component Props
export interface ConfirmPasswordFieldProps extends BaseAuthFieldProps {
    placeholder?: string;
    showPassword: boolean;
    onToggleVisibility: () => void;
    originalPassword: string;
    enableValidation?: boolean;
    validationMode?: 'required' | 'optional';
    onValidationChange?: (validationResult: ValidationResult) => void;
}

export const ConfirmPasswordField: React.FC<ConfirmPasswordFieldProps> = ({
    id = 'confirmPassword',
    value,
    onChange,
    disabled = false,
    className = '',
    errors = [],
    placeholder = "Confirm your password",
    showPassword,
    onToggleVisibility,
    originalPassword,
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
            fieldName: 'confirmPassword',
            fieldType: 'password' as const,
            required: validationMode === 'required',
            rules: [
                ...(validationMode === 'required' ? [{
                    name: 'required',
                    message: 'Password confirmation is required',
                    validator: (val: string) => !!val && val.trim().length > 0
                }] : []),
                {
                    name: 'passwordMatch',
                    message: 'Passwords do not match',
                    validator: (val: string) => !val || val === originalPassword
                }
            ]
        };
    }, [enableValidation, validationMode, originalPassword]);

    // Validate field when value changes
    const validateField = React.useCallback((fieldValue: string) => {
        if (!enableValidation || !validationConfig) {
            setValidationErrors([]);
            return true;
        }

        const result: ValidationResult = validationService.validateField('confirmPassword', fieldValue, validationConfig);
        setValidationErrors(result.errors);

        // Notify parent of validation changes
        if (onValidationChange) {
            onValidationChange(result);
        }

        return result.isValid;
    }, [enableValidation, validationConfig, onValidationChange]);

    // Handle validation prop changes and original password changes
    React.useEffect(() => {
        if (!enableValidation) {
            setValidationErrors([]);
            if (onValidationChange) {
                onValidationChange({ isValid: true, errors: [] });
            }
        } else if (hasBeenTouched) {
            // Re-validate when original password changes
            validateField(value);
        }
    }, [enableValidation, validationMode, originalPassword, hasBeenTouched, value, validateField]);

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
                Confirm Password
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

export default ConfirmPasswordField;