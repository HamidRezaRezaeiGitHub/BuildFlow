# Data Transfer Objects (DTOs)

This directory contains TypeScript interfaces and types that define the data structures used for communication between the frontend and backend.

## Summary

The DTOs directory provides type-safe data structures that match the backend API's request and response formats. These interfaces ensure type safety throughout the application and provide clear contracts for API communication. All DTOs mirror the backend's Spring Boot entity and DTO structures.

## Files Structure

```
dtos/
├── AddressDtos.ts       # Address-related data structures
├── AuthDtos.ts          # Authentication request/response types
├── MvcDtos.ts           # Spring MVC response wrappers
├── PaginationDtos.ts    # Pagination and page response types
├── ProjectDtos.ts       # Project-related data structures
├── UserDtos.ts          # User profile and contact data structures
└── index.ts             # Centralized DTO exports
```

## DTO Details

### AddressDtos.ts
**Purpose:** Address data structures for location information.

**Interfaces:**
```typescript
// Address data for forms and display
export interface AddressData {
  unitNumber?: string;
  streetNumber?: string;
  streetName?: string;
  streetNumberName?: string;  // Combined street number + name
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  country?: string;
}

// Address request DTO (matches backend LocationRequestDto)
export interface LocationRequestDto {
  streetNumberName: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
}
```

**Usage:**
```typescript
import { AddressData, LocationRequestDto } from '@/services/dtos';

const addressData: AddressData = {
  unitNumber: '301',
  streetNumber: '123',
  streetName: 'Main Street',
  city: 'Vancouver',
  stateProvince: 'BC',
  postalCode: 'V6B 1A1',
  country: 'Canada'
};

// Convert to API format
const locationDto: LocationRequestDto = {
  streetNumberName: `${addressData.streetNumber} ${addressData.streetName}`,
  city: addressData.city!,
  stateProvince: addressData.stateProvince!,
  postalCode: addressData.postalCode!,
  country: addressData.country!
};
```

### AuthDtos.ts
**Purpose:** Authentication and authorization data structures.

**Interfaces:**
```typescript
// Login credentials
export interface LoginCredentials {
  username: string;  // Can be username or email
  password: string;
}

// User registration data
export interface SignUpData {
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword?: string;  // Frontend-only validation
}

// Authentication response from backend
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}
```

**Usage:**
```typescript
import { LoginCredentials, SignUpData, AuthResponse } from '@/services/dtos';

// Login
const credentials: LoginCredentials = {
  username: 'john@example.com',
  password: 'SecurePass123!'
};

const response: AuthResponse = await authService.login(credentials);

// Signup
const signUpData: SignUpData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'SecurePass123!',
  confirmPassword: 'SecurePass123!'
};

const response: AuthResponse = await authService.register(signUpData);
```

### UserDtos.ts
**Purpose:** User profile, contact, and update data structures.

**Interfaces:**
```typescript
// User role enum
export type UserRole = 'ADMIN' | 'PREMIUM_USER' | 'USER' | 'VIEWER';

// Contact information
export interface ContactDto {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  locationDto?: LocationDto;
}

// Full user profile
export interface User {
  id: string;
  username: string;
  contactDto: ContactDto;
  role: UserRole;
  createdAt?: string;
  lastLogin?: string;
  isActive?: boolean;
}

// User update request
export interface UserUpdateDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  role?: UserRole;
  isActive?: boolean;
}
```

**Usage:**
```typescript
import { User, UserUpdateDto, UserRole } from '@/services/dtos';

// Current user
const currentUser: User = {
  id: '123',
  username: 'johndoe',
  contactDto: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phoneNumber: '+1-604-555-0100'
  },
  role: 'USER',
  createdAt: '2024-01-15T10:00:00Z',
  isActive: true
};

// Update user
const updates: UserUpdateDto = {
  phoneNumber: '+1-604-555-0200',
  role: 'PREMIUM_USER'
};

await adminService.updateUser('123', updates);
```

### ProjectDtos.ts
**Purpose:** Project creation, display, and management data structures.

**Interfaces:**
```typescript
// Location/Address for projects
export interface LocationDto {
  id?: string;
  streetNumberName: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
}

// Project data
export interface Project {
  id: string;
  name: string;
  description?: string;
  builderId: string;
  ownerId: string;
  locationDto: LocationDto;
  createdAt?: string;
  updatedAt?: string;
  status?: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
}

// Create project request
export interface CreateProjectRequestDto {
  name: string;
  description?: string;
  builderId: string;
  ownerId: string;
  locationRequestDto: LocationRequestDto;
}

// Create project response
export interface CreateProjectResponseDto {
  projectId: string;
  message: string;
}
```

**Usage:**
```typescript
import { 
  Project, 
  CreateProjectRequestDto, 
  CreateProjectResponseDto 
} from '@/services/dtos';

// Create project
const request: CreateProjectRequestDto = {
  name: 'Downtown Office Building',
  description: 'New commercial construction project',
  builderId: '1',
  ownerId: '2',
  locationRequestDto: {
    streetNumberName: '456 Business Ave',
    city: 'Toronto',
    stateProvince: 'ON',
    postalCode: 'M5H 2N2',
    country: 'Canada'
  }
};

const response: CreateProjectResponseDto = 
  await ProjectService.createProject(request);

console.log(`Created project: ${response.projectId}`);
```

### MvcDtos.ts
**Purpose:** Spring MVC response wrapper structures.

**Interfaces:**
```typescript
// Standard API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

// Error response
export interface ErrorResponse {
  status: number;
  error: string;
  message: string;
  path: string;
  timestamp: string;
}

// Validation error details
export interface ValidationError {
  field: string;
  message: string;
  rejectedValue?: any;
}

// Validation error response
export interface ValidationErrorResponse extends ErrorResponse {
  errors: ValidationError[];
}
```

**Usage:**
```typescript
import { ApiResponse, ErrorResponse } from '@/services/dtos';

// Success response
const response: ApiResponse<Project> = {
  success: true,
  data: project,
  message: 'Project created successfully',
  timestamp: new Date().toISOString()
};

// Error handling
try {
  await apiService.post('/api/projects', data);
} catch (error) {
  const errorResponse = error.response.data as ErrorResponse;
  console.error(`Error ${errorResponse.status}: ${errorResponse.message}`);
}
```

### PaginationDtos.ts
**Purpose:** Pagination and paginated response structures.

**Interfaces:**
```typescript
// Pagination request parameters
export interface PaginationParams {
  page?: number;       // Page number (0-indexed)
  size?: number;       // Items per page
  sort?: string;       // Sort field
  direction?: 'ASC' | 'DESC';  // Sort direction
}

// Page metadata
export interface PageInfo {
  totalElements: number;
  totalPages: number;
  number: number;         // Current page (0-indexed)
  size: number;           // Page size
  numberOfElements: number;  // Items in current page
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Paginated response
export interface PageResponse<T> {
  content: T[];
  pageInfo: PageInfo;
}
```

**Usage:**
```typescript
import { PaginationParams, PageResponse } from '@/services/dtos';

// Request paginated data
const params: PaginationParams = {
  page: 0,
  size: 25,
  sort: 'createdAt',
  direction: 'DESC'
};

const response: PageResponse<Project> = 
  await apiService.get('/api/projects', { params });

console.log(`Total projects: ${response.pageInfo.totalElements}`);
console.log(`Current page: ${response.pageInfo.number + 1} of ${response.pageInfo.totalPages}`);
console.log(`Projects on this page: ${response.content.length}`);
```

## DTO Conventions

### Naming Conventions
- **Request DTOs**: Suffix with `RequestDto` (e.g., `CreateProjectRequestDto`)
- **Response DTOs**: Suffix with `ResponseDto` or use domain name (e.g., `User`, `Project`)
- **Data DTOs**: Suffix with `Data` for frontend-specific structures (e.g., `AddressData`)

### Optional vs Required Fields
- Use `?` for optional fields: `description?: string`
- Required fields have no `?`: `name: string`
- Match backend validation rules

### Type Safety
All DTOs use strict TypeScript types:
- No `any` types unless absolutely necessary
- Use enums for fixed value sets
- Use union types for variants
- Interface composition for reusability

## Backend Synchronization

### Matching Backend DTOs
Frontend DTOs should match backend Java DTOs:

**Backend (Java):**
```java
public class CreateProjectRequestDto {
    private String name;
    private String description;
    private String builderId;
    private String ownerId;
    private LocationRequestDto locationRequestDto;
}
```

**Frontend (TypeScript):**
```typescript
export interface CreateProjectRequestDto {
  name: string;
  description?: string;
  builderId: string;
  ownerId: string;
  locationRequestDto: LocationRequestDto;
}
```

### Field Name Mapping
- **Backend**: camelCase (Java convention)
- **Frontend**: camelCase (TypeScript convention)
- **Match exactly** - no transformation needed

## Usage Patterns

### Importing DTOs
```typescript
// Import specific DTOs
import { User, Project } from '@/services/dtos';

// Import all from category
import type * as UserDtos from '@/services/dtos/UserDtos';

// Import through barrel export
import { User, Project, LoginCredentials } from '@/services/dtos';
```

### Type Guards
```typescript
function isUser(obj: any): obj is User {
  return obj && typeof obj.id === 'string' && obj.contactDto !== undefined;
}

if (isUser(data)) {
  console.log(data.username);  // Type-safe access
}
```

### DTO Transformation
```typescript
// Frontend AddressData to Backend LocationRequestDto
function toLocationRequestDto(address: AddressData): LocationRequestDto {
  return {
    streetNumberName: address.streetNumberName || 
      `${address.streetNumber} ${address.streetName}`,
    city: address.city!,
    stateProvince: address.stateProvince!,
    postalCode: address.postalCode!,
    country: address.country!
  };
}
```

## Related Documentation

- [Services](../README.md) - Service layer using these DTOs
- [API Service](../README.md#apiservicetsx) - HTTP client
- [Backend DTOs](../../../../src/main/java/dev/hr/rezaei/buildflow/*/dtos/) - Java DTO definitions
- [Components](../../components/README.md) - Components using DTOs
