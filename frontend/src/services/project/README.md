# Project Service

Project service implementation using the **Factory Pattern** to cleanly separate mock and real backend implementations.

## Structure

```
project/
├── IProjectService.ts        # Interface defining the project service contract
├── ProjectService.ts         # Real backend API implementation
├── ProjectMockService.ts     # Mock implementation for standalone development
├── projectServiceFactory.ts  # Factory that chooses the right implementation
└── README.md                 # This file
```

## Overview

The project service provides project management operations including creating projects, retrieving user projects, and fetching individual project details. It uses a factory pattern to switch between real backend integration and mock data based on environment configuration.

### Design Pattern: Factory with Interface

- **Interface (`IProjectService`)**: Defines the contract all implementations must follow
- **Real Implementation (`ProjectService`)**: Makes HTTP calls to Spring Boot backend
- **Mock Implementation (`ProjectMockService`)**: Uses local mock data for standalone development
- **Factory (`projectServiceFactory`)**: Creates the appropriate implementation based on `config.enableMockData`

## Backend API Alignment

The service is aligned with the backend API:
- **POST /api/v1/projects** - Create a new project
- **GET /api/v1/projects/user/{userId}** - Get all projects for a user (paginated)
- **GET /api/v1/projects/{projectId}** - Get a single project by ID

## Files

### `IProjectService.ts`
Defines the project service interface with methods for:
- Creating new projects
- Retrieving projects by user ID (paginated)
- Fetching individual project by ID

### `ProjectService.ts`
Real backend implementation:
- Makes HTTP calls via `ApiService` to Spring Boot endpoints
- Handles pagination using headers-based metadata
- Production-ready code with no mock logic
- Only 3 methods aligned with current backend

### `ProjectMockService.ts`
Mock implementation for development:
- Uses mock data from `@/mocks/MockProjects`
- Simulates network delays (300-500ms) for realistic development
- Implements client-side pagination logic
- Enabled when `config.enableMockData = true`

### `projectServiceFactory.ts`
Factory and exports:
- Creates correct service instance based on configuration
- Exports `ProjectServiceWithAuth` wrapper for automatic token injection
- Exports singleton `projectService` for application use
- Exports types and classes for testing

## Usage

### Standard Usage (with Auth Context)

```typescript
import { ProjectServiceWithAuth } from '@/services/project/projectServiceFactory';
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { getToken } = useAuth();
  const projectService = new ProjectServiceWithAuth(getToken);

  // Token is automatically injected
  const response = await projectService.createProject(request);
  const projects = await projectService.getProjectsByUserId(userId, params);
}
```

### Direct Service Usage

```typescript
import { projectService } from '@/services';

// Manual token management required
const response = await projectService.createProject(request, token);
const projects = await projectService.getProjectsByUserId(userId, token, params);
```

### Testing

```typescript
import { vi } from 'vitest';

// Mock the service
vi.mock('@/services', () => ({
  projectService: {
    createProject: vi.fn(),
    getProjectsByUserId: vi.fn(),
    getProjectById: vi.fn(),
  }
}));

// Or import specific implementations
import { ProjectService, ProjectMockService } from '@/services/project/projectServiceFactory';
```

## Configuration

The service automatically switches between implementations based on:

```typescript
// In environment.ts or .env
enableMockData: boolean  // true = ProjectMockService, false = ProjectService
enableConsoleLogs: boolean  // Enables debug logging
```

## Methods

### `createProject(request, token): Promise<CreateProjectResponse>`
Creates a new project with user, role, and location information.

**Backend**: `POST /api/v1/projects`

### `getProjectsByUserId(userId, token, params?): Promise<PagedResponse<Project>>`
Retrieves all projects for a specific user with optional pagination.

**Backend**: `GET /api/v1/projects/user/{userId}`

**Pagination**: Supports page, size, orderBy, and direction parameters.

### `getProjectById(projectId, token): Promise<Project>`
Retrieves a single project by its ID.

**Backend**: `GET /api/v1/projects/{projectId}`

## Migration Notes

This service was migrated from a monolithic `ProjectService.ts` file that mixed mock and real logic with if-else conditionals. The new structure:

1. **Zero runtime conditionals** - Configuration determines which implementation is instantiated at startup
2. **Removed outdated methods** - Eliminated builder-specific, owner-specific, and combined endpoint methods that no longer exist in backend
3. **Simplified to 3 methods** - Aligned with current backend API (create, get by user, get by id)
4. **Clean separation** - Mock and real implementations are completely independent
5. **Type safety** - Interface ensures both implementations maintain the same contract

## Related Files

- `@/mocks/MockProjects.ts` - Mock project data and helper functions
- `@/services/dtos/ProjectDtos.ts` - Project-related TypeScript types
- `@/services/ApiService.ts` - HTTP client used by real implementation
