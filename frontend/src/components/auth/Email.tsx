import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ValidationResult } from '../../services/validation';
import { useSmartFieldValidation } from '../../services/validation/useSmartFieldValidation';
import { Mail } from 'lucide-react';
import { ChangeEvent, FC, useMemo } from 'react';
import { AUTH_VALIDATION_RULES, BaseAuthFieldProps } from './';

// Email Field Component Props
export interface EmailFieldProps extends BaseAuthFieldProps {
    placeholder?: string;
    enableValidation?: boolean;
    validationMode?: 'required' | 'optional';
    onValidationChange?: (validationResult: ValidationResult) => void;
}

export const EmailField: FC<EmailFieldProps> = ({
    id = 'email',
    value,
    onChange,
    disabled = false,
    className = '',
    errors = [],
    placeholder = "john@company.com",
    enableValidation = false,
    validationMode = 'optional',
    onValidationChange
}) => {
    // Defensive programming: validate required props
    if (!onChange || typeof onChange !== 'function') {
        console.warn('EmailField: onChange prop is required and must be a function');
        return null;
    }
    
    // Safely handle value prop
    const safeValue = value ?? '';
    const safeErrors = Array.isArray(errors) ? errors : [];
    const safeClassName = typeof className === 'string' ? className : '';
    const safePlaceholder = typeof placeholder === 'string' ? placeholder : 'john@company.com';
    const safeId = typeof id === 'string' && id.length > 0 ? id : 'email';
    // Memoized validation rules configuration
    const validationRules = useMemo(() => {
        if (!enableValidation) return [];

        return [
            ...(validationMode === 'required' ? [{
                name: 'required',
                message: 'Email is required',
                validator: (val: string) => !!val && val.trim().length > 0
            }] : []),
            {
                name: 'validEmail',
                message: 'Email must be valid',
                validator: (val: string) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
            },
            {
                name: `maxLength_${AUTH_VALIDATION_RULES.EMAIL_MAX_LENGTH}`,
                message: `Email must not exceed ${AUTH_VALIDATION_RULES.EMAIL_MAX_LENGTH} characters`,
                validator: (val: string) => !val || val.length <= AUTH_VALIDATION_RULES.EMAIL_MAX_LENGTH
            }
        ];
    }, [enableValidation, validationMode]);

    // Memoized config for the hook to prevent infinite re-renders
    const hookConfig = useMemo(() => ({
        fieldName: 'email',
        fieldType: 'email' as const,
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
                Email
                {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    id={safeId}
                    type="email"
                    placeholder={safePlaceholder}
                    className={`pl-10 ${hasErrors ? 'border-red-500 focus:border-red-500' : ''}`}
                    value={safeValue}
                    onFocus={handleFocus}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={disabled}
                    aria-describedby={ariaDescribedBy}
                    aria-invalid={hasErrors}
                />
            </div>
            {hasErrors && (
                <div id={errorId} className="space-y-1" role="alert" aria-live="polite">
                    {displayErrors.map((error, index) => (
                        <p key={index} className="text-xs text-red-500">{error || 'Invalid field'}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmailField;