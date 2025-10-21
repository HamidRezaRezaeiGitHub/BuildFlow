# Pages Directory

This directory contains all route-level page components that compose smaller components into complete views.

## Summary

The pages directory contains React components that represent full pages in the application. Each page component corresponds to a route and composes multiple smaller components from the `components/` directory to create complete user interfaces. Pages handle route-specific logic, data fetching, and layout composition.

## Files Structure

```
pages/
├── project/              # Project-related pages
│   ├── NewProject.tsx   # New project creation page
│   └── index.ts         # Page exports
├── temp/                 # Temporary demo/test pages
│   ├── AddressPage.tsx
│   ├── FlexibleBottomNavbarDemo.tsx
│   ├── FlexibleSignUpPage.tsx
│   └── Theme.tsx
├── AdminPage.tsx         # Admin panel page
├── DashboardPage.tsx     # User dashboard page
├── HomePage.tsx          # Landing/home page
└── index.ts              # Page exports
```

## Page Details

### HomePage.tsx
**Purpose:** Public landing page introducing the BuildFlow platform.

**Route:** `/` or `/home`

**Features:**
- Hero section with value proposition
- Feature highlights
- Brand showcase
- Authentication section
- Contact information
- Footer

**Components Used:**
- `Hero` - Main landing section
- `Features` - Platform features showcase
- `AuthSection` - Login/signup forms
- `Contact` - Contact information
- `Footer` - Page footer
- `Navbar` - Home page navigation

**Usage:**
```typescript
<Route path="/" element={<HomePage />} />
```

### DashboardPage.tsx
**Purpose:** Main authenticated user dashboard.

**Route:** `/dashboard` (protected)

**Features:**
- Projects overview
- Quick actions
- Recent activity
- Statistics and analytics

**Components Used:**
- `DashboardLayout` - Layout wrapper
- `ProjectsSection` - User's projects
- Statistics cards
- Activity feed

**Usage:**
```typescript
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } 
/>
```

### AdminPage.tsx
**Purpose:** Admin panel for system administration and user management.

**Route:** `/admin` (protected, admin-only)

**Features:**
- User management table
- User details drawer
- System statistics
- Admin actions

**Components Used:**
- `AdminLayout` - Admin layout wrapper
- `UsersTable` - User listing and management
- `UserDetailsDrawer` - User detail panel

**Usage:**
```typescript
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredRole="ADMIN">
      <AdminPage />
    </ProtectedRoute>
  } 
/>
```

**Access Control:**
- Only accessible to users with ADMIN role
- Redirects non-admin users to dashboard
- Shows loading state during auth check

## Subdirectory: project/

### [project/NewProject.tsx](./project/README.md#newprojecttsx)
**Purpose:** Page for creating new construction projects.

**Route:** `/projects/new` (protected)

**Features:**
- Project creation form
- Address input
- Builder/owner assignment
- Form validation

**Components Used:**
- `NewProjectForm` - Project creation form
- `DashboardLayout` - Layout wrapper

**Usage:**
```typescript
<Route 
  path="/projects/new" 
  element={
    <ProtectedRoute>
      <NewProject />
    </ProtectedRoute>
  } 
/>
```

## Subdirectory: temp/

Temporary pages for testing and demonstration. These are not part of the main application flow.

### temp/AddressPage.tsx
**Purpose:** Demo page for testing address components.

**Features:**
- FlexibleAddressForm demonstration
- Different field configurations
- Validation testing

### temp/FlexibleBottomNavbarDemo.tsx
**Purpose:** Demo page for bottom navigation component.

**Features:**
- Bottom navbar variants
- Mobile navigation testing

### temp/FlexibleSignUpPage.tsx
**Purpose:** Demo page for testing signup form variants.

**Features:**
- Different signup configurations
- Field preset testing
- Validation scenarios

### temp/Theme.tsx
**Purpose:** Theme system demonstration page.

**Features:**
- All theme toggle variants
- Theme showcase
- Color palette display

## Page Architecture Patterns

### Layout Composition
Pages compose layouts and sections:
```typescript
const DashboardPage = () => (
  <DashboardLayout>
    <PageHeader />
    <ProjectsSection />
    <ActivityFeed />
  </DashboardLayout>
);
```

### Data Fetching
Pages handle data fetching for their content:
```typescript
const ProjectPage = () => {
  const { projects, loading } = useProjects();
  
  if (loading) return <LoadingSpinner />;
  
  return <ProjectList projects={projects} />;
};
```

### Route Protection
Sensitive pages use ProtectedRoute wrapper:
```typescript
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } 
/>
```

### Error Handling
Pages handle errors gracefully:
```typescript
const MyPage = () => {
  const { data, error } = useFetchData();
  
  if (error) return <ErrorDisplay error={error} />;
  
  return <PageContent data={data} />;
};
```

## Routing Integration

### Routes Defined in AppRouter.tsx
```typescript
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/dashboard" element={
    <ProtectedRoute><DashboardPage /></ProtectedRoute>
  } />
  <Route path="/admin" element={
    <ProtectedRoute requiredRole="ADMIN">
      <AdminPage />
    </ProtectedRoute>
  } />
  <Route path="/projects/new" element={
    <ProtectedRoute><NewProject /></ProtectedRoute>
  } />
</Routes>
```

### Navigation Between Pages
```typescript
import { useNavigation } from '@/contexts/NavigationContext';

const MyComponent = () => {
  const { navigate } = useNavigation();
  
  const handleClick = () => {
    navigate('/dashboard');
  };
};
```

## State Management

### Page-Level State
Pages manage their own local state:
```typescript
const [selectedProject, setSelectedProject] = useState<Project | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);
```

### Context Integration
Pages consume context for global state:
```typescript
const { user } = useAuth();
const { theme } = useTheme();
const { navigate } = useNavigation();
```

### Service Integration
Pages call services for data operations:
```typescript
import { ProjectService } from '@/services/ProjectService';

const projects = await ProjectService.getProjectsByBuilderId(builderId);
```

## Testing Pages

### Test Patterns
```typescript
test('HomePage_shouldRender_withAllSections', () => {
  render(<HomePage />);
  
  expect(screen.getByRole('heading', { name: /BuildFlow/i })).toBeInTheDocument();
  expect(screen.getByText(/Features/i)).toBeInTheDocument();
});

test('DashboardPage_shouldShowProjects_whenUserAuthenticated', async () => {
  render(<DashboardPage />);
  
  await waitFor(() => {
    expect(screen.getByText('My Projects')).toBeInTheDocument();
  });
});
```

### Integration Testing
Pages should be tested for:
- Correct rendering of all sections
- Data fetching and display
- User interactions
- Route protection
- Error states
- Loading states

## Development Guidelines

### Creating New Pages
1. Create page component in appropriate directory
2. Define route in AppRouter.tsx
3. Add ProtectedRoute wrapper if needed
4. Compose layout and components
5. Handle data fetching and state
6. Add error and loading states
7. Write tests
8. Update this README

### Page File Structure
```typescript
import React from 'react';
import { DashboardLayout } from '@/components/dashboard';
import { ProjectsSection } from '@/components/project';

export const MyPage: React.FC = () => {
  // State and hooks
  
  // Data fetching
  
  // Event handlers
  
  return (
    <DashboardLayout>
      {/* Page content */}
    </DashboardLayout>
  );
};
```

### Naming Conventions
- Page files: PascalCase with "Page" suffix (e.g., `DashboardPage.tsx`)
- Subdirectories: lowercase, singular (e.g., `project/`)
- Export from index.ts for clean imports

## Related Documentation

- [AppRouter](../contexts/README.md#approuter) - Route definitions
- [Components](../components/README.md) - Reusable components
- [Layouts](../components/dashboard/README.md) - Layout components
- [Services](../services/README.md) - Data fetching
- [Contexts](../contexts/README.md) - Global state
