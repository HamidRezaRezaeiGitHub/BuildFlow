# Mock Data

This directory contains mock data and utilities for standalone development mode.

## Purpose

When running the frontend without a backend (`config.enableMockAuth = true`), these mocks provide realistic data for development and testing.

## Structure

### `authMocks.ts`
Mock authentication data and utilities:
- **Mock Users**: Pre-configured test users (admin, testuser)
- **Mock Credentials**: Test login credentials (all use password: `password123`)
- **Mock Token Generation**: Creates JWT-like tokens for testing
- **Mock Auth Responses**: Generates AuthResponse objects
- **User Management**: Create, find, and validate mock users

## Mock Users

### Admin User
- **Username**: `admin`
- **Password**: `password123`
- **Email**: `admin@buildflow.com`
- **Role**: Administrator

### Test User
- **Username**: `testuser`
- **Password**: `password123`
- **Email**: `test@buildflow.com`
- **Role**: Builder

## Usage

Mocks are automatically used when `config.enableMockAuth = true` (standalone mode).

### In Services

```typescript
import { config } from '@/config/environment';
import { validateMockCredentials, generateMockAuthResponse } from '@/mocks/authMocks';

async login(credentials: LoginCredentials): Promise<AuthResponse> {
  if (config.enableMockAuth) {
    const user = validateMockCredentials(credentials.username, credentials.password);
    if (user) {
      return generateMockAuthResponse(user);
    }
    throw new Error('Invalid credentials');
  }
  
  // Real API call
  return await apiService.post('/auth/login', credentials);
}
```

## Adding New Mocks

### 1. Create Mock Data File

```typescript
// mocks/projectMocks.ts
import type { Project } from '../services/dtos';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Sample Project',
    // ... other fields
  },
];

export function findProjectById(id: string): Project | undefined {
  return mockProjects.find(p => p.id === id);
}
```

### 2. Use in Service

```typescript
// services/ProjectService.ts
import { config } from '@/config/environment';
import { mockProjects, findProjectById } from '@/mocks/projectMocks';

async getProjects(): Promise<Project[]> {
  if (config.enableMockData) {
    return Promise.resolve(mockProjects);
  }
  
  return await apiService.get('/projects');
}
```

## Best Practices

1. **Match Real Data Structure**: Mocks should match backend DTOs exactly
2. **Realistic Data**: Use realistic names, addresses, and values
3. **Async Simulation**: Add delays to simulate network requests
4. **Error Cases**: Include functions to test error scenarios
5. **Console Logging**: Use `config.enableConsoleLogs` for debug info
6. **TypeScript**: Fully type all mock data and functions

## Environment Configuration

Mocks are controlled by environment variables:

```bash
# .env.development (standalone mode)
VITE_ENABLE_MOCK_AUTH=true
VITE_ENABLE_MOCK_DATA=true

# .env.production (integrated mode)
VITE_ENABLE_MOCK_AUTH=false
VITE_ENABLE_MOCK_DATA=false
```

## Testing

Mock data is ideal for:
- Unit testing components
- Integration testing without backend
- UI/UX development
- Demo presentations
- Offline development

## Security Notes

⚠️ **Important**: 
- Never use mock credentials in production
- Mock tokens are NOT secure (client-side only)
- Always validate real tokens server-side
- Mock data should never contain real user information

## Future Enhancements

Planned mock modules:
- `projectMocks.ts` - Project data
- `estimateMocks.ts` - Estimate data
- `workItemMocks.ts` - Work item data
- `quoteMocks.ts` - Quote data
