# BuildFlow Frontend

A modern React application for construction project management built with TypeScript, Vite, and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

## 📋 Available Commands

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with hot reload |
| `npm run build`   | Build production bundle                  |
| `npm run preview` | Preview production build locally         |
| `npm run test`    | Run Jest test suite                      |
| `npm run lint`    | Run ESLint for code quality checks       |
| `npm run format`  | Format code with Prettier                |

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── layout/          # Layout components (AppShell, Sidebar, etc.)
│   └── ui/              # Base UI components (shadcn/ui based)
├── pages/               # Application pages/routes
├── lib/                 # Utility functions and configurations
├── styles/              # Global styles and CSS
└── assets/              # Static assets
```

## 🎯 Current Application State

### Architecture Overview

- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.0 with Hot Module Replacement
- **Styling**: Tailwind CSS v4 with custom design system
- **UI Components**: Radix UI primitives with custom wrapper components
- **Routing**: React Router v6 with nested routing
- **Testing**: Jest with React Testing Library
- **Icons**: Lucide React icon library

### Core Features Implemented

1. **Responsive Layout System**
   - **Mobile (default)**: Top app bar with centered title + bottom tab navigation
     - Header: Menu button (left), centered title, avatar (right)
     - Bottom tabs: Fixed position, safe-area aware, icons + labels, 44px touch targets
     - Sidebar: Hidden, accessible via mobile Sheet overlay
   - **Desktop (md+)**: Persistent collapsible left sidebar, hidden bottom tabs
     - Sidebar: Icons + labels, collapsible, active route highlighting
     - Full-width content area with multi-column layouts

2. **Responsive Page Designs**
   - **Projects**: 
     - Mobile: Search + card list (single column), empty states
     - Desktop: Search + data table with sortable columns (Name, Owner, Address, Updated)
   - **ProjectDetail**: 
     - Mobile: Summary card → full-width tabs (Overview, Estimates, Files)
     - Desktop: Two-column layout with sticky left summary + right tabbed content
   - **Estimates**: 
     - Mobile: Search + list rows with chevron navigation
     - Desktop: Search + data table (Name, Created, Lines, Total, Actions)
   - **Catalog**: 
     - Mobile: Search + collapsible category sections
     - Desktop: Left filters sidebar (64 wide) + right data table/grid
   - **Settings**: User preferences and application configuration

3. **UI Component Library**
   - Complete set of accessible UI components based on Radix UI
   - Components include: Avatar, Button, Card, Dialog, Dropdown Menu, Input, Label, Navigation Menu, Select, Separator, Sheet, Tabs
   - Consistent TypeScript typing with proper prop interfaces
   - CSS styling with class-variance-authority for component variants
   - All components follow mobile-first responsive patterns

### Technical Configuration

- **TypeScript**: Strict mode enabled with comprehensive type checking
- **Path Aliases**: `@/*` mapped to `src/*` for clean imports
- **CSS**: Custom design tokens with light/dark theme support
- **Testing**: Complete Jest setup with TypeScript support and DOM testing utilities
- **Code Quality**: ESLint and Prettier configured for consistent code style

### Development Status

- ✅ Complete responsive layout system with distinct mobile/desktop experiences
- ✅ All core UI components implemented with TypeScript
- ✅ Responsive page designs implemented (Projects, ProjectDetail, Estimates, Catalog)
- ✅ Routing and navigation fully functional
- ✅ Testing infrastructure configured
- ✅ Mobile-first design with proper touch targets (44px minimum)
- ✅ Desktop multi-column layouts and data tables
- ✅ All sample/mock data removed
- 🚧 Business logic implementation pending
- 🚧 API integration pending
- 🚧 Data persistence layer to be implemented

### Current Component State

All UI components are properly typed and functional:

- Form components support controlled/uncontrolled patterns
- Navigation components handle active states and keyboard navigation
- Layout components are fully responsive with mobile-first design
- All components follow accessibility best practices (ARIA, focus management)

### Key Dependencies

- **Core**: React, React DOM, React Router
- **UI**: Radix UI primitives, Lucide icons, CVA for variants
- **Styling**: Tailwind CSS v4, PostCSS, Autoprefixer
- **Build**: Vite with React plugin, TypeScript
- **Testing**: Jest, React Testing Library, @testing-library/jest-dom
- **Development**: ESLint, Prettier, various type definitions

The application is in a solid foundational state with a complete UI component library, fully responsive layout system with distinct mobile/desktop experiences, and proper TypeScript configuration. All sample/mock data has been removed, and the app now displays appropriate empty states. The next phase involves implementing business logic, API integration, and data management layers.

## 🛠️ Development Guidelines

### Adding New Components

1. Create TypeScript interfaces for all props
2. Use Radix UI primitives when applicable
3. Apply consistent styling patterns with Tailwind
4. Include accessibility attributes and keyboard navigation
5. Add unit tests for component behavior

### Styling Conventions

- Use Tailwind utility classes for styling
- Custom CSS variables defined in `globals.css` for theme tokens
- Mobile-first responsive design approach
- Touch-friendly interaction targets (44px minimum)
- Responsive breakpoints: `sm=640px`, `md=768px`, `lg=1024px`

### Responsive Design Patterns

- **Mobile-only elements**: `flex md:hidden`
- **Desktop-only elements**: `hidden md:flex` or `hidden md:block`
- **Responsive grids**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- **Responsive layouts**: Single column mobile → multi-column desktop
- **Sticky positioning**: Desktop sidebars use `sticky top-4`
- **Safe areas**: Bottom navigation accounts for mobile safe areas

### Testing Strategy

- Unit tests for all UI components
- Integration tests for page components
- Smoke tests to ensure pages render without errors
- Accessibility testing with testing-library utilities

## 🔧 Configuration Files

- `vite.config.js` - Vite build configuration with path aliases
- `tsconfig.json` - TypeScript compiler options with strict mode
- `tailwind.config.js` - Tailwind CSS configuration with custom theme
- `jest.config.cjs` - Jest testing framework configuration
- `components.json` - shadcn/ui component library configuration
- `.vscode/settings.json` - VS Code workspace settings for Tailwind CSS IntelliSense

## 🎨 Design System

The application uses a comprehensive design system built on Tailwind CSS with:

- Consistent color palette supporting light/dark themes
- Typography scale with semantic font weights
- Spacing system based on rem units
- Component variants using class-variance-authority
- Accessible focus states and color contrast ratios

## 📱 Browser Support

- Modern browsers with ES2020 support
- Mobile browsers with touch interaction
- Keyboard navigation support
- Screen reader compatibility

## 🤝 Contributing

1. Follow the established TypeScript patterns
2. Maintain test coverage for new features
3. Use semantic commit messages
4. Run linting and formatting before commits
5. Test on both desktop and mobile viewports
