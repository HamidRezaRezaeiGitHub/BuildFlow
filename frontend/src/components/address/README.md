# Address Components - Functional Flow Documentation

This directory contains a comprehensive suite of address input components with integrated validation, designed to provide a flexible and user-friendly address entry experience for the BuildFlow application.

## 🏗️ Architecture Overview

The address components follow a hierarchical architecture with consistent patterns:

- **Individual Field Components**: Self-contained, validated input components
- **Composite Form Component**: Orchestrates all fields with form-level validation logic
- **Base Types & Utilities**: Shared interfaces and helper functions
- **Integration Service**: Validation service integration for consistent validation behavior

## 🧩 Core Components

### Individual Address Fields

All address field components follow the same pattern with consistent validation integration:

#### **UnitNumber Field** (`UnitNumber.tsx`)
- **Purpose**: Apartment, suite, or unit number entry
- **Validation Rules**: 
  - Optional/Required modes
  - Maximum 20 characters
- **Test Coverage**: 16 comprehensive test scenarios
- **Special Features**: Touch-based validation, real-time validation after first interaction

#### **StreetNumber Field** (`StreetNumber.tsx`)
- **Purpose**: Street address number entry  
- **Validation Rules**:
  - Optional/Required modes
  - Maximum 20 characters
  - Numbers only format
- **Test Coverage**: 19 comprehensive test scenarios
- **Special Features**: Numeric validation with user-friendly error messages

#### **StreetName Field** (`StreetName.tsx`)
- **Purpose**: Street name entry
- **Validation Rules**:
  - Optional/Required modes
  - 2-100 character length range
- **Test Coverage**: 17 comprehensive test scenarios
- **Special Features**: Length-based validation for street names

#### **City Field** (`City.tsx`)
- **Purpose**: City name entry
- **Validation Rules**:
  - Optional/Required modes
  - 2-50 character length range
  - Letters, spaces, hyphens, periods, apostrophes only
- **Test Coverage**: 19 comprehensive test scenarios
- **Special Features**: International city name support with character validation

#### **StateProvince Field** (`StateProvince.tsx`)
- **Purpose**: State or province entry
- **Validation Rules**:
  - Optional/Required modes
  - 2-50 character length range
  - Letters, spaces, hyphens, periods only
- **Test Coverage**: 12 comprehensive test scenarios
- **Special Features**: Support for both US states and Canadian provinces

#### **PostalCode Field** (`PostalCode.tsx`)
- **Purpose**: Postal/ZIP code entry
- **Validation Rules**:
  - Optional/Required modes
  - 5-10 character length range
  - Canadian (A1A 1A1) or US (12345/12345-6789) format validation
- **Test Coverage**: 21 comprehensive test scenarios including multiple postal code formats
- **Special Features**: Multi-country postal code format support

#### **Country Field** (`Country.tsx`)
- **Purpose**: Country name entry
- **Validation Rules**:
  - Optional/Required modes
  - 2-60 character length range
  - Letters, spaces, hyphens, periods only
- **Test Coverage**: 12 comprehensive test scenarios
- **Special Features**: International country name support

#### **StreetNumberName Field** (`StreetNumberName.tsx`)
- **Purpose**: Combined street number and name input with intelligent parsing
- **Validation Rules**:
  - Optional/Required modes
  - Intelligent parsing of "123 Main St" format
  - Separate validation for number and name components
- **Test Coverage**: 15 comprehensive test scenarios
- **Special Features**: Smart parsing, separate callbacks for parsed components

### Composite Components

#### **Address** (`Address.tsx`)
- **Purpose**: Base types, interfaces, and utility functions for address components
- **Features**:
  - `BaseFieldProps` interface definition
  - `ValidationResult` interface
  - `createEmptyAddress()` utility function
  - Toronto default address constants
- **Special Features**: Shared utilities and type definitions for all address components

#### **AddressPanel** (`AddressPanel.tsx`)
- **Purpose**: Complete address input panel with grid layout
- **Features**:
  - All 7 address fields in responsive grid layout
  - Individual field error display
  - Optional header and custom styling
  - Disabled state support
- **Test Coverage**: Integrated with AddressForm testing
- **Special Features**: Panel-style layout for embedding in larger forms

#### **AddressForm** (`AddressForm.tsx`)
- **Purpose**: Complete address form with integrated validation and submission handling
- **Features**:
  - All 7 address fields integrated
  - Form-level validation orchestration
  - Flexible submission, skip, and reset workflows
  - Customizable button layouts and styling
  - Loading and disabled states
  - External error display support
- **Test Coverage**: 17 comprehensive form-level test scenarios
- **Validation Modes**:
  - **Required Mode**: All fields must be completed and valid
  - **Optional Mode**: Fields validate only if they contain values
  - **Disabled Mode**: No validation, form always submittable

#### **FlexibleAddressForm** (`FlexibleAddressForm.tsx`)
- **Purpose**: Highly configurable address form with customizable field selection
- **Features**:
  - Configurable field inclusion/exclusion
  - Custom field configurations and layouts
  - Pre-defined configuration presets
  - Grid-based responsive layout
  - Per-field validation configuration
- **Test Coverage**: 20 comprehensive configuration test scenarios
- **Special Features**: Ultimate flexibility for different address collection needs

## 🔄 Validation Flow

### Touch-Based Validation Strategy
1. **Initial State**: No validation errors shown on first render
2. **User Interaction**: Validation triggers only after user interacts with field (blur event)
3. **Real-Time Feedback**: After first interaction, validation runs on every change
4. **Form Submission**: Full form validation check before submission

### Validation Integration Pattern
```tsx
// Each field component supports:
interface FieldProps {
    enableValidation?: boolean;           // Enable/disable validation
    validationMode?: 'required' | 'optional'; // Validation strictness
    onValidationChange?: (isValid: boolean, errors: string[]) => void; // Validation callback
}
```

### Form-Level Validation Logic
- **Required Mode**: All fields must have values AND pass validation
- **Optional Mode**: Only fields with values need to pass validation
- **Validation State Tracking**: Form tracks validation state of each field
- **Submit Button State**: Automatically enabled/disabled based on form validity

## 🎨 User Experience Features

### Visual Feedback
- **Error States**: Red borders and error text for invalid fields
- **Required Indicators**: Red asterisk (*) for required fields
- **Loading States**: Disabled fields and loading buttons during submission
- **Success States**: Clean appearance when validation passes

### Accessibility
- **Label Association**: All inputs properly labeled with `htmlFor` attributes
- **Error Announcements**: Error messages properly associated with fields
- **Keyboard Navigation**: Full keyboard accessibility support
- **Screen Reader Support**: Semantic HTML structure

### Responsive Design
- **Grid Layouts**: Responsive 2-column layouts for related fields
- **Mobile-First**: Touch-friendly input sizes and spacing
- **Flexible Button Layouts**: Horizontal/vertical button arrangements

## 🧪 Testing Strategy

### Test Coverage Metrics
- **Total Test Files**: 9 test files
- **Total Test Scenarios**: 140+ individual test cases
- **Coverage Areas**:
  - Basic rendering and props
  - User interaction and callbacks
  - Validation logic and error states
  - Required/optional mode behavior
  - Accessibility features
  - Form integration scenarios

### Test Patterns
- **Isolated Component Testing**: Each field tested independently
- **Integration Testing**: AddressForm tested with all fields
- **Validation Scenario Testing**: Comprehensive validation rule coverage
- **User Interaction Testing**: Real user behavior simulation
- **Edge Case Testing**: Boundary conditions and error scenarios

## 🔧 Configuration & Customization

### Validation Service Integration
Components integrate with the centralized `ValidationService` for:
- **Consistent Rule Definition**: Shared validation rules across components
- **Custom Rule Support**: Ability to add custom validation rules
- **Internationalization**: Support for different validation messages
- **Performance Optimization**: Efficient validation execution

### Styling Customization
- **CSS Classes**: All components accept custom `className` props
- **Theme Integration**: Uses Tailwind CSS design system
- **Component Variants**: Flexible button and input styling options
- **Layout Options**: Inline vs. card-wrapped display modes

### Form Behavior Configuration
- **Submission Handling**: Flexible onSubmit/onSkip/onReset callbacks
- **Button Customization**: Custom text, variants, and layouts
- **Header/Description**: Optional form titles and descriptions
- **Validation Modes**: Global form validation behavior control

## 🔄 Data Flow

### Props Flow
```
AddressForm
├── addressData (AddressData object)
├── onAddressChange (field updates)
├── validation props (enableValidation, validationMode)
└── Field Components
    ├── value (from addressData)
    ├── onChange (calls onAddressChange)
    ├── validation props (passed through)
    └── onValidationChange (validation state updates)
```

### State Management
- **Field-Level State**: Each field manages its own validation state
- **Form-Level State**: AddressForm tracks overall form validity
- **Parent-Level State**: External components control address data
- **Validation State**: Centralized validation state tracking in form

## 📋 Implementation Patterns

### Consistent Component Structure
1. **Interface Definition**: Props interface extending BaseFieldProps
2. **State Management**: Validation errors and touch state
3. **Validation Configuration**: Rules based on props
4. **Effect Handling**: Validation prop changes and re-validation
5. **Event Handlers**: Change and blur event processing
6. **Render Logic**: Label, input, and error display

### Error Handling Strategy
- **Priority System**: Validation errors take precedence over external errors
- **User-Friendly Messages**: Clear, actionable error text
- **Progressive Disclosure**: Errors appear only when relevant
- **State Recovery**: Automatic error clearing when issues resolved

## 🚀 Usage Examples

### Basic Address Form
```tsx
<AddressForm
    addressData={addressData}
    onAddressChange={handleAddressChange}
    onSubmit={handleSubmit}
/>
```

### Validated Address Form
```tsx
<AddressForm
    addressData={addressData}
    onAddressChange={handleAddressChange}
    onSubmit={handleSubmit}
    enableValidation={true}
    isSkippable={false}
/>
```

### Multi-Step Form Integration
```tsx
<AddressForm
    addressData={addressData}
    onAddressChange={handleAddressChange}
    onSubmit={handleNext}
    onSkip={handleSkip}
    isSkippable={true}
    enableValidation={true}
    title="Address Information"
    description="Please provide your address details"
/>
```

This comprehensive address component suite provides a robust, user-friendly, and fully validated address input solution that can be easily integrated into any part of the BuildFlow application.