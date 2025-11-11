import { ValidationService } from './ValidationService';
import { FieldValidationConfig, ValidationRule } from './types';
import { beforeEach, describe, expect, test } from 'vitest';

describe('ValidationService', () => {
    let validationService: ValidationService;

    beforeEach(() => {
        validationService = ValidationService.getInstance();
    });

    describe('Singleton Pattern', () => {
        test('ValidationService_shouldReturnSameInstance_whenGetInstanceCalledMultipleTimes', () => {
            const instance1 = ValidationService.getInstance();
            const instance2 = ValidationService.getInstance();

            expect(instance1).toBe(instance2);
        });
    });

    describe('Built-in Rules', () => {
        describe('Required Rule', () => {
            test('ValidationService_shouldPassRequiredValidation_whenValueProvided', () => {
                const rule = validationService.getRule('required');

                expect(rule.validator('test')).toBe(true);
                expect(rule.validator('  valid  ')).toBe(true);
                expect(rule.validator(123)).toBe(true);
                expect(rule.validator(true)).toBe(true);
            });

            test('ValidationService_shouldFailRequiredValidation_whenValueEmpty', () => {
                const rule = validationService.getRule('required');

                expect(rule.validator('')).toBe(false);
                expect(rule.validator('   ')).toBe(false);
                expect(rule.validator(null)).toBe(false);
                expect(rule.validator(undefined)).toBe(false);
            });
        });

        describe('Email Rule', () => {
            test('ValidationService_shouldPassEmailValidation_whenValidEmailProvided', () => {
                const rule = validationService.getRule('email');

                expect(rule.validator('user@example.com')).toBe(true);
                expect(rule.validator('test.email@domain.co.uk')).toBe(true);
                expect(rule.validator('user+tag@example.org')).toBe(true);
                expect(rule.validator('')).toBe(true); // Empty is valid (let required handle it)
            });

            test('ValidationService_shouldFailEmailValidation_whenInvalidEmailProvided', () => {
                const rule = validationService.getRule('email');

                expect(rule.validator('invalid-email')).toBe(false);
                expect(rule.validator('user@')).toBe(false);
                expect(rule.validator('@domain.com')).toBe(false);
                expect(rule.validator('user@domain')).toBe(false);
                expect(rule.validator('user.domain.com')).toBe(false);
            });
        });

        describe('Phone Rule', () => {
            test('ValidationService_shouldPassPhoneValidation_whenValidPhoneProvided', () => {
                const rule = validationService.getRule('phone');

                expect(rule.validator('+1-555-123-4567')).toBe(true);
                expect(rule.validator('+44 20 7946 0958')).toBe(true);
                expect(rule.validator('(555) 123-4567')).toBe(true);
                expect(rule.validator('555.123.4567')).toBe(true);
                expect(rule.validator('')).toBe(true); // Empty is valid
            });

            test('ValidationService_shouldFailPhoneValidation_whenInvalidPhoneProvided', () => {
                const rule = validationService.getRule('phone');

                expect(rule.validator('123')).toBe(false);
                expect(rule.validator('invalid-phone')).toBe(false);
                expect(rule.validator('++123456789')).toBe(false);
            });
        });

        describe('Strong Password Rule', () => {
            test('ValidationService_shouldPassPasswordValidation_whenStrongPasswordProvided', () => {
                const rule = validationService.getRule('strongPassword');

                expect(rule.validator('SecurePass123!')).toBe(true);
                expect(rule.validator('MyP@ssw0rd')).toBe(true);
                expect(rule.validator('Complex1@')).toBe(true);
            });

            test('ValidationService_shouldFailPasswordValidation_whenWeakPasswordProvided', () => {
                const rule = validationService.getRule('strongPassword');

                expect(rule.validator('password')).toBe(false); // No uppercase, number, special char
                expect(rule.validator('PASSWORD')).toBe(false); // No lowercase, number, special char
                expect(rule.validator('Password123')).toBe(false); // No special char
                expect(rule.validator('Pass!')).toBe(false); // Too short
            });
        });
    });

    describe('Custom Rule Registration', () => {
        test('ValidationService_shouldRegisterCustomRule_whenValidRuleProvided', () => {
            const customRule: ValidationRule = {
                name: 'customTest',
                message: 'Custom validation failed',
                validator: (value: string) => value === 'test'
            };

            validationService.registerRule(customRule);
            const retrievedRule = validationService.getRule('customTest');

            expect(retrievedRule).toBe(customRule);
            expect(retrievedRule.validator('test')).toBe(true);
            expect(retrievedRule.validator('fail')).toBe(false);
        });

        test('ValidationService_shouldThrowError_whenRetrievingNonExistentRule', () => {
            expect(() => {
                validationService.getRule('nonExistentRule');
            }).toThrow("Validation rule 'nonExistentRule' not found");
        });
    });

    describe('Field Configuration', () => {
        test('ValidationService_shouldReturnBuiltInFieldConfig_whenRequestingKnownField', () => {
            const emailConfig = validationService.getFieldConfig('email');

            expect(emailConfig).toBeDefined();
            expect(emailConfig?.fieldName).toBe('email');
            expect(emailConfig?.fieldType).toBe('email');
            expect(emailConfig?.required).toBe(true);
            expect(emailConfig?.rules).toBeDefined();
        });

        test('ValidationService_shouldReturnUndefined_whenRequestingUnknownField', () => {
            const unknownConfig = validationService.getFieldConfig('unknownField');

            expect(unknownConfig).toBeUndefined();
        });

        test('ValidationService_shouldRegisterCustomFieldConfig_whenValidConfigProvided', () => {
            const customConfig: FieldValidationConfig = {
                fieldName: 'customField',
                fieldType: 'text',
                required: false,
                rules: [
                    {
                        name: 'customRule',
                        message: 'Custom rule failed',
                        validator: (value: string) => value.length <= 10
                    }
                ]
            };

            validationService.registerFieldConfig(customConfig);
            const retrievedConfig = validationService.getFieldConfig('customField');

            expect(retrievedConfig).toBe(customConfig);
        });
    });

    describe('Field Validation', () => {
        test('ValidationService_shouldReturnValidResult_whenFieldIsValid', () => {
            const result = validationService.validateField('email', 'test@example.com');

            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        test('ValidationService_shouldReturnInvalidResult_whenFieldIsInvalid', () => {
            const result = validationService.validateField('email', 'invalid-email');

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Email must be valid');
        });

        test('ValidationService_shouldReturnInvalidResult_whenRequiredFieldIsEmpty', () => {
            const result = validationService.validateField('email', '');

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('This field is required');
        });

        test('ValidationService_shouldUseCustomConfig_whenProvided', () => {
            const customConfig: FieldValidationConfig = {
                fieldName: 'testField',
                fieldType: 'text',
                required: true,
                rules: [
                    {
                        name: 'maxLength',
                        message: 'Must not exceed 5 characters',
                        validator: (value: string) => value.length <= 5
                    }
                ]
            };

            const validResult = validationService.validateField('testField', 'test', customConfig);
            expect(validResult.isValid).toBe(true);

            const invalidResult = validationService.validateField('testField', 'toolong', customConfig);
            expect(invalidResult.isValid).toBe(false);
            expect(invalidResult.errors).toContain('Must not exceed 5 characters');
        });

        test('ValidationService_shouldReturnValidResult_whenFieldConfigNotFound', () => {
            const result = validationService.validateField('unknownField', 'anyValue');

            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        test('ValidationService_shouldApplyValueTransformation_whenTransformProvided', () => {
            const configWithTransform: FieldValidationConfig = {
                fieldName: 'testField',
                fieldType: 'text',
                required: false,
                transform: (value: string) => value.toLowerCase(),
                rules: [
                    {
                        name: 'lowercase',
                        message: 'Must be lowercase',
                        validator: (value: string) => value === value.toLowerCase()
                    }
                ]
            };

            // Should pass because transform converts to lowercase
            const result = validationService.validateField('testField', 'UPPERCASE', configWithTransform);
            expect(result.isValid).toBe(true);
        });

        test('ValidationService_shouldHandleValidationError_whenRuleThrowsException', () => {
            const errorConfig: FieldValidationConfig = {
                fieldName: 'errorField',
                fieldType: 'text',
                required: false,
                rules: [
                    {
                        name: 'throwingRule',
                        message: 'This rule throws',
                        validator: () => {
                            throw new Error('Validation rule error');
                        }
                    }
                ]
            };

            const result = validationService.validateField('errorField', 'value', errorConfig);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Validation error: Validation rule error');
        });
    });

    describe('Helper Methods', () => {
        test('ValidationService_shouldCreatePatternRule_whenValidPatternProvided', () => {
            const rule = validationService.createPatternRule(/^[A-Z]+$/, 'Must be uppercase letters only');

            expect(rule.name).toMatch(/pattern_/);
            expect(rule.message).toBe('Must be uppercase letters only');
            expect(rule.validator('ABC')).toBe(true);
            expect(rule.validator('abc')).toBe(false);
            expect(rule.validator('')).toBe(true); // Empty should be valid
        });
    });

    describe('Complex Validation Scenarios', () => {
        test('ValidationService_shouldValidateMultipleRules_whenFieldHasMultipleRules', () => {
            const passwordConfig: FieldValidationConfig = {
                fieldName: 'password',
                fieldType: 'password',
                required: true,
                rules: [
                    validationService.getRule('required'),
                    {
                        name: 'minLength_8',
                        message: 'Password must be at least 8 characters',
                        validator: (value: string) => value.length >= 8
                    },
                    {
                        name: 'hasNumber',
                        message: 'Password must contain a number',
                        validator: (value: string) => /\d/.test(value)
                    }
                ]
            };

            // Should fail multiple rules
            const result1 = validationService.validateField('password', 'abc', passwordConfig);
            expect(result1.isValid).toBe(false);
            expect(result1.errors).toHaveLength(2);
            expect(result1.errors).toContain('Password must be at least 8 characters');
            expect(result1.errors).toContain('Password must contain a number');

            // Should pass all rules
            const result2 = validationService.validateField('password', 'password123', passwordConfig);
            expect(result2.isValid).toBe(true);
            expect(result2.errors).toHaveLength(0);
        });
    });
});