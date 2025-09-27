import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ValidationResult } from '@/services/validation';
import { validationService } from '@/services/validation/ValidationService';
import { Mail } from 'lucide-react';
import { ChangeEvent, FC, useCallback, useEffect, useMemo, useState } from 'react';
import { AUTH_VALIDATION_RULES, BaseAuthFieldProps } from './Auth';

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
    const [validationResult, setValidationResult] = useState<ValidationResult>({ isValid: true, errors: [] });
    const [hasBeenTouched, setHasBeenTouched] = useState(false);
    const [wasAutofilled, setWasAutofilled] = useState(false);
    const [hasFocus, setHasFocus] = useState(false);
    const [userTypingTimer, setUserTypingTimer] = useState<NodeJS.Timeout | null>(null);

    // memoized validation config
    const validationConfig = useMemo(() => {
        if (!enableValidation) return undefined;

        return {
            fieldName: 'email',
            fieldType: 'email' as const,
            required: validationMode === 'required',
            rules: [
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
            ]
        };
    }, [enableValidation, validationMode]);

    // memoized validation function
    const validateEmail = useCallback((fieldValue: string) => {
        if (!enableValidation || !validationConfig) {
            setValidationResult({ isValid: true, errors: [] });
            return;
        }

        const result: ValidationResult = validationService.validateField('email', fieldValue, validationConfig);
        setValidationResult(result);
    }, [enableValidation, validationConfig]);

    const detectAutofill = useCallback((newValue: string, oldValue: string) => {
        // Clear any existing timer
        if (userTypingTimer) {
            clearTimeout(userTypingTimer);
        }

        // Primary detection logic
        const wasEmpty = !oldValue || oldValue.trim() === '';
        const hasContent = newValue && newValue.trim().length > 0;
        const largeChange = (newValue.length - oldValue.length) > 2;
        const noUserInteraction = !hasBeenTouched && !hasFocus;
        const looksLikeEmail = newValue.includes('@') && newValue.includes('.');

        const isLikelyAutofill = wasEmpty && hasContent && largeChange &&
            noUserInteraction && looksLikeEmail;

        if (isLikelyAutofill) {
            setWasAutofilled(true);
            const timer = setTimeout(() => {
                setHasBeenTouched(true);
            }, 1500); // Give user time to see the autofilled value

            setUserTypingTimer(timer);
            return true;
        }

        return false;
    }, [hasBeenTouched, hasFocus, userTypingTimer]);

    useEffect(() => {
        if (onValidationChange) {
            onValidationChange(validationResult);
        }
    }, [validationResult]);

    useEffect(() => {
        validateEmail(value);
    }, [value, validateEmail]);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (userTypingTimer) {
                clearTimeout(userTypingTimer);
            }
        };
    }, [userTypingTimer]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const oldValue = value;
        const newValue = e.target.value;

        // Detect autofill
        if (!wasAutofilled) {
            detectAutofill(newValue, oldValue);
        }

        onChange(newValue);
    };

    const handleFocus = () => {
        setHasFocus(true);
        setHasBeenTouched(true);
    };

    const handleBlur = () => {
        setHasFocus(false);
    };

    // Determine which errors to display
    const displayErrors = enableValidation && hasBeenTouched ? validationResult.errors : errors;
    const hasErrors = displayErrors.length > 0;
    // Determine if field is required for label display
    const isRequired = enableValidation && validationMode === 'required';

    return (
        <div className={`space-y-2 ${className}`}>
            <Label htmlFor={id} className="text-xs">
                Email
                {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    id={id}
                    type="email"
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

export default EmailField;