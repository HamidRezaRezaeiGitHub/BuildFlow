# Project Pages

This directory contains page components related to project management functionality.

## Summary

The project pages directory contains route-level components for project-related views, such as creating new projects, viewing project details, and managing project information.

## Files Structure

```
project/
├── NewProject.tsx       # New project creation page
├── ProjectDetails.tsx   # Project details view page
└── index.ts             # Page exports
```

## Page Details

### NewProject.tsx
**Purpose:** Full page for creating new construction projects with integrated backend API.

**Route:** `/projects/new` (protected route, requires authentication)

**Backend Integration:** ✅ **FULLY INTEGRATED**
- Calls `ProjectService.createProject(request, token)` 
- Endpoint: `POST /api/v1/projects`
- Request: `CreateProjectRequest` with userId, isBuilder, locationRequestDto
- Response: `CreateProjectResponse` with created project details
- Error handling: Structured errors from `ApiService` with user-friendly messages

**Features:**
- **Page Layout:**
  - Mobile-first design with StandardBottomNavbar
  - Centered card layout with responsive padding
  - Page header with title and description
  - Card wrapper for form content

- **Form Integration:**
  - NewProjectForm component with inline mode
  - Address input via FlexibleAddressForm
  - Validation and error handling
  - Loading states during submission (isSubmitting)
  - Cancel functionality to navigate back

- **Success Handling:**
  - Success message displayed in green alert banner
  - Shows created project ID
  - Automatic redirect to /projects or /dashboard after 2 seconds
  - Console logging for debugging

- **Error Handling:**
  - Catches and displays API errors
  - Red destructive alert banner for errors
  - User-friendly error messages
  - Console logging for debugging
  - Network error handling

**Page Structure:**
```typescript
<div className="min-h-screen bg-background pb-20">
  <section className="py-8 bg-background">
    <div className="mx-auto max-w-screen-2xl px-4 lg:px-8">
      {/* Page Header */}
      <div className="text-center space-y-4 mb-16">
        <h1>Create New Project</h1>
        <p>Description text</p>
      </div>

      {/* Success Message */}
      {successMessage && <div className="bg-green-500/10 border border-green-500/20">...</div>}

      {/* Error Message */}
      {error && <div className="bg-destructive/10 border border-destructive/20">...</div>}

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <NewProjectForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            submittingText="Creating Project..."
            inline={true}
          />
        </CardContent>
      </Card>
    </div>
  </section>
  <StandardBottomNavbar />
</div>
```

**Data Flow:**
```
User Input → NewProjectForm → handleSubmit(request)
                                       ↓
                        Validate token exists
                                       ↓
                    ProjectService.createProject(request, token)
                                       ↓
                                Backend API (POST /api/v1/projects)
                                       ↓
                              Success/Error Response
                                       ↓
        Success: Show message → Wait 2s → Navigate to /projects or /dashboard
        Error: Display error message in red banner
```

**Components Used:**
- `StandardBottomNavbar` - Mobile-first bottom navigation
- `NewProjectForm` - Project creation form with address input
- `Card`, `CardHeader`, `CardTitle`, `CardContent` - UI components from shadcn/ui
- `useAuth` hook - For authentication token
- `useNavigate` hook from react-router-dom - For navigation

**Implementation Details:**
```typescript
const NewProject: React.FC = () => {
  const navigate = useReactRouterNavigate();
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const handleSubmit = async (request: CreateProjectRequest) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (!token) {
        throw new Error('You must be logged in to create a project');
      }

      console.log('Creating project with request:', request);
      const response = await projectService.createProject(request, token);
      
      console.log('Project created successfully:', response);
      setSuccessMessage(`Project created successfully! Project ID: ${response.project.id}`);
      
      // Navigate after 2 seconds delay
      setTimeout(() => {
        navigate('/projects'); // or fallback to /dashboard
      }, 2000);
      
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  // ... render JSX
};
```

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

---

### ProjectDetails.tsx
**Purpose:** Full page for viewing detailed information about a specific project.

**Route:** `/projects/:id` (protected route, requires authentication)

**Backend Integration:** ✅ **FULLY INTEGRATED**
- Calls `ProjectService.getProjectById(projectId, token)`
- Endpoint: `GET /api/v1/projects/{projectId}`
- Response: `ProjectDto` with full project details including location
- Error handling: Structured errors from `ApiService` with user-friendly messages
- Supports mock mode with `findProjectById()` from MockProjects

**Features:**
- **Page Layout:**
  - Mobile-first responsive design
  - Clean card-based layout
  - Header with project address as title
  - Quick action buttons (Back, Edit, Delete)
  
- **Data Display:**
  - Project summary card (builder ID, owner ID, timestamps)
  - Location section with full address details
  - Participants section (builder and owner information)
  - Tabbed interface for future sections (Estimates, Work Items)
  
- **State Management:**
  - Loading state with skeleton placeholders
  - Error state with retry option
  - Success state with complete project information
  - URL parameter extraction via `useParams`

- **Navigation:**
  - Back button to return to dashboard
  - Direct URL access supported (e.g., /projects/1)
  - Deep linking compatible
  
**Data Flow:**
```
URL Parameter (:id) → useParams → ProjectService.getProjectById(id, token)
                                              ↓
                                        Backend API (GET /api/v1/projects/{id})
                                              ↓
                                        Success/Error Response
                                              ↓
        Success: Display project details with all sections
        Error: Display error message with retry option
```

**Components Used:**
- `Card`, `CardHeader`, `CardTitle`, `CardContent` - UI components from shadcn/ui
- `Button` - Action buttons
- `Skeleton` - Loading placeholders
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` - Tabbed interface
- `useAuth` hook - For authentication token
- `useParams` hook from react-router-dom - For URL parameters
- `useNavigate` hook from react-router-dom - For navigation

**Implementation Details:**
```typescript
export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useReactRouterNavigate();
  const { token } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        setError('Project ID is required');
        setIsLoading(false);
        return;
      }

      if (!token) {
        setError('Authentication required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const projectService = new ProjectServiceWithAuth(() => token);
        const fetchedProject = await projectService.getProjectById(id);
        setProject(fetchedProject);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, token]);

  // ... render JSX
};
```

**Page Structure:**
```typescript
<div className="min-h-screen bg-background pb-20">
  <section className="py-8 bg-background">
    <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
      {/* Header Section */}
      <div className="mb-6">
        <h1>{getShortAddress(project)}</h1>
        <div className="flex gap-2">
          <Button onClick={handleBack}>Back</Button>
          <Button onClick={handleEdit}>Edit</Button>
          <Button onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader><CardTitle>Project Summary</CardTitle></CardHeader>
        <CardContent>{/* Builder ID, Owner ID, timestamps */}</CardContent>
      </Card>

      {/* Location Section */}
      <Card>
        <CardHeader><CardTitle>Location</CardTitle></CardHeader>
        <CardContent>{/* Full address details */}</CardContent>
      </Card>

      {/* Participants Section */}
      <Card>
        <CardHeader><CardTitle>Project Participants</CardTitle></CardHeader>
        <CardContent>{/* Builder and Owner info */}</CardContent>
      </Card>

      {/* Future Tabs Section */}
      <Card>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="estimates">Estimates</TabsTrigger>
            <TabsTrigger value="workitems">Work Items</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">{/* Placeholder */}</TabsContent>
          <TabsContent value="estimates">{/* Placeholder */}</TabsContent>
          <TabsContent value="workitems">{/* Placeholder */}</TabsContent>
        </Tabs>
      </Card>
    </div>
  </section>
</div>
```

**Usage Example:**
```typescript
import { ProjectDetails } from '@/pages/project';

// In AppRouter
<Route 
  path="/projects/:id" 
  element={
    <ProtectedRoute>
      <ProjectDetails />
    </ProtectedRoute>
  } 
/>
```

**Props:** None (page-level component, uses URL parameters)

**Navigation Integration:**
- ProjectList navigates to this page on project card click
- Direct URL access: `/projects/1`, `/projects/2`, etc.
- Back button returns to dashboard
- Edit/Delete actions show placeholder alerts (future implementation)

**Loading States:**
1. **Loading:** Skeleton placeholders for header and content cards
2. **Error:** Error card with message and retry/back buttons
3. **Success:** Full project details with all sections visible

**Testing:**
```typescript
test('ProjectDetails_shouldDisplayProjectInfo_whenFetchSucceeds', async () => {
  mockGetProjectById.mockResolvedValue(mockProject);
  
  renderWithRouterAndParams('1');
  
  await waitFor(() => {
    expect(screen.getByText(/123 Main St, Vancouver/i)).toBeInTheDocument();
  });
  
  expect(screen.getByText(/Project Summary/i)).toBeInTheDocument();
  expect(screen.getByText(/Location/i)).toBeInTheDocument();
});

test('ProjectDetails_shouldDisplayError_whenFetchFails', async () => {
  mockGetProjectById.mockRejectedValue(new Error('Failed to load project'));
  
  renderWithRouterAndParams('1');
  
  await waitFor(() => {
    expect(screen.getByText(/Error Loading Project/i)).toBeInTheDocument();
  });
});
```

## Route Protection

All project pages are protected and require authentication:
```typescript
<ProtectedRoute>
  <NewProject />
</ProtectedRoute>

<ProtectedRoute>
  <ProjectDetails />
</ProtectedRoute>
```
