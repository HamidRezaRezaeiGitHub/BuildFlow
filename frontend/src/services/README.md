# Services Directory

This directory contains all API services, business logic, and data transfer objects for backend communication.

## Summary

The services directory provides the data layer for the BuildFlow frontend, containing service classes that communicate with the backend API, DTOs that define data structures, validation services, and helper utilities. Services follow a consistent pattern for API calls, error handling, and data transformation.

## Files Structure

```
services/
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
├── AdminService.tsx          # Admin operations API service
├── ApiService.tsx            # Base HTTP client and API utilities
├── AuthService.tsx           # Authentication API service
├── ProjectService.ts         # Project management API service
├── ProjectService.test.ts    # Project service tests
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

### AuthService.tsx
**Purpose:** Authentication and user session management.

**Features:**
- User login/logout
- User registration
- Token management
- Session persistence
- Mock authentication (dev mode)
- Password validation

**Key Functions:**
```typescript
class AuthService {
  login(credentials: LoginCredentials): Promise<AuthResponse>
  register(signUpData: SignUpData): Promise<AuthResponse>
  logout(): Promise<void>
  getCurrentUser(): Promise<User | null>
  refreshToken(): Promise<string>
}
```

**Mock Authentication:**
- Enabled via `config.enableMockAuth`
- Uses mock users from `@/mocks/authMocks`
- Simulates backend responses
- Perfect for standalone development

**Usage:**
```typescript
import { authService } from '@/services/AuthService';

// Login
const response = await authService.login({
  username: 'admin',
  password: 'password123'
});

// Register
const response = await authService.register({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'SecurePass123!'
});
```

### ProjectService.ts
**Purpose:** Project management and CRUD operations.

**Features:**
- Create new projects
- Get projects by builder ID
- Get projects by owner ID
- Update project details
- Delete projects
- Mock project data (dev mode)

**Key Functions:**
```typescript
class ProjectService {
  createProject(request: CreateProjectRequestDto): Promise<CreateProjectResponseDto>
  getProjectsByBuilderId(builderId: string): Promise<Project[]>
  getProjectsByOwnerId(ownerId: string): Promise<Project[]>
  updateProject(id: string, updates: Partial<Project>): Promise<Project>
  deleteProject(id: string): Promise<void>
}
```

**Mock Data Integration:**
- Uses `MockProjects.ts` when `config.enableMockData = true`
- Simulates network delays (300-500ms)
- Stores mock projects in memory
- Realistic Canadian project data

**Usage:**
```typescript
import { ProjectService } from '@/services/ProjectService';

// Create project
const project = await ProjectService.createProject({
  name: 'New Building',
  description: 'Commercial construction',
  builderId: '1',
  ownerId: '2',
  locationRequestDto: addressData
});

// Get builder's projects
const projects = await ProjectService.getProjectsByBuilderId('1');
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

## Testing

### ProjectService.test.ts
Comprehensive tests for ProjectService:
- Mock data operations
- API call verification
- Error handling
- Response transformation

**Test Patterns:**
```typescript
test('ProjectService_shouldCreateProject_withValidData', async () => {
  const mockProject = { /* ... */ };
  
  const result = await ProjectService.createProject(mockProject);
  
  expect(result).toHaveProperty('id');
  expect(result.name).toBe(mockProject.name);
});
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
