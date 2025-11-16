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
**Purpose:** Full page for creating new construction projects with a multi-step accordion flow and integrated backend API.

**Route:** `/projects/new` (protected route, requires authentication)

**Backend Integration:** ✅ **FULLY INTEGRATED**
- Calls `projectService.createProject(request, token)` 
- Endpoint: `POST /api/v1/projects`
- Request: `CreateProjectRequest` with userId, isBuilder, locationRequest
- Response: `CreateProjectResponse` with created project details
- Error handling: Structured errors from `ApiService` with user-friendly messages

**Features:**
- **Multi-Step Accordion Flow:**
  - **Step 1: User Role Selection** - User identifies as builder or owner
  - **Step 2: Other Party Information** - Optional contact details for the other party (owner if user is builder, builder if user is owner)
  - **Step 3: Project Location** - Required address information for the construction site
  - Controlled accordion (one step open at a time)
  - State persistence across steps (navigating back retains entered values)
  - Clear progress indication with numbered step headers

- **Navigation:**
  - Step 1 & 2: **Next** and **Previous** buttons (Previous hidden on Step 1)
  - Step 3: **Previous**, **Cancel**, and **Create Project** buttons
  - Programmatic focus management for accessibility
  - Cancel confirmation modal to prevent accidental data loss

- **Validation:**
  - Blocking validation for required fields in Steps 1 & 3
  - Step 2 fields remain optional (no blocking validation)
  - Inline validation messages for required fields
  - Disabled "Next"/"Create Project" buttons when validation fails
  - Required fields: streetNumberAndName, city, stateOrProvince, country
  - Optional fields: unitNumber, postalOrZipCode, and all Step 2 fields

- **Page Layout:**
  - Mobile-first design with StandardBottomNavbar
  - Centered card layout with responsive padding
  - Page header with title and description
  - Accordion-based multi-step form within card

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
        <p>Follow the steps below to set up your new construction project.</p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && <SuccessAlert />}
      {error && <ErrorAlert />}
      {showCancelConfirm && <CancelConfirmationModal />}

      {/* Multi-Step Accordion Form */}
      <Card>
        <CardHeader>New Project Setup</CardHeader>
        <CardContent>
          <Accordion type="single" value={activeStep} onValueChange={setActiveStep}>
            {/* Step 1: User Role */}
            <AccordionItem value="step-1">
              <AccordionTrigger>
                <StepHeader number={1} title="Your Role" />
              </AccordionTrigger>
              <AccordionContent>
                <RoleSelection />
                <NextButton />
              </AccordionContent>
            </AccordionItem>

            {/* Step 2: Other Party Information */}
            <AccordionItem value="step-2">
              <AccordionTrigger>
                <StepHeader number={2} title="Owner/Builder Information" />
              </AccordionTrigger>
              <AccordionContent>
                <OtherPartyInlineForm />
                <PreviousButton /> <NextButton />
              </AccordionContent>
            </AccordionItem>

            {/* Step 3: Project Location */}
            <AccordionItem value="step-3">
              <AccordionTrigger>
                <StepHeader number={3} title="Project Location" />
              </AccordionTrigger>
              <AccordionContent>
                <FlexibleAddressForm />
                <PreviousButton /> <CancelButton /> <CreateProjectButton />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  </section>
  <StandardBottomNavbar />
</div>
```

**Data Flow:**
```
Step 1: User Role Selection (Builder/Owner)
                    ↓
Step 2: Other Party Info (Optional - Owner if Builder, Builder if Owner)
                    ↓
Step 3: Project Location (Required Address Fields)
                    ↓
         Validate Location Fields
                    ↓
       Create CreateProjectRequest
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
- `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` - Multi-step UI from shadcn/ui
- `FlexibleSignUpForm` - Inline form for optional other party information capture
- `FlexibleAddressForm` - Project location address input
- `StandardBottomNavbar` - Mobile-first bottom navigation
- `Card`, `CardHeader`, `CardTitle`, `CardContent` - UI components from shadcn/ui
- `Button` - Navigation and action buttons
- `useAuth` hook - For authentication token and user info
- `useNavigate` hook from react-router-dom - For navigation

**Form State Management:**
```typescript
interface OtherPartyFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface MultiStepFormState {
  userRole: 'builder' | 'owner';           // Step 1
  otherParty: OtherPartyFormData;          // Step 2 (optional)
  projectLocation: AddressData;            // Step 3 (required)
}

// Single source of truth - state persists across steps
const [formData, setFormData] = useState<MultiStepFormState>({
  userRole: 'builder',
  otherParty: {
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  },
  projectLocation: createEmptyAddress()
});

// Controlled accordion for step navigation
const [activeStep, setActiveStep] = useState<string>('step-1');
```

**Step Navigation:**
```typescript
// Navigate to next step
const handleNext = (currentStep: string) => {
  const nextStep = getNextStep(currentStep);
  setActiveStep(nextStep);
  // Focus management for accessibility
  focusStepHeading(nextStep);
};

// Navigate to previous step
const handlePrevious = (currentStep: string) => {
  const prevStep = getPreviousStep(currentStep);
  setActiveStep(prevStep);
  focusStepHeading(prevStep);
};
```

**Validation Logic:**
```typescript
// Step 3 validation (required address fields)
const validateAddress = (address: AddressData) => {
  const requiredFields: (keyof AddressData)[] = [
    'streetNumberAndName', 'city', 'stateOrProvince', 'country'
  ];
  return requiredFields.every(field => 
    address[field] && address[field].trim().length > 0
  );
};

// Enable/disable Create Project button
const isFormValid = isLocationValid;
```

**Keyboard & Accessibility:**
- Accordion is keyboard navigable (arrow keys, Enter/Space to toggle)
- ARIA attributes on accordion triggers and regions
- Accessible button names and roles
- Focus moves to active step heading on navigation
- Touch-friendly controls for mobile
- Proper ARIA pressed states on role selection buttons

**Implementation Details:**
```typescript
export const NewProject: React.FC = () => {
  const navigate = useReactRouterNavigate();
  const { user, token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [activeStep, setActiveStep] = useState<string>('step-1');
  
  const [formData, setFormData] = useState<MultiStepFormState>({
    userRole: 'builder',
    otherParty: createEmptyOtherPartyFormData(),
    projectLocation: createEmptyAddress()
  });

  const handleSubmit = async () => {
    if (!user || !token) {
      setError('You must be logged in to create a project');
      return;
    }

    if (!isLocationValid) {
      setError('Please complete all required address fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const createRequest: CreateProjectRequest = {
        userId: user.id,
        isBuilder: formData.userRole === 'builder',
        locationRequest: formData.projectLocation
      };

      const response = await projectService.createProject(createRequest, token);
      setSuccessMessage(`Project created successfully! Project ID: ${response.project.id}`);
      
      setTimeout(() => {
        navigate('/projects');
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowCancelConfirm(true);  // Show confirmation modal
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

**Testing:**
```typescript
test('NewProject_shouldRenderAccordionSteps_whenPageLoads', () => {
  render(<NewProject />);
  
  expect(screen.getByText(/Your Role/i)).toBeInTheDocument();
  expect(screen.getByText(/Owner Information/i)).toBeInTheDocument();
  expect(screen.getByText(/Project Location/i)).toBeInTheDocument();
});

test('NewProject_shouldPersistState_whenNavigatingBetweenSteps', async () => {
  render(<NewProject />);
  
  // Select role
  await userEvent.click(screen.getByRole('button', { name: /Builder/i }));
  
  // Navigate to Step 2
  await userEvent.click(screen.getByRole('button', { name: /Next/i }));
  
  // Navigate back to Step 1
  await userEvent.click(screen.getByRole('button', { name: /Previous/i }));
  
  // Role selection should be preserved
  expect(screen.getByRole('button', { name: /Builder/i }))
    .toHaveAttribute('aria-pressed', 'true');
});

test('NewProject_shouldDisableCreateButton_whenRequiredFieldsEmpty', async () => {
  render(<NewProject />);
  
  // Navigate to Step 3
  // ... (navigation steps)
  
  const createButton = screen.getByRole('button', { name: /Create Project/i });
  expect(createButton).toBeDisabled();
});
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
- [ProjectService](../../services/project/README.md) - Backend integration
- [Project Types](../../services/project/ProjectDtos.ts) - Data structures
- [AppRouter](../../contexts/README.md#approuter) - Route configuration

---

### ProjectDetails.tsx
**Purpose:** Full page for viewing detailed information about a specific project.

**Route:** `/projects/:id` (protected route, requires authentication)

**Backend Integration:** ✅ **FULLY INTEGRATED**
- Calls `projectService.getProjectById(projectId, token)`
- Endpoint: `GET /api/v1/projects/{projectId}`
- Response: `Project` with full project details including location
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
