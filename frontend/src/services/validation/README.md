# Field Validation Integration Guide

This guide demonstrates how to integrate validation into form field components using the BuildFlow validation system. The system provides two integration approaches: the legacy manual integration pattern and the modern `useSmartFieldValidation` hook with advanced features like autofill detection and smart error display.

## Table of Contents
1. [Overview](#overview)
2. [Validation Architecture](#validation-architecture)
3. [Smart Field Validation Hook](#smart-field-validation-hook)
4. [Legacy Field Integration Patterns](#legacy-field-integration-patterns)
5. [Testing Strategies](#testing-strategies)
6. [Implementation Checklist](#implementation-checklist)
7. [Common Patterns & Examples](#common-patterns--examples)

## Overview

The BuildFlow validation system provides:
- **Centralized validation service** with built-in and custom rules
- **Smart field validation hook** (`useSmartFieldValidation`) with autofill detection and advanced UX features
- **Touch-based validation UX** (errors only appear after user interaction)
- **Autofill detection** with configurable patterns and smart touch handling
- **Flexible validation modes** (required vs optional)
- **Prop-reactive validation** (responds to validation setting changes)
- **Comprehensive callback system** for parent component integration

### Recommended Integration Approach

For new field components, use the **`useSmartFieldValidation` hook** which provides:
- Automatic autofill detection with configurable patterns
- Smart touch-based error display
- Built-in focus/blur state management
- Seamless validation service integration
- Memory-safe timer cleanup
- Progressive error display logic

For existing components or simple validation needs, the legacy manual integration pattern is still supported.

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

## Smart Field Validation Hook

The `useSmartFieldValidation` hook provides a modern, feature-rich approach to field validation with minimal setup.

### Hook Interface

```typescript
interface UseSmartFieldValidationProps {
  value: string;
  config: SmartFieldConfig;
  enableValidation?: boolean;
  onValidationChange?: (result: ValidationResult) => void;
}

interface SmartFieldConfig {
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

interface AutofillDetectionConfig {
  minChangeThreshold?: number;    // Default: 2
  touchedDelay?: number;          // Default: 1500ms
  contentPatterns?: RegExp[];     // Field-specific patterns
}
```

### Basic Usage

```typescript
import { useSmartFieldValidation } from '@/services/validation';

const YourFieldComponent = ({ value, onChange, enableValidation = true }) => {
  const { state, handlers, utils } = useSmartFieldValidation({
    value,
    config: {
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
          name: 'email',
          message: 'Please enter a valid email address',
          validator: (val: string) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
        }
      ],
      autofillConfig: {
        minChangeThreshold: 3,
        touchedDelay: 1500,
        contentPatterns: [/@/, /\./]  // Email-specific patterns
      }
    },
    enableValidation,
    onValidationChange: (result) => {
      // Handle validation state changes
      console.log('Validation:', result.isValid, result.errors);
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const oldValue = value;
    
    onChange(newValue);
    
    // Trigger autofill detection
    handlers.handleChange(newValue, oldValue);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Email Address
        {state.validationResult && enableValidation && 
         state.validationResult.errors.length === 0 && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="email"
        value={value}
        onChange={handleInputChange}
        onFocus={handlers.handleFocus}
        onBlur={handlers.handleBlur}
        className={`border rounded px-3 py-2 ${
          state.displayErrors.length > 0 ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      
      {/* Smart error display - only shows after field has been touched */}
      {state.displayErrors.map((error, index) => (
        <p key={index} className="text-sm text-red-500">{error}</p>
      ))}
      
      {/* Autofill detection indicator (optional) */}
      {state.wasAutofilled && (
        <p className="text-xs text-blue-500">✓ Autofill detected</p>
      )}
    </div>
  );
};
```

### Advanced Features

#### 1. Autofill Detection

The hook automatically detects browser autofill and manages the touched state intelligently:

```typescript
const config: SmartFieldConfig = {
  fieldName: 'phone',
  fieldType: 'phone',
  autofillConfig: {
    minChangeThreshold: 5,           // Minimum chars changed to consider autofill
    touchedDelay: 2000,              // Delay before marking as touched after autofill
    contentPatterns: [               // Custom patterns for phone detection
      /^\+?[\d\s\-\(\)\.]+$/         // Phone number pattern
    ]
  }
};
```

#### 2. Field Type Patterns

The hook includes built-in autofill detection patterns for common field types:

```typescript
// Built-in patterns by field type
const defaultPatterns = {
  email: [/@/, /\./],
  password: [/[A-Z]/, /[a-z]/, /[0-9]/],
  phone: [/^\+?[\d\s-()]+$/],
  name: [/^[a-zA-Z\s'-]+$/],
  text: []  // No specific patterns
};
```

#### 3. State Management

The hook provides comprehensive state information:

```typescript
const { state } = useSmartFieldValidation({...});

// Available state properties:
state.validationResult    // Current validation result
state.hasBeenTouched     // Whether user has interacted with field
state.wasAutofilled      // Whether autofill was detected
state.hasFocus           // Current focus state
state.displayErrors      // Smart error display (only when appropriate)
```

#### 4. Utility Functions

Access validation utilities for custom logic:

```typescript
const { utils } = useSmartFieldValidation({...});

// Manual validation
const result = utils.validateField('custom value');

// Manual autofill detection
const wasDetected = utils.detectAutofill('new value', 'old value');
```

### Integration with Existing Forms

The hook integrates seamlessly with form libraries and state management:

```typescript
// With React Hook Form
const YourField = ({ name, control, rules }) => {
  const { field, fieldState } = useController({ name, control, rules });
  
  const { state, handlers } = useSmartFieldValidation({
    value: field.value || '',
    config: {
      fieldName: name,
      fieldType: 'text',
      required: !!rules?.required,
      validationRules: [
        // Convert RHF rules to validation rules
        ...(rules?.required ? [{
          name: 'required',
          message: 'This field is required',
          validator: (val: string) => !!val && val.trim().length > 0
        }] : [])
      ]
    },
    onValidationChange: (result) => {
      // Sync with form state if needed
    }
  });

  // Merge errors from both sources
  const allErrors = [
    ...state.displayErrors,
    ...(fieldState.error ? [fieldState.error.message] : [])
  ];

  return (
    <input
      {...field}
      onChange={(e) => {
        const newValue = e.target.value;
        field.onChange(newValue);
        handlers.handleChange(newValue, field.value || '');
      }}
      onFocus={handlers.handleFocus}
      onBlur={(e) => {
        field.onBlur(e);
        handlers.handleBlur();
      }}
      className={allErrors.length > 0 ? 'border-red-500' : 'border-gray-300'}
    />
  );
};
```

### Performance Considerations

The hook is optimized for performance:
- Uses `useMemo` for validation configuration and patterns
- Uses `useCallback` for event handlers to prevent unnecessary re-renders
- Includes automatic timer cleanup to prevent memory leaks
- Smart dependency arrays to minimize effect re-runs

### Migration from Legacy Pattern

To migrate from the manual integration pattern:

1. Replace manual state management with the hook
2. Remove custom validation logic
3. Update event handlers to use hook handlers
4. Replace validation configuration with `SmartFieldConfig`
5. Update error display logic to use `state.displayErrors`

```typescript
// Before (Legacy)
const [validationErrors, setValidationErrors] = useState<string[]>([]);
const [hasBeenTouched, setHasBeenTouched] = useState(false);

// After (Smart Hook)
const { state, handlers } = useSmartFieldValidation({
  value,
  config: {
    fieldName: 'email',
    fieldType: 'email',
    // ... rest of config
  }
});

// Use state.displayErrors instead of validationErrors
// Use handlers.handleFocus/handleBlur instead of custom handlers
```

## Legacy Field Integration Patterns

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

### Smart Hook Implementation
- [ ] Import `useSmartFieldValidation` hook
- [ ] Define `SmartFieldConfig` with field rules and autofill settings
- [ ] Integrate hook in component with proper props
- [ ] Update event handlers to use hook handlers (`handleChange`, `handleFocus`, `handleBlur`)
- [ ] Use `state.displayErrors` for error display
- [ ] Use `state.hasBeenTouched` and `state.wasAutofilled` for UX enhancements
- [ ] Implement `onValidationChange` callback for parent integration
- [ ] Test autofill detection with different field types

### Legacy Component Implementation
- [ ] Add validation props to component interface
- [ ] Set up validation state (`validationErrors`, `hasBeenTouched`)
- [ ] Create validation configuration with `useMemo`
- [ ] Implement validation function with `useCallback`
- [ ] Add `useEffect` for prop change handling
- [ ] Update event handlers (`handleChange`, `handleBlur`)
- [ ] Integrate validation state into UI (errors, styling, required indicator)

### Testing Implementation

#### Smart Hook Tests
- [ ] Hook state initialization tests
- [ ] Validation integration tests (with/without validation enabled)
- [ ] Autofill detection tests (various scenarios)
- [ ] Touch-based validation tests (before/after touch)
- [ ] Focus/blur state management tests
- [ ] Custom autofill configuration tests
- [ ] Field type pattern tests
- [ ] Callback integration tests (`onValidationChange`)
- [ ] Memory management tests (timer cleanup)

#### Legacy Pattern Tests
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
- [ ] Autofill detection works across different browsers
- [ ] Touch-based validation UX is intuitive
- [ ] No memory leaks from timer cleanup

## Common Patterns & Examples

### Smart Hook Configuration Examples

#### Email Field with Autofill Detection
```typescript
const emailConfig: SmartFieldConfig = {
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
      name: 'email',
      message: 'Please enter a valid email address',
      validator: (val: string) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
    }
  ],
  autofillConfig: {
    minChangeThreshold: 3,
    touchedDelay: 1500,
    contentPatterns: [/@/, /\./]
  }
};
```

#### Phone Field with Custom Patterns
```typescript
const phoneConfig: SmartFieldConfig = {
  fieldName: 'phone',
  fieldType: 'phone',
  required: false,
  validationRules: [
    {
      name: 'phone',
      message: 'Please enter a valid phone number',
      validator: (val: string) => {
        if (!val) return true;
        return /^[\+\(\d][\d\-\s\(\)\.]{6,28}$/.test(val);
      }
    }
  ],
  autofillConfig: {
    minChangeThreshold: 5,
    touchedDelay: 2000,
    contentPatterns: [/^\+?[\d\s\-\(\)\.]+$/]
  }
};
```

#### Password Field with Security Rules
```typescript
const passwordConfig: SmartFieldConfig = {
  fieldName: 'password',
  fieldType: 'password',
  required: true,
  validationRules: [
    {
      name: 'required',
      message: 'Password is required',
      validator: (val: string) => !!val && val.trim().length > 0
    },
    {
      name: 'minLength',
      message: 'Password must be at least 8 characters long',
      validator: (val: string) => !val || val.length >= 8
    },
    {
      name: 'strongPassword',
      message: 'Password must contain uppercase, lowercase, number, and special character',
      validator: (val: string) => {
        if (!val) return true;
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/.test(val);
      }
    }
  ],
  autofillConfig: {
    minChangeThreshold: 8,
    touchedDelay: 1000,
    contentPatterns: [/[A-Z]/, /[a-z]/, /[0-9]/, /[@$!%*?&_]/]
  }
};
```

### Advanced Integration Patterns

#### Multi-Field Form with Smart Validation
```typescript
const MultiFieldForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: ''
  });

  const [formValidation, setFormValidation] = useState({
    email: { isValid: true, errors: [] },
    phone: { isValid: true, errors: [] },
    password: { isValid: true, errors: [] }
  });

  const handleValidationChange = (field: string) => (result: ValidationResult) => {
    setFormValidation(prev => ({
      ...prev,
      [field]: result
    }));
  };

  const isFormValid = Object.values(formValidation).every(v => v.isValid);

  const emailValidation = useSmartFieldValidation({
    value: formData.email,
    config: emailConfig,
    enableValidation: true,
    onValidationChange: handleValidationChange('email')
  });

  const phoneValidation = useSmartFieldValidation({
    value: formData.phone,
    config: phoneConfig,
    enableValidation: true,
    onValidationChange: handleValidationChange('phone')
  });

  const passwordValidation = useSmartFieldValidation({
    value: formData.password,
    config: passwordConfig,
    enableValidation: true,
    onValidationChange: handleValidationChange('password')
  });

  return (
    <form>
      {/* Email Field */}
      <SmartField
        label="Email"
        value={formData.email}
        onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
        validation={emailValidation}
      />

      {/* Phone Field */}
      <SmartField
        label="Phone"
        value={formData.phone}
        onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
        validation={phoneValidation}
      />

      {/* Password Field */}
      <SmartField
        label="Password"
        type="password"
        value={formData.password}
        onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
        validation={passwordValidation}
      />

      <button type="submit" disabled={!isFormValid}>
        Submit Form
      </button>
    </form>
  );
};
```

#### Reusable Smart Field Component
```typescript
interface SmartFieldProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  value: string;
  onChange: (value: string) => void;
  validation: ReturnType<typeof useSmartFieldValidation>;
  placeholder?: string;
  disabled?: boolean;
}

const SmartField: React.FC<SmartFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  validation,
  placeholder,
  disabled
}) => {
  const { state, handlers } = validation;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const oldValue = value;
    
    onChange(newValue);
    handlers.handleChange(newValue, oldValue);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {state.validationResult && !state.validationResult.isValid && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>

      <input
        type={type}
        value={value}
        onChange={handleInputChange}
        onFocus={handlers.handleFocus}
        onBlur={handlers.handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          block w-full rounded-md border px-3 py-2 shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${state.displayErrors.length > 0
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500'
          }
          ${disabled ? 'bg-gray-50 text-gray-500' : 'bg-white'}
        `}
      />

      {/* Error Messages */}
      {state.displayErrors.map((error, index) => (
        <p key={index} className="text-sm text-red-600">
          {error}
        </p>
      ))}

      {/* Autofill Indicator */}
      {state.wasAutofilled && (
        <p className="text-xs text-blue-600 flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Autofilled
        </p>
      )}
    </div>
  );
};
```

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
- `SmartField_shouldDetectAutofill_whenLargeValueChangeWithoutInteraction`
- `EmailField_shouldPassValidation_whenValidEmailProvided`
- `PhoneField_shouldNotValidateBeforeTouch_whenValidationEnabled`
- `useSmartFieldValidation_shouldSetTouchedAfterDelay_whenAutofillDetected`

### Error Message Standards
- Use clear, user-friendly language
- Be specific about what's wrong and how to fix it
- Keep messages concise but helpful
- Use consistent terminology across fields

### Performance Best Practices

#### Smart Hook Usage
- Use `useMemo` for validation configs that depend on props
- Minimize re-renders by memoizing callback props
- Use the hook's built-in optimization features
- Clean up resources properly (hook handles this automatically)

#### Autofill Detection Tuning
- Adjust `minChangeThreshold` based on expected input length
- Set appropriate `touchedDelay` for UX (1000-2000ms recommended)
- Use specific `contentPatterns` for better detection accuracy
- Test across different browsers and autofill scenarios

This guide ensures consistent, reliable validation implementation across all form field components in the BuildFlow application, with modern smart validation capabilities and comprehensive autofill detection.