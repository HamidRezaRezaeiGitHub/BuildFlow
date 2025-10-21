# Frontend Source Directory

This is the main source directory for the BuildFlow frontend application, containing all React components, pages, services, contexts, and utilities.

## Summary

The `src/` directory follows a modular architecture pattern, organizing code by feature and responsibility. Each subdirectory has a specific purpose in the application, from UI components and pages to business logic services and shared contexts.

## Files Structure

```
src/
├── components/           # Reusable React components
│   ├── address/         # Address input components
│   ├── admin/           # Admin panel components
│   ├── auth/            # Authentication components
│   ├── dashboard/       # Dashboard layout components
│   ├── dev/             # Development-only components
│   ├── home/            # Landing page components
│   ├── navbar/          # Navigation bar components
│   ├── project/         # Project-related components
│   ├── theme/           # Theme system components
│   └── ui/              # Base UI components (shadcn/ui)
├── config/              # Environment configuration
├── contexts/            # React Context providers
├── mocks/               # Mock data for development
├── pages/               # Route page components
│   ├── project/         # Project-related pages
│   └── temp/            # Temporary demo pages
├── services/            # API services and business logic
│   ├── dtos/            # Data Transfer Objects
│   └── validation/      # Validation service
├── test/                # Testing utilities and setup
├── utils/               # Utility functions and hooks
├── App.tsx              # Main application component
├── App.css              # Global application styles
├── main.tsx             # Application entry point
├── index.css            # Global CSS imports
└── vite-env.d.ts        # TypeScript environment declarations
```

## Subdirectory Overview

### [components/](./components/README.md)
Reusable React components organized by feature domain. Contains both composite and individual components for building the application UI.

### [config/](./config/README.md)
Environment configuration management with profile-based settings similar to Spring Boot's application.yml system.

### [contexts/](./contexts/README.md)
React Context providers for global state management including authentication, navigation, theme, and router configuration.

### [mocks/](./mocks/README.md)
Mock data and utilities for standalone development mode when running without a backend.

### [pages/](./pages/README.md)
Route-level page components that compose smaller components into full pages.

### [services/](./services/README.md)
API services, data transfer objects, and business logic for backend communication.

### [test/](./test/README.md)
Testing configuration, utilities, and shared test helpers for Jest and React Testing Library.

### [utils/](./utils/README.md)
Pure utility functions and custom React hooks that don't fit into other categories.

## Key Exports

### Application Entry Point
- **main.tsx** - Application bootstrapping and provider setup
- **App.tsx** - Root application component with routing

### Global Styling
- **index.css** - Tailwind CSS imports and global styles
- **App.css** - Application-specific styles

### Type Definitions
- **vite-env.d.ts** - TypeScript declarations for Vite environment variables

## Architecture Patterns

### Component Organization
- **Feature-based** - Components grouped by domain (auth, project, admin)
- **Atomic Design** - UI components at the lowest level, composed into features
- **Page Components** - Top-level route handlers in pages/

### State Management
- **React Context** - Global state for auth, theme, navigation
- **Component State** - Local state with useState/useReducer
- **Service Layer** - Business logic separated from UI

### Data Flow
```
Pages → Components → Services → Backend API
         ↓              ↓
      Contexts ←── Mock Data (dev mode)
```

## Development Guidelines

### Adding New Features
1. Create components in appropriate `components/` subdirectory
2. Add page components in `pages/` if creating new routes
3. Create services in `services/` for API integration
4. Add DTOs in `services/dtos/` matching backend models
5. Update relevant README files

### File Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Tests**: Same as source file + `.test.tsx` suffix
- **Types**: PascalCase with `Dtos.ts` or `Types.ts` suffix

### Import Path Aliases
- `@/components/*` - Components directory
- `@/services/*` - Services directory
- `@/contexts/*` - Contexts directory
- `@/utils/*` - Utils directory
- `@/config/*` - Config directory

## Related Documentation

- [Project Root README](../README.md) - Frontend overview and setup
- [Component Documentation](./components/README.md) - Component library details
- [Service Documentation](./services/README.md) - API service patterns
- [Testing Guide](./test/README.md) - Testing setup and utilities
