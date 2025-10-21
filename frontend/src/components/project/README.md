# Project Components

This directory contains components for project management functionality including project creation, listing, and display.

## Summary

The project components provide the user interface for managing construction projects. These components handle project creation through forms, display project lists, and organize projects in sections. They integrate with the ProjectService for backend communication and support both builder and owner project views.

## Files Structure

```
project/
├── NewProjectForm.tsx        # Project creation form
├── ProjectList.tsx           # Project cards display
├── ProjectList.test.tsx      # Project list tests
├── ProjectsSection.tsx       # Projects section container
├── ProjectsSection.test.tsx  # Projects section tests
└── index.ts                  # Component exports
```

## Component Details

### NewProjectForm.tsx
**Purpose:** Form for creating new construction projects.

**Features:**
- **Project Information Fields:**
  - Project name/title
  - Project description
  - Builder selection (for admins)
  - Owner selection (for admins)
  
- **Address Integration:**
  - FlexibleAddressForm for project location
  - Address validation
  - Canadian address support
  
- **Form Validation:**
  - Required field validation
  - Name length validation
  - Description validation
  - Address completeness check

- **Submission Handling:**
  - Creates project via ProjectService
  - Shows loading states
  - Displays success/error messages
  - Redirects to project list on success

**Props:**
```typescript
interface NewProjectFormProps {
  onSuccess?: (project: Project) => void;
  onCancel?: () => void;
  className?: string;
  enableValidation?: boolean;
}
```

**Usage:**
```typescript
import { NewProjectForm } from '@/components/project';

const NewProjectPage = () => (
  <NewProjectForm
    onSuccess={(project) => navigate(`/projects/${project.id}`)}
    onCancel={() => navigate('/projects')}
    enableValidation={true}
  />
);
```

**Form Fields:**
- Project Name (required, 3-100 characters)
- Description (optional, max 500 characters)
- Builder (auto-filled for non-admin users)
- Owner (auto-filled for non-admin users)
- Address (FlexibleAddressForm with full address fields)

### ProjectList.tsx
**Purpose:** Displays a list of projects as cards in a responsive grid.

**Features:**
- **Project Cards:**
  - Project name and description
  - Location display
  - Builder and owner information
  - Project status badge
  - Click to view details

- **Responsive Grid:**
  - 1 column on mobile
  - 2 columns on tablet
  - 3 columns on desktop
  - Auto-adjusts based on screen size

- **Empty State:**
  - Friendly message when no projects
  - Call-to-action to create first project
  - Icon and description

- **Loading State:**
  - Skeleton cards during data fetch
  - Smooth loading transitions

**Props:**
```typescript
interface ProjectListProps {
  projects: Project[];
  loading?: boolean;
  onProjectClick?: (project: Project) => void;
  emptyMessage?: string;
  className?: string;
}
```

**Usage:**
```typescript
import { ProjectList } from '@/components/project';

const ProjectsPage = () => {
  const { projects, loading } = useProjects();

  return (
    <ProjectList
      projects={projects}
      loading={loading}
      onProjectClick={(project) => navigate(`/projects/${project.id}`)}
      emptyMessage="No projects found. Create your first project!"
    />
  );
};
```

**Card Information Displayed:**
- Project title
- Project description (truncated if long)
- Full address
- Builder name
- Owner name
- Creation date
- Status indicator

### ProjectsSection.tsx
**Purpose:** Container component organizing projects by builder or owner with filtering.

**Features:**
- **View Modes:**
  - My Projects (as builder)
  - Client Projects (as owner)
  - All Projects (admin view)

- **Filtering:**
  - Filter by builder
  - Filter by owner
  - Filter by status
  - Search by name

- **Actions:**
  - Create new project button
  - Refresh projects
  - Filter controls
  - Sort options

- **Header:**
  - Section title
  - Project count
  - Action buttons
  - Filter controls

**Props:**
```typescript
interface ProjectsSectionProps {
  viewMode?: 'builder' | 'owner' | 'all';
  showCreateButton?: boolean;
  onCreateProject?: () => void;
  className?: string;
}
```

**Usage:**
```typescript
import { ProjectsSection } from '@/components/project';

// Builder's projects
<ProjectsSection 
  viewMode="builder" 
  showCreateButton={true}
  onCreateProject={() => navigate('/projects/new')}
/>

// Owner's projects
<ProjectsSection 
  viewMode="owner" 
  showCreateButton={false}
/>

// Admin view (all projects)
<ProjectsSection 
  viewMode="all" 
  showCreateButton={true}
/>
```

**Section Features:**
- Automatic data fetching based on view mode
- Loading states
- Error handling
- Empty states
- Responsive layout

## Data Flow

### Project Creation Flow
```
User Input → NewProjectForm → Validation → ProjectService.createProject() → Backend API
                                                     ↓
                                              Success/Error
                                                     ↓
                                         Update Project List
```

### Project Display Flow
```
Page Load → ProjectsSection → ProjectService.getProjects() → Backend API
                                       ↓
                                  Project Data
                                       ↓
                                  ProjectList
                                       ↓
                                  Project Cards
```

## Integration Points

### ProjectService
Uses ProjectService for all backend operations:
```typescript
import { ProjectService } from '@/services/ProjectService';

// Create project
const project = await ProjectService.createProject(createProjectDto);

// Get projects by builder
const projects = await ProjectService.getProjectsByBuilderId(builderId);

// Get projects by owner
const projects = await ProjectService.getProjectsByOwnerId(ownerId);
```

### Project DTOs
Uses type-safe data transfer objects:
```typescript
import { 
  Project, 
  CreateProjectRequestDto, 
  LocationRequestDto 
} from '@/services/dtos';
```

### Address Components
Integrates FlexibleAddressForm for location entry:
```typescript
import { FlexibleAddressForm } from '@/components/address';

<FlexibleAddressForm
  addressData={addressData}
  onAddressChange={setAddressData}
  fieldsConfig="full"
  enableValidation={true}
/>
```

### AuthContext
Gets current user for builder/owner assignment:
```typescript
const { user } = useAuth();
```

## Testing

### ProjectList.test.tsx
**Test Coverage:**
- Renders project cards correctly
- Handles empty state
- Shows loading state
- Responds to project clicks
- Responsive grid layout

### ProjectsSection.test.tsx
**Test Coverage:**
- Fetches projects based on view mode
- Displays correct section title
- Shows create button when allowed
- Handles loading and error states
- Filters projects correctly

**Test Patterns:**
```typescript
test('ProjectList_shouldRenderCards_whenProjectsProvided', () => {
  const projects = [mockProject1, mockProject2];
  render(<ProjectList projects={projects} />);
  
  expect(screen.getByText(mockProject1.name)).toBeInTheDocument();
  expect(screen.getByText(mockProject2.name)).toBeInTheDocument();
});

test('ProjectsSection_shouldFetchBuilderProjects_whenViewModeIsBuilder', async () => {
  render(<ProjectsSection viewMode="builder" />);
  
  await waitFor(() => {
    expect(ProjectService.getProjectsByBuilderId).toHaveBeenCalled();
  });
});
```

## Styling Approach

### Card Design
- Clean, modern card design
- Shadow on hover
- Smooth transitions
- Clickable with cursor pointer

### Grid Layout
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {projects.map(project => <ProjectCard key={project.id} {...project} />)}
</div>
```

### Status Badges
- Color-coded status indicators
- Active/Completed/On-hold states
- Icon + text badges

## Usage Example

```typescript
import { 
  NewProjectForm, 
  ProjectList, 
  ProjectsSection 
} from '@/components/project';

// Projects listing page
const ProjectsPage = () => (
  <div className="container mx-auto py-6">
    <ProjectsSection 
      viewMode="builder"
      showCreateButton={true}
      onCreateProject={() => navigate('/projects/new')}
    />
  </div>
);

// New project page
const NewProjectPage = () => (
  <div className="container mx-auto py-6">
    <Card>
      <CardHeader>
        <CardTitle>Create New Project</CardTitle>
      </CardHeader>
      <CardContent>
        <NewProjectForm
          onSuccess={() => navigate('/projects')}
          onCancel={() => navigate('/projects')}
        />
      </CardContent>
    </Card>
  </div>
);
```

## Related Documentation

- [ProjectService](../../services/README.md#projectservice) - Project API service
- [Project DTOs](../../services/dtos/README.md#projectdtos) - Project data structures
- [Address Components](../address/README.md) - Address form integration
- [New Project Page](../../pages/project/NewProject.tsx) - Complete page example
- [Dashboard](../dashboard/README.md) - Projects section in dashboard
