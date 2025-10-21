# Contexts Directory

This directory contains React Context providers for global state management throughout the application.

## Summary

The contexts directory provides centralized state management using React Context API. Each context manages a specific domain of application state (authentication, navigation, theme, routing) and exposes hooks for consuming components. Contexts are composed together in AppProviders for easy integration.

## Files Structure

```
contexts/
├── AppProviders.tsx              # Composition of all providers
├── AppRouter.tsx                 # Route definitions and protection
├── AuthContext.tsx               # Authentication state management
├── AuthContext.test.tsx          # Auth context tests
├── NavigationContext.tsx         # Navigation helpers
├── NavigationContext.test.tsx    # Navigation context tests
├── RouterProvider.tsx            # Router setup wrapper
├── ThemeContext.tsx              # Theme state management
├── ThemeContext.test.tsx         # Theme context tests
├── ThemeContext.README.md        # Detailed theme context documentation
└── index.ts                      # Context exports
```

## Context Details

### AppProviders.tsx
**Purpose:** Composes all context providers into a single wrapper.

**Features:**
- Combines all application contexts
- Correct provider nesting order
- Single import for all contexts
- Simplified app setup

**Provider Hierarchy:**
```typescript
<ThemeProvider>
  <RouterProvider>
    <AuthProvider>
      <NavigationProvider>
        {children}
      </NavigationProvider>
    </AuthProvider>
  </RouterProvider>
</ThemeProvider>
```

**Usage:**
```typescript
import { AppProviders } from '@/contexts';

// In main.tsx
root.render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>
);
```

### AuthContext.tsx
**Purpose:** Manages user authentication state and operations.

**State:**
```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (signUpData: SignUpData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}
```

**Features:**
- User authentication state
- Login/logout functionality
- User registration
- Token management
- Session persistence (localStorage)
- Mock authentication support
- Loading states
- Error handling

**Usage:**
```typescript
import { useAuth } from '@/contexts';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginButton onClick={showLoginForm} />;
  }
  
  return (
    <div>
      <p>Welcome, {user.contactDto.firstName}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

**Token Management:**
- Stores JWT token in localStorage
- Includes token in API requests
- Auto-refreshes expired tokens
- Clears token on logout

**Mock Authentication:**
When `config.enableMockAuth = true`:
- Uses mock users from `@/mocks/authMocks`
- Simulates login/logout
- No backend required
- Perfect for development

### NavigationContext.tsx
**Purpose:** Provides navigation helpers and utilities.

**State:**
```typescript
interface NavigationContextType {
  navigate: (to: string, options?: NavigateOptions) => void;
  goBack: () => void;
  goForward: () => void;
  
  // Convenience methods
  navigateToDashboard: () => void;
  navigateToLogin: () => void;
  navigateToHome: () => void;
  
  // Current location
  currentPath: string;
  previousPath: string | null;
}
```

**Features:**
- Wrapper around react-router navigation
- Convenience navigation methods
- Path history tracking
- Navigation guards (future)
- Scroll restoration

**Usage:**
```typescript
import { useNavigation } from '@/contexts';

const MyComponent = () => {
  const { navigate, navigateToDashboard, goBack } = useNavigation();
  
  const handleSuccess = () => {
    navigate('/projects', { replace: true });
  };
  
  const handleCancel = () => {
    goBack();
  };
  
  return (
    <div>
      <button onClick={navigateToDashboard}>Go to Dashboard</button>
      <button onClick={goBack}>Back</button>
    </div>
  );
};
```

**Navigation Options:**
```typescript
navigate('/path', {
  replace: true,     // Replace current history entry
  state: { data },   // Pass state to next page
});
```

### ThemeContext.tsx
**Purpose:** Manages application theme (light/dark mode).

**State:**
```typescript
interface ThemeContextType {
  theme: Theme;                    // 'light' | 'dark' | 'system'
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark';   // Resolved theme (system → light/dark)
}
```

**Features:**
- Light/dark/system theme modes
- System preference detection
- Theme persistence (localStorage)
- Smooth theme transitions
- CSS variable updates
- Real-time theme changes

**Usage:**
```typescript
import { useTheme } from '@/contexts';

const ThemeToggle = () => {
  const { theme, setTheme, actualTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <button onClick={toggleTheme}>
      Current: {actualTheme}
      {theme === 'system' && ' (auto)'}
    </button>
  );
};
```

**System Preference:**
- Detects OS theme preference
- Updates when system theme changes
- `prefers-color-scheme` media query

**CSS Integration:**
```typescript
// ThemeContext updates document root
document.documentElement.classList.remove('light', 'dark');
document.documentElement.classList.add(actualTheme);
```

See [ThemeContext.README.md](./ThemeContext.README.md) for detailed documentation.

### AppRouter.tsx
**Purpose:** Defines all application routes and route protection.

**Features:**
- Route definitions
- Protected routes (authentication required)
- Role-based route access
- Not found (404) handling
- Redirect logic
- Route guards

**Route Structure:**
```typescript
<Routes>
  {/* Public routes */}
  <Route path="/" element={<HomePage />} />
  
  {/* Protected routes */}
  <Route path="/dashboard" element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } />
  
  {/* Admin-only routes */}
  <Route path="/admin" element={
    <ProtectedRoute requiredRole="ADMIN">
      <AdminPage />
    </ProtectedRoute>
  } />
  
  {/* Not found */}
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

**ProtectedRoute Component:**
```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = '/'
}) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};
```

**Usage:**
Routes are automatically set up by AppProviders. No manual integration needed.

### RouterProvider.tsx
**Purpose:** Wraps the application with React Router.

**Features:**
- BrowserRouter configuration
- Base URL setup
- Route configuration
- Future flags

**Usage:**
Automatically used by AppProviders. No manual usage required.

## Context Composition

### Provider Order
The order of providers matters:
1. **ThemeProvider** - Theme available everywhere
2. **RouterProvider** - Routing setup
3. **AuthProvider** - Auth state (uses router for redirects)
4. **NavigationProvider** - Navigation helpers (uses router and auth)

### Why This Order?
- Theme doesn't depend on anything → outermost
- Router needed by auth redirects
- Auth needed by navigation guards
- Navigation uses router and auth → innermost

## Testing

### Test Coverage
Each context has comprehensive tests:
- **AuthContext.test.tsx** - Auth operations, state management
- **NavigationContext.test.tsx** - Navigation helpers, history
- **ThemeContext.test.tsx** - Theme switching, persistence

**Test Patterns:**
```typescript
test('AuthContext_shouldLogin_withValidCredentials', async () => {
  const { result } = renderHook(() => useAuth(), {
    wrapper: AuthProvider
  });
  
  await act(async () => {
    await result.current.login({
      username: 'admin',
      password: 'password123'
    });
  });
  
  expect(result.current.isAuthenticated).toBe(true);
  expect(result.current.user).toBeDefined();
});
```

## Development Guidelines

### Creating New Contexts
1. Define context interface
2. Create context with `createContext`
3. Implement provider component
4. Create custom hook for consumption
5. Add comprehensive tests
6. Export from index.ts
7. Add to AppProviders
8. Update this README

### Context Pattern
```typescript
// 1. Define interface
interface MyContextType {
  value: string;
  setValue: (value: string) => void;
}

// 2. Create context
const MyContext = createContext<MyContextType | undefined>(undefined);

// 3. Provider component
export const MyProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [value, setValue] = useState('');
  
  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
};

// 4. Custom hook
export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within MyProvider');
  }
  return context;
};
```

### State Persistence
Use localStorage for persisting context state:
```typescript
const [value, setValue] = useState(() => {
  const stored = localStorage.getItem('my-key');
  return stored ? JSON.parse(stored) : defaultValue;
});

useEffect(() => {
  localStorage.setItem('my-key', JSON.stringify(value));
}, [value]);
```

## Performance Considerations

### Memoization
Memoize context values to prevent unnecessary re-renders:
```typescript
const contextValue = useMemo(
  () => ({
    user,
    isAuthenticated,
    login,
    logout
  }),
  [user, isAuthenticated]
);
```

### Splitting Contexts
Consider splitting large contexts:
- Separate read and write operations
- Create focused contexts for specific features
- Avoid putting everything in one context

### Context Selectors
For large contexts, consider selector pattern:
```typescript
const useAuthUser = () => useAuth().user;
const useAuthStatus = () => useAuth().isAuthenticated;
```

## Related Documentation

- [AuthService](../services/README.md#authservicetsx) - Authentication API
- [NavigationContext Usage](../components/README.md) - In components
- [Theme System](../components/theme/README.md) - Theme components
- [AppRouter Routes](../pages/README.md) - Page routing
