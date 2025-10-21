# Test Directory

This directory contains testing configuration, utilities, and shared test helpers for the BuildFlow frontend application.

## Summary

The test directory provides the foundation for testing React components and utilities using Jest and React Testing Library. It includes global test setup, custom rendering utilities, and configuration tests to ensure the testing environment is properly initialized.

## Files Structure

```
test/
├── config.test.ts     # Configuration validation tests
├── setup.ts           # Global test setup and configuration
└── test-utils.tsx     # Custom testing utilities and helpers
```

## File Details

### setup.ts
**Purpose:** Global Jest configuration and test environment setup.

**Features:**
- Jest DOM matchers setup
- Global test utilities
- Mock configuration
- Polyfills for test environment
- Custom assertions

**Configuration:**
```typescript
import '@testing-library/jest-dom';

// Global test utilities
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));
```

**What It Provides:**
- `@testing-library/jest-dom` matchers
  - `toBeInTheDocument()`
  - `toHaveClass()`
  - `toHaveTextContent()`
  - And many more...
- Mock implementations for browser APIs
- Test environment configuration

### test-utils.tsx
**Purpose:** Custom testing utilities and wrapper functions.

**Custom Render Function:**
```typescript
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { AppProviders } from '@/contexts';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  // Add custom options here
  initialRoute?: string;
  initialUser?: User;
}

/**
 * Custom render function that wraps components with necessary providers
 */
function customRender(
  ui: ReactElement,
  options?: CustomRenderOptions
): RenderResult {
  const { initialRoute = '/', ...renderOptions } = options || {};
  
  // Set initial route
  window.history.pushState({}, 'Test page', initialRoute);
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AppProviders>
        {children}
      </AppProviders>
    ),
    ...renderOptions
  });
}

// Re-export everything from React Testing Library
export * from '@testing-library/react';

// Override render with custom render
export { customRender as render };
```

**Usage:**
```typescript
import { render, screen, fireEvent } from '@/test/test-utils';

test('MyComponent_shouldRender_withProviders', () => {
  render(<MyComponent />, {
    initialRoute: '/dashboard'
  });
  
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
});
```

**Utilities Provided:**
- `render()` - Custom render with all providers
- `renderHook()` - Render hooks with providers
- `waitFor()` - Wait for async operations
- `screen` - Query utilities
- `fireEvent` - User event simulation
- `userEvent` - Advanced user interactions

### config.test.ts
**Purpose:** Tests to verify Jest configuration is correct.

**Test Coverage:**
- Jest environment setup
- jsdom availability
- Testing library integration
- Custom matchers availability
- Mock implementations

**Example Tests:**
```typescript
describe('Jest Configuration', () => {
  test('should have jsdom environment', () => {
    expect(typeof window).toBe('object');
    expect(typeof document).toBe('object');
  });
  
  test('should have testing library matchers', () => {
    const element = document.createElement('div');
    expect(element).toBeInTheDocument();
  });
  
  test('should have mocked localStorage', () => {
    expect(global.localStorage).toBeDefined();
    expect(global.localStorage.getItem).toBeDefined();
  });
});
```

## Testing Patterns

### Component Testing
```typescript
import { render, screen, fireEvent } from '@/test/test-utils';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  test('should render with default props', () => {
    render(<MyComponent />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  
  test('should handle user interaction', () => {
    const mockOnClick = jest.fn();
    render(<MyComponent onClick={mockOnClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
  
  test('should update when props change', () => {
    const { rerender } = render(<MyComponent value="initial" />);
    expect(screen.getByText('initial')).toBeInTheDocument();
    
    rerender(<MyComponent value="updated" />);
    expect(screen.getByText('updated')).toBeInTheDocument();
  });
});
```

### Hook Testing
```typescript
import { renderHook, act } from '@/test/test-utils';
import { useMyHook } from './useMyHook';

describe('useMyHook', () => {
  test('should initialize with default value', () => {
    const { result } = renderHook(() => useMyHook());
    
    expect(result.current.value).toBe(defaultValue);
  });
  
  test('should update value', () => {
    const { result } = renderHook(() => useMyHook());
    
    act(() => {
      result.current.setValue('new value');
    });
    
    expect(result.current.value).toBe('new value');
  });
});
```

### Async Testing
```typescript
import { render, screen, waitFor } from '@/test/test-utils';

test('should load data asynchronously', async () => {
  render(<AsyncComponent />);
  
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});
```

### User Event Testing
```typescript
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';

test('should handle user typing', async () => {
  const user = userEvent.setup();
  render(<InputComponent />);
  
  const input = screen.getByRole('textbox');
  await user.type(input, 'Hello World');
  
  expect(input).toHaveValue('Hello World');
});
```

## Common Test Utilities

### Mock Functions
```typescript
const mockCallback = jest.fn();
const mockAsyncFn = jest.fn().mockResolvedValue(data);
const mockRejectedFn = jest.fn().mockRejectedValue(error);
```

### Query Methods
```typescript
// Preferred queries (fail if not found)
screen.getByRole('button');
screen.getByLabelText('Email');
screen.getByText('Submit');

// Query variants (return null if not found)
screen.queryByRole('button');
screen.queryByText('Optional text');

// Find variants (async, wait for element)
await screen.findByRole('button');
await screen.findByText('Loaded data');

// Multiple elements
screen.getAllByRole('listitem');
screen.queryAllByRole('button');
await screen.findAllByText('Item');
```

### Custom Matchers
```typescript
// Jest DOM matchers
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toBeDisabled();
expect(element).toHaveClass('active');
expect(element).toHaveTextContent('Hello');
expect(element).toHaveAttribute('href', '/path');
expect(input).toHaveValue('text');
expect(checkbox).toBeChecked();
```

## Test Configuration

### jest.config.js
Located in frontend root:
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test/**',
  ],
};
```

### tsconfig.jest.json
TypeScript configuration for tests:
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "jsx": "react",
    "esModuleInterop": true,
    "types": ["jest", "@testing-library/jest-dom"]
  },
  "include": [
    "src/**/*.test.ts",
    "src/**/*.test.tsx",
    "src/test/**/*"
  ]
}
```

## Running Tests

### Commands
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test MyComponent.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should render"
```

### Coverage Reports
```bash
npm run test:coverage

# View coverage report
open coverage/lcov-report/index.html
```

## Best Practices

### Test Naming
```typescript
// Pattern: Component_should<Behavior>_when<Condition>
test('Button_shouldCallOnClick_whenClicked', () => {});
test('Form_shouldShowError_whenValidationFails', () => {});
test('List_shouldRenderItems_whenDataProvided', () => {});
```

### Arrange-Act-Assert
```typescript
test('example test', () => {
  // Arrange
  const mockFn = jest.fn();
  render(<Component onClick={mockFn} />);
  
  // Act
  fireEvent.click(screen.getByRole('button'));
  
  // Assert
  expect(mockFn).toHaveBeenCalled();
});
```

### Test Isolation
- Each test should be independent
- Clean up after tests
- Don't rely on test execution order
- Use `beforeEach` and `afterEach` for setup/cleanup

### Accessibility Testing
```typescript
test('should be accessible', () => {
  render(<MyComponent />);
  
  // Check for proper ARIA labels
  expect(screen.getByLabelText('Email')).toBeInTheDocument();
  
  // Check for keyboard navigation
  expect(screen.getByRole('button')).toHaveFocus();
});
```

## Related Documentation

- [Jest Documentation](https://jestjs.io/docs/getting-started) - Jest testing framework
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - Component testing
- [Testing Library Queries](https://testing-library.com/docs/queries/about/) - Query methods
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom) - Custom matchers
- [Component Tests](../components/README.md#testing-strategy) - Component testing patterns
