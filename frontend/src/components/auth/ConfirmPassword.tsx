import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ValidationResult } from '../../services/validation';
import { useSmartFieldValidation } from '../../services/validation/useSmartFieldValidation';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { ChangeEvent, FC, useMemo } from 'react';
import { BaseAuthFieldProps } from './';

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

export const ConfirmPasswordField: FC<ConfirmPasswordFieldProps> = ({
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
    // Memoized validation rules configuration
    const validationRules = useMemo(() => {
        if (!enableValidation) return [];

        return [
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
        ];
    }, [enableValidation, validationMode, originalPassword]);

    // Memoized config for the hook to prevent infinite re-renders
    const hookConfig = useMemo(() => ({
        fieldName: 'confirmPassword',
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

export default ConfirmPasswordField;