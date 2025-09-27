import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ValidationResult } from '@/services/validation';
import { useSmartFieldValidation } from '@/services/validation/useSmartFieldValidation';
import { User } from 'lucide-react';
import { ChangeEvent, FC, useMemo } from 'react';
import { BaseAuthFieldProps } from './Auth';

// Name type configuration
export type NameType = 'firstName' | 'lastName';

// Name Field Component Props
export interface NameFieldProps extends BaseAuthFieldProps {
    nameType: NameType;
    placeholder?: string;
    enableValidation?: boolean;
    validationMode?: 'required' | 'optional';
    onValidationChange?: (validationResult: ValidationResult) => void;
}

// Configuration for different name types
const nameConfig = {
    firstName: {
        label: 'First Name',
        defaultPlaceholder: 'John',
        fieldName: 'firstName',
        requiredMessage: 'First name is required',
        maxLengthMessage: 'First name must not exceed 100 characters'
    },
    lastName: {
        label: 'Last Name',
        defaultPlaceholder: 'Doe',
        fieldName: 'lastName',
        requiredMessage: 'Last name is required',
        maxLengthMessage: 'Last name must not exceed 100 characters'
    }
} as const;

export const NameField: FC<NameFieldProps> = ({
    nameType,
    id,
    value,
    onChange,
    disabled = false,
    className = '',
    errors = [],
    placeholder,
    enableValidation = false,
    validationMode = 'optional',
    onValidationChange
}) => {
    // Get configuration for the specific name type
    const config = nameConfig[nameType];
    
    // Use default ID if not provided
    const fieldId = id || config.fieldName;
    
    // Use default placeholder if not provided
    const fieldPlaceholder = placeholder || config.defaultPlaceholder;

    // Memoized validation rules configuration
    const validationRules = useMemo(() => {
        if (!enableValidation) return [];

        return [
            ...(validationMode === 'required' ? [{
                name: 'required',
                message: config.requiredMessage,
                validator: (val: string) => !!val && val.trim().length > 0
            }] : []),
            {
                name: 'maxLength_100',
                message: config.maxLengthMessage,
                validator: (val: string) => !val || val.length <= 100
            }
        ];
    }, [enableValidation, validationMode, config]);

    // Memoized config for the hook to prevent infinite re-renders
    const hookConfig = useMemo(() => ({
        fieldName: config.fieldName,
        fieldType: 'text' as const,
        required: validationMode === 'required',
        validationRules
    }), [validationMode, validationRules, config.fieldName]);

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
            <Label htmlFor={fieldId} className="text-xs">
                {config.label}
                {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    id={fieldId}
                    type="text"
                    placeholder={fieldPlaceholder}
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

export default NameField;