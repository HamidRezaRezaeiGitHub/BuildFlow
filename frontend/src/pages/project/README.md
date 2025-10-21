# Project Pages

This directory contains page components related to project management functionality.

## Summary

The project pages directory contains route-level components for project-related views, such as creating new projects, viewing project details, and managing project information.

## Files Structure

```
project/
├── NewProject.tsx    # New project creation page
└── index.ts          # Page exports
```

## Page Details

### NewProject.tsx
**Purpose:** Full page for creating new construction projects with form and layout.

**Route:** `/projects/new` (protected route, requires authentication)

**Features:**
- **Page Layout:**
  - DashboardLayout wrapper for consistent navigation
  - Page header with title and breadcrumbs
  - Cancel button to return to projects list

- **Form Integration:**
  - NewProjectForm component
  - Address input via FlexibleAddressForm
  - Validation and error handling
  - Loading states during submission

- **Success Handling:**
  - Success message on project creation
  - Automatic redirect to projects list
  - Option to create another project

- **Error Handling:**
  - Display backend validation errors
  - Network error handling
  - Form-level error messages

**Page Structure:**
```typescript
<DashboardLayout>
  <div className="container mx-auto py-6">
    <Card>
      <CardHeader>
        <CardTitle>Create New Project</CardTitle>
        <CardDescription>
          Add a new construction project to your portfolio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NewProjectForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          enableValidation={true}
        />
      </CardContent>
    </Card>
  </div>
</DashboardLayout>
```

**Data Flow:**
```
User Input → NewProjectForm → Validation → ProjectService.createProject()
                                                      ↓
                                               Backend API
                                                      ↓
                                            Success/Error Response
                                                      ↓
                                      Navigate to Projects List
```

**Components Used:**
- `DashboardLayout` - Page layout wrapper
- `NewProjectForm` - Project creation form
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` - UI components

**Usage Example:**
```typescript
import { NewProject } from '@/pages/project';

// In AppRouter
<Route 
  path="/projects/new" 
  element={
    <ProtectedRoute>
      <NewProject />
    </ProtectedRoute>
  } 
/>
```

**Props:** None (page-level component)

**Success Handler:**
```typescript
const handleSuccess = (project: Project) => {
  // Show success toast/notification
  toast.success('Project created successfully!');
  
  // Navigate to projects list or project details
  navigate('/dashboard'); // or navigate(`/projects/${project.id}`)
};
```

**Cancel Handler:**
```typescript
const handleCancel = () => {
  // Return to previous page or dashboard
  navigate(-1); // or navigate('/dashboard')
};
```

## Route Protection

This page is protected and requires authentication:
```typescript
<ProtectedRoute>
  <NewProject />
</ProtectedRoute>
```

**Access Control:**
- Requires authenticated user
- User must have permission to create projects
- Builder and owner roles can create projects
- Admin role can create projects for any user

## State Management

### Local State
The page may manage:
- Form submission loading state
- Success/error messages
- Redirect logic

### Context Integration
Uses contexts for:
- `AuthContext` - Current user information
- `NavigationContext` - Route navigation
- `ThemeContext` - Theme consistency

## Testing Considerations

Page should be tested for:
- Rendering with DashboardLayout
- NewProjectForm integration
- Success flow and redirect
- Cancel flow and navigation
- Authentication requirement
- Loading states
- Error handling

**Test Example:**
```typescript
test('NewProject_shouldRenderForm_whenPageLoads', () => {
  render(<NewProject />);
  
  expect(screen.getByRole('heading', { name: /create new project/i }))
    .toBeInTheDocument();
  expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
});

test('NewProject_shouldNavigateToDashboard_whenProjectCreated', async () => {
  const mockNavigate = jest.fn();
  jest.mock('@/contexts/NavigationContext', () => ({
    useNavigation: () => ({ navigate: mockNavigate })
  }));
  
  render(<NewProject />);
  
  // Fill form and submit
  fireEvent.change(screen.getByLabelText(/project name/i), {
    target: { value: 'New Project' }
  });
  fireEvent.click(screen.getByRole('button', { name: /create project/i }));
  
  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
```

## Future Enhancements

Potential additions to this directory:
- `ProjectDetails.tsx` - View project details
- `EditProject.tsx` - Edit existing project
- `ProjectList.tsx` - List all projects (if moved from components)
- `ProjectSettings.tsx` - Project settings page

## Related Documentation

- [NewProjectForm Component](../../components/project/README.md#newprojectformtsx) - Form component used in this page
- [DashboardLayout](../../components/dashboard/README.md) - Layout wrapper
- [ProjectService](../../services/README.md#projectservice) - Backend integration
- [Project DTOs](../../services/dtos/README.md#projectdtos) - Data structures
- [AppRouter](../../contexts/README.md#approuter) - Route configuration
