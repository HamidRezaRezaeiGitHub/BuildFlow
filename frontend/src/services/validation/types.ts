// Core validation result interface
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

// Validation rule definition
export interface ValidationRule<T = any> {
    name: string;
    message: string;
    validator: (value: T) => boolean;
}

// Input field types for different validation strategies
export type InputFieldType =
    | 'text'
    | 'email'
    | 'password'
    | 'phone'
    | 'number'
    | 'url'
    | 'date'
    | 'address'
    | 'name'
    | 'postalCode'
    | 'custom';

// Field validation configuration
export interface FieldValidationConfig {
    fieldName: string;
    fieldType: InputFieldType;
    required?: boolean;
    rules?: ValidationRule[];
    transform?: (value: any) => any; // Value transformation before validation
    debounceMs?: number; // For real-time validation
}

// Input attributes for individual field validation
export interface ValidatedInputProps {
    // Core input props
    value: any;
    fieldName: string;
    fieldType?: InputFieldType;

    // Validation behavior
    required?: boolean;
    validationConfig?: FieldValidationConfig;
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    debounceMs?: number;

    // Display behavior
    showErrorsImmediately?: boolean;
    customErrorMessages?: Record<string, string>;

    // Callbacks
    onValidationChange?: (result: ValidationResult) => void;
    onValidationComplete?: (result: ValidationResult) => void;
}

// Validation rule types
export interface ValidationRules {
    // Basic rules
    required: ValidationRule;
    minLength: (min: number) => ValidationRule;
    maxLength: (max: number) => ValidationRule;
    pattern: (regex: RegExp, message: string) => ValidationRule;

    // Type-specific rules  
    email: ValidationRule;
    phone: ValidationRule;
    postalCode: (country?: string) => ValidationRule;
    password: ValidationRule;
    url: ValidationRule;

    // Numeric rules
    min: (min: number) => ValidationRule;
    max: (max: number) => ValidationRule;
    integer: ValidationRule;

    // Custom rules
    custom: (validator: (value: any) => boolean, message: string) => ValidationRule;
}

// Built-in field type configurations
export interface BuiltInFieldConfigs {
    email: FieldValidationConfig;
    password: FieldValidationConfig;
    phone: FieldValidationConfig;
    firstName: FieldValidationConfig;
    lastName: FieldValidationConfig;
    streetNumber: FieldValidationConfig;
    unitNumber: FieldValidationConfig;
    postalCode: FieldValidationConfig;
}

// Export commonly used validation patterns
export const VALIDATION_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_INTERNATIONAL: /^[\+\(\d][\d\-\s\(\)\.]{6,28}$/,
    CANADIAN_POSTAL: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
    US_ZIP: /^\d{5}(-\d{4})?$/,
    STREET_NUMBER: /^\d+$/,
    UNIT_NUMBER: /^[A-Za-z0-9\-#]*$/,
    PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/,
} as const;

export default ValidationResult;