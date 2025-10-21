# Components Directory

This directory contains all reusable React components for the BuildFlow application, organized by feature domain and responsibility.

## Summary

The components directory follows a modular architecture where components are grouped by their domain or purpose. Each subdirectory contains related components, tests, and documentation. The `ui/` folder contains base shadcn/ui components, while feature-specific folders contain business logic components.

## Files Structure

```
components/
├── address/             # Address input components and forms
│   └── README.md
├── admin/               # Admin panel specific components
│   ├── AdminLayout.tsx
│   ├── UserDetailsDrawer.tsx
│   ├── UsersTable.tsx
│   └── index.ts
├── auth/                # Authentication components and forms
│   └── README.md
├── dashboard/           # Dashboard layout components
│   ├── DashboardLayout.tsx
│   ├── DashboardLayout.test.tsx
│   └── index.ts
├── dev/                 # Development-only components
│   └── README.md
├── home/                # Landing page components
│   ├── AuthSection.tsx
│   ├── Brands.tsx
│   ├── Contact.tsx
│   ├── Features.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   └── index.ts
├── navbar/              # Navigation bar components
│   └── README.md
├── project/             # Project-related components
│   ├── NewProjectForm.tsx
│   ├── ProjectList.tsx
│   ├── ProjectList.test.tsx
│   ├── ProjectsSection.tsx
│   ├── ProjectsSection.test.tsx
│   └── index.ts
├── theme/               # Theme system components
│   ├── ThemeShowcase.tsx
│   ├── ThemeToggle.tsx
│   └── index.ts
└── ui/                  # Base UI components (shadcn/ui)
    └── (excluded from documentation per requirements)
```

## Subdirectory Overview

### [address/](./address/README.md)
Comprehensive address input library with individual field components and flexible forms. Includes validation, touch-based UX, and support for multiple address formats.

**Key Components:**
- UnitNumber, StreetNumber, StreetName, City, StateProvince, PostalCode, Country
- FlexibleAddressForm - Configurable address collection form

### [admin/](./admin/README.md)
Admin panel components for user management and system administration.

**Key Components:**
- AdminLayout - Admin panel layout wrapper
- UsersTable - User listing and management table
- UserDetailsDrawer - User details side panel

### [auth/](./auth/README.md)
Authentication components including login, signup, and credential input fields with integrated validation.

**Key Components:**
- EmailField, PasswordField, UsernameField, PhoneField, NameField
- LoginForm, FlexibleSignUpForm

### [dashboard/](./dashboard/README.md)
Dashboard layout components and container elements for authenticated user views.

**Key Components:**
- DashboardLayout - Main dashboard layout with navigation

### [dev/](./dev/README.md)
Development-only components that provide debugging tools and configuration information.

**Key Components:**
- DevPanel - Floating development panel (only renders in dev mode)

### [home/](./home/README.md)
Landing page components for the public-facing website.

**Key Components:**
- Hero - Landing page hero section
- Features - Feature showcase section
- AuthSection - Login/signup section
- Contact - Contact information section
- Brands - Brand showcase section
- Footer - Page footer
- Navbar - Home page navigation

### [navbar/](./navbar/README.md)
Navigation bar component system with flexible configuration and theme integration.

**Key Components:**
- FlexibleNavbar - Configurable navigation bar
- Logo, LoginButton, SignUpButton, Avatar

### [project/](./project/README.md)
Project management components for creating and viewing projects.

**Key Components:**
- ProjectsSection - Project listing section
- ProjectList - Project cards display
- NewProjectForm - Project creation form

### [theme/](./theme/README.md)
Theme system components for light/dark mode and theme customization.

**Key Components:**
- ThemeToggle - Theme switcher with multiple variants
- ThemeShowcase - Theme demonstration page

### ui/
Base UI components from shadcn/ui library. Not documented per requirements but contains foundational components like Button, Input, Card, etc.

## Component Patterns

### Component Architecture
- **Atomic Design** - Small components compose into larger features
- **Composition** - Flexible components accept children and render props
- **Controlled Components** - Parent components control state via props
- **Type Safety** - Full TypeScript interfaces for all components

### Common Props Interface
Most components extend from base interfaces:
```typescript
interface BaseFieldProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  errors?: string[];
  enableValidation?: boolean;
  validationMode?: 'required' | 'optional';
  onValidationChange?: (result: ValidationResult) => void;
}
```

### Validation Integration
Components integrate with the centralized validation service for:
- Touch-based validation (errors after user interaction)
- Real-time validation after first touch
- Required/optional validation modes
- Consistent error messaging

### Styling Approach
- **Tailwind CSS** - Utility-first styling
- **Theme Variables** - CSS custom properties for theming
- **Responsive Design** - Mobile-first breakpoints
- **Accessibility** - Proper ARIA labels and keyboard navigation

## Testing Strategy

### Test Coverage
- **Individual Components** - Unit tests for each component
- **Integration Tests** - Form and workflow testing
- **Accessibility Tests** - Screen reader and keyboard navigation
- **User Interaction Tests** - Click, change, blur event handling

### Test Patterns
```typescript
// Component rendering
test('ComponentName_shouldRender_withDefaultProps', () => {
  render(<Component />);
  expect(screen.getByRole('...')).toBeInTheDocument();
});

// User interaction
test('ComponentName_shouldCallCallback_whenUserInteracts', () => {
  const mockCallback = jest.fn();
  render(<Component onChange={mockCallback} />);
  fireEvent.click(screen.getByRole('button'));
  expect(mockCallback).toHaveBeenCalled();
});

// Validation
test('ComponentName_shouldShowError_whenValidationFails', () => {
  render(<Component value="" enableValidation={true} />);
  fireEvent.blur(screen.getByRole('textbox'));
  expect(screen.getByText(/required/)).toBeInTheDocument();
});
```

## Development Guidelines

### Adding New Components
1. Create component file in appropriate subdirectory
2. Add TypeScript interface extending base props
3. Implement component with proper TypeScript types
4. Add comprehensive test file
5. Export from subdirectory index.ts
6. Update subdirectory README
7. Update this components README

### Component File Structure
```typescript
// imports
import React from 'react';
import { Button } from '@/components/ui/button';

// interface
export interface MyComponentProps {
  value: string;
  onChange: (value: string) => void;
}

// component
export const MyComponent: React.FC<MyComponentProps> = ({ 
  value, 
  onChange 
}) => {
  return <div>...</div>;
};
```

### Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Test Files**: Component name + `.test.tsx`
- **Index Files**: `index.ts` for exports
- **README Files**: `README.md` in each subdirectory

## Related Documentation

- [Address Components](./address/README.md) - Address input library
- [Auth Components](./auth/README.md) - Authentication components
- [Navbar Components](./navbar/README.md) - Navigation system
- [Dev Components](./dev/README.md) - Development tools
