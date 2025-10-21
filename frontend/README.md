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

## 🚀 Deployment

### GitHub Pages Deployment (Automatic)

The frontend is automatically deployed to GitHub Pages on every push to `main` or `master` branch:

**Live Demo**: [https://hamidrezarezaeigithub.github.io/BuildFlow/](https://hamidrezarezaeigithub.github.io/BuildFlow/)

#### Deployment Configuration
- **Profile**: Development mode with mock authentication and data
- **Backend**: Not integrated - uses mock users and data from `src/mocks/`
- **Auto-deploy**: Triggered on push to main/master branch
- **Mock Users**: Available for testing (see `src/mocks/authMocks.ts`)
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