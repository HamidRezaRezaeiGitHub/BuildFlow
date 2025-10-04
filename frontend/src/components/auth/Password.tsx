import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ValidationResult } from '../../services/validation';
import { useSmartFieldValidation } from '../../services/validation/useSmartFieldValidation';
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
    // Defensive programming: validate required props
    if (!onChange || typeof onChange !== 'function') {
        console.warn('PasswordField: onChange prop is required and must be a function');
        return null;
    }
    
    if (!onToggleVisibility || typeof onToggleVisibility !== 'function') {
        console.warn('PasswordField: onToggleVisibility prop is required and must be a function');
        return null;
    }
    
    // Safely handle props
    const safeValue = value ?? '';
    const safeErrors = Array.isArray(errors) ? errors : [];
    const safeClassName = typeof className === 'string' ? className : '';
    const safePlaceholder = typeof placeholder === 'string' ? placeholder : 'Enter your password';
    const safeId = typeof id === 'string' && id.length > 0 ? id : 'password';
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
        value: safeValue,
        config: hookConfig,
        enableValidation,
        onValidationChange
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e?.target) return;
        
        const oldValue = safeValue;
        const newValue = e.target.value ?? '';

        // Use the hook's change handler for autofill detection
        handlers?.handleChange?.(newValue, oldValue);

        onChange(newValue);
    };

    const handleFocus = () => {
        handlers?.handleFocus?.();
    };

    const handleBlur = () => {
        handlers?.handleBlur?.();
    };

    // Determine which errors to display - use hook's computed displayErrors or fallback to external errors
    const displayErrors = enableValidation && state?.displayErrors ? state.displayErrors : safeErrors;
    const hasErrors = Array.isArray(displayErrors) && displayErrors.length > 0;
    // Determine if field is required for label display
    const isRequired = enableValidation && validationMode === 'required';
    
    // Generate ARIA IDs for accessibility
    const errorId = hasErrors ? `${safeId}-error` : undefined;
    const ariaDescribedBy = errorId;

    return (
        <div className={`space-y-2 ${safeClassName}`}>
            <Label htmlFor={safeId} className="text-xs">
                Password
                {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    id={safeId}
                    type={showPassword ? "text" : "password"}
                    placeholder={safePlaceholder}
                    className={`pl-10 pr-10 ${hasErrors ? 'border-red-500 focus:border-red-500' : ''}`}
                    value={safeValue}
                    onFocus={handleFocus}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={disabled}
                    aria-describedby={ariaDescribedBy}
                    aria-invalid={hasErrors}
                    autoComplete={validationType === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                    type="button"
                    onClick={onToggleVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
            {hasErrors && (
                <div id={errorId} className="space-y-1" role="alert" aria-live="polite">
                    {displayErrors.map((error, index) => (
                        <p key={index} className="text-xs text-red-500">{error || 'Invalid password'}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PasswordField;