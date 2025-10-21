# Utils Directory

This directory contains utility functions and custom React hooks that provide reusable functionality across the application.

## Summary

The utils directory houses pure utility functions and custom hooks that don't fit into other categories. These utilities provide common functionality like className merging, media query detection, and other helper functions used throughout the application.

## Files Structure

```
utils/
├── useMediaQuery.ts    # Custom hook for responsive media queries
├── utils.test.ts       # Utility function tests
└── utils.ts            # General utility functions
```

## Utility Details

### utils.ts
**Purpose:** General utility functions for common operations.

**Key Functions:**
```typescript
/**
 * Merges className strings with conditional logic
 * Powered by clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]): string

/**
 * Formats a date to a readable string
 */
export function formatDate(date: Date, format?: string): string

/**
 * Debounces a function call
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void

/**
 * Generates a unique ID
 */
export function generateId(prefix?: string): string
```

**Usage:**
```typescript
import { cn } from '@/utils/utils';

// Conditional className merging
const buttonClass = cn(
  'px-4 py-2 rounded',
  isActive && 'bg-blue-500',
  isDisabled && 'opacity-50 cursor-not-allowed'
);

// Result: "px-4 py-2 rounded bg-blue-500" (if active)
```

**Why `cn` is Important:**
- Merges Tailwind classes intelligently
- Handles conditional classes
- Resolves conflicting classes (e.g., `p-4 p-2` → `p-2`)
- Used extensively in shadcn/ui components

### useMediaQuery.ts
**Purpose:** Custom React hook for responsive media query detection.

**Hook Definition:**
```typescript
/**
 * Custom hook to detect media query matches
 * @param query - CSS media query string
 * @returns boolean indicating if query matches
 */
export function useMediaQuery(query: string): boolean
```

**Features:**
- Real-time media query matching
- Server-side rendering safe
- Event listener cleanup
- TypeScript support

**Usage:**
```typescript
import { useMediaQuery } from '@/utils/useMediaQuery';

const MyComponent = () => {
  // Detect screen size
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  
  // Detect dark mode preference
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  
  // Conditional rendering based on screen size
  if (isMobile) {
    return <MobileLayout />;
  }
  
  if (isTablet) {
    return <TabletLayout />;
  }
  
  return <DesktopLayout />;
};
```

**Common Media Queries:**
```typescript
// Screen sizes (Tailwind breakpoints)
const isSmall = useMediaQuery('(max-width: 640px)');      // sm
const isMedium = useMediaQuery('(min-width: 768px)');      // md
const isLarge = useMediaQuery('(min-width: 1024px)');      // lg
const isXLarge = useMediaQuery('(min-width: 1280px)');     // xl
const is2XLarge = useMediaQuery('(min-width: 1536px)');    // 2xl

// Device orientation
const isPortrait = useMediaQuery('(orientation: portrait)');
const isLandscape = useMediaQuery('(orientation: landscape)');

// User preferences
const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
const prefersHighContrast = useMediaQuery('(prefers-contrast: high)');
```

**Implementation Details:**
```typescript
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Create media query list
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);
    
    // Event handler
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add listener (supports both old and new API)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      mediaQuery.addListener(handler);  // Fallback for older browsers
    }
    
    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, [query]);

  return matches;
}
```

## Testing

### utils.test.ts
**Test Coverage:**
- `cn()` function className merging
- Conditional class logic
- Class conflict resolution
- Edge cases (empty, undefined, null)

**Test Example:**
```typescript
describe('cn utility function', () => {
  test('should merge multiple class names', () => {
    expect(cn('class1', 'class2', 'class3'))
      .toBe('class1 class2 class3');
  });
  
  test('should handle conditional classes', () => {
    expect(cn('base', true && 'active', false && 'inactive'))
      .toBe('base active');
  });
  
  test('should resolve Tailwind conflicts', () => {
    expect(cn('p-4', 'p-2'))
      .toBe('p-2');  // Last class wins for same property
  });
});
```

## Usage Patterns

### Responsive Components
```typescript
import { useMediaQuery } from '@/utils/useMediaQuery';

const ResponsiveNav = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return isMobile ? <MobileNav /> : <DesktopNav />;
};
```

### Conditional Styling
```typescript
import { cn } from '@/utils/utils';

const Card = ({ isHighlighted, isDisabled }) => (
  <div className={cn(
    'rounded-lg border p-4',
    isHighlighted && 'border-blue-500 bg-blue-50',
    isDisabled && 'opacity-50 pointer-events-none'
  )}>
    {/* Card content */}
  </div>
);
```

### Adaptive Layouts
```typescript
const AdaptiveGrid = () => {
  const isSmall = useMediaQuery('(max-width: 640px)');
  const isMedium = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  
  const columns = isSmall ? 1 : isMedium ? 2 : 3;
  
  return (
    <div className={`grid grid-cols-${columns} gap-4`}>
      {/* Grid items */}
    </div>
  );
};
```

### Accessibility
```typescript
const AccessibleComponent = () => {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  
  return (
    <div className={cn(
      'transition-all',
      !prefersReducedMotion && 'duration-300'
    )}>
      {/* Content with conditional animations */}
    </div>
  );
};
```

## Development Guidelines

### Adding New Utilities
1. Create function in `utils.ts`
2. Add TypeScript types
3. Write comprehensive tests
4. Document usage examples
5. Export from file
6. Update this README

### Utility Function Pattern
```typescript
/**
 * Brief description of what the function does
 * @param param1 - Description of parameter
 * @param param2 - Description of parameter
 * @returns Description of return value
 * @example
 * const result = myUtility('input');
 */
export function myUtility(param1: string, param2?: number): string {
  // Implementation
  return result;
}
```

### Custom Hook Pattern
```typescript
/**
 * Brief description of what the hook does
 * @param options - Hook configuration
 * @returns Hook return value
 * @example
 * const value = useMyHook({ option: true });
 */
export function useMyHook(options?: HookOptions): HookReturn {
  const [state, setState] = useState(initialState);
  
  useEffect(() => {
    // Effect logic
    return () => {
      // Cleanup
    };
  }, [dependencies]);
  
  return state;
}
```

## Performance Considerations

### Memoization
For expensive utility functions:
```typescript
export const expensiveUtility = memoize((input: string) => {
  // Expensive computation
  return result;
});
```

### Hook Optimization
Use dependency arrays correctly:
```typescript
useEffect(() => {
  // Effect logic
}, [query]);  // Only re-run when query changes
```

## Common Utilities to Add

Potential utilities for future development:
- `formatCurrency(amount: number, currency: string): string`
- `truncateText(text: string, maxLength: number): string`
- `slugify(text: string): string`
- `copyToClipboard(text: string): Promise<void>`
- `downloadFile(blob: Blob, filename: string): void`
- `useDebounce<T>(value: T, delay: number): T`
- `useThrottle<T>(value: T, delay: number): T`
- `useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void]`

## Related Documentation

- [Components](../components/README.md) - Components using utilities
- [Hooks Documentation](https://react.dev/reference/react) - React hooks reference
- [Tailwind Merge](https://github.com/dcastil/tailwind-merge) - `cn` function dependency
- [clsx](https://github.com/lukeed/clsx) - Conditional classes
