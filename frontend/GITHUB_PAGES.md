# GitHub Pages Deployment Guide

## Overview

The BuildFlow frontend is automatically deployed to GitHub Pages, providing a live demo of the application running in standalone mode with mock authentication and data.

**Live Demo URL**: [https://hamidrezarezaeigithub.github.io/BuildFlow/](https://hamidrezarezaeigithub.github.io/BuildFlow/)

## Key Features

- **Automatic Deployment**: Triggered on every push to `main` or `master` branch
- **Standalone Mode**: Uses mock data and authentication (no backend required)
- **Mock Users**: Pre-configured test accounts for demonstration
- **SPA Routing**: Full client-side routing support with 404.html fallback

## Configuration Files

### 1. Workflow File
**Location**: `.github/workflows/deploy-frontend.yml`

The GitHub Actions workflow handles:
- Installing Node.js and dependencies
- Building frontend with GitHub Pages profile
- Creating 404.html for SPA routing
- Deploying to GitHub Pages

### 2. Environment Configuration
**Location**: `frontend/.env.github-pages`

Settings for GitHub Pages deployment:
```env
VITE_APP_MODE=standalone          # No backend integration
VITE_API_BASE_URL=/BuildFlow/api  # GitHub Pages path
VITE_BASE_PATH=/BuildFlow/        # Repository subdirectory
VITE_BACKEND_ENABLED=false        # Mock data only
VITE_ENABLE_MOCK_AUTH=true        # Mock authentication
VITE_ENABLE_MOCK_DATA=true        # Mock data
VITE_ENABLE_CONSOLE_LOGS=true     # Debug logging
VITE_ENVIRONMENT=development      # Development profile
```

### 3. Vite Configuration
**Location**: `frontend/vite.config.ts`

Updated to support dynamic base paths:
```typescript
base: process.env.VITE_BASE_PATH || '/'
```

This allows:
- Local development: uses root path `/`
- GitHub Pages: uses repository path `/BuildFlow/`

## Mock Users

Pre-configured Canadian accounts for testing (defined in `src/mocks/MockUsers.ts`):

| Username   | Role  | Name             | Location      |
| ---------- | ----- | ---------------- | ------------- |
| `admin`    | Admin | Alexandre Dubois | Vancouver, BC |
| `testuser` | User  | Sarah MacDonald  | Toronto, ON   |

**Note**: Passwords are configured in the source code and meet validation requirements (8+ chars, uppercase, lowercase, digit, special character).

### User Registration

In addition to the pre-configured accounts above, users can **register new accounts** directly through the signup form. These dynamically created accounts:
- Are stored in browser memory for the session
- Can be used to login immediately after registration
- Persist until page refresh or browser close
- Provide a complete testing experience without backend integration

This allows for comprehensive testing of both registration and login flows on GitHub Pages.

## Local Testing

### Build and Preview GitHub Pages Version

```bash
# Build with GitHub Pages profile
npm run build:github-pages

# Preview locally (simulates GitHub Pages environment)
npm run preview:github-pages
```

This will:
1. Build with `.env.github-pages` configuration
2. Apply `/BuildFlow/` base path
3. Enable mock authentication and data
4. Start preview server (typically at http://localhost:4173)

## Development Modes

The configuration supports multiple development modes without disruption:

### 1. Standalone Development (Default)
```bash
npm run dev
```
- Uses `.env.development`
- Mock auth and data enabled
- Runs on port 3000
- No backend required

### 2. Integrated Development
```bash
npm run dev:integrated
```
- Uses `.env.development.integrated`
- Connects to local backend at http://localhost:8080
- Real API calls
- Backend must be running

### 3. GitHub Pages Build
```bash
npm run build:github-pages
```
- Uses `.env.github-pages`
- Standalone mode with `/BuildFlow/` base path
- Mock data enabled
- Optimized for GitHub Pages

### 4. Production Build
```bash
npm run build
```
- Uses `.env.production`
- Integrated mode (expects backend)
- No base path (assumes root deployment)
- All mocks disabled

## How It Works

### Deployment Process

1. **Trigger**: Push to `main` or `master` branch with changes to `frontend/` directory
2. **Build**: GitHub Actions installs dependencies and builds with `.env.github-pages`
3. **SPA Support**: Creates `404.html` copy of `index.html` for client-side routing
4. **Deploy**: Uploads build artifacts to GitHub Pages
5. **Live**: Application available at repository URL

### Base Path Handling

The application handles base paths automatically:

- **Development**: No base path needed, uses `/`
- **GitHub Pages**: Uses `/BuildFlow/` as configured in workflow
- **Production**: Uses `/` or custom path as needed

All asset references (CSS, JS, images) are automatically prefixed with the correct base path during build.

### SPA Routing

GitHub Pages serves static files. To support client-side routing:

1. Main page served from `index.html`
2. Direct navigation to routes returns `404.html` (copy of `index.html`)
3. React Router takes over and renders correct route
4. All routing happens client-side after initial load

## Troubleshooting

### Issue: Assets not loading

**Problem**: CSS/JS files return 404 errors

**Solution**: Verify `VITE_BASE_PATH` is set correctly in workflow:
```yaml
env:
  VITE_BASE_PATH: /BuildFlow/
```

### Issue: Routes return 404

**Problem**: Direct navigation to routes (e.g., `/BuildFlow/dashboard`) fails

**Solution**: Ensure `404.html` is created during build:
```yaml
- name: Create 404.html for SPA routing
  working-directory: ./frontend
  run: cp dist/index.html dist/404.html
```

### Issue: Mock data not working

**Problem**: Application tries to connect to backend

**Solution**: Verify `.env.github-pages` has correct settings:
```env
VITE_BACKEND_ENABLED=false
VITE_ENABLE_MOCK_AUTH=true
VITE_ENABLE_MOCK_DATA=true
```

## Maintenance

### Updating Mock Data

Mock users are defined in `src/mocks/MockUsers.ts`. To add or modify users:

1. Edit `mockUsers` array
2. Update `mockCredentials` object
3. Commit changes
4. Deployment will automatically pick up new mock data

### Updating Deployment

The workflow configuration can be modified in `.github/workflows/deploy-frontend.yml`:

- Change trigger conditions (branches, paths)
- Adjust Node.js version
- Modify build commands
- Update deployment settings

### Monitoring Deployments

1. Go to repository **Actions** tab
2. Select **Deploy Frontend to GitHub Pages** workflow
3. View build logs and deployment status
4. Check deployment history

## Non-Disruptive Design

The GitHub Pages setup is designed to not interfere with other workflows:

✅ **Local Development**: Unaffected, uses default `.env.development`
✅ **Integrated Testing**: Separate configuration, not impacted
✅ **Production Builds**: Independent process, no conflicts
✅ **Backend Integration**: Maven build still includes frontend normally
✅ **CI Pipeline**: Existing tests and builds continue to work

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Actions Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [BuildFlow Frontend README](./README.md)

---

**Note**: GitHub Pages deployment uses the free tier, which is suitable for public repositories and demo purposes. For production deployments with sensitive data, use a proper hosting solution with backend integration.
