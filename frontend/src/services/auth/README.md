# Authentication Service

Authentication service implementation using the **Factory Pattern** to cleanly separate mock and real backend implementations.

## Structure

```
auth/
├── IAuthService.ts           # Interface defining the authentication contract
├── AuthService.ts            # Real backend API implementation
├── AuthMockService.ts        # Mock implementation for standalone development
├── authServiceFactory.ts     # Factory that chooses the right implementation
└── README.md                 # This file
```

## Overview

The authentication service provides user authentication, registration, token management, and session handling. It uses a factory pattern to switch between real backend integration and mock data based on environment configuration.

### Design Pattern: Factory with Interface

- **Interface (`IAuthService`)**: Defines the contract all implementations must follow
- **Real Implementation (`AuthService`)**: Makes HTTP calls to Spring Boot backend
- **Mock Implementation (`AuthMockService`)**: Uses local mock data for standalone development
- **Factory (`authServiceFactory`)**: Creates the appropriate implementation based on `config.enableMockAuth`

## Files

### `IAuthService.ts`
Defines the authentication service interface with methods for:
- User login and registration
- Token validation and refresh
- User session management
- Admin user creation

### `AuthService.ts`
Real backend implementation:
- Makes HTTP calls via `ApiService` to Spring Boot endpoints
- Handles authentication tokens and sessions
- Production-ready code with no mock logic

### `AuthMockService.ts`
Mock implementation for development:
- Uses mock data from `@/mocks/MockUsers`
- Simulates network delays for realistic development
- Enabled when `config.enableMockAuth = true`

### `authServiceFactory.ts`
Factory and exports:
- Creates correct service instance based on configuration
- Exports singleton `authService` for application use
- Exports types and classes for testing

## Usage

### Standard Usage

```typescript
import { authService } from '@/services';

// Factory automatically provides the right implementation
const response = await authService.login(credentials);
const user = await authService.getCurrentUser(token);
```

### Testing

```typescript
import { vi } from 'vitest';

// Mock the service
vi.mock('@/services', () => ({
  authService: {
    login: vi.fn(),
    getCurrentUser: vi.fn(),
  }
}));

// Or import specific implementations
import { AuthService, AuthMockService } from '@/services/auth/authServiceFactory';
```

## Configuration

The factory switches implementations based on environment:

| Mode | Config | Implementation | Use Case |
|------|--------|----------------|----------|
| Standalone | `enableMockAuth: true` | `AuthMockService` | Frontend development without backend |
| Integrated | `enableMockAuth: false` | `AuthService` | Full-stack development and production |

## Key Features

- **Clean Separation**: Mock and real logic are completely isolated in separate files
- **No Runtime Conditionals**: Service methods contain no if-else checks for mock vs real
- **Type Safety**: Interface ensures both implementations have matching signatures
- **Easy Testing**: Each implementation can be tested independently
- **Single Responsibility**: Each file has one clear purpose

