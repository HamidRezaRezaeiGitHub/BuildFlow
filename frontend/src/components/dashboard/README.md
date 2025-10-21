# Dashboard Components

This directory contains components for the authenticated user dashboard layout and structure.

## Summary

The dashboard components provide the main layout wrapper and structure for authenticated user views. The DashboardLayout component serves as the container for all dashboard pages, providing consistent navigation, header, and content areas.

## Files Structure

```
dashboard/
├── DashboardLayout.tsx       # Main dashboard layout component
├── DashboardLayout.test.tsx  # Dashboard layout tests
└── index.ts                  # Component exports
```

## Component Details

### DashboardLayout.tsx
**Purpose:** Main layout wrapper for authenticated dashboard pages.

**Features:**
- **Consistent Layout Structure:**
  - Top navigation bar with user profile
  - Side navigation (optional)
  - Main content area
  - Theme toggle integration
  
- **Navigation Integration:**
  - FlexibleNavbar for top navigation
  - User avatar and profile menu
  - Navigation menu items
  - Logout functionality

- **Responsive Design:**
  - Mobile hamburger menu
  - Collapsible sidebar
  - Adaptive content area
  - Touch-friendly controls

**Props:**
```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
  showSidebar?: boolean;
  navItems?: NavItem[];
}
```

**Usage:**
```typescript
import { DashboardLayout } from '@/components/dashboard';

const DashboardPage = () => {
  return (
    <DashboardLayout 
      showSidebar={true}
      navItems={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Projects', href: '/projects' },
        { label: 'Settings', href: '/settings' }
      ]}
    >
      <div className="dashboard-content">
        {/* Page content */}
      </div>
    </DashboardLayout>
  );
};
```

## Layout Structure

### Visual Layout
```
┌─────────────────────────────────────────────────┐
│  Navbar (FlexibleNavbar)                        │
│  [Logo] [Nav Items] [Theme] [Avatar]           │
├─────────────────────────────────────────────────┤
│                                                 │
│  Main Content Area                              │
│  (children prop rendered here)                  │
│                                                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Responsive Layout
**Desktop:**
- Full navbar with all items visible
- Optional sidebar navigation
- Wide content area

**Tablet:**
- Compact navbar
- Collapsible sidebar
- Adjusted content width

**Mobile:**
- Hamburger menu
- Hidden sidebar (drawer on demand)
- Full-width content

## Integration Points

### FlexibleNavbar
DashboardLayout uses FlexibleNavbar for top navigation:
```typescript
<FlexibleNavbar
  isAuthenticated={true}
  user={currentUser}
  navItems={navItems}
  ThemeToggleComponent={ThemeToggle}
  onAvatarClick={handleProfileMenu}
/>
```

### AuthContext
Retrieves user information and authentication state:
```typescript
const { user, isAuthenticated, logout } = useAuth();
```

### NavigationContext
Handles routing and navigation:
```typescript
const { navigate } = useNavigation();
```

### ThemeContext
Integrates theme switching:
```typescript
const { theme } = useTheme();
```

## Component Architecture

### Composition Pattern
DashboardLayout is a container component:
- Accepts children for page content
- Provides consistent navigation
- Manages layout structure
- Handles authentication checks

### Layout Variants
Can be extended for different layouts:
- `DashboardLayout` - Standard dashboard
- `AdminDashboardLayout` - Admin-specific layout (future)
- `ProjectDashboardLayout` - Project-focused layout (future)

## Styling Approach

### Tailwind CSS
```typescript
<div className="min-h-screen bg-background">
  <nav className="border-b border-border">
    {/* Navigation */}
  </nav>
  <main className="container mx-auto px-4 py-6">
    {/* Content */}
  </main>
</div>
```

### Theme Awareness
- Respects current theme (light/dark)
- Uses theme color variables
- Smooth theme transitions

### Responsive Classes
- Mobile-first approach
- Breakpoint modifiers (`md:`, `lg:`)
- Flexible grid/flex layouts

## Testing

### DashboardLayout.test.tsx
**Test Coverage:**
- Layout rendering with children
- Navigation item display
- User authentication state
- Theme integration
- Responsive behavior
- Profile menu interactions

**Test Patterns:**
```typescript
test('DashboardLayout_shouldRender_withChildren', () => {
  render(
    <DashboardLayout>
      <div>Dashboard Content</div>
    </DashboardLayout>
  );
  expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
});

test('DashboardLayout_shouldShowUserAvatar_whenAuthenticated', () => {
  render(<DashboardLayout />);
  expect(screen.getByRole('img', { name: /user avatar/i })).toBeInTheDocument();
});
```

## Usage Patterns

### Basic Dashboard Page
```typescript
import { DashboardLayout } from '@/components/dashboard';

const MyDashboardPage = () => (
  <DashboardLayout>
    <h1>My Dashboard</h1>
    <div className="grid gap-4">
      {/* Dashboard widgets */}
    </div>
  </DashboardLayout>
);
```

### With Custom Navigation
```typescript
import { DashboardLayout } from '@/components/dashboard';

const navItems = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Projects', href: '/dashboard/projects' },
  { label: 'Analytics', href: '/dashboard/analytics' }
];

const DashboardWithNav = () => (
  <DashboardLayout navItems={navItems}>
    {/* Content */}
  </DashboardLayout>
);
```

### Protected Route Integration
```typescript
import { DashboardLayout } from '@/components/dashboard';
import { ProtectedRoute } from '@/contexts/AppRouter';

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardPage />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>
```

## Development Guidelines

### Extending the Layout
To add new layout features:
1. Add props to `DashboardLayoutProps` interface
2. Update component implementation
3. Add tests for new functionality
4. Update this documentation

### Custom Layouts
To create custom layout variants:
1. Create new component extending DashboardLayout
2. Customize structure and features
3. Maintain consistent API
4. Add comprehensive tests

## Related Documentation

- [Navbar Components](../navbar/README.md) - FlexibleNavbar integration
- [AuthContext](../../contexts/README.md#authcontext) - Authentication state
- [NavigationContext](../../contexts/README.md#navigationcontext) - Routing
- [ThemeContext](../../contexts/README.md#themecontext) - Theme management
- [Dashboard Page](../../pages/DashboardPage.tsx) - Example usage
