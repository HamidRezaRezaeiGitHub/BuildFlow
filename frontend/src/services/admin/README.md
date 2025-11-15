# Admin Service

Administrative service implementation using the **Factory Pattern** to cleanly separate mock and real backend implementations.

## Structure

```
admin/
├── IAdminService.ts           # Interface defining the admin service contract
├── AdminService.ts            # Real backend API implementation
├── AdminMockService.ts        # Mock implementation for standalone development
├── adminServiceFactory.ts     # Factory that chooses the right implementation
└── README.md                  # This file
```

## Overview

The admin service provides administrative operations for user management, authentication records, and system monitoring. It uses a factory pattern to switch between real backend integration and mock data based on environment configuration.

### Design Pattern: Factory with Interface

- **Interface (`IAdminService`)**: Defines the contract all implementations must follow
- **Real Implementation (`AdminService`)**: Makes HTTP calls to Spring Boot backend
- **Mock Implementation (`AdminMockService`)**: Uses local mock data for standalone development
- **Factory (`adminServiceFactory`)**: Creates the appropriate implementation based on `config.enableMockAuth`

## Files

### `IAdminService.ts`
Defines the admin service interface with methods for:
- User management (CRUD operations)
- User authentication record retrieval
- Combined user details (User + UserAuthentication)
- User statistics calculation
- Admin user creation

### `AdminService.ts`
Real backend implementation:
- Makes HTTP calls via `ApiService` to Spring Boot endpoints
- Handles admin-only operations with proper authorization
- Combines data from multiple endpoints efficiently (parallel requests)
- Production-ready code with no mock logic

### `AdminMockService.ts`
Mock implementation for development:
- Uses mock data from `@/mocks/MockUsers`
- Simulates network delays for realistic development
- Enabled when `config.enableMockAuth = true`
- Provides realistic admin panel functionality without backend

### `adminServiceFactory.ts`
Factory and exports:
- Creates correct service instance based on configuration
- Exports singleton `adminService` for application use
- Exports `AdminServiceWithAuth` wrapper for automatic token injection
- Exports types and classes for testing

## Usage

### Standard Usage (with token)

```typescript
import { adminService } from '@/services';

// Get all users
const users = await adminService.getAllUsers(token);

// Get combined user details
const userDetails = await adminService.getUserDetails('username', token);

// Calculate user statistics
const stats = adminService.calculateUserStats(userDetailsList);
```

### With Auth Context (no token parameter needed)

```typescript
import { AdminServiceWithAuth } from '@/services';
import { useAuth } from '@/contexts/AuthContext';

function AdminComponent() {
  const { token } = useAuth();
  const adminService = new AdminServiceWithAuth(() => token);
  
  // Token automatically injected
  const users = await adminService.getAllUsers();
  const stats = adminService.calculateUserStats(userDetails);
}
```

### Testing

```typescript
import { vi } from 'vitest';

// Mock the service
vi.mock('@/services', () => ({
  adminService: {
    getAllUsers: vi.fn(),
    getUserDetails: vi.fn(),
  }
}));

// Or import specific implementations
import { AdminService, AdminMockService } from '@/services/admin/adminServiceFactory';
```

## Configuration

The factory switches implementations based on environment:

| Mode | Config | Implementation | Use Case |
|------|--------|----------------|----------|
| Standalone | `enableMockAuth: true` | `AdminMockService` | Frontend development without backend |
| Integrated | `enableMockAuth: false` | `AdminService` | Full-stack development and production |

## Key Features

- **Clean Separation**: Mock and real logic are completely isolated in separate files
- **No Runtime Conditionals**: Service methods contain no if-else checks for mock vs real
- **Type Safety**: Interface ensures both implementations have matching signatures
- **Efficient Data Fetching**: Combines multiple API calls in parallel for better performance
- **Auth Integration**: Optional wrapper for automatic token injection from AuthContext
- **Statistics Calculation**: Client-side utility for user statistics (no API call needed)

## Admin Operations

### User Management
- `getAllUsers()` - Retrieve all system users
- `getUserByUsername()` - Get specific user by username
- `createUser()` - Create new regular user (requires ADMIN_USERS authority)
- `createAdminUser()` - Create new admin user (requires CREATE_ADMIN authority)

### Authentication Records
- `getAllUserAuthentications()` - Get all user authentication records
- `getUserAuthenticationByUsername()` - Get authentication for specific user

### Combined Operations
- `getUserDetails()` - Get User + UserAuthentication combined for one user
- `getAllUserDetails()` - Get all users with their authentication records
- `calculateUserStats()` - Calculate statistics from user details array

## Authorization Requirements

All methods require admin authentication (token with ADMIN_USERS or CREATE_ADMIN authority):

- **ADMIN_USERS**: Required for most admin operations
- **CREATE_ADMIN**: Required specifically for creating admin users
