# BuildFlow Backend

A Spring Boot REST API for construction project management with comprehensive estimate and project tracking capabilities. **This backend includes an integrated React frontend, creating a single deployable JAR for the complete full-stack application.**

## 🌐 Live Demo

**Frontend Demo on GitHub Pages**: [https://hamidrezarezaeigithub.github.io/BuildFlow/](https://hamidrezarezaeigithub.github.io/BuildFlow/)

The frontend is automatically deployed to GitHub Pages in standalone mode with mock authentication and data. No backend required - perfect for exploring the UI and features.


## 🚀 Quick Start

### Prerequisites
- **Java 21** (required) - Install with: `sudo apt install -y openjdk-21-jdk`
- **Node.js & npm** (for frontend development) - Version 18+ recommended

### Running the Application Locally

#### Option 1: Full-Stack Integrated Mode (Single JAR - Recommended)
```bash
# 1. Build the frontend first
cd frontend
npm install
npm run build
cd ..

# 2. Build the complete application
./mvnw clean package -DskipTests

# 3. Run the application
java -jar target/BuildFlow-0.0.1-SNAPSHOT.jar

# ✅ Application available at: http://localhost:8080/
```

#### Option 2: Development Mode with Hot Reload
```bash
# 1. Build frontend for integration
cd frontend && npm install && npm run build && cd ..

# 2. Run backend with hot reload
./mvnw spring-boot:run

# ✅ Application available at: http://localhost:8080/
```

#### Option 3: Separate Frontend & Backend Development
```bash
# Terminal 1: Start the backend
./mvnw spring-boot:run

# Terminal 2: Start the frontend dev server
cd frontend
npm install
npm run dev

# ✅ Frontend dev server: http://localhost:5173/
# ✅ Backend API: http://localhost:8080/api/*
```

### Environment Profiles
```bash
# Development (default) - Full access, H2 console enabled
java -jar target/BuildFlow-0.0.1-SNAPSHOT.jar

# UAT - Production-like with testing features
java -jar target/BuildFlow-0.0.1-SNAPSHOT.jar --spring.profiles.active=uat

# Production - Full security, optimized configuration
java -jar target/BuildFlow-0.0.1-SNAPSHOT.jar --spring.profiles.active=production
```

### Running Tests
```bash
# Run complete test suite (294 tests)
./mvnw test

# Run only backend compilation
./mvnw clean compile
```

## 📋 Available Maven Commands

| Command                  | Description                                                  |
| ------------------------ | ------------------------------------------------------------ |
| `./mvnw clean package`   | **Build backend JAR** (copy pre-built frontend if available) |
| `./mvnw spring-boot:run` | Start development server with hot reload                     |
| `./mvnw test`            | Run backend test suite                                       |
| `./mvnw clean compile`   | Compile backend only (no frontend copy)                      |

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
│   │   ├── BuildFlowApplication.java    # Main Spring Boot application entry point
│   │   ├── base/
│   │   │   ├── BaseAddress.java                  # Abstract entity for address fields
│   │   │   ├── BaseAddressDto.java               # Abstract DTO for address fields
│   │   │   ├── DuplicateUserException.java       # Exception for duplicate user attempts
│   │   │   ├── UpdatableEntity.java              # Abstract entity with audit fields
│   │   │   ├── UpdatableEntityDto.java           # Abstract DTO with audit fields
│   │   │   ├── UpdatableEntityDtoMapper.java     # Base mapper for entity-DTO conversions
│   │   │   ├── UserNotAuthorizedException.java   # Exception for authorization failures
│   │   │   ├── UserNotFoundException.java        # Exception for user lookup failures
│   │   │   └── README.md
│   │   ├── config/
│   │   │   ├── mvc/
│   │   │   │   ├── dto/
│   │   │   │   │   ├── ErrorResponse.java                 # Unified error response
│   │   │   │   │   ├── MessageResponse.java               # Success message response
│   │   │   │   │   └── README.md
│   │   │   │   ├── AbstractAuthorizationHandler.java      # Base authorization handler
│   │   │   │   ├── GlobalExceptionHandler.java            # Centralized exception handling
│   │   │   │   ├── OpenApiConfig.java                     # API documentation config
│   │   │   │   ├── PagedResponseBuilder.java              # Paginated response builder
│   │   │   │   ├── PaginationHelper.java                  # Pagination helper utility
│   │   │   │   ├── README.md
│   │   │   │   ├── ResponseErrorType.java                 # Error type categorization
│   │   │   │   ├── ResponseFacilitator.java               # Response formatting utility
│   │   │   │   ├── SpaPathResourceResolver.java           # SPA routing resolver
│   │   │   │   └── WebMvcConfig.java                      # Central MVC configuration
│   │   │   ├── security/
│   │   │   │   ├── dto/
│   │   │   │   │   ├── JwtAuthenticationResponse.java     # JWT token response
│   │   │   │   │   ├── LoginRequest.java                  # Login request DTO
│   │   │   │   │   ├── SignUpRequest.java                 # Registration request DTO
│   │   │   │   │   ├── UserAuthenticationDto.java         # Secure user auth DTO
│   │   │   │   │   ├── UserSummaryResponse.java           # User summary response
│   │   │   │   │   └── README.md
│   │   │   │   ├── AdminUserInitializer.java              # Admin user bootstrap
│   │   │   │   ├── AuthController.java                    # Authentication endpoints
│   │   │   │   ├── AuthService.java                       # Authentication service
│   │   │   │   ├── CustomUserDetailsService.java          # User details service
│   │   │   │   ├── JwtAuthenticationFilter.java           # JWT filter
│   │   │   │   ├── JwtTokenProvider.java                  # JWT provider
│   │   │   │   ├── MockDataInitializer.java               # Mock data generator
│   │   │   │   ├── README.md
│   │   │   │   ├── RateLimitingFilter.java                # Rate limiting filter
│   │   │   │   ├── Role.java                              # Role enum with authorities
│   │   │   │   ├── SecurityAuditService.java              # Security audit service
│   │   │   │   ├── SecurityConfig.java                    # Main Security configuration
│   │   │   │   ├── SecurityController.java                # Security test endpoints
│   │   │   │   ├── SecurityExceptionHandler.java          # Security exception handler
│   │   │   │   ├── UserAuthentication.java                # Authentication entity
│   │   │   │   ├── UserAuthenticationRepository.java      # Authentication repository
│   │   │   │   └── UserPrincipal.java                     # User principal
│   │   │   └── README.md
│   │   ├── dto/
│   │   │   ├── Dto.java                          # Marker interface for all DTOs
│   │   │   ├── DtoMappingException.java          # Exception for DTO mapping failures
│   │   │   └── README.md
│   │   ├── estimate/
│   │   │   ├── Estimate.java                      # Main estimate entity
│   │   │   ├── EstimateDto.java                   # DTO for estimate operations
│   │   │   ├── EstimateDtoMapper.java             # MapStruct mapper for Estimate
│   │   │   ├── EstimateGroup.java                 # Group entity for line items
│   │   │   ├── EstimateGroupDto.java              # DTO for estimate group
│   │   │   ├── EstimateGroupDtoMapper.java        # MapStruct mapper for EstimateGroup
│   │   │   ├── EstimateGroupRepository.java       # JPA repository for groups
│   │   │   ├── EstimateGroupService.java          # Business logic for groups
│   │   │   ├── EstimateLine.java                  # Line item entity
│   │   │   ├── EstimateLineDto.java               # DTO for estimate line
│   │   │   ├── EstimateLineDtoMapper.java         # MapStruct mapper for EstimateLine
│   │   │   ├── EstimateLineRepository.java        # JPA repository for lines
│   │   │   ├── EstimateLineService.java           # Business logic for lines
│   │   │   ├── EstimateLineStrategy.java          # Strategy enum for calculations
│   │   │   ├── EstimateRepository.java            # JPA repository for estimates
│   │   │   ├── EstimateService.java               # Business logic for estimates
│   │   │   └── README.md
│   │   ├── project/
│   │   │   ├── dto/
│   │   │   │   ├── CreateProjectRequest.java          # Request for creating projects
│   │   │   │   ├── CreateProjectResponse.java         # Response with created project
│   │   │   │   ├── ProjectLocationRequestDto.java     # Location info for creation
│   │   │   │   └── README.md
│   │   │   ├── Project.java                           # Core project entity
│   │   │   ├── ProjectAuthService.java                # Authorization service
│   │   │   ├── ProjectController.java                 # REST API controller
│   │   │   ├── ProjectDto.java                        # DTO for project operations
│   │   │   ├── ProjectDtoMapper.java                  # MapStruct mapper for Project
│   │   │   ├── ProjectLocation.java                   # Location entity
│   │   │   ├── ProjectLocationDto.java                # DTO for location
│   │   │   ├── ProjectLocationDtoMapper.java          # MapStruct mapper for Location
│   │   │   ├── ProjectLocationRepository.java         # JPA repository for locations
│   │   │   ├── ProjectLocationService.java            # Business logic for locations
│   │   │   ├── ProjectRepository.java                 # JPA repository for projects
│   │   │   ├── ProjectService.java                    # Business logic for projects
│   │   │   └── README.md
│   │   ├── quote/
│   │   │   ├── Quote.java                         # Main quote entity
│   │   │   ├── QuoteDto.java                      # DTO for quote operations
│   │   │   ├── QuoteDtoMapper.java                # MapStruct mapper for Quote
│   │   │   ├── QuoteDomain.java                   # Domain classification enum
│   │   │   ├── QuoteLocation.java                 # Location entity for quotes
│   │   │   ├── QuoteLocationDto.java              # DTO for quote location
│   │   │   ├── QuoteLocationDtoMapper.java        # MapStruct mapper for QuoteLocation
│   │   │   ├── QuoteLocationRepository.java       # JPA repository for locations
│   │   │   ├── QuoteLocationService.java          # Business logic for locations
│   │   │   ├── QuoteRepository.java               # JPA repository for quotes
│   │   │   ├── QuoteService.java                  # Business logic for quotes
│   │   │   ├── QuoteUnit.java                     # Unit of measurement enum
│   │   │   └── README.md
│   │   ├── user/
│   │   │   ├── dto/
│   │   │   │   ├── ContactAddressRequestDto.java      # Address info for creation
│   │   │   │   ├── ContactRequestDto.java             # Contact info for creation
│   │   │   │   ├── CreateUserRequest.java             # Request for creating users
│   │   │   │   ├── CreateUserResponse.java            # Response with created user
│   │   │   │   └── README.md
│   │   │   ├── Contact.java                           # Contact information entity
│   │   │   ├── ContactAddress.java                    # Address entity for contacts
│   │   │   ├── ContactAddressDto.java                 # DTO for contact address
│   │   │   ├── ContactAddressDtoMapper.java           # MapStruct mapper for ContactAddress
│   │   │   ├── ContactAddressRepository.java          # JPA repository for addresses
│   │   │   ├── ContactAddressService.java             # Business logic for addresses
│   │   │   ├── ContactDto.java                        # DTO for contact operations
│   │   │   ├── ContactDtoMapper.java                  # MapStruct mapper for Contact
│   │   │   ├── ContactLabel.java                      # Contact role/type enum
│   │   │   ├── ContactRepository.java                 # JPA repository for contacts
│   │   │   ├── ContactService.java                    # Business logic for contacts
│   │   │   ├── User.java                              # Core user entity
│   │   │   ├── UserController.java                    # REST API controller
│   │   │   ├── UserDto.java                           # DTO for user operations
│   │   │   ├── UserDtoMapper.java                     # MapStruct mapper for User
│   │   │   ├── UserMockDataInitializer.java           # Mock data generator
│   │   │   ├── UserMockDataProperties.java            # Mock data configuration
│   │   │   ├── UserRepository.java                    # JPA repository for users
│   │   │   ├── UserService.java                       # Business logic for users
│   │   │   └── README.md
│   │   ├── util/
│   │   │   ├── EnumUtil.java                     # Enum conversion utilities
│   │   │   ├── StringUtil.java                   # String manipulation utilities
│   │   │   └── README.md
│   │   ├── workitem/
│   │   │   ├── dto/
│   │   │   │   ├── CreateWorkItemRequest.java         # Request for creating work items
│   │   │   │   ├── CreateWorkItemResponse.java        # Response with created work item
│   │   │   │   └── README.md
│   │   │   ├── WorkItem.java                          # Core work item entity
│   │   │   ├── WorkItemController.java                # REST API controller
│   │   │   ├── WorkItemDomain.java                    # Domain classification enum
│   │   │   ├── WorkItemDto.java                       # DTO for work item operations
│   │   │   ├── WorkItemDtoMapper.java                 # MapStruct mapper for WorkItem
│   │   │   ├── WorkItemRepository.java                # JPA repository for work items
│   │   │   ├── WorkItemService.java                   # Business logic for work items
│   │   │   └── README.md
│   │   └── README.md
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
- **Security**: Spring Security with JWT authentication, OAuth2 Client support, and Role-Based Access Control (RBAC)
- **Build Tool**: Maven 3.x
- **Testing**: Spring Boot Test with JUnit 5
- **Code Generation**: Lombok for boilerplate reduction
- **API Documentation**: SpringDoc OpenAPI 2.8.9 with Swagger UI
- **JWT Support**: JSON Web Token implementation with io.jsonwebtoken 0.12.7
- **Utilities**: Apache Commons Lang3 3.18.0
- **Monitoring**: Spring Boot Actuator

#### Frontend
- **Framework**: React 18.2.0 with TypeScript 5.0.2
- **Build Tool**: Vite 4.4.5 with Hot Module Replacement
- **Styling**: Tailwind CSS 3.3.0 with custom design system
- **UI Components**: Radix UI primitives (@radix-ui/react-slot 1.2.3) with custom wrapper components
- **State Management**: Class Variance Authority 0.7.1 with utility libraries
- **Icons**: Lucide React 0.544.0 icon library
- **Utilities**: clsx 2.1.1, tailwind-merge 3.3.1, tailwindcss-animate 1.0.7

#### Full-Stack Integration
- **Frontend Maven Plugin**: Automated Node.js/npm installation and React build
- **Resource Copying**: Automatic inclusion of frontend build in JAR
- **SPA Routing**: WebMvcConfig handles client-side routing fallback
- **Single Deployment**: One JAR file contains complete application

### Full-Stack Build Process

The Maven build currently includes:
1. **Compiles Spring Boot backend** with Java 21
2. **Copies pre-built frontend assets** from `frontend/dist` to Spring Boot's static resources
3. **Creates a single JAR** with both frontend and backend included

**Note**: The frontend build process (`npm install` and `npm run build`) needs to be run manually or integrated via frontend-maven-plugin for automated builds. Currently, the Maven build copies pre-built assets from `frontend/dist/`.

### WebMvcConfig

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
   - **Project**: Core project entity with builder/owner relationships and location management
   - **ProjectLocation**: Physical location details inheriting from BaseAddress
   - Relationships with estimates and users, cascade operations for location management
   - Complete CRUD operations with JPA repositories and DTO mapping

2. **Estimation System**
   - **Estimate**: Project cost estimates with hierarchical structure and overall multipliers
   - **EstimateGroup**: Logical grouping of estimate line items with descriptions
   - **EstimateLine**: Individual line items with quantities, pricing, and computed costs
   - **EstimateLineStrategy**: Strategy enum (AVERAGE, LATEST, LOWEST) for estimation approaches
   - Complex bidirectional relationships supporting detailed cost breakdowns and grouping

3. **User Management & Authentication**
   - **User**: Core business user entity with contact information and project relationships
   - **Contact**: Contact details with labels, communication preferences, and address management
   - **ContactAddress**: Address management inheriting from BaseAddress with cascade operations
   - **UserAuthentication**: Separate authentication entity with JWT support and role management
   - **Role-Based Access Control**: USER, PREMIUM_USER, ADMIN, VIEWER roles with granular permissions

4. **Work Items & Quotes**
   - **WorkItem**: Task and work breakdown structure with user ownership and domain classification
   - **WorkItemDomain**: Domain classification enum (PUBLIC, PRIVATE) for work items
   - **Quote**: Supplier quotations with pricing, currency, location, and bidirectional user relationships
   - **QuoteLocation**: Location-specific quote details inheriting from BaseAddress
   - **QuoteUnit & QuoteDomain**: Enums for quote pricing units and domain classification

5. **Security & Authentication**
   - **JWT Authentication**: Secure token-based authentication with role integration
   - **Rate Limiting**: Brute force protection with sliding window algorithm
   - **Audit Logging**: Comprehensive security event tracking and monitoring
   - **Admin Management**: Automatic admin user initialization and role-based endpoint protection

### API & Configuration

- **REST API**: Comprehensive API endpoints with authentication and authorization
  - Authentication endpoints (`/api/auth/*`): register, login, logout, refresh, validate
  - Security endpoints (`/api/security/*`): public/private endpoint examples
  - Admin endpoints: Role-based access control with method-level security
- **Database**: H2 file-based database with environment-specific configurations
- **Security**: Full JWT-based authentication with RBAC, rate limiting, and audit logging
- **API Documentation**: SpringDoc OpenAPI with Swagger UI available for interactive testing
- **Actuator Endpoints**: Health, metrics, info, and monitoring endpoints with security controls
- **Logging**: Comprehensive logging with file rotation, archiving, and security audit trails

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

### Configuration

#### Development Profile (default)
- **Server Port**: 8080
- **Database**: File-based H2 (`./data/buildflow-db`)
- **Security**: Configurable (can be disabled via `spring.security.enabled=false` for testing)
- **JPA**: Auto DDL updates enabled with comprehensive entity validation
- **H2 Console**: Enabled at `/h2-console` for database inspection
- **Management**: Extended endpoints for debugging and monitoring
- **JWT**: Development-friendly token settings with configurable expiration

#### UAT Profile (`--spring.profiles.active=uat`)
- **Server Port**: 8080 (management on 8081)
- **Database**: File-based H2 (`/app/data/buildflow-uat-db`)
- **Security**: Fully enabled with JWT authentication and RBAC
- **JPA**: Schema validation only (no auto-updates)
- **H2 Console**: Enabled for data inspection during testing
- **Management**: Production-like with additional debugging endpoints
- **Rate Limiting**: Enabled for security testing

#### Production Profile (`--spring.profiles.active=production`)
- **Server Port**: 8080 (management on 8081)
- **Database**: File-based H2 (`/app/data/buildflow-production-db`)
- **Security**: Enhanced security with comprehensive headers (CSP, HSTS, XSS protection)
- **JPA**: Schema validation only (no auto-updates)
- **H2 Console**: Disabled for security
- **Management**: Limited endpoints on separate port for security
- **Rate Limiting**: Strict brute force protection with audit logging
- **Admin User**: Automatic initialization with configurable credentials

#### All Profiles
- **Logging**: Configured via logback.xml with daily rotation, archiving, and security audit trails
- **Frontend**: React build automatically included in JAR with TypeScript compilation
- **Static Resources**: Served from `/static/` with SPA routing support and API route separation
- **Security Audit**: Comprehensive logging for compliance and monitoring
- **Documentation**: SpringDoc OpenAPI available at `/swagger-ui.html` for API exploration

This backend provides a complete full-stack foundation for the BuildFlow construction management platform, with seamless frontend-backend integration and single-JAR deployment capability.

## 📚 Documentation Structure

The project includes comprehensive documentation across multiple domains:

### Domain-Specific Documentation
- **Model Documentation**: Detailed entity relationship diagrams and business rules
  - [`Model.md`](src/main/java/dev/hr/rezaei/buildflow/Model.md) - Overall model architecture overview
  - [`/user/UserModel.md`](src/main/java/dev/hr/rezaei/buildflow/user/UserModel.md) - User, Contact, ContactAddress entities
  - [`/project/ProjectModel.md`](src/main/java/dev/hr/rezaei/buildflow/project/ProjectModel.md) - Project and ProjectLocation entities
  - [`/estimate/EstimateModel.md`](src/main/java/dev/hr/rezaei/buildflow/estimate/EstimateModel.md) - Estimation system entities
  - [`/workitem/WorkItemModel.md`](src/main/java/dev/hr/rezaei/buildflow/workitem/WorkItemModel.md) - Work item management
  - [`/quote/QuoteModel.md`](src/main/java/dev/hr/rezaei/buildflow/quote/QuoteModel.md) - Quote and supplier management

### Service Layer Documentation
- [`Services.md`](src/main/java/dev/hr/rezaei/buildflow/Services.md) - Comprehensive service layer overview
- Domain-specific service documentation:
  - [`/user/UserServices.md`](src/main/java/dev/hr/rezaei/buildflow/user/UserServices.md)
  - [`/project/ProjectServices.md`](src/main/java/dev/hr/rezaei/buildflow/project/ProjectServices.md)
  - [`/estimate/EstimateServices.md`](src/main/java/dev/hr/rezaei/buildflow/estimate/EstimateServices.md)
  - [`/workitem/WorkItemServices.md`](src/main/java/dev/hr/rezaei/buildflow/workitem/WorkItemServices.md)
  - [`/quote/QuoteServices.md`](src/main/java/dev/hr/rezaei/buildflow/quote/QuoteServices.md)

### Controller Layer Documentation
- [`Controllers.md`](src/main/java/dev/hr/rezaei/buildflow/Controllers.md) - REST API controller overview
- Domain-specific controller documentation:
  - [`/user/UserControllers.md`](src/main/java/dev/hr/rezaei/buildflow/user/UserControllers.md)
  - [`/project/ProjectControllers.md`](src/main/java/dev/hr/rezaei/buildflow/project/ProjectControllers.md)

### API Documentation
- [`Dtos.md`](src/main/java/dev/hr/rezaei/buildflow/Dtos.md) - Data Transfer Objects overview
- Domain-specific DTO documentation:
  - [`/user/UserDtos.md`](src/main/java/dev/hr/rezaei/buildflow/user/UserDtos.md)
  - [`/project/ProjectDtos.md`](src/main/java/dev/hr/rezaei/buildflow/project/ProjectDtos.md)
  - [`/estimate/EstimateDtos.md`](src/main/java/dev/hr/rezaei/buildflow/estimate/EstimateDtos.md)
  - [`/workitem/WorkItemDtos.md`](src/main/java/dev/hr/rezaei/buildflow/workitem/WorkItemDtos.md)
  - [`/quote/QuoteDtos.md`](src/main/java/dev/hr/rezaei/buildflow/quote/QuoteDtos.md)

### Security Documentation
- [`/config/security/Security.md`](src/main/java/dev/hr/rezaei/buildflow/config/security/Security.md) - Complete security architecture and RBAC system

### Configuration Documentation
- [`/config/mvc/mvc.md`](src/main/java/dev/hr/rezaei/buildflow/config/mvc/mvc.md) - MVC configuration and SPA routing

### Project Planning
- [`/roadmap/buildflow_backend_roadmap.md`](src/main/resources/roadmap/buildflow_backend_roadmap.md) - 8-week development roadmap

### Documentation Standards
- [`/instructions/ModelReadMeInstructions.md`](src/main/resources/instructions/ModelReadMeInstructions.md) - Model documentation guidelines
- [`/instructions/ServiceReadMeInstructions.md`](src/main/resources/instructions/ServiceReadMeInstructions.md) - Service documentation guidelines
- [`/instructions/DtoReadMeInstructions.md`](src/main/resources/instructions/DtoReadMeInstructions.md) - DTO documentation guidelines

### Testing Documentation
- [`/test/TestClassesPattern.md`](src/test/resources/TestClassesPattern.md) - Test naming conventions and patterns
