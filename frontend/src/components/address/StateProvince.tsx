import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ValidationResult } from '@/services/validation';
import { useSmartFieldValidation } from '@/services/validation/useSmartFieldValidation';
import { ChangeEvent, FC, useMemo } from 'react';
import { BaseFieldProps } from '.';

// State/Province Field Component
export interface StateProvinceFieldProps extends BaseFieldProps {
    placeholder?: string;
    enableValidation?: boolean;
    validationMode?: 'required' | 'optional';
    onValidationChange?: (validationResult: ValidationResult) => void;
}

export const StateProvinceField: FC<StateProvinceFieldProps> = ({
    id = 'stateOrProvince',
    value,
    onChange,
    disabled = false,
    className = '',
    errors = [],
    placeholder = 'ON',
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
                message: 'State/Province is required',
                validator: (val: string) => !!val && val.trim().length > 0
            }] : []),
            {
                name: 'maxLength_50',
                message: 'State/Province must not exceed 50 characters',
                validator: (val: string) => !val || val.length <= 50
            },
            {
                name: 'minLength_2',
                message: 'State/Province must be at least 2 characters long',
                validator: (val: string) => !val || val.trim().length >= 2
            },
            {
                name: 'validStateProvince',
                message: 'State/Province must contain only letters, spaces, hyphens, and periods',
                validator: (val: string) => !val || /^[a-zA-Z\s\-.]+$/.test(val.trim())
            }
        ];
    }, [enableValidation, validationMode]);

    // Memoized config for the hook to prevent infinite re-renders
    const hookConfig = useMemo(() => ({
        fieldName: 'stateOrProvince',
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
                Province/State
                {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
                id={id}
                type="text"
                placeholder={placeholder}
                value={value}
                onFocus={handleFocus}
                onChange={handleChange}
                onBlur={handleBlur}
                className={hasErrors ? 'border-red-500 focus:border-red-500' : ''}
                disabled={disabled}
            />
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

export default StateProvinceField;