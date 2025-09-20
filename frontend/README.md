# BuildFlow Frontend

A modern React-based web application for construction project management, built with TypeScript, Vite, and a comprehensive UI component system.

## 🏗️ Project Overview

BuildFlow is a construction management platform that helps construction professionals manage projects, create estimates, track progress, and collaborate effectively. The frontend provides an intuitive interface for project management, analytics, and administrative functions.

### Key Features

- **📊 Project Analytics** - Real-time insights and reporting with progress tracking and budget analysis
- **📄 Smart Estimates** - Intelligent pricing and material database for accurate estimates
- **👥 Team Collaboration** - Real-time communication and task assignment
- **📱 Mobile-First Design** - Responsive design that works on all devices
- **🔒 Role-Based Access** - Secure authentication with VIEWER → USER → PREMIUM_USER → ADMIN hierarchy
- **🎨 Theme System** - Light/dark mode with 7+ theme toggle variants
- **⚡ Real-Time Updates** - Live project updates and notifications

## 🛠️ Tech Stack

### Core Technologies
- **React 18.2** - UI framework with hooks and functional components
- **TypeScript 5.0** - Type-safe development
- **Vite 4.4** - Fast build tool and development server
- **React Router 6.30** - Client-side routing

### UI & Styling
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **CVA (Class Variance Authority)** - Component variant management

### Testing
- **Jest 30.1** - Testing framework
- **React Testing Library 16.3** - Component testing utilities
- **ts-jest 29.4** - TypeScript support for Jest
- **jsdom** - Browser environment simulation

### Development Tools
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📁 Project Structure

```
src/
├── components/
│   ├── home/           # Landing page components
│   │   ├── Auth.tsx    # Authentication forms
│   │   ├── Features.tsx # Feature showcase
│   │   ├── Hero.tsx    # Landing hero section
│   │   ├── Navbar.tsx  # Navigation bar
│   │   └── ...
│   ├── layouts/        # Layout components
│   │   ├── AppLayout.tsx    # Authenticated app layout
│   │   ├── HomeLayout.tsx   # Public page layout
│   │   └── AdminLayout.tsx  # Admin panel layout
│   ├── theme/          # Theme system components
│   │   ├── ThemeToggle.tsx  # 7+ toggle variants
│   │   └── ThemeShowcase.tsx # Theme demo page
│   ├── ui/             # Reusable UI components
│   │   ├── button.tsx  # Button variants
│   │   ├── card.tsx    # Card components
│   │   ├── tabs.tsx    # Tab system
│   │   └── ...
│   └── admin/          # Admin-specific components
├── contexts/           # React Context providers
│   ├── AuthContext.tsx      # Authentication state
│   ├── ThemeContext.tsx     # Theme management
│   ├── AppProviders.tsx     # Provider composition
│   └── RouterProvider.tsx   # Router setup
├── pages/              # Route components
│   ├── Home.tsx        # Landing page
│   ├── Dashboard.tsx   # User dashboard
│   ├── Admin.tsx       # Admin panel
│   └── Theme.tsx       # Theme showcase
├── router/             # Routing configuration
│   └── AppRouter.tsx   # Route definitions & protection
├── services/           # API and business logic
│   ├── ApiService.tsx       # HTTP client
│   ├── AuthService.tsx      # Authentication API
│   ├── AdminService.tsx     # Admin operations
│   └── dtos/               # Data transfer objects
├── utils/              # Pure utility functions
│   ├── validation.ts   # Form validation
│   ├── addressUtils.ts # Address formatting
│   └── utils.ts        # General utilities
└── test/               # Testing configuration
    ├── setup.ts        # Jest setup
    ├── test-utils.tsx  # Testing utilities
    └── config.test.ts  # Configuration tests
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

## 📜 Available Scripts

### Development
```bash
npm run dev          # Start development server with hot reload
npm run preview      # Preview production build locally
```

### Building
```bash
npm run build        # Build for production (TypeScript check + Vite build)
```

### Code Quality
```bash
npm run lint         # Run ESLint for code quality checks
```

### Testing
```bash
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Individual Test Files
```bash
npx jest src/test/config.test.ts                    # Test Jest configuration
npx jest src/components/ui/button.test.tsx          # Test button component
npx jest src/contexts/ThemeContext.test.tsx         # Test theme context
```

## 🔐 Authentication & Routes

### Route Structure
- **`/`** - Home page (public, landing page with auth forms)
- **`/theme`** - Theme showcase (public, demonstrates design system)
- **`/dashboard`** - User dashboard (protected, requires authentication)
- **`/admin`** - Admin panel (protected, requires admin role)

### Route Protection
- **ProtectedRoute** - Requires user authentication
- **AdminRoute** - Requires admin role (currently auth-only, role check pending)
- **Automatic redirects** - Unauthenticated users redirect to home

### Authentication Flow
1. **Registration** - Sign up with email/password
2. **Login** - Authenticate with credentials
3. **JWT Tokens** - Secure token-based authentication
4. **Role-based Access** - Different permissions per user role

## 🎨 Theme System

### Available Theme Toggles
1. **DropdownThemeToggle** - Dropdown with system/light/dark options
2. **SwitchThemeToggle** - Switch with sun/moon icons
3. **SingleChangingIconThemeToggle** - Single icon that changes
4. **ToggleGroupThemeToggle** - Toggle group with icons
5. **ButtonThemeToggle** - Simple button toggle
6. **SegmentedThemeToggle** - Segmented control style
7. **CompactThemeToggle** - Minimal compact version

### Theme Features
- **System Theme Detection** - Automatically detects OS preference
- **Persistent Storage** - Remembers user choice in localStorage
- **CSS Variables** - Dynamic theme switching with CSS custom properties
- **Accessible** - Proper ARIA labels and keyboard navigation

## 🧪 Testing Strategy

### Test Configuration
- **Jest** with TypeScript support via ts-jest
- **React Testing Library** for component testing
- **jsdom** environment for browser API simulation
- **Custom test utilities** in `src/test/test-utils.tsx`

### Testing Utilities
- **Custom render** with theme providers
- **Mock factories** for localStorage, matchMedia, ResizeObserver
- **User event setup** for interaction testing
- **Accessibility helpers** for a11y testing

### Current Test Coverage
- ✅ **119 tests passing** across 8 test suites
- ✅ **Component tests** - UI components with variants
- ✅ **Context tests** - Theme and auth state management
- ✅ **Utility tests** - Pure functions and helpers
- ✅ **Page tests** - Route components and layouts

## 🏗️ Component Architecture

### Layout System
- **HomeLayout** - For public pages (landing, theme showcase)
- **AppLayout** - For authenticated app pages with resizable sidebar
- **AdminLayout** - For admin panel with restricted access header

### UI Component Library
Built on **Radix UI** primitives with **Tailwind CSS** styling:
- **Accessible** - ARIA compliance and keyboard navigation
- **Customizable** - CVA-based variants and theming
- **Type-safe** - Full TypeScript definitions
- **Tested** - Comprehensive test coverage

### State Management
- **React Context** - Theme and authentication state
- **Local State** - Component-specific state with hooks
- **Provider Pattern** - Centralized state management

## 🔧 Configuration Files

### Key Configurations
- **`components.json`** - shadcn/ui configuration with custom utils path
- **`tailwind.config.js`** - Tailwind CSS with design system tokens
- **`tsconfig.json`** - TypeScript configuration with path aliases
- **`jest.config.js`** - Jest testing configuration with ES modules
- **`vite.config.ts`** - Vite build configuration

### Path Aliases
- **`@/components`** → `src/components`
- **`@/utils`** → `src/utils` (custom setup, not using lib/)
- **`@/contexts`** → `src/contexts`
- **`@/pages`** → `src/pages`

## 🚀 Deployment

### Build Process
```bash
npm run build
```
Generates optimized production build in `dist/` directory.

### Build Output
- **Static assets** - Optimized HTML, CSS, JS
- **Code splitting** - Automatic route-based splitting
- **Tree shaking** - Dead code elimination
- **Minification** - Compressed assets for production

## 🔮 Planned Features

### Near-term
- **Enhanced role checking** in AdminRoute component
- **Project CRUD operations** in dashboard
- **Real-time notifications** system
- **Advanced form validation** with better UX

### Long-term
- **Progressive Web App** (PWA) capabilities
- **Offline support** for core features
- **Advanced analytics** dashboard
- **Mobile app** integration

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `main`
2. Develop with tests
3. Run linting and testing
4. Submit pull request

### Code Standards
- **TypeScript** - Strict type checking
- **ESLint** - Code quality enforcement
- **Prettier** - Code formatting (if configured)
- **Test coverage** - Required for new features

## 📝 License

[Add your license information here]

---

**BuildFlow Frontend** - Building the future of construction management, one component at a time. 🏗️