# BuildFlow Backend

A Spring Boot REST API for construction project management with comprehensive estimate and project tracking capabilities. **This backend includes an integrated React frontend, creating a single deployable JAR for the complete full-stack application.**

## 🚀 Quick Start

```bash
# Build the complete full-stack application (includes frontend)
./mvnw clean package

# Run the full-stack application
java -jar target/BuildFlow-0.0.1-SNAPSHOT.jar

# Alternative: Run in development mode
./mvnw spring-boot:run

# Run tests only
./mvnw test

# Access the complete application:
# - Frontend (React App): http://localhost:8080/
# - Backend API: http://localhost:8080/api/*
# - H2 Database Console: http://localhost:8080/h2-console
# - Actuator endpoints: http://localhost:8080/actuator/*
```

## 📋 Available Maven Commands

| Command                    | Description                              |
| -------------------------- | ---------------------------------------- |
| `./mvnw clean package`     | **Build complete full-stack JAR** (frontend + backend) |
| `./mvnw spring-boot:run`   | Start development server with hot reload |
| `./mvnw test`              | Run backend test suite                  |
| `./mvnw clean compile`     | Compile backend only (no frontend build) |

## 🏗️ Full-Stack Architecture

This project creates a **single deployable JAR** that includes both the React frontend and Spring Boot backend:

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

### Project Structure

```
src/
├── main/
│   ├── java/dev/hr/rezaei/buildflow/
│   │   ├── BuildFlowApplication.java    # Main Spring Boot application
│   │   ├── base/                        # Base entities and utilities
│   │   ├── config/                      # Configuration classes
│   │   │   ├── security/               # Security configuration
│   │   │   └── mvc/                    # MVC and frontend integration
│   │   │       ├── WebMvcConfig.java   # Main MVC configuration
│   │   │       └── SpaPathResourceResolver.java # SPA routing logic
│   │   ├── dto/                        # Data Transfer Objects
│   │   ├── estimate/                   # Estimate domain (entities, services, DTOs)
│   │   ├── project/                    # Project domain (entities, services, DTOs)
│   │   ├── quote/                      # Quote domain (entities, services, DTOs)
│   │   ├── user/                       # User domain (entities, services, DTOs)
│   │   ├── util/                       # Utility classes
│   │   └── workitem/                   # Work item domain
│   └── resources/
│       ├── application.yml             # Application configuration
│       ├── static/                     # Frontend build files (auto-generated)
│       └── logback.xml                 # Logging configuration
├── test/                               # Backend test classes
└── frontend/                           # React application source
    ├── src/                           # React source code
    ├── package.json                   # Frontend dependencies
    └── dist/                          # Build output (copied to static/)
```

## 🎯 Current Application State

### Technology Stack

#### Backend
- **Framework**: Spring Boot 3.5.3
- **Java Version**: 21
- **Database**: H2 (file-based for development)
- **ORM**: Spring Data JPA with Hibernate
- **Security**: Spring Security with OAuth2 Client support
- **Build Tool**: Maven 3.x
- **Testing**: Spring Boot Test with JUnit 5
- **Code Generation**: Lombok for boilerplate reduction
- **Monitoring**: Spring Boot Actuator

#### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.0 with Hot Module Replacement
- **Styling**: Tailwind CSS v4 with custom design system
- **UI Components**: Radix UI primitives with custom wrapper components
- **Routing**: React Router v6 with nested routing
- **Testing**: Jest with React Testing Library
- **Icons**: Lucide React icon library

#### Full-Stack Integration
- **Frontend Maven Plugin**: Automated Node.js/npm installation and React build
- **Resource Copying**: Automatic inclusion of frontend build in JAR
- **SPA Routing**: WebMvcConfig handles client-side routing fallback
- **Single Deployment**: One JAR file contains complete application

### Full-Stack Build Process

The Maven build automatically:
1. **Installs Node.js v20.11.0 and npm 10.2.4** locally
2. **Runs `npm install`** to install React dependencies
3. **Executes `npm run build`** to build the React application
4. **Copies frontend build files** to Spring Boot's static resources
5. **Creates a single JAR** with both frontend and backend included

### WebMvcConfig - SPA Routing Strategy

The `WebMvcConfig` class implements sophisticated routing for the full-stack application:

#### Route Handling Logic:
- **Static Assets** (JS, CSS, images): Served directly from `/static/`
- **API Routes** (`/api/*`): Routed to Spring Boot controllers
- **Admin Routes** (`/h2-console`, `/actuator/*`): Preserved for backend services
- **Client Routes** (all others): Return `index.html` for React Router handling

This enables:
- ✅ Direct URL access to any React route (e.g., `/projects`, `/estimates`)
- ✅ Browser refresh works on any page
- ✅ API endpoints remain accessible
- ✅ Backend administrative interfaces preserved

### Core Domain Models Implemented

1. **Project Management**
   - **Project**: Core project entity with builder relationships
   - **ProjectLocation**: Physical location details for projects
   - Complete CRUD operations with JPA repositories
   - DTO mapping for clean API responses

2. **Estimation System**
   - **Estimate**: Project cost estimates with hierarchical structure
   - **EstimateGroup**: Logical grouping of estimate line items
   - **EstimateLine**: Individual line items with quantities and pricing
   - **EstimateLineStrategy**: Strategy pattern for different estimation approaches
   - Complex relationships supporting detailed cost breakdowns

3. **User Management**
   - **User**: Core user entity with contact information
   - **Contact**: Contact details and communication preferences
   - **ContactAddress**: Address management for users and projects
   - Support for user roles and project assignments

4. **Work Items & Quotes**
   - **WorkItem**: Task and work breakdown structure
   - **Quote**: Client quotations based on estimates
   - **QuoteLocation**: Location-specific quote details

### API & Configuration

- **REST API**: Security controller providing public/private endpoints (`/api/security/*`)
- **Database**: H2 file-based database with web console access
- **Security**: Configurable security (currently disabled for development)
- **Actuator Endpoints**: Health, metrics, info, and monitoring endpoints
- **Logging**: Comprehensive logging with file rotation and archiving

### Development Features

- **Hot Reload**: Spring Boot DevTools integration
- **Database Console**: H2 web console for development debugging
- **Test Coverage**: Comprehensive integration and unit tests for all domains
- **DTO Mapping**: Clean separation between entities and API responses
- **Validation**: Entity validation with JPA constraints

### Deployment & Production

#### Single JAR Deployment:
```bash
# Build the complete application
./mvnw clean package

# Deploy anywhere Java 21+ is available
java -jar target/BuildFlow-0.0.1-SNAPSHOT.jar

# The application serves:
# - React frontend at the root URL
# - REST API at /api/*
# - Database console at /h2-console
# - Health checks at /actuator/health
```

#### Production Benefits:
- **Simplified Deployment**: Single JAR file deployment
- **Reduced Infrastructure**: No separate frontend hosting needed
- **Consistent Versioning**: Frontend and backend always in sync
- **Embedded Server**: No external web server configuration required

### Current Development Status

- ✅ Complete domain model implementation (Project, Estimate, User, WorkItem, Quote)
- ✅ Spring Data JPA repositories for all entities
- ✅ Service layer with business logic
- ✅ DTO pattern implementation with mappers
- ✅ Comprehensive test suite with integration tests
- ✅ Security framework setup (OAuth2 ready)
- ✅ Database persistence with H2
- ✅ Actuator monitoring and health checks
- ✅ Logging configuration with file archiving
- ✅ **Complete React frontend integration**
- ✅ **Automated full-stack build process**
- ✅ **Single JAR deployment capability**
- ✅ **SPA routing with fallback support**
- 🔄 REST API endpoints (basic security endpoints implemented)
- 🔄 Full CRUD REST controllers for all domains
- 🔄 Authentication and authorization implementation

### Configuration

- **Server Port**: 8080
- **Database**: File-based H2 (`./data/buildflow-db`)
- **Security**: Currently disabled for development
- **JPA**: Auto DDL updates enabled
- **Logging**: Configured with daily rotation and archiving
- **Frontend**: React build automatically included in JAR
- **Static Resources**: Served from `/static/` with SPA routing support

This backend provides a complete full-stack foundation for the BuildFlow construction management platform, with seamless frontend-backend integration and single-JAR deployment capability.
