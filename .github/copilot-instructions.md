# BuildFlow: Full-Stack Construction Management Platform

**CRITICAL**: Always reference these instructions first and only fallback to search or additional context gathering if the information here is incomplete or found to be in error. Notify the user if any discrepancies are found, and update this document accordingly. Keep this document short and concise.

## Table of Contents
1. [Project Summary](#1-project-summary)
2. [Technology Stack](#2-technology-stack)
3. [Architecture Overview](#3-architecture-overview)
4. [Development Requirements](#4-development-requirements)
5. [Build and Deployment](#5-build-and-deployment)
6. [Validation and Testing](#6-validation-and-testing)
7. [Development Guidelines](#7-development-guidelines)
8. [Performance and Timing](#8-performance-and-timing)

## 1. Project Summary

BuildFlow is a comprehensive full-stack construction management platform that provides:

### Business Capabilities
- **Project Management**: Complete project lifecycle management with location tracking and ownership
- **Estimation System**: Hierarchical cost estimation with organized groups and detailed line items
- **User Management**: Comprehensive user and contact management with secure authentication
- **Work Items & Quotes**: Detailed task breakdown structure with client quotation generation

### Platform Benefits
BuildFlow delivers a unified solution for construction companies to manage projects from initial estimation through completion, with integrated user management and comprehensive reporting capabilities.

## 2. Technology Stack

### Backend Technologies
- **Framework**: Spring Boot 3.5.3
- **Runtime**: Java 21 (REQUIRED)
- **Database**: H2 Database with JPA/Hibernate
- **Security**: Spring Security
- **Build Tool**: Maven

### Frontend Technologies
- **Framework**: React with TypeScript
- **Runtime**: Node.js V20
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Components**: Shadcn UI components

## 3. Architecture Overview

### Project Structure Summary
BuildFlow creates a **single deployable JAR** that includes both React frontend and Spring Boot backend:

```
BuildFlow-0.0.1-SNAPSHOT.jar
├── Spring Boot Application (Backend)
│   ├── REST API endpoints (/api/*)
│   ├── Database layer (H2)
│   ├── Business logic & services
│   └── Security & configuration
└── React Application (Frontend)
    ├── Static assets (/static/*)
    ├── Client-side routing
    ├── UI components
    └── API integration
```

### Backend Folder Structure
```
src/main/java/dev/hr/rezaei/buildflow/
├── BuildFlowApplication.java    # Main Spring Boot application
├── base/                        # Base entities and utilities
├── config/                      # Configuration classes
│   ├── security/               # Security configuration
│   └── mvc/                    # MVC and frontend integration
├── estimate/                   # Estimate domain (entities, services, controllers)
├── project/                    # Project domain (entities, services, controllers)
├── quote/                      # Quote domain (entities, services, controllers)
├── user/                       # User domain (entities, services, controllers)
├── util/                       # Utility classes
└── workitem/                   # Work item domain

src/main/resources/
├── application.yml             # Application configuration
├── static/                     # Frontend build files (auto-generated)
└── logback.xml                # Logging configuration
```

### Frontend Folder Structure
```
frontend/src/
├── components/
│   ├── home/                   # Landing page components (Hero, Features, etc.)
│   ├── ui/                     # Reusable UI components (Button, Card, etc.)
│   ├── theme/                  # Theme system components
│   ├── address/                # Address-related components
│   ├── project/                # Project-specific components
│   └── admin/                  # Admin panel components
├── pages/                      # Route components (HomePage, DashboardPage, etc.)
├── contexts/                   # React Context providers (Auth, Theme, etc.)
├── services/                   # API services (AuthService, ApiService, etc.)
│   ├── dtos/                   # Data Transfer Objects for API communication - Matching backend
├── utils/                      # Utility functions (validation, formatting)
├── mocks/                      # Mock data
└── test/                       # Testing utilities and setup
```

### General Configuration Summary
- **Vite**: Development server on port 3000, builds to `dist/` directory, supports path aliases (`@/`)
- **Jest**: Test runner with jsdom environment, TypeScript support via ts-jest
- **Tailwind CSS**: Utility-first styling with v4 configuration
- **Spring Boot**: H2 database, Spring Security, Maven build system

## 4. Development Requirements

### Prerequisites
- **Java 21** (CRITICAL REQUIREMENT)
  ```bash
  export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
  export PATH=$JAVA_HOME/bin:$PATH
  ```
  Verify: `java -version` should show "openjdk version 21.0.x"

### Database Profiles
- **Development** (default): H2 console enabled, security customizable, schema auto-update
- **UAT**: Production-like security, H2 console enabled for inspection, schema validation only
- **Production**: Full security enabled, H2 console disabled, schema validation only

## 4. Build and Deployment

### Build Process Overview
**CRITICAL**: The Maven build does NOT automatically build the frontend. Manual frontend build is required.

### Build Commands (Execute in Order)

#### 1. Backend Compilation (6-8 seconds)
*Only if backend code changes exist*
```bash
./mvnw clean compile
```

#### 2. Frontend Build (3-5 seconds)
*Only if frontend code changes exist*
```bash
cd frontend
npm install    # ~30 seconds - installs 283 packages (deprecation warnings normal)
npm run build  # ~3 seconds - creates frontend/dist/ directory
cd ..
```

#### 3. Complete Full-Stack Build (8-18 seconds)
*Only if any code changes exist - NEVER CANCEL*
```bash
./mvnw clean package -DskipTests
# Creates target/BuildFlow-0.0.1-SNAPSHOT.jar with integrated frontend
```

#### 4. Verify Frontend Integration
Look for log message:
```
[INFO] Copying 4 resources from frontend/dist to target/classes/static
```

### Running the Application

#### Production Mode (JAR deployment)
```bash
java -jar target/BuildFlow-0.0.1-SNAPSHOT.jar
# Available at: http://localhost:8080/
```

#### Development Mode (Maven with hot reload)
```bash
./mvnw spring-boot:run
# Available at: http://localhost:8080/
```

#### Frontend Development Mode
```bash
cd frontend
npm run dev
# CRITICAL: Always terminate this command when finished
# Use Ctrl+C to stop the Vite dev server
```

## 6. Validation and Testing

### Backend Testing
*Execute only if backend code changes exist*

#### Backend Test Suite (35-37 seconds)
*NEVER CANCEL - completes within measured timeframes*
```bash
./mvnw test
```

#### Backend Validation Checklist
After backend changes:
1. **Compilation**: `./mvnw clean compile` (~6 seconds)
2. **Test Execution**: `./mvnw test` (~35 seconds)
3. **Application Startup**: Verify Spring Boot starts without errors

### Frontend Testing
*Execute only if frontend code changes exist*

#### Frontend Test Suite
```bash
cd frontend
npm test        # Run Jest test suite
npm run build   # Verify build succeeds (~3 seconds)
```

#### Frontend Validation Checklist
After frontend changes:
1. **Dependencies**: `npm install` (if package.json changed)
2. **Type Check**: `npm run type-check` (TypeScript validation)
3. **Test Suite**: `npm test` (Jest with jsdom environment)
4. **Build Test**: `npm run build` (Vite build to dist/)
5. **Dev Server**: `npm run dev` (verify localhost:3000 works)

### Full-Stack Integration Testing
*Execute when both backend and frontend changes exist*

#### Complete Validation Process
1. **Frontend Build**: `cd frontend && npm run build`
2. **Backend Package**: `./mvnw clean package` (includes frontend assets)
3. **Integration Verify**: Look for log message:
   ```
   [INFO] Copying 4 resources from frontend/dist to target/classes/static
   ```
4. **Application Test**: `java -jar target/BuildFlow-0.0.1-SNAPSHOT.jar`
5. **End-to-End Verify**: Full application accessible at http://localhost:8080

## 7. Development Guidelines

### Backend Development Standards

#### Package Documentation Standards
- **backend package** must contain a comprehensive `README.md` with:
- **Technical Overview**: Complete functionality and architecture
- **File Descriptions**: Comprehensive table of all classes with descriptions and links
- **Integration Points**: Cross-package integration patterns
- **Business Logic**: Domain-specific rules and workflows
- **Design Principles**: Architectural patterns and decisions

#### Backend README Maintenance Requirements
- Update package README when ANY file is added, modified, or deleted
- Propagate sub-package changes to parent package READMEs
- Maintain accurate file links and technical details
- Document business context without repeating code syntax

#### Backend Testing Standards
When writing new backend classes:
- **Look for similar unit and integration test files** as templates
- **Write comprehensive tests** for all new classes and methods
- **Test expected behavior** - catch bugs by validating business logic and edge cases
- **Follow existing test patterns** in the codebase for consistency
- **Include both unit tests** (isolated class testing) **and integration tests** (full Spring context)

### Frontend Development Standards

#### Mobile-First Responsive Design
When writing frontend components:
- **Mobile-First Approach**: Design and implement for mobile devices first
- **Responsive Design**: Ensure proper scaling across all device sizes (mobile → tablet → desktop)
- **Touch-Friendly**: Design interactive elements with appropriate touch targets
- **Performance**: Optimize for mobile network conditions and device capabilities
- **Accessibility**: Ensure components work across different input methods and screen readers

#### Frontend Component Guidelines
- **Reusable Components**: Build components that work across different contexts
- **TypeScript First**: All components should have proper TypeScript interfaces
- **Testing**: Write Jest tests for component logic and user interactions
- **Styling**: Use Tailwind CSS classes with responsive breakpoint modifiers
- **State Management**: Use React Context for shared state, local state for component-specific data
- **Library Usage**: Prefer Shadcn UI components for consistency and accessibility

## 8. Performance and Timing

### Build Time Expectations (MEASURED)
- **Backend Compilation**: 6-8 seconds
- **Frontend Build**: 3-5 seconds
- **Full Package Build**: 8-18 seconds
- **Test Suite**: 35-37 seconds
- **Application Startup**: 7-8 seconds

### Timeout Recommendations
- **Compilation**: 2+ minutes
- **Full Package**: 10+ minutes
- **Test Suite**: 10+ minutes

### Critical Guidelines
- **NEVER CANCEL BUILDS OR TESTS** - they complete within measured timeframes
- Use generous timeouts for automated processes
- Build failures indicate real issues, not timeout problems
- All processes have been validated and complete successfully

---

*This application provides a solid foundation for construction project management with proven build processes and comprehensive testing coverage.*