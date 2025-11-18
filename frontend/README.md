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
- **Vitest 4.0** - Fast testing framework powered by Vite
- **React Testing Library 16.3** - Component testing utilities
- **jsdom** - Browser environment simulation
- **@vitest/ui** - Interactive test UI
- **@vitest/coverage-v8** - Code coverage reporting

### Development Tools
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📁 Project Structure

```
frontend/
├── src/                           # Main source directory - [📖 Documentation](src/README.md)
│   ├── components/               # Reusable React components - [📖 Documentation](src/components/README.md)
│   │   ├── address/             # Address input library - [📖 Documentation](src/components/address/README.md)
│   │   │   ├── City.tsx
│   │   │   ├── Country.tsx
│   │   │   ├── FlexibleAddressForm.tsx
│   │   │   ├── PostalCode.tsx
│   │   │   ├── StateProvince.tsx
│   │   │   ├── StreetName.tsx
│   │   │   ├── StreetNumber.tsx
│   │   │   ├── StreetNumberName.tsx
│   │   │   ├── UnitNumber.tsx
│   │   │   └── index.ts
│   │   ├── admin/               # Admin panel components - [📖 Documentation](src/components/admin/README.md)
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── UserDetailsDrawer.tsx
│   │   │   ├── UsersTable.tsx
│   │   │   └── index.ts
│   │   ├── auth/                # Authentication components - [📖 Documentation](src/components/auth/README.md)
│   │   │   ├── Email.tsx
│   │   │   ├── Password.tsx
│   │   │   ├── ConfirmPassword.tsx
│   │   │   ├── Username.tsx
│   │   │   ├── UsernameEmail.tsx
│   │   │   ├── Name.tsx
│   │   │   ├── Phone.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── FlexibleSignUpForm.tsx
│   │   │   └── index.ts
│   │   ├── dashboard/           # Dashboard layout - [📖 Documentation](src/components/dashboard/README.md)
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── index.ts
│   │   ├── dev/                 # Development tools - [📖 Documentation](src/components/dev/README.md)
│   │   │   ├── DevPanel.tsx
│   │   │   └── index.ts
│   │   ├── home/                # Landing page components - [📖 Documentation](src/components/home/README.md)
│   │   │   ├── AuthSection.tsx
│   │   │   ├── Brands.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── index.ts
│   │   ├── navbar/              # Navigation components - [📖 Documentation](src/components/navbar/README.md)
│   │   │   ├── FlexibleNavbar.tsx
│   │   │   ├── Logo.tsx
│   │   │   ├── LoginButton.tsx
│   │   │   ├── SignUpButton.tsx
│   │   │   ├── Avatar.tsx
│   │   │   └── index.ts
│   │   ├── project/             # Project components - [📖 Documentation](src/components/project/README.md)
│   │   │   ├── NewProjectForm.tsx
│   │   │   ├── ProjectList.tsx
│   │   │   ├── ProjectsSection.tsx
│   │   │   └── index.ts
│   │   ├── theme/               # Theme system - [📖 Documentation](src/components/theme/README.md)
│   │   │   ├── ThemeShowcase.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── index.ts
│   │   └── ui/                  # Base UI components (shadcn/ui)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── ...
│   ├── config/                  # Environment configuration - [📖 Documentation](src/config/README.md)
│   │   ├── environment.ts
│   │   └── index.ts
│   ├── contexts/                # React Context providers - [📖 Documentation](src/contexts/README.md)
│   │   ├── AppProviders.tsx
│   │   ├── AppRouter.tsx
│   │   ├── AuthContext.tsx
│   │   ├── NavigationContext.tsx
│   │   ├── RouterProvider.tsx
│   │   ├── ThemeContext.tsx
│   │   └── index.ts
│   ├── mocks/                   # Mock data for development - [📖 Documentation](src/mocks/README.md)
│   │   ├── MockUsers.ts
│   │   ├── MockProjects.ts
│   │   └── index.ts
│   ├── pages/                   # Route page components - [📖 Documentation](src/pages/README.md)
│   │   ├── project/            # Project pages - [📖 Documentation](src/pages/project/README.md)
│   │   │   ├── NewProject.tsx
│   │   │   └── index.ts
│   │   ├── temp/               # Temporary demo pages - [📖 Documentation](src/pages/temp/README.md)
│   │   │   ├── AddressPage.tsx
│   │   │   ├── FlexibleBottomNavbarDemo.tsx
│   │   │   ├── FlexibleSignUpPage.tsx
│   │   │   └── Theme.tsx
│   │   ├── AdminPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── HomePage.tsx
│   │   └── index.ts
│   ├── services/                # API services - [📖 Documentation](src/services/README.md)
│   │   ├── address/            # Address types
│   │   │   ├── AddressDtos.ts
│   │   │   └── index.ts
│   │   ├── admin/              # Admin service
│   │   │   ├── AdminMockService.ts
│   │   │   ├── AdminService.ts
│   │   │   ├── adminServiceFactory.ts
│   │   │   ├── IAdminService.ts
│   │   │   └── index.ts
│   │   ├── auth/               # Authentication service and types - [📖 Documentation](src/services/auth/README.md)
│   │   │   ├── AuthDtos.ts
│   │   │   ├── AuthMockService.ts
│   │   │   ├── AuthService.ts
│   │   │   ├── authServiceFactory.ts
│   │   │   ├── IAuthService.ts
│   │   │   └── index.ts
│   │   ├── contact/            # Contact types
│   │   │   ├── ContactDtos.ts
│   │   │   └── index.ts
│   │   ├── estimate/           # Estimate types
│   │   │   ├── EstimateDtos.ts
│   │   │   └── index.ts
│   │   ├── project/            # Project service and types - [📖 Documentation](src/services/project/README.md)
│   │   │   ├── IProjectService.ts
│   │   │   ├── ProjectDtos.ts
│   │   │   ├── ProjectMockService.ts
│   │   │   ├── ProjectService.ts
│   │   │   ├── projectServiceFactory.ts
│   │   │   └── index.ts
│   │   ├── quote/              # Quote types
│   │   │   ├── QuoteDtos.ts
│   │   │   └── index.ts
│   │   ├── user/               # User types
│   │   │   ├── UserDtos.ts
│   │   │   └── index.ts
│   │   ├── validation/         # Validation service - [📖 Documentation](src/services/validation/README.md)
│   │   │   ├── types.ts
│   │   │   ├── ValidationService.ts
│   │   │   ├── useSmartFieldValidation.ts
│   │   │   └── index.ts
│   │   ├── workitem/           # Work item types
│   │   │   ├── WorkItemDtos.ts
│   │   │   └── index.ts
│   │   ├── ApiService.tsx
│   │   ├── MvcDtos.ts
│   │   ├── PaginationDtos.ts
│   │   ├── TimerService.ts
│   │   ├── apiHelpers.ts
│   │   └── index.ts
│   ├── test/                    # Testing utilities - [📖 Documentation](src/test/README.md)
│   │   ├── config.test.ts
│   │   ├── setup.ts
│   │   └── test-utils.tsx
│   ├── utils/                   # Utility functions - [📖 Documentation](src/utils/README.md)
│   │   ├── useMediaQuery.ts
│   │   ├── utils.test.ts
│   │   └── utils.ts
│   ├── App.tsx                  # Main application component
│   ├── App.css                  # Global application styles
│   ├── main.tsx                 # Application entry point
│   ├── index.css                # Global CSS imports
│   └── vite-env.d.ts           # TypeScript environment declarations
├── public/                      # Static assets
├── .env.development            # Development environment config
├── .env.production             # Production environment config
├── .env.uat                    # UAT environment config
├── .env.integrated             # Integrated backend config
├── .env.github-pages           # GitHub Pages config
├── .env.test                   # Test environment config
├── vitest.config.ts            # Vitest test configuration
├── tsconfig.json               # TypeScript IDE configuration
├── tsconfig.build.json         # TypeScript build configuration
├── tsconfig.node.json          # TypeScript Node configuration
├── vite.config.ts              # Vite build configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## ⚙️ TypeScript Configuration

The project uses **separate TypeScript configurations** for IDE support and production builds:

### Configuration Files

#### `tsconfig.json` - IDE Configuration
- **Purpose**: Used by VS Code for IntelliSense, type checking, and import resolution
- **Includes**: All TypeScript files including test files (`*.test.ts`, `*.test.tsx`)
- **Features**: 
  - Path aliases (`@/*` → `./src/*`) for clean imports
  - Vitest globals and jest-dom type declarations
  - Full type checking for development experience

#### `tsconfig.build.json` - Build Configuration
- **Purpose**: Used during production builds (`npm run build`)
- **Extends**: `tsconfig.json` for base configuration
- **Excludes**: Test files and test utilities to prevent build errors
- **Features**:
  - Ensures test-specific code doesn't cause compilation errors
  - Faster build times by skipping unnecessary files
  - Production-ready output without test dependencies

#### `tsconfig.node.json` - Node Configuration
- **Purpose**: TypeScript configuration for Vite config files
- **Scope**: Build tools and configuration files only

### Why Separate Configurations?

This pattern solves a common TypeScript challenge:
- ✅ **IDE Support**: Test files get full IntelliSense and path alias resolution in VS Code
- ✅ **Clean Builds**: Test files excluded from production compilation
- ✅ **Type Safety**: Both development and production maintain strong typing
- ✅ **No Import Changes**: No need to modify import patterns in test files

### Build Scripts

All build scripts use `tsconfig.build.json` to exclude test files:
```json
"build": "tsc --project tsconfig.build.json && vite build"
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
npm run build                 # Build for production (TypeScript check + Vite build)
npm run build:uat             # Build for UAT environment
npm run build:production      # Build for production environment
npm run build:github-pages    # Build for GitHub Pages deployment
```

### Preview
```bash
npm run preview               # Preview production build locally
npm run preview:github-pages  # Preview GitHub Pages build locally
```

### Code Quality
```bash
npm run lint         # Run ESLint for code quality checks
```

### Testing
```bash
npm test             # Run all tests with Vitest
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run test:ui      # Open Vitest UI for interactive testing
```

### Individual Test Files
```bash
npm test -- src/test/config.test.ts                    # Test configuration
npm test -- src/components/ui/button.test.tsx          # Test button component
npm test -- src/contexts/ThemeContext.test.tsx         # Test theme context
```

## 🚀 Deployment

### GitHub Pages Deployment (Automatic)

The frontend is automatically deployed to GitHub Pages on every push to `main` or `master` branch:

**Live Demo**: [https://hamidrezarezaeigithub.github.io/BuildFlow/](https://hamidrezarezaeigithub.github.io/BuildFlow/)

#### Deployment Configuration
- **Profile**: Development mode with mock authentication and data
- **Backend**: Not integrated - uses mock users and data from `src/mocks/`
- **Auto-deploy**: Triggered on push to main/master branch
- **Mock Users**: Available for testing (see `src/mocks/MockUsers.ts`)
  - Username: `admin` / Password: `password123`
  - Username: `testuser` / Password: `password123`

#### How It Works
1. GitHub Actions workflow detects changes to `frontend/` directory
2. Builds frontend with `.env.github-pages` configuration
3. Deploys static assets to GitHub Pages
4. Available at repository URL with `/BuildFlow/` base path

#### Local GitHub Pages Testing
```bash
npm run build:github-pages    # Build with GitHub Pages profile
npm run preview:github-pages  # Preview locally at http://localhost:4173
```

### Manual Production Build

For integrated backend deployment or local testing:

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

---

**BuildFlow Frontend** - Building the future of construction management, one component at a time. 🏗️