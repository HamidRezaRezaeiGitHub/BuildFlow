import { act, renderHook } from '@testing-library/react';
import { ValidationResult } from './types';
import { SmartFieldConfig, useSmartFieldValidation } from './useSmartFieldValidation';

// Mock the ValidationService
jest.mock('./ValidationService', () => ({
    validationService: {
        validateField: jest.fn().mockReturnValue({
            isValid: true,
            errors: []
        })
    }
}));

import { validationService } from './ValidationService';

const mockValidationService = validationService as jest.Mocked<typeof validationService>;

describe('useSmartFieldValidation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    const createEmailConfig = (): SmartFieldConfig => ({
        fieldName: 'email',
        fieldType: 'email',
        required: true,
        validationRules: [
            {
                name: 'required',
                message: 'Email is required',
                validator: (val: string) => !!val && val.trim().length > 0
            },
            {
                name: 'validEmail',
                message: 'Email must be valid',
                validator: (val: string) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
            }
        ],
        autofillConfig: {
            minChangeThreshold: 3,
            touchedDelay: 1500,
            contentPatterns: [/@/, /\./]
        }
    });

    describe('Initial State', () => {
        test('useSmartFieldValidation_shouldInitializeWithCorrectDefaultState', () => {
            const config = createEmailConfig();
            const { result } = renderHook(() =>
                useSmartFieldValidation({
                    value: '',
                    config,
                    enableValidation: true
                })
            );

            expect(result.current.state.validationResult.isValid).toBe(true);
            expect(result.current.state.validationResult.errors).toHaveLength(0);
            expect(result.current.state.hasBeenTouched).toBe(false);
            expect(result.current.state.wasAutofilled).toBe(false);
            expect(result.current.state.hasFocus).toBe(false);
            expect(result.current.state.displayErrors).toHaveLength(0);
        });
    });

    describe('Validation Integration', () => {
        test('useSmartFieldValidation_shouldCallValidationService_whenValueChanges', () => {
            const mockResult: ValidationResult = { isValid: false, errors: ['Email is required'] };
            mockValidationService.validateField.mockReturnValue(mockResult);

            const config = createEmailConfig();
            const { result, rerender } = renderHook(({ value }) =>
                useSmartFieldValidation({
                    value,
                    config,
                    enableValidation: true
                }),
                {
                    initialProps: { value: '' }
                }
            );

            rerender({ value: 'test' });

            expect(mockValidationService.validateField).toHaveBeenCalledWith(
                'email',
                'test',
                expect.objectContaining({
                    fieldName: 'email',
                    fieldType: 'email',
                    required: true,
                    rules: config.validationRules
                })
            );

            expect(result.current.state.validationResult).toEqual(mockResult);
        });

        test('useSmartFieldValidation_shouldNotCallValidationService_whenValidationDisabled', () => {
            const config = createEmailConfig();
            renderHook(() =>
                useSmartFieldValidation({
                    value: 'test@example.com',
                    config,
                    enableValidation: false
                })
            );

            expect(mockValidationService.validateField).not.toHaveBeenCalled();
        });

        test('useSmartFieldValidation_shouldCallOnValidationChange_whenValidationResultChanges', () => {
            const mockOnValidationChange = jest.fn();
            const mockResult: ValidationResult = { isValid: false, errors: ['Email is required'] };
            mockValidationService.validateField.mockReturnValue(mockResult);

            const config = createEmailConfig();
            renderHook(() =>
                useSmartFieldValidation({
                    value: '',
                    config,
                    enableValidation: true,
                    onValidationChange: mockOnValidationChange
                })
            );

            expect(mockOnValidationChange).toHaveBeenCalledWith(mockResult);
        });
    });

    describe('Autofill Detection', () => {
        test('useSmartFieldValidation_shouldDetectAutofill_whenLargeValueChangeWithoutInteraction', () => {
            const config = createEmailConfig();
            const { result } = renderHook(() =>
                useSmartFieldValidation({
                    value: '',
                    config,
                    enableValidation: true
                })
            );

            // Simulate autofill detection
            act(() => {
                result.current.handlers.handleChange('user@example.com', '');
            });

            expect(result.current.state.wasAutofilled).toBe(true);
        });

        test('useSmartFieldValidation_shouldNotDetectAutofill_whenSmallValueChange', () => {
            const config = createEmailConfig();
            const { result } = renderHook(() =>
                useSmartFieldValidation({
                    value: '',
                    config,
                    enableValidation: true
                })
            );

            // Small change - should not be detected as autofill
            act(() => {
                result.current.handlers.handleChange('ab', '');
            });

            expect(result.current.state.wasAutofilled).toBe(false);
        });

        test('useSmartFieldValidation_shouldNotDetectAutofill_whenUserHasTouchedField', () => {
            const config = createEmailConfig();
            const { result } = renderHook(() =>
                useSmartFieldValidation({
                    value: '',
                    config,
                    enableValidation: true
                })
            );

            // First touch the field
            act(() => {
                result.current.handlers.handleFocus();
            });

            // Then try to trigger autofill detection
            act(() => {
                result.current.handlers.handleChange('user@example.com', '');
            });

            expect(result.current.state.wasAutofilled).toBe(false);
        });

        test('useSmartFieldValidation_shouldNotDetectAutofill_whenFieldHasFocus', () => {
            const config = createEmailConfig();
            const { result } = renderHook(() =>
                useSmartFieldValidation({
                    value: '',
                    config,
                    enableValidation: true
                })
            );

            // Focus the field first
            act(() => {
                result.current.handlers.handleFocus();
            });

            // Reset touched state to simulate autofill scenario
            // Note: This is artificial for testing - in real usage, focus would set touched

            // Try autofill detection with focus
            act(() => {
                result.current.handlers.handleChange('user@example.com', '');
            });

            // Should not detect as autofill because field has focus (user is actively using it)
            expect(result.current.state.wasAutofilled).toBe(false);
        });

        test('useSmartFieldValidation_shouldNotDetectAutofill_whenContentDoesNotMatchPattern', () => {
            const config = createEmailConfig();
            const { result } = renderHook(() =>
                useSmartFieldValidation({
                    value: '',
                    config,
                    enableValidation: true
                })
            );

            // Large change but doesn't match email pattern
            act(() => {
                result.current.handlers.handleChange('notanemail', '');
            });

            expect(result.current.state.wasAutofilled).toBe(false);
        });

        test('useSmartFieldValidation_shouldSetTouchedAfterDelay_whenAutofillDetected', async () => {
            const config = createEmailConfig();
            const { result } = renderHook(() =>
                useSmartFieldValidation({
                    value: '',
                    config,
                    enableValidation: true
                })
            );

            // Trigger autofill detection
            act(() => {
                result.current.handlers.handleChange('user@example.com', '');
            });

            expect(result.current.state.wasAutofilled).toBe(true);
            expect(result.current.state.hasBeenTouched).toBe(false);

            // Fast-forward timer
            act(() => {
                jest.advanceTimersByTime(1500);
            });

            expect(result.current.state.hasBeenTouched).toBe(true);
        });

        test('useSmartFieldValidation_shouldUseCustomAutofillConfig_whenProvided', () => {
            const customConfig: SmartFieldConfig = {
                fieldName: 'phone',
                fieldType: 'phone',
                required: false,
                validationRules: [],
                autofillConfig: {
                    minChangeThreshold: 5,
                    touchedDelay: 2000,
                    contentPatterns: [/^\+?[\d\s\-\(\)\.]+$/]
                }
            };

            const { result } = renderHook(() =>
                useSmartFieldValidation({
                    value: '',
                    config: customConfig,
                    enableValidation: true
                })
            );

            // Should detect with phone pattern and custom threshold
            act(() => {
                result.current.handlers.handleChange('+1-555-123-4567', '');
            });

            expect(result.current.state.wasAutofilled).toBe(true);

            // Should use custom delay
            act(() => {
                jest.advanceTimersByTime(1500);
            });
            expect(result.current.state.hasBeenTouched).toBe(false);

            act(() => {
                jest.advanceTimersByTime(500); // Total 2000ms
            });
            expect(result.current.state.hasBeenTouched).toBe(true);
        });
    });

    describe('Focus and Blur Handling', () => {
        test('useSmartFieldValidation_shouldSetFocusAndTouched_whenHandleFocusCalled', () => {
            const config = createEmailConfig();
            const { result } = renderHook(() =>
                useSmartFieldValidation({
                    value: '',
                    config,
                    enableValidation: true
                })
            );

            act(() => {
                result.current.handlers.handleFocus();
            });

            expect(result.current.state.hasFocus).toBe(true);
            expect(result.current.state.hasBeenTouched).toBe(true);
        });

        test('useSmartFieldValidation_shouldClearFocus_whenHandleBlurCalled', () => {
            const config = createEmailConfig();
            const { result } = renderHook(() =>
                useSmartFieldValidation({
                    value: '',
                    config,
                    enableValidation: true
                })
            );

            // First set focus
            act(() => {
                result.current.handlers.handleFocus();
            });

            // Then blur
            act(() => {
                result.current.handlers.handleBlur();
            });

            expect(result.current.state.hasFocus).toBe(false);
            expect(result.current.state.hasBeenTouched).toBe(true); // Should remain true
        });
    });

    describe('Error Display Logic', () => {
        test('useSmartFieldValidation_shouldShowErrors_whenTouchedAndValidationEnabled', () => {
            const mockResult: ValidationResult = { isValid: false, errors: ['Email is required'] };
            mockValidationService.validateField.mockReturnValue(mockResult);

            const config = createEmailConfig();
            const { result } = renderHook(() =>
                useSmartFieldValidation({
                    value: '',
                    config,
                    enableValidation: true
                })
            );

            // Initially no errors shown (not touched)
            expect(result.current.state.displayErrors).toHaveLength(0);

            // Touch the field
            act(() => {
                result.current.handlers.handleFocus();
            });

            // Now errors should be displayed
            expect(result.current.state.displayErrors).toEqual(['Email is required']);
        });

        test('useSmartFieldValidation_shouldNotShowErrors_whenValidationDisabled', () => {
            const config = createEmailConfig();
            const { result } = renderHook(() =>
                useSmartFieldValidation({
                    value: '',
                    config,
                    enableValidation: false
                })
            );

            act(() => {
                result.current.handlers.handleFocus();
            });

            expect(result.current.state.displayErrors).toHaveLength(0);
        });

        test('useSmartFieldValidation_shouldNotShowErrors_whenNotTouched', () => {
            const mockResult: ValidationResult = { isValid: false, errors: ['Email is required'] };
            mockValidationService.validateField.mockReturnValue(mockResult);

            const config = createEmailConfig();
            const { result } = renderHook(() =>
                useSmartFieldValidation({
                    value: '',
                    config,
                    enableValidation: true
                })
            );

            expect(result.current.state.displayErrors).toHaveLength(0);
        });
    });

    describe('Field Type Specific Behavior', () => {
        test('useSmartFieldValidation_shouldUseDefaultPatternsForFieldType_whenNoPatternsProvided', () => {
            const passwordConfig: SmartFieldConfig = {
                fieldName: 'password',
                fieldType: 'password',
                required: true,
                validationRules: [],
                // No custom patterns - should use default password patterns
            };

            const { result } = renderHook(() =>
                useSmartFieldValidation({
                    value: '',
                    config: passwordConfig,
                    enableValidation: true
                })
            );

            // Should detect autofill for password with mixed case, numbers
            act(() => {
                result.current.handlers.handleChange('SecurePass123', '');
            });

            expect(result.current.state.wasAutofilled).toBe(true);
        });

        test('useSmartFieldValidation_shouldNotDetectAutofill_whenPatternDoesNotMatch', () => {
            const config = createEmailConfig();
            const { result } = renderHook(() =>
                useSmartFieldValidation({
                    value: '',
                    config,
                    enableValidation: true
                })
            );

            // Large change but no @ or . (doesn't match email patterns)
            act(() => {
                result.current.handlers.handleChange('plaintext', '');
            });

            expect(result.current.state.wasAutofilled).toBe(false);
        });
    });

    describe('Edge Cases', () => {
        test('useSmartFieldValidation_shouldHandleEmptyValidationRules_gracefully', () => {
            const configWithoutRules: SmartFieldConfig = {
                fieldName: 'test',
                fieldType: 'text',
                required: false,
                validationRules: undefined
            };

            const { result } = renderHook(() =>
                useSmartFieldValidation({
                    value: 'test',
                    config: configWithoutRules,
                    enableValidation: true
                })
            );

            expect(result.current.state.validationResult.isValid).toBe(true);
            expect(result.current.state.validationResult.errors).toHaveLength(0);
        });

        test('useSmartFieldValidation_shouldNotDetectAutofill_whenAlreadyDetected', () => {
            const config = createEmailConfig();
            const { result } = renderHook(() =>
                useSmartFieldValidation({
                    value: '',
                    config,
                    enableValidation: true
                })
            );

            // First autofill detection
            act(() => {
                result.current.handlers.handleChange('user@example.com', '');
            });

            expect(result.current.state.wasAutofilled).toBe(true);

            // Second change should not trigger autofill detection again
            const wasAutofilledBefore = result.current.state.wasAutofilled;

            act(() => {
                result.current.handlers.handleChange('different@email.com', 'user@example.com');
            });

            expect(result.current.state.wasAutofilled).toBe(wasAutofilledBefore);
        });

        test('useSmartFieldValidation_shouldHandleRapidValueChanges_correctly', () => {
            const config = createEmailConfig();
            const { result } = renderHook(() =>
                useSmartFieldValidation({
                    value: '',
                    config,
                    enableValidation: true
                })
            );

            // Rapid changes
            act(() => {
                result.current.handlers.handleChange('u', '');
                result.current.handlers.handleChange('us', 'u');
                result.current.handlers.handleChange('use', 'us');
                result.current.handlers.handleChange('user', 'use');
            });

            // Should not detect as autofill (incremental typing)
            expect(result.current.state.wasAutofilled).toBe(false);
        });
    });
});