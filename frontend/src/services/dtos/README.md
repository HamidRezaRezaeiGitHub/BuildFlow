# Data Transfer Objects (DTOs)

This directory contains TypeScript interfaces and types that define the data structures used for communication between the frontend and backend.

## Summary

The DTOs directory provides type-safe data structures that match the backend API's request and response formats. These interfaces ensure type safety throughout the application and provide clear contracts for API communication. All DTOs mirror the backend's Spring Boot entity and DTO structures.

## DTO Naming Convention and Aliasing

**Critical Pattern:** DTOs are defined with their full backend names (including `Dto` suffix) in their respective files to maintain alignment with backend structures, but are **re-exported with alias names** through the central `index.ts` to provide a clean, domain-centric API for frontend consumers.

### Why This Pattern?

1. **Backend Alignment:** DTO files maintain exact naming from backend for clarity and traceability
2. **Frontend Ergonomics:** Consumer code uses clean, domain-focused names without implementation details
3. **Consistency:** All DTOs follow the same pattern across User, Contact, Project, and other domains
4. **IDE Support:** Auto-imports default to clean alias names, improving developer experience

### Aliasing Rules

**Suffix Removal:**
- `ProjectDto` → `Project`
- `ProjectLocationDto` → `ProjectLocation`  
- `ProjectLocationRequestDto` → `ProjectLocationRequest`
- `UserDto` → `User`
- `ContactDto` → `Contact`

**Request/Response Types:**
- `CreateProjectRequest` (no suffix, already clean)
- `CreateProjectResponse` (no suffix, already clean)

### Example: Project DTOs

**In ProjectDtos.ts (internal definition):**
```typescript
export interface ProjectDto {
  id: string;
  builderId: string;
  ownerId: string;
  location: ProjectLocationDto;
  createdAt: string;
  lastUpdatedAt: string;
}

export interface ProjectLocationDto extends BaseAddressDto {
  id: string;
}

export interface ProjectLocationRequestDto extends BaseAddressDto {
  // No additional fields
}
```

**In index.ts (consumer-facing exports):**
```typescript
export type {
  CreateProjectRequest,
  CreateProjectResponse,
  ProjectDto as Project,
  ProjectLocationDto as ProjectLocation,
  ProjectLocationRequestDto as ProjectLocationRequest
} from './ProjectDtos';
```

**In consumer code:**
```typescript
// ✅ Correct - use aliased names from index.ts
import { Project, ProjectLocation, CreateProjectRequest } from '@/services/dtos';

const project: Project = { /* ... */ };
const location: ProjectLocation = project.location;

// ❌ Incorrect - don't import from ProjectDtos directly
import { ProjectDto } from '@/services/dtos/ProjectDtos';
```

### Benefits

1. **Clean consumer code:** Components don't leak backend naming conventions
2. **Consistent with existing patterns:** User and Contact DTOs already follow this pattern
3. **Improved readability:** `Project` is clearer than `ProjectDto` in UI layer
4. **Better auto-completion:** IDEs suggest `Project` instead of `ProjectDto`

## Files Structure

```
dtos/
├── AddressDtos.ts       # Address-related data structures and base DTO types
├── AuthDtos.ts          # Authentication request/response types
├── EstimateDtos.ts      # Estimate-related data structures
├── MvcDtos.ts           # Spring MVC response wrappers
├── PaginationDtos.ts    # Pagination and page response types
├── ProjectDtos.ts       # Project-related data structures
├── QuoteDtos.ts         # Quote-related data structures
├── UserDtos.ts          # User profile and contact data structures
├── WorkItemDtos.ts      # Work item-related data structures
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

**Note:** Following the DTO aliasing pattern, consumers use `Project`, `ProjectLocation`, and `ProjectLocationRequest` 
(exported from `index.ts`), while internal definitions retain the `Dto` suffix for backend alignment.

**Interfaces (internal definitions):**
```typescript
// Project location request DTO (extends BaseAddressDto)
export interface ProjectLocationRequestDto extends BaseAddressDto {
  // Inherits all address fields from BaseAddressDto
}

// Project location DTO with ID (for responses)
export interface ProjectLocationDto extends BaseAddressDto {
  id: string;
}

// Project DTO
export interface ProjectDto {
  id: string;
  builderId: string;
  ownerId: string;
  location: ProjectLocationDto;
  createdAt: string;
  lastUpdatedAt: string;
}

// Create project request
export interface CreateProjectRequest {
  userId: string;
  isBuilder: boolean;
  locationRequestDto: ProjectLocationRequestDto;
}

// Create project response
export interface CreateProjectResponse {
  projectDto: ProjectDto;
}
```

**Consumer-facing exports (from index.ts):**
```typescript
export type {
  CreateProjectRequest,           // No alias (clean name)
  CreateProjectResponse,           // No alias (clean name)
  ProjectDto as Project,          // ✅ Use 'Project' in consumer code
  ProjectLocationDto as ProjectLocation,  // ✅ Use 'ProjectLocation' in consumer code
  ProjectLocationRequestDto as ProjectLocationRequest  // ✅ Use 'ProjectLocationRequest' in consumer code
} from './ProjectDtos';
```

**Usage:**
```typescript
// ✅ Correct - use aliased names from index.ts
import { 
  Project,  // Not ProjectDto
  ProjectLocation,  // Not ProjectLocationDto
  ProjectLocationRequest,  // Not ProjectLocationRequestDto
  CreateProjectRequest, 
  CreateProjectResponse 
} from '@/services/dtos';

// Create project request
const locationRequest: ProjectLocationRequest = {
  unitNumber: '301',
  streetNumberAndName: '456 Business Ave',
  city: 'Toronto',
  stateOrProvince: 'ON',
  postalOrZipCode: 'M5H 2N2',
  country: 'Canada'
};

const request: CreateProjectRequest = {
  userId: '123',
  isBuilder: true,
  locationRequestDto: locationRequest
};

const response: CreateProjectResponse = 
  await projectService.createProject(request, token);

// Access the created project
const project: Project = response.projectDto;
const location: ProjectLocation = project.location;

console.log(`Created project at: ${location.city}, ${location.stateOrProvince}`);
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

**Internal DTO Files (e.g., ProjectDtos.ts, UserDtos.ts):**
- **Domain DTOs**: Include `Dto` suffix to mirror backend (e.g., `ProjectDto`, `UserDto`, `ContactDto`)
- **Request DTOs**: Clean names without suffix (e.g., `CreateProjectRequest`, `ContactRequest`)
- **Response DTOs**: Clean names without suffix (e.g., `CreateProjectResponse`)
- **Data DTOs**: Suffix with `Data` for frontend-specific structures (e.g., `AddressData`)

**Consumer-Facing Exports (index.ts):**
- **Domain DTOs**: Exported with alias removing `Dto` suffix (e.g., `Project`, `User`, `Contact`)
- **Request/Response DTOs**: Exported as-is (already have clean names)
- **Result:** All consumer code uses clean, domain-centric names without implementation details

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

### EstimateDtos.ts
**Purpose:** Estimate cost management data structures.

**Note:** Following the DTO aliasing pattern, consumers use `Estimate`, `EstimateGroup`, and `EstimateLine` 
(exported from `index.ts`), while internal definitions retain the `Dto` suffix for backend alignment.

**Interfaces (internal definitions):**
```typescript
// Estimate line strategy enum
export enum EstimateLineStrategy {
  AVERAGE = 'AVERAGE',
  LATEST = 'LATEST',
  LOWEST = 'LOWEST'
}

// Estimate line DTO (extends UpdatableEntityDto)
export type EstimateLineDto = UpdatableEntityDto & {
  id: string;
  workItemId: string;
  quantity: number;
  estimateStrategy: string;
  multiplier: number;
  computedCost: string;  // BigDecimal from backend
};

// Estimate group DTO
export type EstimateGroupDto = {
  id: string;
  workItemId: string;
  name: string;
  description?: string;
  estimateLineDtos: EstimateLineDto[];
};

// Estimate DTO (extends UpdatableEntityDto)
export type EstimateDto = UpdatableEntityDto & {
  id: string;
  projectId: string;
  overallMultiplier: number;
  groupDtos: EstimateGroupDto[];
};
```

**Consumer-facing exports (from index.ts):**
```typescript
export type {
  EstimateDto as Estimate,        // ✅ Use 'Estimate' in consumer code
  EstimateGroupDto as EstimateGroup,  // ✅ Use 'EstimateGroup' in consumer code
  EstimateLineDto as EstimateLine     // ✅ Use 'EstimateLine' in consumer code
} from './EstimateDtos';

export { EstimateLineStrategy } from './EstimateDtos';
```

**Usage:**
```typescript
// ✅ Correct - use aliased names from index.ts
import { 
  Estimate,  // Not EstimateDto
  EstimateGroup,  // Not EstimateGroupDto
  EstimateLine,  // Not EstimateLineDto
  EstimateLineStrategy 
} from '@/services/dtos';

// Create estimate structure
const estimate: Estimate = {
  id: '123',
  projectId: '456',
  overallMultiplier: 1.15,
  groupDtos: [
    {
      id: '789',
      workItemId: '101',
      name: 'Foundation',
      description: 'Foundation work items',
      estimateLineDtos: [
        {
          id: '1001',
          workItemId: '101',
          quantity: 50,
          estimateStrategy: EstimateLineStrategy.AVERAGE,
          multiplier: 1.0,
          computedCost: '5000.00',
          createdAt: '2024-01-15T10:00:00Z',
          lastUpdatedAt: '2024-01-15T10:00:00Z'
        }
      ]
    }
  ],
  createdAt: '2024-01-15T10:00:00Z',
  lastUpdatedAt: '2024-01-15T10:00:00Z'
};

console.log(`Total groups: ${estimate.groupDtos.length}`);
```

### WorkItemDtos.ts
**Purpose:** Work item management data structures.

**Note:** Following the DTO aliasing pattern, consumers use `WorkItem` 
(exported from `index.ts`), while internal definitions retain the `Dto` suffix for backend alignment.

**Interfaces (internal definitions):**
```typescript
// Work item domain enum
export enum WorkItemDomain {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

// Work item DTO (extends UpdatableEntityDto)
export type WorkItemDto = UpdatableEntityDto & {
  id: string;
  code: string;
  name: string;
  description?: string;
  optional: boolean;
  userId: string;
  defaultGroupName?: string;
  domain: string;
};

// Create work item request
export type CreateWorkItemRequest = {
  code: string;
  name: string;
  description?: string;
  optional: boolean;
  userId: string;
  defaultGroupName?: string;
  domain?: string;
};

// Create work item response
export type CreateWorkItemResponse = {
  workItemDto: WorkItemDto;
};
```

**Consumer-facing exports (from index.ts):**
```typescript
export type {
  WorkItemDto as WorkItem,  // ✅ Use 'WorkItem' in consumer code
  CreateWorkItemRequest,    // No alias (clean name)
  CreateWorkItemResponse    // No alias (clean name)
} from './WorkItemDtos';

export { WorkItemDomain } from './WorkItemDtos';
```

**Usage:**
```typescript
// ✅ Correct - use aliased names from index.ts
import { 
  WorkItem,  // Not WorkItemDto
  CreateWorkItemRequest,
  CreateWorkItemResponse,
  WorkItemDomain 
} from '@/services/dtos';

// Create work item request
const request: CreateWorkItemRequest = {
  code: 'S1-001',
  name: 'Foundation Preparation',
  description: 'Prepare the foundation area',
  optional: false,
  userId: '123',
  defaultGroupName: 'Site Preparation',
  domain: WorkItemDomain.PUBLIC
};

const response: CreateWorkItemResponse = 
  await workItemService.createWorkItem(request);

// Access the created work item
const workItem: WorkItem = response.workItemDto;
console.log(`Created work item: ${workItem.name} (${workItem.code})`);
```

### QuoteDtos.ts
**Purpose:** Quote and pricing data structures.

**Note:** Following the DTO aliasing pattern, consumers use `Quote` and `QuoteLocation` 
(exported from `index.ts`), while internal definitions retain the `Dto` suffix for backend alignment.

**Interfaces (internal definitions):**
```typescript
// Quote domain enum
export enum QuoteDomain {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

// Quote unit enum
export enum QuoteUnit {
  SQUARE_METER = 'SQUARE_METER',
  SQUARE_FOOT = 'SQUARE_FOOT',
  CUBIC_METER = 'CUBIC_METER',
  CUBIC_FOOT = 'CUBIC_FOOT',
  METER = 'METER',
  FOOT = 'FOOT',
  EACH = 'EACH',
  KILOGRAM = 'KILOGRAM',
  TON = 'TON',
  LITER = 'LITER',
  MILLILITER = 'MILLILITER',
  HOUR = 'HOUR',
  DAY = 'DAY'
}

// Quote unit display mapping
export const QuoteUnitDisplay: Record<QuoteUnit, string> = {
  [QuoteUnit.SQUARE_METER]: 'm²',
  [QuoteUnit.SQUARE_FOOT]: 'ft²',
  // ... other mappings
};

// Quote location DTO (extends BaseAddressDto)
export type QuoteLocationDto = BaseAddressDto & {
  id: string;
};

// Quote DTO (extends UpdatableEntityDto)
export type QuoteDto = UpdatableEntityDto & {
  id: string;
  workItemId: string;
  createdByUserId: string;
  supplierId: string;
  quoteUnit: string;
  unitPrice: string;  // BigDecimal from backend
  currency: string;
  quoteDomain: string;
  locationDto: QuoteLocationDto;
  valid: boolean;
};
```

**Consumer-facing exports (from index.ts):**
```typescript
export type {
  QuoteDto as Quote,            // ✅ Use 'Quote' in consumer code
  QuoteLocationDto as QuoteLocation  // ✅ Use 'QuoteLocation' in consumer code
} from './QuoteDtos';

export { QuoteDomain, QuoteUnit, QuoteUnitDisplay } from './QuoteDtos';
```

**Usage:**
```typescript
// ✅ Correct - use aliased names from index.ts
import { 
  Quote,  // Not QuoteDto
  QuoteLocation,  // Not QuoteLocationDto
  QuoteDomain,
  QuoteUnit,
  QuoteUnitDisplay 
} from '@/services/dtos';

// Create quote
const quote: Quote = {
  id: '123',
  workItemId: '456',
  createdByUserId: '789',
  supplierId: '101',
  quoteUnit: QuoteUnit.SQUARE_METER,
  unitPrice: '50.00',
  currency: 'CAD',
  quoteDomain: QuoteDomain.PUBLIC,
  locationDto: {
    id: '202',
    streetNumberAndName: '123 Main St',
    city: 'Toronto',
    stateOrProvince: 'ON',
    postalOrZipCode: 'M5H 2N2',
    country: 'Canada'
  },
  valid: true,
  createdAt: '2024-01-15T10:00:00Z',
  lastUpdatedAt: '2024-01-15T10:00:00Z'
};

// Display unit with proper formatting
console.log(`Price: $${quote.unitPrice} per ${QuoteUnitDisplay[quote.quoteUnit as QuoteUnit]}`);
```

## Related Documentation

- [Services](../README.md) - Service layer using these DTOs
- [API Service](../README.md#apiservicetsx) - HTTP client
- [Backend DTOs](../../../../src/main/java/dev/hr/rezaei/buildflow/*/dtos/) - Java DTO definitions
- [Components](../../components/README.md) - Components using DTOs
