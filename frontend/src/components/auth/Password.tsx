import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ValidationResult } from '@/services/validation';
import { useSmartFieldValidation } from '@/services/validation/useSmartFieldValidation';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { ChangeEvent, FC, useMemo } from 'react';
import { AUTH_VALIDATION_RULES, BaseAuthFieldProps } from './';

// Password Field Component Props
export interface PasswordFieldProps extends BaseAuthFieldProps {
    placeholder?: string;
    showPassword: boolean;
    onToggleVisibility: () => void;
    enableValidation?: boolean;
    validationMode?: 'required' | 'optional';
    validationType?: 'signup' | 'login'; // Different validation rules for signup vs login
    onValidationChange?: (validationResult: ValidationResult) => void;
}

export const PasswordField: FC<PasswordFieldProps> = ({
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
    // Memoized validation rules configuration
    const validationRules = useMemo(() => {
        if (!enableValidation) return [];

        const isSignup = validationType === 'signup';
        const minLength = AUTH_VALIDATION_RULES.PASSWORD_MIN_LENGTH;
        const maxLength = AUTH_VALIDATION_RULES.PASSWORD_MAX_LENGTH;

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

        return baseRules;
    }, [enableValidation, validationMode, validationType]);

    // Memoized config for the hook to prevent infinite re-renders
    const hookConfig = useMemo(() => ({
        fieldName: 'password',
        fieldType: 'password' as const,
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
                    onFocus={handleFocus}
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