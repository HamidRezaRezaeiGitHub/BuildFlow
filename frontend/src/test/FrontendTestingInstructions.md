# Frontend Testing Instructions

## Overview

This document provides comprehensive instructions for writing and maintaining tests in the BuildFlow frontend application. We use Jest as our testing framework with React Testing Library for component testing.

## Testing Philosophy

Our frontend testing follows similar patterns to the backend tests (see `/src/test/resources/TestClassesPattern.md`) but adapted for React/TypeScript:

- **Unit Tests**: Test individual functions, utilities, and hooks in isolation
- **Component Tests**: Test React components with user interactions
- **Integration Tests**: Test multiple components working together
- **No E2E Tests**: End-to-end testing is handled separately

## Test File Naming Conventions

### File Naming
- **Unit tests**: `<filename>.test.ts` (e.g., `validation.test.ts`)
- **Component tests**: `<ComponentName>.test.tsx` (e.g., `Hero.test.tsx`)
- **Integration tests**: `<FeatureName>.integration.test.tsx`

### Test Location
- Tests should be placed in the same directory as the code they test
- Alternatively, tests can be placed in `__tests__` folders within each directory
- Test setup and utilities go in `/src/test/`

## Test Method Naming

Following the backend pattern, all test method names should follow:

```
describe_shouldExpectedBehavior_whenCondition()
```

Examples:
```typescript
test('validateEmail_shouldReturnValid_whenEmailIsCorrect', () => {})
test('Button_shouldCallOnClick_whenClicked', () => {})
test('Hero_shouldNavigateToSignup_whenGetStartedClicked', () => {})
```

## Test Structure

### Setup and Cleanup
```typescript
describe('ComponentName', () => {
  // Setup before each test
  beforeEach(() => {
    // Reset mocks, initialize test data
  });

  // Cleanup after each test
  afterEach(() => {
    // Clear mocks, cleanup DOM
    cleanup();
  });
});
```

### Test Organization
```typescript
describe('UtilityFunction', () => {
  describe('when valid input provided', () => {
    test('utilityFunction_shouldReturnExpected_whenValidInput', () => {
      // Test implementation
    });
  });

  describe('when invalid input provided', () => {
    test('utilityFunction_shouldThrowError_whenInvalidInput', () => {
      // Test implementation
    });
  });
});
```

## Writing Different Types of Tests

### 1. Utility Function Tests

```typescript
import { validateEmail } from '@/utils/validation';

describe('validateEmail', () => {
  test('validateEmail_shouldReturnValid_whenEmailIsCorrect', () => {
    const result = validateEmail('user@example.com');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('validateEmail_shouldReturnInvalid_whenEmailMissingAtSymbol', () => {
    const result = validateEmail('userexample.com');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Email must be valid');
  });
});
```

### 2. React Component Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  test('Button_shouldCallOnClick_whenClicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByRole('button', { name: /click me/i }));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('Button_shouldApplyVariantClass_whenVariantProvided', () => {
    render(<Button variant="destructive">Delete</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('destructive');
  });
});
```

### 3. Context Provider Tests

```typescript
import { render, screen } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

// Test component to use the context
const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

describe('ThemeProvider', () => {
  test('ThemeProvider_shouldProvideDefaultTheme_whenMounted', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });
});
```

### 4. Custom Hook Tests

```typescript
import { renderHook, act } from '@testing-library/react';
import { useMediaQuery } from '@/lib/useMediaQuery';

describe('useMediaQuery', () => {
  test('useMediaQuery_shouldReturnTrue_whenMediaQueryMatches', () => {
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: true,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    });

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    
    expect(result.current).toBe(true);
  });
});
```

## Assertion Guidelines

### What to Assert
- **Function returns**: Assert the return value and its properties
- **Component rendering**: Assert elements are in the document
- **User interactions**: Assert functions are called, states change
- **Accessibility**: Assert proper ARIA attributes and roles

### What NOT to Assert
- **Implementation details**: Don't test internal state unless it affects behavior
- **CSS classes**: Only test classes that affect functionality
- **Exact error messages**: Test error types, not specific text

### Preferred Assertions
```typescript
// Good - Testing behavior
expect(screen.getByRole('button')).toBeInTheDocument();
expect(handleClick).toHaveBeenCalledWith(expectedArgs);
expect(result.isValid).toBe(true);

// Avoid - Testing implementation
expect(component.state.internalCounter).toBe(5);
expect(element).toHaveClass('some-internal-class');
```

## Testing Best Practices

### 1. Test User Behavior, Not Implementation
```typescript
// Good - Testing what user sees and does
test('SignUpForm_shouldShowValidationError_whenEmailInvalid', async () => {
  render(<SignUpForm />);
  
  await user.type(screen.getByLabelText(/email/i), 'invalid-email');
  await user.click(screen.getByRole('button', { name: /sign up/i }));
  
  expect(screen.getByText(/email must be valid/i)).toBeInTheDocument();
});

// Avoid - Testing internal implementation
test('SignUpForm_shouldSetEmailError_whenEmailInvalid', () => {
  const { component } = render(<SignUpForm />);
  component.setEmailError('Email must be valid');
  expect(component.state.emailError).toBe('Email must be valid');
});
```

### 2. Use Screen Queries Properly
```typescript
// Preferred queries (in order of preference):
screen.getByRole('button', { name: /submit/i })  // Accessible and user-focused
screen.getByLabelText(/email address/i)          // Form labels
screen.getByText(/welcome/i)                     // Visible text
screen.getByTestId('submit-button')              // Last resort
```

### 3. Handle Async Operations
```typescript
// For async operations, use waitFor or findBy
test('ApiCall_shouldShowData_whenRequestSucceeds', async () => {
  render(<DataComponent />);
  
  // Wait for element to appear
  const data = await screen.findByText(/loaded data/i);
  expect(data).toBeInTheDocument();
  
  // Or use waitFor for more complex assertions
  await waitFor(() => {
    expect(screen.getByText(/loaded data/i)).toBeInTheDocument();
  });
});
```

### 4. Mock External Dependencies
```typescript
// Mock API calls
jest.mock('@/services/api', () => ({
  signUp: jest.fn(),
  login: jest.fn(),
}));

// Mock React Router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));
```

## Available Scripts

```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Testing Coverage Goals

- **Utility functions**: 100% coverage (they're pure functions)
- **Components**: 80%+ coverage of critical paths
- **Context providers**: 90%+ coverage
- **Business logic**: 95%+ coverage

## File Organization Example

```
src/
  components/
    ui/
      button.tsx
      button.test.tsx
    home/
      Hero.tsx
      Hero.test.tsx
  utils/
    validation.ts
    validation.test.ts
  contexts/
    ThemeContext.tsx
    ThemeContext.test.tsx
  test/
    setup.ts
    test-utils.tsx  # Custom render helpers
```

## Common Testing Patterns

### Test Utilities
Create helper functions for common testing scenarios:

```typescript
// src/test/test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { AppProviders } from '@/contexts/AppProviders';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <AppProviders>{children}</AppProviders>;
};

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### Testing Forms
```typescript
test('SignUpForm_shouldSubmitForm_whenAllFieldsValid', async () => {
  const mockSubmit = jest.fn();
  render(<SignUpForm onSubmit={mockSubmit} />);
  
  await user.type(screen.getByLabelText(/first name/i), 'John');
  await user.type(screen.getByLabelText(/last name/i), 'Doe');
  await user.type(screen.getByLabelText(/email/i), 'john@example.com');
  await user.type(screen.getByLabelText(/password/i), 'SecurePass123!');
  
  await user.click(screen.getByRole('button', { name: /sign up/i }));
  
  expect(mockSubmit).toHaveBeenCalledWith({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'SecurePass123!'
  });
});
```

This testing approach ensures comprehensive coverage while maintaining maintainable and reliable tests that focus on user behavior rather than implementation details.