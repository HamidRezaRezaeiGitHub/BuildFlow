# Environment Configuration

This package provides environment configuration management for the BuildFlow frontend application, similar to Spring Boot's `application.yml` profile system.

## Overview

The configuration system uses:
- **Environment files** (`.env.*`) for profile-specific settings
- **TypeScript singleton** for type-safe access across the application
- **Module-level initialization** (similar to Spring's `@Configuration` beans)

## Environment Files

### `.env.development`
Used for standalone frontend development:
```bash
npm run dev
```
- Mock authentication and data enabled
- Runs on port 3000
- No backend required

### `.env.development.integrated`
Used when testing with local Spring Boot backend:
```bash
npm run dev:integrated  # (you'll need to add this script)
```
- Real backend API at `http://localhost:8080/api`
- Mock features disabled
- Frontend on port 3000, backend on 8080

### `.env.uat`
Used for UAT builds:
```bash
npm run build:uat  # (you'll need to add this script)
```
- Integrated with backend
- Console logs enabled for debugging
- Production-like behavior

### `.env.production`
Used for production builds:
```bash
npm run build
```
- Fully integrated with backend
- All mocks disabled
- Optimized and minified

## Usage Examples

### 1. In API Services

```typescript
import { config } from '@/config/environment';
import axios from 'axios';

// Create API client with environment-aware base URL
export const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
});

// Use feature flags to determine behavior
export const authService = {
  async login(username: string, password: string) {
    if (config.enableMockAuth) {
      // Return mock data in standalone mode
      return { token: 'mock-token', user: { id: 1, name: 'Mock User' } };
    }
    
    // Real API call in integrated mode
    const response = await apiClient.post('/auth/login', { username, password });
    return response.data;
  }
};
```

### 2. In Components

```typescript
import { config } from '@/config/environment';

export const Dashboard: React.FC = () => {
  // Conditionally render based on mode
  if (config.isStandalone) {
    return <StandaloneDashboard />;
  }
  
  return <IntegratedDashboard />;
};
```

### 3. In Data Fetching Hooks

```typescript
import { config } from '@/config/environment';
import useSWR from 'swr';

export function useProjects() {
  const url = config.getApiEndpoint('/projects');
  
  const { data, error } = useSWR(
    config.enableMockData ? null : url,  // Skip fetch if using mock data
    fetcher
  );
  
  if (config.enableMockData) {
    return { data: mockProjects, error: null };
  }
  
  return { data, error };
}
```

### 4. Conditional Logging

```typescript
import { config } from '@/config/environment';

export function logDebugInfo(message: string, data?: any) {
  if (config.enableConsoleLogs) {
    console.log(`[DEBUG] ${message}`, data);
  }
}
```

### 5. API Endpoint Construction

```typescript
import { config } from '@/config/environment';

// Automatically constructs full URL
const projectsUrl = config.getApiEndpoint('/projects');
// Development: http://localhost:3000/api/projects
// Integrated Dev: http://localhost:8080/api/projects
// Production: /api/projects (relative to origin)

const userUrl = config.getApiEndpoint('users/123');  // handles missing leading slash
// Results in: {baseUrl}/api/users/123
```

### 6. Feature Flag Checks

```typescript
import { config } from '@/config/environment';

// Type-safe feature flag checking
if (config.isFeatureEnabled('mockAuth')) {
  // Use mock authentication
}

// Direct property access (preferred)
if (config.enableMockData) {
  // Return mock data
}
```

## Initialization

The config singleton is automatically initialized when first imported. To ensure early initialization, it's imported in `main.tsx`:

```typescript
// main.tsx
import './config/environment'  // Loads config before app renders
```

This guarantees:
- ✅ Config is available in all components
- ✅ Environment variables are validated early
- ✅ Configuration is logged in development mode
- ✅ No manual initialization needed

## Adding New Configuration

### 1. Add to environment files:
```bash
# .env.development
VITE_NEW_FEATURE=true
```

### 2. Add TypeScript type:
```typescript
// src/vite-env.d.ts
interface ImportMetaEnv {
  readonly VITE_NEW_FEATURE: string;
  // ... other vars
}
```

### 3. Add to Config class:
```typescript
// environment.ts
class Config implements EnvironmentConfig {
  readonly newFeature: boolean;
  
  constructor() {
    this.newFeature = getBooleanEnvVar('VITE_NEW_FEATURE', false);
  }
}
```

### 4. Update interface:
```typescript
interface EnvironmentConfig {
  newFeature: boolean;
  // ... other properties
}
```

## Package Scripts (To Add)

Update `package.json` to support different modes:

```json
{
  "scripts": {
    "dev": "vite",
    "dev:integrated": "vite --mode development.integrated",
    "build": "vite build",
    "build:uat": "vite build --mode uat",
    "build:production": "vite build --mode production"
  }
}
```

## Comparison with Spring Boot

| Spring Boot            | BuildFlow Frontend    | Purpose              |
| ---------------------- | --------------------- | -------------------- |
| `application.yml`      | `.env`                | Default config       |
| `application-dev.yml`  | `.env.development`    | Dev profile          |
| `application-uat.yml`  | `.env.uat`            | UAT profile          |
| `application-prod.yml` | `.env.production`     | Production profile   |
| `@Value` annotation    | `config.propertyName` | Access config        |
| `@Configuration` bean  | `export const config` | Singleton instance   |
| `@Profile` annotation  | `config.isStandalone` | Conditional behavior |

## Best Practices

1. **Never commit `.env.local`** - Add to `.gitignore` for local overrides
2. **Use feature flags** - Enable/disable features based on mode
3. **Type safety** - Always update `vite-env.d.ts` when adding new vars
4. **Prefix with VITE_** - Only `VITE_` prefixed vars are exposed to client
5. **Early import** - Import in `main.tsx` for early initialization
6. **Mock in standalone** - Use mock data/auth when backend unavailable
7. **Log in development** - Config automatically logs in dev mode

## Security Notes

⚠️ **Important**: Environment variables are **bundled into the client code** and are **publicly visible**. Never store secrets, API keys, or sensitive data in environment variables.

For sensitive configuration, use:
- Server-side configuration
- Runtime configuration endpoints
- Secure backend APIs

## Troubleshooting

### Config not loading?
- Check that environment file exists (`.env.development`, etc.)
- Verify `VITE_` prefix on all custom variables
- Restart dev server after adding new env vars

### Wrong environment?
- Check which script you're running (`dev` vs `dev:integrated`)
- Verify correct `.env.*` file is present
- Check console logs in development mode

### TypeScript errors?
- Ensure `vite-env.d.ts` includes your new variable
- Restart TypeScript server in VS Code
- Check that variable names match exactly (case-sensitive)
