/**
 * This module provides:
 * - Type-safe validation for individual input fields
 * - Pre-configured validation rules for common field types
 * 
 * Usage Examples:
 * 
 * const result = validationService.validateField('email', emailValue);
 * if (!result.isValid) {
 *   console.log('Errors:', result.errors);
 * }
 * 
 * // Using pre-configured field types
 * const emailConfig = createFieldConfig.email(true); // required
 * const result = validationService.validateField('email', emailValue, emailConfig);
 */

// Core types and interfaces
export type {
    BuiltInFieldConfigs, FieldValidationConfig, InputFieldType, ValidatedInputProps, ValidationResult,
    ValidationRule, ValidationRules
} from './types';

// Constants and patterns
export {
    VALIDATION_PATTERNS
} from './types';

// Main validation service
export {
    createFieldConfig, validateField, ValidationService
} from './ValidationService';
