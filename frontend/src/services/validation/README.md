# Field Validation Integration Guide

This guide demonstrates how to integrate validation into form field components using the BuildFlow validation system. Based on the UnitNumber field implementation, this document provides patterns, best practices, and comprehensive testing strategies.

## Table of Contents
1. [Overview](#overview)
2. [Validation Architecture](#validation-architecture)
3. [Field Integration Patterns](#field-integration-patterns)
4. [Testing Strategies](#testing-strategies)
5. [Implementation Checklist](#implementation-checklist)
6. [Common Patterns & Examples](#common-patterns--examples)

## Overview

The BuildFlow validation system provides:
- **Centralized validation service** with built-in and custom rules
- **Touch-based validation UX** (errors only appear after user interaction)
- **Flexible validation modes** (required vs optional)
- **Prop-reactive validation** (responds to validation setting changes)
- **Comprehensive callback system** for parent component integration

## Validation Architecture

### Core Types
```typescript
// Field validation configuration
interface FieldValidationConfig {
    fieldName: string;
    fieldType: InputFieldType;
    required?: boolean;
    rules?: ValidationRule[];
}

// Validation result
interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

// Individual validation rule
interface ValidationRule {
    name: string;
    message: string;
    validator: (value: any) => boolean;
}
```

### Validation Service
The validation service provides centralized field validation:
```typescript
import { validationService } from '@/services/validation';

const result = validationService.validateField('fieldName', value, config);
```

## Field Integration Patterns

### 1. Component Props Interface
Define validation-related props in your field component:

```typescript
export interface YourFieldProps extends BaseFieldProps {
    placeholder?: string;
    enableValidation?: boolean;           // Toggle validation on/off
    validationMode?: 'required' | 'optional';  // Validation strictness
    onValidationChange?: (isValid: boolean, errors: string[]) => void;
}
```

### 2. State Management
Set up validation state in your component:

```typescript
const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
const [hasBeenTouched, setHasBeenTouched] = React.useState(false);
```

### 3. Validation Configuration
Create field-specific validation config using `useMemo`:

```typescript
const validationConfig = React.useMemo(() => {
    if (!enableValidation) return undefined;

    return {
        fieldName: 'yourFieldName',
        fieldType: 'text' as const,
        required: validationMode === 'required',
        rules: [
            // Required rule (conditional)
            ...(validationMode === 'required' ? [{
                name: 'required',
                message: 'This field is required',
                validator: (val: string) => !!val && val.trim().length > 0
            }] : []),
            // Custom validation rules
            {
                name: 'customRule',
                message: 'Custom validation message',
                validator: (val: string) => {
                    // Your validation logic
                    return true; // or false
                }
            }
        ]
    };
}, [enableValidation, validationMode]);
```

### 4. Validation Function
Create a validation callback using `useCallback`:

```typescript
const validateField = React.useCallback((fieldValue: string) => {
    if (!enableValidation || !validationConfig) {
        setValidationErrors([]);
        return true;
    }

    const result = validationService.validateField('yourFieldName', fieldValue, validationConfig);
    setValidationErrors(result.errors);

    // Notify parent of validation changes
    if (onValidationChange) {
        onValidationChange(result.isValid, result.errors);
    }

    return result.isValid;
}, [enableValidation, validationConfig, onValidationChange]);
```

### 5. Prop Change Handling
Handle validation prop changes with `useEffect`:

```typescript
React.useEffect(() => {
    if (!enableValidation) {
        // Clear validation errors when validation is disabled
        setValidationErrors([]);
        if (onValidationChange) {
            onValidationChange(true, []);
        }
    } else if (hasBeenTouched) {
        // Re-validate current value when validation mode changes and field has been touched
        validateField(value);
    }
}, [enableValidation, validationMode, hasBeenTouched, validateField, onValidationChange]);
```

### 6. Event Handlers
Implement touch-based validation with proper event handlers:

```typescript
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Validate if touched or if we want immediate validation
    if (hasBeenTouched && enableValidation) {
        validateField(newValue);
    }
};

const handleBlur = () => {
    setHasBeenTouched(true);
    if (enableValidation) {
        validateField(value);
    }
};
```

### 7. UI Integration
Integrate validation state into your component's UI:

```typescript
// Error display logic
const displayErrors = enableValidation ? validationErrors : errors;
const hasErrors = displayErrors.length > 0;

// Required field indicator
const isRequired = enableValidation && validationMode === 'required';

return (
    <div className={`space-y-2 ${className}`}>
        <Label htmlFor={id} className="text-xs">
            Your Field Label
            {isRequired && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Input
            id={id}
            value={value}
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
```

## Testing Strategies

### Test Categories
Your validation tests should cover these essential scenarios:

#### 1. Basic Functionality Tests
- Default rendering without validation
- Input value changes trigger `onChange`
- External errors display correctly
- Disabled state works properly

#### 2. Validation Enable/Disable Tests
```typescript
test('YourField_shouldNotShowValidationErrors_whenValidationDisabled', () => {
    const mockOnChange = jest.fn();
    
    render(
        <YourField
            value=""
            onChange={mockOnChange}
            enableValidation={false}
            validationMode="required"
        />
    );

    const input = screen.getByRole('textbox');
    fireEvent.blur(input);

    expect(screen.queryByText(/required/)).not.toBeInTheDocument();
    expect(input).not.toHaveClass('border-red-500');
});
```

#### 3. Required vs Optional Mode Tests
```typescript
test('YourField_shouldShowRequiredError_whenValidationRequiredAndFieldEmpty', () => {
    const mockOnValidationChange = jest.fn();
    
    render(
        <YourField
            value=""
            onChange={jest.fn()}
            enableValidation={true}
            validationMode="required"
            onValidationChange={mockOnValidationChange}
        />
    );

    fireEvent.blur(screen.getByRole('textbox'));

    expect(screen.getByText('Your field is required')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveClass('border-red-500');
    expect(mockOnValidationChange).toHaveBeenCalledWith(false, ['Your field is required']);
});
```

#### 4. Touch-Based Validation Tests
```typescript
test('YourField_shouldNotValidateBeforeTouch_whenValidationEnabled', () => {
    const mockOnValidationChange = jest.fn();
    
    render(
        <YourField
            value=""
            onChange={jest.fn()}
            enableValidation={true}
            validationMode="required"
            onValidationChange={mockOnValidationChange}
        />
    );

    // Should not validate on change before blur
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } });

    expect(screen.queryByText(/required/)).not.toBeInTheDocument();
    expect(mockOnValidationChange).not.toHaveBeenCalled();
});

test('YourField_shouldValidateOnChangeAfterFirstBlur', () => {
    render(
        <YourField
            value=""
            onChange={jest.fn()}
            enableValidation={true}
            validationMode="required"
        />
    );

    const input = screen.getByRole('textbox');
    
    // First blur to trigger touch
    fireEvent.blur(input);
    
    // Now validation should occur on change
    fireEvent.change(input, { target: { value: 'valid' } });
    expect(screen.queryByText(/required/)).not.toBeInTheDocument();
    
    fireEvent.change(input, { target: { value: '' } });
    expect(screen.getByText('Your field is required')).toBeInTheDocument();
});
```

#### 5. Prop Change/Rerender Tests
```typescript
test('YourField_shouldClearValidationErrors_whenValidationDisabled', () => {
    const mockOnValidationChange = jest.fn();
    
    const { rerender } = render(
        <YourField
            value=""
            onChange={jest.fn()}
            enableValidation={true}
            validationMode="required"
            onValidationChange={mockOnValidationChange}
        />
    );

    // Trigger error
    fireEvent.blur(screen.getByRole('textbox'));
    expect(screen.getByText('Your field is required')).toBeInTheDocument();

    // Disable validation
    rerender(
        <YourField
            value=""
            onChange={jest.fn()}
            enableValidation={false}
            validationMode="required"
            onValidationChange={mockOnValidationChange}
        />
    );

    // Errors should be cleared
    expect(screen.queryByText('Your field is required')).not.toBeInTheDocument();
    expect(mockOnValidationChange).toHaveBeenLastCalledWith(true, []);
});

test('YourField_shouldReValidate_whenValidationModeChanges', () => {
    const mockOnValidationChange = jest.fn();
    
    const { rerender } = render(
        <YourField
            value=""
            onChange={jest.fn()}
            enableValidation={true}
            validationMode="optional"
            onValidationChange={mockOnValidationChange}
        />
    );

    // Touch field first
    fireEvent.blur(screen.getByRole('textbox'));
    expect(screen.queryByText(/required/)).not.toBeInTheDocument();

    // Change to required mode
    rerender(
        <YourField
            value=""
            onChange={jest.fn()}
            enableValidation={true}
            validationMode="required"
            onValidationChange={mockOnValidationChange}
        />
    );

    // Should now show error
    expect(screen.getByText('Your field is required')).toBeInTheDocument();
    expect(mockOnValidationChange).toHaveBeenLastCalledWith(false, ['Your field is required']);
});
```

#### 6. Required Indicator Tests
```typescript
test('YourField_shouldShowRequiredAsterisk_whenValidationEnabledAndRequired', () => {
    render(
        <YourField
            value=""
            onChange={jest.fn()}
            enableValidation={true}
            validationMode="required"
        />
    );

    const asterisk = screen.getByText('*');
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveClass('text-red-500');
    expect(asterisk).toHaveClass('ml-1');
});

test('YourField_shouldNotShowRequiredAsterisk_whenValidationEnabledButOptional', () => {
    render(
        <YourField
            value=""
            onChange={jest.fn()}
            enableValidation={true}
            validationMode="optional"
        />
    );

    expect(screen.queryByText('*')).not.toBeInTheDocument();
});
```

#### 7. Custom Validation Rules Tests
```typescript
test('YourField_shouldShowCustomValidationError_whenCustomRuleFails', () => {
    render(
        <YourField
            value="invalid-format"
            onChange={jest.fn()}
            enableValidation={true}
            validationMode="optional"
        />
    );

    fireEvent.blur(screen.getByRole('textbox'));

    expect(screen.getByText('Your custom error message')).toBeInTheDocument();
});
```

## Implementation Checklist

### Component Implementation
- [ ] Add validation props to component interface
- [ ] Set up validation state (`validationErrors`, `hasBeenTouched`)
- [ ] Create validation configuration with `useMemo`
- [ ] Implement validation function with `useCallback`
- [ ] Add `useEffect` for prop change handling
- [ ] Update event handlers (`handleChange`, `handleBlur`)
- [ ] Integrate validation state into UI (errors, styling, required indicator)

### Testing Implementation
- [ ] Basic functionality tests (4+ tests)
- [ ] Validation enable/disable tests (2+ tests)
- [ ] Required vs optional mode tests (2+ tests)
- [ ] Touch-based validation tests (2+ tests)
- [ ] Prop change/rerender tests (3+ tests)
- [ ] Required indicator tests (3+ tests)
- [ ] Custom validation rule tests (as needed)
- [ ] Callback integration tests (verify `onValidationChange` calls)

### Quality Assurance
- [ ] All tests pass consistently
- [ ] TypeScript compilation without errors
- [ ] No console errors during test execution
- [ ] Proper error message display
- [ ] Correct CSS class application for error states
- [ ] Required indicator displays correctly
- [ ] Validation callbacks work as expected

## Common Patterns & Examples

### Custom Validation Rules
```typescript
// Email validation
{
    name: 'email',
    message: 'Please enter a valid email address',
    validator: (val: string) => {
        if (!val) return true; // Let required rule handle empty values
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }
}

// Length validation
{
    name: 'maxLength_50',
    message: 'Field must not exceed 50 characters',
    validator: (val: string) => !val || val.length <= 50
}

// Pattern validation
{
    name: 'alphanumeric',
    message: 'Field must contain only letters and numbers',
    validator: (val: string) => {
        if (!val) return true;
        return /^[a-zA-Z0-9]*$/.test(val);
    }
}
```

### Test Naming Conventions
Follow the established pattern:
```
ComponentName_shouldBehavior_whenCondition
```

Examples:
- `UnitNumberField_shouldShowRequiredError_whenValidationRequiredAndFieldEmpty`
- `EmailField_shouldPassValidation_whenValidEmailProvided`
- `PhoneField_shouldNotValidateBeforeTouch_whenValidationEnabled`

### Error Message Standards
- Use clear, user-friendly language
- Be specific about what's wrong and how to fix it
- Keep messages concise but helpful
- Use consistent terminology across fields

This guide ensures consistent, reliable validation implementation across all form field components in the BuildFlow application.