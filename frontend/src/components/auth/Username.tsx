import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ValidationResult } from '@/services/validation';
import { useSmartFieldValidation } from '@/services/validation/useSmartFieldValidation';
import { User } from 'lucide-react';
import { ChangeEvent, FC, useMemo } from 'react';
import { AUTH_VALIDATION_RULES, BaseAuthFieldProps } from './';

// Username Field Component Props
export interface UsernameFieldProps extends BaseAuthFieldProps {
    placeholder?: string;
    enableValidation?: boolean;
    validationMode?: 'required' | 'optional';
    onValidationChange?: (validationResult: ValidationResult) => void;
}

export const UsernameField: FC<UsernameFieldProps> = ({
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
    // Memoized validation rules configuration
    const validationRules = useMemo(() => {
        if (!enableValidation) return [];

        return [
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
        ];
    }, [enableValidation, validationMode]);

    // Memoized config for the hook to prevent infinite re-renders
    const hookConfig = useMemo(() => ({
        fieldName: 'username',
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
                    onFocus={handleFocus}
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