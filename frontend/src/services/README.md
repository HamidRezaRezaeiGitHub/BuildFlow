# Services Directory

This directory contains all API services, business logic, and data transfer objects for backend communication.

## Summary

The services directory provides the data layer for the BuildFlow frontend, containing service classes that communicate with the backend API, DTOs that define data structures, validation services, and helper utilities. Services follow a consistent pattern for API calls, error handling, and data transformation.

## Files Structure

```
services/
├── admin/                     # Admin service (Factory Pattern)
│   ├── IAdminService.ts      # Admin service interface
│   ├── AdminService.ts       # Real backend implementation
│   ├── AdminMockService.ts   # Mock implementation for standalone dev
│   ├── adminServiceFactory.ts # Factory creating correct implementation
│   └── README.md             # Admin service documentation
├── auth/                      # Authentication service (Factory Pattern)
│   ├── IAuthService.ts       # Authentication service interface
│   ├── AuthService.ts        # Real backend implementation
│   ├── AuthMockService.ts    # Mock implementation for standalone dev
│   ├── authServiceFactory.ts # Factory creating correct implementation
│   └── README.md             # Authentication service documentation
├── project/                   # Project service (Factory Pattern)
│   ├── IProjectService.ts    # Project service interface
│   ├── ProjectService.ts     # Real backend implementation
│   ├── ProjectMockService.ts # Mock implementation for standalone dev
│   ├── projectServiceFactory.ts # Factory creating correct implementation
│   └── README.md             # Project service documentation
├── dtos/                      # Data Transfer Objects
│   ├── AddressDtos.ts        # Address data structures and base types
│   ├── AuthDtos.ts           # Authentication data structures
│   ├── EstimateDtos.ts       # Estimate data structures
│   ├── MvcDtos.ts            # MVC response wrappers
│   ├── PaginationDtos.ts     # Pagination data structures
│   ├── ProjectDtos.ts        # Project data structures
│   ├── QuoteDtos.ts          # Quote data structures
│   ├── UserDtos.ts           # User data structures
│   ├── WorkItemDtos.ts       # Work item data structures
│   └── index.ts              # DTO exports
├── validation/               # Validation service and hooks
│   └── README.md            # Comprehensive validation documentation
├── ApiService.tsx            # Base HTTP client and API utilities
├── TimerService.ts           # Timer utility service
├── apiHelpers.ts             # API helper functions
└── index.ts                  # Service exports
```

## Service Details

### ApiService.tsx
**Purpose:** Base HTTP client and API request utilities.

**Features:**
- Axios-based HTTP client
- Request/response interceptors
- Error handling middleware
- Token management
- Base URL configuration
- Mock data integration (dev mode)

**Key Functions:**
```typescript
class ApiService {
  // HTTP methods
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>
  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>
  
  // Token management
  setAuthToken(token: string): void
  clearAuthToken(): void
  
  // Configuration
  setBaseURL(url: string): void
}
```

**Usage:**
```typescript
import { apiService } from '@/services/ApiService';

const data = await apiService.get<User[]>('/users');
const result = await apiService.post<Project>('/projects', projectData);
```

### auth/ - Authentication Service (Factory Pattern)
**Purpose:** User authentication, registration, and session management using clean architecture.

**[📖 Full Documentation](auth/README.md)**

**Architecture:**
- **Interface (`IAuthService`)** - Defines authentication contract
- **Real Implementation (`AuthService`)** - Makes HTTP calls to backend
- **Mock Implementation (`AuthMockService`)** - Uses local mock data
- **Factory (`authServiceFactory`)** - Creates correct implementation based on config

**Features:**
- User login/logout
- User registration
- Token validation and refresh
- Session persistence
- Admin user creation
- Environment-aware (switches between mock and real based on `config.enableMockAuth`)

**Usage:**
```typescript
import { authService } from '@/services';

// Factory automatically provides the right implementation
const response = await authService.login({
  username: 'admin',
  password: 'password123'
});

const user = await authService.getCurrentUser(token);
```

### admin/ - Admin Service (Factory Pattern)
**Purpose:** Administrative operations, user management, and system monitoring using clean architecture.

**[📖 Full Documentation](admin/README.md)**

**Architecture:**
- **Interface (`IAdminService`)** - Defines admin service contract
- **Real Implementation (`AdminService`)** - Makes HTTP calls to backend
- **Mock Implementation (`AdminMockService`)** - Uses local mock data
- **Factory (`adminServiceFactory`)** - Creates correct implementation based on config

**Features:**
- User management (CRUD operations)
- User authentication record retrieval
- Combined user details (User + UserAuthentication)
- User statistics calculation
- Admin user creation
- Environment-aware (switches between mock and real based on `config.enableMockAuth`)

**Usage:**
```typescript
import { adminService } from '@/services';

// Get all users
const users = await adminService.getAllUsers(token);

// Get user details (User + Auth combined)
const userDetails = await adminService.getUserDetails('username', token);

// Calculate statistics
const stats = adminService.calculateUserStats(userDetailsList);
```

### project/ - Project Service (Factory Pattern)
**Purpose:** Project management operations using clean architecture.

**[📖 Full Documentation](project/README.md)**

**Architecture:**
- **Interface (`IProjectService`)** - Defines project service contract
- **Real Implementation (`ProjectService`)** - Makes HTTP calls to backend
- **Mock Implementation (`ProjectMockService`)** - Uses local mock data
- **Factory (`projectServiceFactory`)** - Creates correct implementation based on config

**Features:**
- Create new projects
- Retrieve projects by user ID (paginated)
- Fetch individual project details
- Zero runtime conditionals (factory pattern)
- Aligned with simplified backend API

**Backend Integration:**
- Endpoint: `POST /api/v1/projects` for project creation
- Endpoint: `GET /api/v1/projects/user/{userId}` for user's projects
- Requires JWT authentication token
- Supports pagination with headers

**Usage:**
```typescript
import { ProjectServiceWithAuth } from '@/services/project/projectServiceFactory';
import { useAuth } from '@/contexts/AuthContext';

const { getToken } = useAuth();
const projectService = new ProjectServiceWithAuth(getToken);

// Create a project (token auto-injected)
const response = await projectService.createProject(request);

// Get projects for user (paginated, token auto-injected)
const projects = await projectService.getProjectsByUserId(userId, params);
```

**Migration Note:** This service was refactored from a monolithic file to factory pattern, removing outdated builder/owner-specific endpoints and aligning with the current backend API.

### dtos/ - Data Transfer Objects}
```

**Mock Data Integration:**
- Uses `MockProjects.ts` when `config.enableMockData = true`
- Simulates network delays (300-500ms for pagination, 500ms for creation)
- Stores mock projects in memory
- Supports pagination simulation
- Realistic Canadian project data

**Usage:**
```typescript
import { projectService } from '@/services/ProjectService';

// Create project (requires token)
const response = await projectService.createProject({
  userId: '123e4567-e89b-12d3-a456-426614174000',
  isBuilder: true,
  locationRequestDto: {
    unitNumber: '101',
    streetNumberAndName: '123 Main St',
    city: 'Toronto',
    stateOrProvince: 'ON',
    postalOrZipCode: 'M5V 3A8',
    country: 'Canada'
  }
}, token);

// Get paginated builder's projects
const pagedProjects = await projectService.getProjectsByBuilderIdPaginated(
  builderId,
  token,
  { page: 0, size: 25, orderBy: 'lastUpdatedAt', direction: 'DESC' }
);

// Usage with AuthContext wrapper (recommended)
import { ProjectServiceWithAuth } from '@/services/ProjectService';
import { useAuth } from '@/contexts/AuthContext';

const { token } = useAuth();
const projectServiceWithAuth = new ProjectServiceWithAuth(() => token);

// No need to pass token manually
const response = await projectServiceWithAuth.createProject(request);
```

### AdminService.tsx
**Purpose:** Admin-only operations for user and system management.

**Features:**
- Get all users
- Get user by ID
- Update user details
- Delete user
- Change user role
- System statistics

**Key Functions:**
```typescript
class AdminService {
  getAllUsers(): Promise<User[]>
  getUserById(id: string): Promise<User>
  updateUser(id: string, updates: UserUpdateDto): Promise<User>
  deleteUser(id: string): Promise<void>
  changeUserRole(id: string, newRole: UserRole): Promise<User>
  getSystemStats(): Promise<SystemStats>
}
```

**Access Control:**
- Requires ADMIN role
- Token must include admin permissions
- Returns 403 for non-admin users

**Usage:**
```typescript
import { AdminService } from '@/services/AdminService';

// Get all users (admin only)
const users = await AdminService.getAllUsers();

// Update user
await AdminService.updateUser('123', {
  firstName: 'Jane',
  role: 'PREMIUM_USER'
});
```

### TimerService.ts
**Purpose:** Timer and scheduling utilities.

**Features:**
- Debouncing
- Throttling
- Delayed execution
- Interval management
- Timer cleanup

**Key Functions:**
```typescript
class TimerService {
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void
  
  throttle<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void
  
  delay(ms: number): Promise<void>
}
```

**Usage:**
```typescript
import { TimerService } from '@/services/TimerService';

// Debounced search
const debouncedSearch = TimerService.debounce(
  (query: string) => performSearch(query),
  300
);

// Throttled scroll handler
const throttledScroll = TimerService.throttle(
  () => handleScroll(),
  100
);
```

### apiHelpers.ts
**Purpose:** Helper utilities for API operations.

**Features:**
- Response transformation
- Error parsing
- Query parameter building
- URL construction
- Date formatting

**Key Functions:**
```typescript
// Build query string
buildQueryString(params: Record<string, any>): string

// Parse API errors
parseApiError(error: AxiosError): string

// Transform response
transformResponse<T>(response: AxiosResponse): T

// Format date for API
formatDateForApi(date: Date): string
```

## Data Transfer Objects (DTOs)

See [dtos/README.md](./dtos/README.md) for detailed DTO documentation.

**DTO Categories:**
- **AddressDtos** - Address data structures and base types (UpdatableEntityDto)
- **AuthDtos** - Login, signup, auth responses
- **EstimateDtos** - Estimate, EstimateGroup, and EstimateLine data structures
- **MvcDtos** - Spring MVC response wrappers
- **PaginationDtos** - Paginated response structures
- **ProjectDtos** - Project creation and data
- **QuoteDtos** - Quote and QuoteLocation data structures
- **UserDtos** - User profiles and updates
- **WorkItemDtos** - Work item creation and data

## Validation Service

See [validation/README.md](./validation/README.md) for comprehensive validation documentation.

**Validation Features:**
- Field validation rules
- Form validation
- Smart validation hooks
- Autofill detection
- Touch-based validation UX

## Service Patterns

### Singleton Pattern
Services are exported as singleton instances:
```typescript
class MyService {
  // Service implementation
}

export const myService = new MyService();
```

### Error Handling
Consistent error handling across services:
```typescript
try {
  const data = await apiService.get('/endpoint');
  return data;
} catch (error) {
  console.error('Operation failed:', error);
  throw new Error('User-friendly error message');
}
```

### Mock Integration
Services check configuration for mock mode:
```typescript
async getData() {
  if (config.enableMockData) {
    return mockData;
  }
  
  return await apiService.get('/api/data');
}
```

### Type Safety
All services use TypeScript with strict typing:
```typescript
async getUser(id: string): Promise<User> {
  return await apiService.get<User>(`/users/${id}`);
}
```

## Development Guidelines

### Adding New Services
1. Create service class file
2. Define TypeScript interfaces
3. Implement service methods
4. Add error handling
5. Add mock data support
6. Write comprehensive tests
7. Export from index.ts
8. Update this README

### Service Method Pattern
```typescript
class MyService {
  private baseUrl = '/api/resource';
  
  async getAll(): Promise<Resource[]> {
    // Mock check
    if (config.enableMockData) {
      return mockResources;
    }
    
    // API call
    try {
      const response = await apiService.get<Resource[]>(this.baseUrl);
      return response;
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      throw error;
    }
  }
}
```

## Related Documentation

- [DTOs](./dtos/README.md) - Data transfer object definitions
- [Validation](./validation/README.md) - Validation service and hooks
- [API Configuration](../config/README.md) - Environment configuration
- [Mock Data](../mocks/README.md) - Mock data for development
- [Contexts](../contexts/README.md) - Context integration
