# GitHub Actions Workflows

This directory contains comprehensive CI/CD workflows for the BuildFlow application.

## Workflows Overview

### 1. CI Workflow (`ci.yml`)
**Triggers:** Pull requests and pushes to master/main branch, manual dispatch

**Purpose:** Continuous Integration for development workflow

**Jobs:**
- **Frontend Build & Test**: Builds React frontend with Node.js 18, runs tests, uploads build artifacts
- **Backend Build & Test**: Compiles Java 21 backend with Maven, runs 295+ test suite
- **Integration Build**: Full application build combining frontend and backend into deployable JAR

**Key Features:**
- Parallel job execution for faster feedback
- Comprehensive caching (Maven, npm)
- Artifact preservation for troubleshooting
- JAR validation and smoke testing
- Test result reporting

### 2. Build and Package Workflow (`build-package.yml`)
**Triggers:** Git tags (v*), releases, manual dispatch with environment selection

**Purpose:** Production-ready package creation and release management

**Jobs:**
- **Build and Package**: Creates versioned application artifacts with deployment instructions
- **Validate Package**: Validates JAR structure and performs startup verification

**Key Features:**
- Semantic versioning support
- Release artifact uploading
- Environment-specific configurations (UAT/Production)
- Comprehensive deployment documentation
- Package integrity validation

### 3. Deploy Frontend to GitHub Pages (`deploy-frontend.yml`)
**Triggers:** Push to main/master branch (with frontend changes), manual dispatch

**Purpose:** Automatic deployment of frontend to GitHub Pages for live demo

**Jobs:**
- **Build**: Builds frontend with GitHub Pages profile (standalone mode with mock data)
- **Deploy**: Deploys to GitHub Pages environment

**Key Features:**
- Standalone frontend deployment (no backend required)
- Mock authentication and data for demonstration
- SPA routing support with 404.html fallback
- Base path configuration for GitHub Pages subdirectory
- Automatic deployment on frontend changes

### 4. Deploy Frontend to GitHub Pages - Manual (`deploy-frontend-manual.yml`)
**Triggers:** Manual dispatch only (with optional branch selection or latest PR)

**Purpose:** Manual deployment of feature branches to GitHub Pages for review

**Jobs:**
- **Build**: Builds frontend from specified branch with GitHub Pages profile, runs tests and linting
- **Deploy**: Deploys to same GitHub Pages environment/URL as automatic deployment

**Key Features:**
- Deploy any branch manually for preview/review
- **NEW:** Deploy latest open PR head branch automatically
- Uses same GitHub Pages URL as automatic deployment
- Branch selection input (defaults to current branch if empty)
- **NEW:** Runs tests before deployment (fails fast if tests fail)
- **NEW:** Runs linting before deployment (fails fast if linting fails)
- Useful for testing feature branches before merging
- Same build configuration as automatic deployment

**Usage:**
```
1. Go to Actions → Deploy Frontend to GitHub Pages (Manual)
2. Click "Run workflow"
3. Choose deployment method:
   - Enter branch name to deploy, OR
   - Check "Deploy the latest open PR head branch", OR
   - Leave empty for current branch
4. Click "Run workflow" button
5. Monitor deployment progress (tests and linting run first)
6. Access deployed frontend at: https://hamidrezarezaeigithub.github.io/BuildFlow/
```

### 5. Security Scan Workflow (`security.yml`)
**Triggers:** Push/PR to master/main, weekly schedule (Sundays 2 AM UTC), manual dispatch

**Purpose:** Security vulnerability scanning and code quality analysis

**Jobs:**
- **Security Scan**: OWASP dependency checking for Maven and npm audit for frontend
- **CodeQL Analysis**: GitHub's semantic code analysis for Java and JavaScript

**Key Features:**
- Dependency vulnerability scanning
- Multi-language code analysis
- Scheduled security updates
- Security report generation and retention

## Build Requirements

### Backend (Spring Boot)
- **Java 21** (required, Java 17 will fail)
- Maven wrapper (`./mvnw`)
- Test suite: 295 tests (typically 1 skipped)
- Build time: ~18 seconds for full package

### Frontend (React + Vite)
- **Node.js 18+**
- npm package manager
- Build output: `frontend/dist/`
- Build time: ~4 seconds
- **Note:** ESLint configuration has known issues, linting skipped in CI

### Integration
- Frontend must be built before Maven package step
- Maven copies `frontend/dist/` to `target/classes/static/`
- Single deployable JAR contains both frontend and backend
- Application runs on port 8080 by default

## Workflow Features

### Performance Optimizations
- **Parallel Jobs**: Frontend and backend tests run simultaneously
- **Intelligent Caching**: Maven dependencies, npm packages cached across runs
- **Artifact Reuse**: Frontend build shared between jobs via artifacts
- **Conditional Steps**: Java/Node.js setup only when needed

### Quality Assurance
- **Comprehensive Testing**: Full backend test suite execution
- **Build Validation**: JAR structure and startup verification
- **Security Scanning**: Regular dependency and code vulnerability analysis
- **Smoke Testing**: Quick application startup validation

### DevOps Best Practices
- **Environment Separation**: Different profiles (dev, uat, production)
- **Artifact Management**: Versioned releases with retention policies
- **Documentation**: Auto-generated deployment instructions
- **Monitoring**: Build status reporting and failure notifications

## Usage Examples

### For Development (Automatic)
```bash
# Triggers on every PR and master push
git push origin feature-branch  # Creates PR → triggers CI workflow
git push origin master         # Direct push → triggers CI workflow
```

### For Releases (Manual)
```bash
# Create version tag for release
git tag v1.0.0
git push origin v1.0.0        # Triggers build-package workflow

# Or use GitHub interface for manual dispatch
# Actions → Build and Package → Run workflow
```

### For Security (Automatic + Scheduled)
```bash
# Automatic: Runs on every push/PR
# Scheduled: Runs weekly on Sundays at 2 AM UTC
# Manual: Actions → Security Scan → Run workflow
```

## Artifact Outputs

### CI Workflow
- `frontend-dist`: Built frontend static files (1 day retention)
- `test-results`: Backend test reports (7 days retention)
- `buildflow-application`: Complete application JAR (30 days retention)

### Build Package Workflow
- `BuildFlow-{version}`: Versioned application with deployment docs (90 days retention)
- GitHub Releases: Permanent artifact storage for tagged versions

### Security Workflow
- `security-reports`: Dependency check and audit reports (14 days retention)
- Security alerts: Integrated with GitHub Security tab

## Configuration Files

All workflows use:
- **Java 21** with Temurin distribution
- **Node.js 18** with npm caching
- **Maven wrapper** for reproducible builds
- **Latest GitHub Actions** (v4) for security and reliability

## Troubleshooting

### Common Issues
1. **Java Version**: Ensure Java 21 is specified (Java 17 causes compilation errors)
2. **Frontend Build**: Must run `npm run build` before Maven package
3. **Maven Wrapper**: Must be executable (`chmod +x mvnw`)
4. **Caching**: Clear cache if dependency issues occur

### Monitoring
- Check Actions tab for workflow status
- Review artifact uploads for build outputs
- Monitor Security tab for vulnerability alerts
- Check test reports for detailed failure analysis

## Deployment Integration

While deployment is not currently configured, the workflows are designed to support:
- Container image building (Docker)
- Cloud platform deployment (AWS, Azure, GCP)
- Infrastructure as Code (Terraform, CloudFormation)
- Environment promotion (dev → uat → production)

The versioned artifacts and comprehensive validation make deployment pipeline integration straightforward when needed.