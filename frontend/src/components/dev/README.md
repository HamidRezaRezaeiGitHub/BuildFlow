# Development Components

This directory contains components that are only available in development mode for debugging and development purposes.

## Components

### DevPanel
A floating development panel built with ShadCN components that provides:
- **Configuration Display**: Shows current environment variables and configuration settings
- **Debug Information**: Displays browser storage info, user agent, and other debugging data
- **Development Tools**: Quick actions for clearing storage, logging config, and page reload

#### Usage
```tsx
import { DevPanel } from '@/components/dev';

// The DevPanel automatically checks if it's in development mode
// and only renders when config.isDevelopment is true
function App() {
  return (
    <div>
      {/* Your app content */}
      <DevPanel />
    </div>
  );
}
```

#### Features
- **Auto-hide in Production**: Only renders in development mode
- **Modern Design**: Built with ShadCN Card and Collapsible components
- **Clear Warning**: Orange-themed design with prominent development-only warning
- **Collapsible Sections**: Each section (Config, Debug, Tools) can be expanded/collapsed independently
- **Responsive**: Positioned as a floating panel in the bottom-right corner
- **Accessible**: Full keyboard navigation and screen reader support

#### Development Mode Detection
The DevPanel uses `config.isDevelopment` from the environment configuration to determine if it should render. This ensures it never appears in production builds.

## Guidelines

- Components in this directory should only be used during development
- Always check for development mode before rendering (`config.isDevelopment`)
- Keep development tools lightweight and non-intrusive
- Use clear naming and documentation for debugging utilities