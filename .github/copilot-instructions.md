# BuildFlow: Full-Stack Construction Management Platform

**CRITICAL**: Always follow these instructions. Reference this document first before gathering additional context.

## 1. Project Summary

BuildFlow is a full-stack construction management platform providing:
- **Project Management**: Lifecycle management with location tracking and ownership
- **Estimation System**: Hierarchical cost estimation with groups and line items
- **User Management**: User and contact management with secure authentication
- **Work Items & Quotes**: Task breakdown structure with quotation generation

## 2. Technology Stack

### Backend
- Spring Boot 3.5.3 with Java 21 (REQUIRED) | H2 Database + JPA/Hibernate | Maven

### Frontend
- React + TypeScript | Vite | Tailwind CSS v4 | Shadcn UI | Node.js V20

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

**Key Configuration**:
- Vite: Dev server port 3000, builds to `dist/`, path aliases (`@/`)
- Jest: jsdom environment, TypeScript via ts-jest
- Tailwind CSS: v4 utility-first styling
- Spring Boot: H2 database, Spring Security, Maven

## 4. Step-by-Step Development Workflow

### Step 1: Review Project Context
**ALWAYS START HERE** before making any changes:

1. **Read root README.md** - Single source of truth for structure and build instructions
2. **Identify change scope** - Backend, frontend, or full-stack?
3. **Check relevant package READMEs** - Domain-specific documentation in each package

### Step 2: Environment Setup

**Verify Java 21** (CRITICAL):
```bash
java -version  # Must show "openjdk version 21.0.x"
```

### Step 3: Implement Changes

#### For Backend Changes:

**A. Research Phase**
- Search for similar patterns using `semantic_search` or `grep_search`
- Review domain package README for business rules
- Check existing tests for patterns

**B. Implementation Standards**
- Follow existing package patterns (entities, DTOs, mappers, services, repositories)
- Use Lombok annotations for boilerplate reduction

**C. Testing Requirements** (MANDATORY)
- Look for similar test files as templates
- Write **unit tests** for isolated class logic
- Write **integration tests** for Spring context validation
- Test business logic and edge cases
- Follow existing test naming patterns

**D. Documentation Requirements**
- Update package README.md when adding/modifying files following existing style
- Document business logic, not code syntax
- Propagate changes to parent package READMEs if needed

#### For Frontend Changes:

**A. Research Phase**
- Review existing patterns for similar functionality

**B. Mobile-First Implementation Standards**
- Design for mobile devices first + touch-friendly interactions
- Use Tailwind CSS with responsive breakpoints
- Use Shadcn UI components for consistency

**C. Component Guidelines**
- Build reusable, context-independent components
- Use React Context for shared state
- Apply proper prop typing with TypeScript
- Follow existing component structure patterns

**D. Testing Requirements** (MANDATORY)
- Write Jest tests for component logic, co-located with components
- Test user interactions with React Testing Library
- Verify responsive behavior
- Follow existing test patterns

**E. Documentation Requirements**
- Update component README when adding/modifying components following existing style
- Include component description. Not much code details.

### Step 4: Build Process

**CRITICAL**: Maven does NOT auto-build frontend. Build manually when needed.

#### Backend Only Changes:
```bash
./mvnw clean compile  # 6-8 seconds
./mvnw test           # 35-37 seconds - NEVER CANCEL
```

#### Frontend Only Changes:
```bash
cd frontend
npm install           # If package.json changed (~30 seconds)
npm run build         # 3-5 seconds
npm test              # Run Jest suite
```

#### Full-Stack Changes:
```bash
# 1. Build frontend
cd frontend && npm install && npm run build && cd ..

# 2. Package complete application
./mvnw clean package -DskipTests  # 8-18 seconds - NEVER CANCEL

# Verify: Look for "[INFO] Copying 4 resources from frontend/dist to target/classes/static"
```

### Step 5: Validation

#### Backend Validation:
1. Compilation: `./mvnw clean compile` (~6 seconds)
2. Startup: Verify Spring Boot starts without errors

#### Frontend Validation:
1. Type Check: `npm run type-check`
2. Dev Server: `npm run dev` (verify localhost:3000) - **TERMINATE when done**
3. Screenshots: Include mobile-width screenshots in PR description (if applicable)

#### Full-Stack Integration:
```bash
# Run complete application
java -jar target/BuildFlow-0.0.1-SNAPSHOT.jar
# Available at http://localhost:8080/
```

### Step 6: Documentation Updates

After implementing changes:

1. **Update root README.md** if new files/folders created
2. **Update/create package README.md** for new folders with multiple files
3. **Keep formatting consistent** with existing README style
4. **Document business context**, not code details

**Critical Rules**:
- **NEVER CANCEL builds or tests** - they complete within measured timeframes
- Use generous timeouts (2+ minutes for compilation, 10+ minutes for full builds)
- Build failures indicate real issues, not timeout problems

### Key Patterns:
- Backend: Entity → DTO → Mapper → Repository → Service → Controller
- Frontend: Component → Context → Service → DTO
- Testing: Look for similar test files, follow patterns
- Documentation: Update READMEs when files change
