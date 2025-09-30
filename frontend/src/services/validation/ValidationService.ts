import {
    FieldValidationConfig,
    VALIDATION_PATTERNS,
    ValidationResult,
    ValidationRule
} from './types';

/**
 * Simplified validation service focused on individual field validation only
 */
export class ValidationService {
    private static instance: ValidationService;
    private ruleRegistry: Map<string, ValidationRule> = new Map();
    private fieldConfigs: Map<string, FieldValidationConfig> = new Map();

    private constructor() {
        this.initializeBuiltInRules();
        this.initializeBuiltInFieldConfigs();
    }

    public static getInstance(): ValidationService {
        if (!ValidationService.instance) {
            ValidationService.instance = new ValidationService();
        }
        return ValidationService.instance;
    }

    /**
     * Initialize built-in validation rules - simplified
     */
    private initializeBuiltInRules(): void {
        // Required rule
        this.registerRule({
            name: 'required',
            message: 'This field is required',
            validator: (value: any) => {
                if (value === null || value === undefined) return false;
                if (typeof value === 'string') return value.trim().length > 0;
                return true;
            }
        });

        // Email rule
        this.registerRule({
            name: 'email',
            message: 'Email must be valid',
            validator: (value: string) => {
                if (!value) return true; // Let required rule handle empty values
                return VALIDATION_PATTERNS.EMAIL.test(value);
            }
        });

        // Phone rule
        this.registerRule({
            name: 'phone',
            message: 'Phone number must be a valid format (e.g., +1-555-123-4567)',
            validator: (value: string) => {
                if (!value) return true;
                return VALIDATION_PATTERNS.PHONE_INTERNATIONAL.test(value);
            }
        });

        // Password strength rule
        this.registerRule({
            name: 'strongPassword',
            message: 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character',
            validator: (value: string) => {
                if (!value) return true;
                return VALIDATION_PATTERNS.PASSWORD_STRONG.test(value);
            }
        });

        // Street number rule (alphanumeric with common separators)
        this.registerRule({
            name: 'streetNumber',
            message: 'Street number contains invalid characters',
            validator: (value: string) => {
                if (!value) return true;
                return /^[0-9A-Za-z\-\/\s]*$/.test(value);
            }
        });

        // Unit number rule (alphanumeric and common unit characters)
        this.registerRule({
            name: 'unitNumber',
            message: 'Unit number contains invalid characters',
            validator: (value: string) => {
                if (!value) return true;
                return VALIDATION_PATTERNS.UNIT_NUMBER.test(value);
            }
        });
    }

    /**
     * Initialize built-in field configurations
     */
    private initializeBuiltInFieldConfigs(): void {
        // Email field
        this.registerFieldConfig({
            fieldName: 'email',
            fieldType: 'email',
            required: true,
            rules: [
                this.getRule('required'),
                this.getRule('email'),
                this.createMaxLengthRule(100)
            ]
        });

        // Password field
        this.registerFieldConfig({
            fieldName: 'password',
            fieldType: 'password',
            required: true,
            rules: [
                this.getRule('required'),
                this.createMinLengthRule(8),
                this.createMaxLengthRule(128),
                this.getRule('strongPassword')
            ]
        });

        // First name field
        this.registerFieldConfig({
            fieldName: 'firstName',
            fieldType: 'name',
            required: true,
            rules: [
                this.getRule('required'),
                this.createMaxLengthRule(100)
            ]
        });

        // Last name field
        this.registerFieldConfig({
            fieldName: 'lastName',
            fieldType: 'name',
            required: true,
            rules: [
                this.getRule('required'),
                this.createMaxLengthRule(100)
            ]
        });

        // Phone field
        this.registerFieldConfig({
            fieldName: 'phone',
            fieldType: 'phone',
            required: false,
            rules: [
                this.getRule('phone'),
                this.createMaxLengthRule(30)
            ]
        });

        // Street number field
        this.registerFieldConfig({
            fieldName: 'streetNumber',
            fieldType: 'text',
            required: false,
            rules: [
                this.getRule('streetNumber'),
                this.createMaxLengthRule(20)
            ]
        });

        // Street name field
        this.registerFieldConfig({
            fieldName: 'streetName',
            fieldType: 'text',
            required: true,
            rules: [
                this.getRule('required'),
                this.createMaxLengthRule(200)
            ]
        });

        // City field
        this.registerFieldConfig({
            fieldName: 'city',
            fieldType: 'text',
            required: true,
            rules: [
                this.getRule('required'),
                this.createMaxLengthRule(100)
            ]
        });

        // State/Province field
        this.registerFieldConfig({
            fieldName: 'stateOrProvince',
            fieldType: 'text',
            required: true,
            rules: [
                this.getRule('required'),
                this.createMaxLengthRule(100)
            ]
        });

        // Country field
        this.registerFieldConfig({
            fieldName: 'country',
            fieldType: 'text',
            required: true,
            rules: [
                this.getRule('required'),
                this.createMaxLengthRule(100)
            ]
        });

        // Postal code field
        this.registerFieldConfig({
            fieldName: 'postalOrZipCode',
            fieldType: 'postalCode',
            required: false,
            rules: [
                this.createMaxLengthRule(20)
            ]
        });

        // Unit number field
        this.registerFieldConfig({
            fieldName: 'unitNumber',
            fieldType: 'text',
            required: false,
            rules: [
                this.createMaxLengthRule(20)
            ]
        });
    }

    /**
     * Register a new validation rule
     */
    public registerRule(rule: ValidationRule): void {
        this.ruleRegistry.set(rule.name, rule);
    }

    /**
     * Get a registered validation rule
     */
    public getRule(name: string): ValidationRule {
        const rule = this.ruleRegistry.get(name);
        if (!rule) {
            throw new Error(`Validation rule '${name}' not found`);
        }
        return rule;
    }

    /**
     * Register a field validation configuration
     */
    public registerFieldConfig(config: FieldValidationConfig): void {
        this.fieldConfigs.set(config.fieldName, config);
    }

    /**
     * Get field validation configuration
     */
    public getFieldConfig(fieldName: string): FieldValidationConfig | undefined {
        return this.fieldConfigs.get(fieldName);
    }

    /**
     * Validate a single field value
     */
    public validateField(
        fieldName: string,
        value: any,
        customConfig?: FieldValidationConfig
    ): ValidationResult {
        const config = customConfig || this.getFieldConfig(fieldName);

        if (!config) {
            return {
                isValid: true,
                errors: []
            };
        }

        const errors: string[] = [];

        // Transform value if transformer is provided
        const transformedValue = config.transform ? config.transform(value) : value;

        // Apply all validation rules
        if (config.rules) {
            for (const rule of config.rules) {
                try {
                    const isValid = rule.validator(transformedValue);

                    if (!isValid) {
                        errors.push(rule.message);
                    }
                } catch (error) {
                    errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Helper method to create a min length rule
     */
    private createMinLengthRule(min: number): ValidationRule {
        return {
            name: `minLength_${min}`,
            message: `Must be at least ${min} characters long`,
            validator: (value: string) => {
                if (!value) return true; // Let required rule handle empty values
                return value.length >= min;
            }
        };
    }

    /**
     * Helper method to create a max length rule
     */
    private createMaxLengthRule(max: number): ValidationRule {
        return {
            name: `maxLength_${max}`,
            message: `Must not exceed ${max} characters`,
            validator: (value: string) => {
                if (!value) return true;
                return value.length <= max;
            }
        };
    }

    /**
     * Helper method to create a pattern rule
     */
    public createPatternRule(pattern: RegExp, message: string): ValidationRule {
        return {
            name: `pattern_${pattern.source}`,
            message,
            validator: (value: string) => {
                if (!value) return true;
                return pattern.test(value);
            }
        };
    }
}

/**
 * Validation configuration builders for common field types
 */
export const createFieldConfig = {
    email: (required = true): FieldValidationConfig =>
        validationService.getFieldConfig('email') || { fieldName: 'email', fieldType: 'email', required },

    password: (required = true): FieldValidationConfig =>
        validationService.getFieldConfig('password') || { fieldName: 'password', fieldType: 'password', required },

    name: (fieldName: string, required = true): FieldValidationConfig => ({
        fieldName,
        fieldType: 'name',
        required,
        rules: [
            ...(required ? [validationService.getRule('required')] : []),
            {
                name: 'maxLength_100',
                message: 'Must not exceed 100 characters',
                validator: (value: string) => !value || value.length <= 100
            }
        ]
    }),

    phone: (): FieldValidationConfig =>
        validationService.getFieldConfig('phone') || { fieldName: 'phone', fieldType: 'phone', required: false },

    address: (fieldName: string, required = true): FieldValidationConfig => {
        const baseConfig = validationService.getFieldConfig(fieldName);
        if (baseConfig) return baseConfig;

        return {
            fieldName,
            fieldType: 'address',
            required,
            rules: required ? [validationService.getRule('required')] : []
        };
    }
};

// Export singleton instance
export const validationService = ValidationService.getInstance();

// Export convenience function for single field validation
export const validateField = (fieldName: string, value: any, customConfig?: FieldValidationConfig) =>
    validationService.validateField(fieldName, value, customConfig);

export default validationService;