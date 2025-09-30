import { useCallback, useEffect, useMemo, useState } from 'react';
import { ValidationResult } from './types';
import { validationService } from './ValidationService';

export interface AutofillDetectionConfig {
  /** Minimum character change to consider autofill */
  minChangeThreshold?: number;
  /** Delay before marking field as touched after autofill detection */
  touchedDelay?: number;
  /** Custom patterns to detect autofill content */
  contentPatterns?: RegExp[];
}

export interface SmartFieldConfig {
  fieldName: string;
  fieldType: 'email' | 'password' | 'text' | 'phone' | 'name';
  required?: boolean;
  validationRules?: Array<{
    name: string;
    message: string;
    validator: (value: string) => boolean;
  }>;
  autofillConfig?: AutofillDetectionConfig;
}

export interface UseSmartFieldValidationProps {
  value: string;
  config: SmartFieldConfig;
  enableValidation?: boolean;
  onValidationChange?: (result: ValidationResult) => void;
}

export interface SmartFieldState {
  validationResult: ValidationResult;
  hasBeenTouched: boolean;
  wasAutofilled: boolean;
  hasFocus: boolean;
  displayErrors: string[];
}

/**
 * Smart field validation hook that provides:
 * - Autofill detection with configurable patterns
 * - Progressive error display (touch-based)
 * - Immediate validation for parent form state
 * - Configurable validation rules
 * - Proper cleanup and memory management
 */
export const useSmartFieldValidation = ({
  value,
  config,
  enableValidation = true,
  onValidationChange
}: UseSmartFieldValidationProps) => {
  const [validationResult, setValidationResult] = useState<ValidationResult>({ 
    isValid: true, 
    errors: [] 
  });
  const [hasBeenTouched, setHasBeenTouched] = useState(false);
  const [wasAutofilled, setWasAutofilled] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [autofillTimer, setAutofillTimer] = useState<NodeJS.Timeout | null>(null);

  // Memoized validation configuration
  const validationConfig = useMemo(() => {
    if (!enableValidation || !config.validationRules) return undefined;

    return {
      fieldName: config.fieldName,
      fieldType: config.fieldType,
      required: config.required || false,
      rules: config.validationRules
    };
  }, [enableValidation, config]);

  // Memoized autofill detection patterns
  const autofillPatterns = useMemo(() => {
    const defaultPatterns: Record<string, RegExp[]> = {
      email: [/@/, /\./],
      password: [/[A-Z]/, /[a-z]/, /[0-9]/],
      phone: [/^\+?[\d\s-()]+$/],
      name: [/^[a-zA-Z\s'-]+$/],
      text: []
    };

    return config.autofillConfig?.contentPatterns || 
           defaultPatterns[config.fieldType] || 
           [];
  }, [config.fieldType, config.autofillConfig]);

  // Validation function
  const validateField = useCallback((fieldValue: string) => {
    if (!enableValidation || !validationConfig) {
      const result = { isValid: true, errors: [] };
      setValidationResult(result);
      return result;
    }

    const result = validationService.validateField(
      config.fieldName, 
      fieldValue, 
      validationConfig
    );
    setValidationResult(result);
    return result;
  }, [enableValidation, validationConfig, config.fieldName]);

  // Autofill detection function
  const detectAutofill = useCallback((newValue: string, oldValue: string) => {
    const autofillConfig = config.autofillConfig || {};
    const minChange = autofillConfig.minChangeThreshold || 2;
    const delay = autofillConfig.touchedDelay || 1500;

    // Clear existing timer
    if (autofillTimer) {
      clearTimeout(autofillTimer);
    }

    // Detection logic
    const wasEmpty = !oldValue || oldValue.trim() === '';
    const hasContent = newValue && newValue.trim().length > 0;
    const largeChange = (newValue.length - oldValue.length) > minChange;
    const noUserInteraction = !hasBeenTouched && !hasFocus;
    
    // Check content patterns
    const matchesPattern = autofillPatterns.length === 0 || 
      autofillPatterns.every(pattern => pattern.test(newValue));

    const isLikelyAutofill = wasEmpty && 
      hasContent && 
      largeChange && 
      noUserInteraction && 
      matchesPattern;

    if (isLikelyAutofill) {
      setWasAutofilled(true);
      const timer = setTimeout(() => {
        setHasBeenTouched(true);
      }, delay);
      
      setAutofillTimer(timer);
      return true;
    }

    return false;
  }, [hasBeenTouched, hasFocus, autofillTimer, autofillPatterns, config.autofillConfig]);

  // Notify parent of validation changes
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(validationResult);
    }
  }, [validationResult, onValidationChange]);

  // Validate when value changes
  useEffect(() => {
    validateField(value);
  }, [value, validateField]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autofillTimer) {
        clearTimeout(autofillTimer);
      }
    };
  }, [autofillTimer]);

  // Field handlers
  const handleChange = useCallback((newValue: string, oldValue: string) => {
    if (!wasAutofilled) {
      detectAutofill(newValue, oldValue);
    }
  }, [wasAutofilled, detectAutofill]);

  const handleFocus = useCallback(() => {
    setHasFocus(true);
    setHasBeenTouched(true);
  }, []);

  const handleBlur = useCallback(() => {
    setHasFocus(false);
  }, []);

  // Computed state
  const state: SmartFieldState = {
    validationResult,
    hasBeenTouched,
    wasAutofilled,
    hasFocus,
    displayErrors: enableValidation && hasBeenTouched ? validationResult.errors : []
  };

  return {
    state,
    handlers: {
      handleChange,
      handleFocus,
      handleBlur
    },
    utils: {
      validateField,
      detectAutofill
    }
  };
};

export default useSmartFieldValidation;