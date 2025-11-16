# MVC Configuration Package

This package provides comprehensive Model-View-Controller (MVC) configuration and utilities for the BuildFlow application. It handles web configuration, exception handling, response formatting, API documentation, and Single Page Application (SPA) support.

## Summary

This package provides the MVC foundation with centralized configuration, exception handling, SPA routing support, API documentation, and consistent response formatting across all endpoints.

## Files Structure

```
mvc/
├── dto/
│   ├── ErrorResponse.java                 # Unified error response for all errors
│   ├── MessageResponse.java               # Generic message response for success
│   └── README.md                          # DTO package documentation
├── AbstractAuthorizationHandler.java      # Base class for custom authorization logic
├── DateFilter.java                        # DTO for optional date range filtering
├── DateFilterHelper.java                  # Utility for parsing ISO 8601 timestamps
├── GlobalExceptionHandler.java            # Centralized exception handler for all controllers
├── OpenApiConfig.java                     # OpenAPI/Swagger documentation configuration
├── PagedResponseBuilder.java              # Utility for building paginated responses
├── PaginationHelper.java                  # Helper for pagination parameter processing
├── README.md                              # This file
├── ResponseErrorType.java                 # Enum for categorizing error types
├── ResponseFacilitator.java               # Utility for building consistent API responses
├── SpaPathResourceResolver.java           # Custom resolver for SPA routing
├── UpdatableEntitySpecification.java      # JPA Specification factory for date filtering
└── WebMvcConfig.java                      # Central Spring MVC configuration (includes CORS)
```

## Subfolder References

### [dto/](dto/) - MVC Response DTOs
Data Transfer Objects for standardized error and success message responses across all API endpoints.

## Package Contents

### Configuration Classes

| File | Description |
|------|-------------|
| [WebMvcConfig.java](WebMvcConfig.java) | Central Spring MVC configuration for frontend/API integration and CORS |
| [OpenApiConfig.java](OpenApiConfig.java) | OpenAPI/Swagger documentation configuration |

### Exception Handling

| File | Description |
|------|-------------|
| [GlobalExceptionHandler.java](GlobalExceptionHandler.java) | Centralized exception handler for all controllers |

### Response Utilities

| File | Description |
|------|-------------|
| [ResponseFacilitator.java](ResponseFacilitator.java) | Utility for building consistent API responses |
| [ResponseErrorType.java](ResponseErrorType.java) | Enum for categorizing error types in API responses |
| [PagedResponseBuilder.java](PagedResponseBuilder.java) | Utility for building paginated responses with RFC 5988 Link headers |
| [PaginationHelper.java](PaginationHelper.java) | Helper class for processing pagination parameters |

### Date Filtering Utilities

| File | Description |
|------|-------------|
| [DateFilter.java](DateFilter.java) | DTO for optional date range filtering on createdAt/lastUpdatedAt fields |
| [DateFilterHelper.java](DateFilterHelper.java) | Utility for parsing ISO 8601 timestamps from request parameters |
| [UpdatableEntitySpecification.java](UpdatableEntitySpecification.java) | JPA Specification factory for type-safe date filtering on UpdatableEntity |

### SPA Support

| File | Description |
|------|-------------|
| [SpaPathResourceResolver.java](SpaPathResourceResolver.java) | Custom resource resolver for Single Page Application routing |

### Authorization Support

| File | Description |
|------|-------------|
| [AbstractAuthorizationHandler.java](AbstractAuthorizationHandler.java) | Base class for implementing custom authorization logic |

### DTO Sub-package

| Directory | Description |
|-----------|-------------|
| [dto/](dto/) | Contains DTOs for MVC responses and error handling |

## Endpoints

This package does not contain controller classes, but it provides infrastructure that all controllers use for:
- Exception handling and error responses
- SPA routing and static resource serving
- API documentation generation
- Paginated response formatting
- Consistent response structures

## Technical Overview

### WebMvcConfig
Central Spring MVC configuration enabling full-stack application deployment with CORS support.

**Key Features:**
- **Frontend Integration**: Serves React frontend assets from classpath
- **Client-Side Routing**: Handles SPA routing with fallback to index.html
- **Static Resource Management**: Configures serving of JS, CSS, and image assets
- **Route Preservation**: Maintains API endpoints and administrative interfaces
- **CORS Configuration**: Environment-aware CORS for development mode

**Route Handling Strategy:**
- **Static Assets**: Direct serving of files in /static directory
- **API Routes**: Paths starting with /api/ routed to Spring controllers
- **Admin Routes**: Preservation of /h2-console and /actuator/ endpoints
- **Client Routes**: All other paths return index.html for React Router

**Frontend Integration Process:**
```
1. Maven build includes frontend assets in JAR
2. Static resources served from classpath:/static/
3. SpaPathResourceResolver handles client-side routing
4. API endpoints remain accessible for backend operations
```

**CORS Configuration (Development Only):**
- **Allowed Origins**: `http://localhost:3000`, `http://127.0.0.1:3000`
- **Allowed Methods**: GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Allowed Headers**: All headers including Authorization for JWT
- **Credentials**: Enabled for cookie and header-based authentication
- **Cache Duration**: Preflight responses cached for 1 hour

**Environment Detection:**
```
Development: Profiles 'dev', 'development', 'test', 'default'
Production:  Profiles 'production', 'prod', 'uat'
```

**Production Mode**: No CORS configuration (frontend served from same origin as backend)

### WebConfig
Global web configuration managing CORS and other cross-cutting web concerns.

**Key Features:**
- **Environment-Aware CORS**: Different CORS policies for development and production
- **Development Mode**: Allows frontend dev server (localhost:3000) to call backend API
- **Production Mode**: No CORS configuration needed (same-origin serving)
- **Centralized Management**: Single location for all CORS configuration

**CORS Configuration (Development Only):**
- **Allowed Origins**: `http://localhost:3000`, `http://127.0.0.1:3000`
- **Allowed Methods**: GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Allowed Headers**: All headers including Authorization for JWT
- **Credentials**: Enabled for cookie and header-based authentication
- **Cache Duration**: Preflight responses cached for 1 hour

**Environment Detection:**
```
Development: Profiles 'dev', 'development', 'test', 'default'
Production:  Profiles 'production', 'prod', 'uat'
```

### SpaPathResourceResolver
Custom resource resolver supporting Single Page Application routing patterns.

**Key Features:**
- **Resource Resolution**: First attempts to serve actual static files
- **Fallback Strategy**: Returns index.html for non-existent client routes
- **API Preservation**: Avoids interfering with API and admin routes
- **Performance Optimization**: Efficient resource lookup and caching

**Resolution Logic:**
```
1. Check if requested resource exists as static file
2. If exists, serve the actual resource
3. If not exists and not API/admin route, serve index.html
4. Allow React Router to handle client-side routing
```

### GlobalExceptionHandler
Centralized exception handling ensuring consistent error responses across the application.

**Key Features:**
- **Unified Error Handling**: Consistent error response format
- **Exception Categorization**: Different handling for various exception types
- **Validation Support**: Comprehensive validation error processing
- **Security Integration**: Coordinates with security exception handlers

**Exception Types Handled:**
- **Validation Errors**: Bean validation and custom validation failures
- **Business Exceptions**: Domain-specific business rule violations
- **Authentication Errors**: Security and authorization failures
- **System Errors**: Unexpected system exceptions

### ResponseFacilitator
Utility class for building consistent API responses across controllers.

**Key Features:**
- **Response Standardization**: Uniform response structure for all endpoints
- **Success Responses**: Consistent format for successful operations
- **Error Responses**: Standardized error response generation
- **Integration Support**: Used by controllers and exception handlers

**Response Patterns:**
- **Success**: Standard success response with data
- **Created**: Resource creation confirmation responses
- **Error**: Detailed error information with context
- **Validation**: Specific validation error responses

### ResponseErrorType Enum
Categorization system for different types of API errors.

**Error Categories:**
- **VALIDATION**: Input validation failures
- **BUSINESS**: Business rule violations
- **AUTHENTICATION**: Authentication failures
- **AUTHORIZATION**: Authorization failures
- **RATE_LIMIT**: Rate limiting violations
- **SYSTEM**: System-level errors

### OpenApiConfig
Configuration for comprehensive API documentation using OpenAPI/Swagger.

**Key Features:**
- **API Metadata**: Application information and version details
- **Security Schemes**: JWT authentication documentation
- **Endpoint Documentation**: Automatic endpoint discovery and documentation
- **Response Documentation**: Comprehensive response schema documentation

**Documentation Structure:**
- **Authentication**: JWT bearer token documentation
- **Endpoints**: All REST endpoints with request/response schemas
- **Models**: DTO and entity documentation
- **Examples**: Request and response examples

### AbstractAuthorizationHandler
Base class providing framework for custom authorization implementations.

**Key Features:**
- **Extension Framework**: Foundation for domain-specific authorization
- **Common Patterns**: Shared authorization logic and utilities
- **Integration Points**: Hooks for service-layer authorization
- **Flexibility**: Supports various authorization strategies

**Usage Patterns:**
- **Project Authorization**: Access control for project resources
- **User Authorization**: User-specific access controls
- **Role-Based Security**: Role and permission-based authorization
- **Resource Protection**: Fine-grained resource access control

## Integration Points

This package integrates with:
- **Frontend**: Serves React application and handles client-side routing
- **Security Package**: Coordinates with authentication and authorization
- **All Controllers**: Provides consistent response formatting and error handling
- **API Documentation**: Generates comprehensive API documentation
- **Base Package**: Utilizes standard DTOs and error handling patterns

## SPA Architecture

### Frontend-Backend Integration
```
Build Process:
1. React app built with npm run build
2. Static assets copied to src/main/resources/static/
3. Spring Boot packages assets in JAR
4. WebMvcConfig serves assets and handles routing

Runtime Process:
1. Client requests URL (e.g., /projects/123)
2. SpaPathResourceResolver checks for static file
3. If not found, serves index.html
4. React Router handles client-side navigation
5. API calls to /api/* handled by Spring controllers
```

### Route Management
```
Route Categories:
- /api/** → Spring Boot controllers
- /actuator/** → Spring Boot Actuator endpoints
- /h2-console/** → H2 database console (dev/uat)
- /static/** → Static resources (CSS, JS, images)
- /** → React SPA (index.html + client routing)
```

## Date Filtering Utilities

The date filtering utilities provide a reusable pattern for filtering entities based on `createdAt` and `lastUpdatedAt` timestamps. This pattern works across all entities extending `UpdatableEntity`.

### DateFilter
Immutable DTO representing optional date range filtering on entity timestamps.

**Purpose:**
- Encapsulate date filtering criteria for API endpoints
- Support filtering by creation and update timestamps
- Enable flexible date range queries (after, before, both)

**Fields:**
- `createdAfter` - Filter for entities created on or after this timestamp
- `createdBefore` - Filter for entities created before this timestamp
- `updatedAfter` - Filter for entities last updated on or after this timestamp
- `updatedBefore` - Filter for entities last updated before this timestamp

**Usage:**
```java
// Build a date filter
DateFilter dateFilter = DateFilter.builder()
    .createdAfter(Instant.parse("2024-01-01T00:00:00Z"))
    .createdBefore(Instant.parse("2024-12-31T23:59:59Z"))
    .build();

// Check if filter has any criteria
if (dateFilter.hasFilters()) {
    // Apply filtering logic
}

// Get empty filter (no filtering)
DateFilter emptyFilter = DateFilter.empty();
```

### DateFilterHelper
Static utility class for parsing ISO 8601 timestamps from request parameters.

**Purpose:**
- Convert string request parameters to Instant objects
- Handle null, blank, and invalid timestamp formats gracefully
- Provide consistent error logging for invalid formats
- Always return a non-null DateFilter

**Key Method:**
```java
public static DateFilter createDateFilter(
    String createdAfter, 
    String createdBefore,
    String updatedAfter, 
    String updatedBefore
)
```

**Error Handling:**
- Null/blank parameters treated as no filter criteria
- Invalid ISO 8601 formats logged as warnings
- Invalid timestamps ignored (field set to null in DateFilter)
- Never throws exceptions, always returns valid DateFilter

**Usage in Controllers:**
```java
@GetMapping
public ResponseEntity<List<ProjectDto>> getProjects(
    @RequestParam(required = false) String createdAfter,
    @RequestParam(required = false) String createdBefore,
    @RequestParam(required = false) String updatedAfter,
    @RequestParam(required = false) String updatedBefore
) {
    DateFilter dateFilter = DateFilterHelper.createDateFilter(
        createdAfter, createdBefore, updatedAfter, updatedBefore
    );
    // Use dateFilter with service layer
}
```

### UpdatableEntitySpecification
Factory class for creating JPA Specifications for date filtering on `UpdatableEntity` subclasses.

**Purpose:**
- Provide type-safe JPA Criteria API queries for date filtering
- Enable composition with other Specifications
- Support filtering on createdAt and lastUpdatedAt fields
- Reusable across all UpdatableEntity-based entities

**Key Methods:**
```java
// Create standalone date filter specification
public static <T extends UpdatableEntity> Specification<T> withDateFilter(DateFilter dateFilter)

// Combine date filter with existing specification (using AND)
public static <T extends UpdatableEntity> Specification<T> withDateFilterAnd(
    Specification<T> existingSpec, 
    DateFilter dateFilter
)
```

**Usage in Services:**
```java
// Standalone date filtering
Specification<Project> spec = UpdatableEntitySpecification.withDateFilter(dateFilter);
Page<Project> results = repository.findAll(spec, pageable);

// Combined with other criteria
Specification<Project> userSpec = (root, query, cb) -> 
    cb.equal(root.get("user").get("id"), userId);
Specification<Project> combinedSpec = UpdatableEntitySpecification
    .withDateFilterAnd(userSpec, dateFilter);
Page<Project> results = repository.findAll(combinedSpec, pageable);
```

**Repository Requirements:**
Repositories must extend `JpaSpecificationExecutor`:
```java
public interface ProjectRepository extends 
    JpaRepository<Project, UUID>, 
    JpaSpecificationExecutor<Project> {
}
```

### Date Filtering API Usage

**Request Format:**
All timestamps must use ISO 8601 format with timezone:
```
createdAfter=2024-01-01T00:00:00Z
createdBefore=2024-12-31T23:59:59Z
updatedAfter=2024-06-01T00:00:00Z
updatedBefore=2024-12-31T23:59:59Z
```

**Example API Calls:**
```bash
# Filter projects created in 2024
GET /api/projects?createdAfter=2024-01-01T00:00:00Z&createdBefore=2024-12-31T23:59:59Z

# Filter projects updated in last 30 days
GET /api/projects?updatedAfter=2024-11-15T00:00:00Z

# Combine creation and update filters
GET /api/projects?createdAfter=2024-01-01T00:00:00Z&updatedAfter=2024-11-01T00:00:00Z

# Combine with pagination
GET /api/projects?createdAfter=2024-01-01T00:00:00Z&page=0&size=20&sort=createdAt,desc
```

**Filter Behavior:**
- `createdAfter`: Entities where `createdAt >= timestamp` (inclusive)
- `createdBefore`: Entities where `createdAt < timestamp` (exclusive)
- `updatedAfter`: Entities where `lastUpdatedAt >= timestamp` (inclusive)
- `updatedBefore`: Entities where `lastUpdatedAt < timestamp` (exclusive)
- Multiple filters are combined with AND logic
- All filters are optional and can be used independently

## Error Handling Strategy

### Centralized Exception Processing
```
Exception Flow:
1. Controller throws exception
2. GlobalExceptionHandler catches exception
3. ResponseFacilitator formats error response
4. ResponseErrorType categorizes error
5. Consistent ErrorResponse returned to client
```

### Validation Integration
```
Validation Process:
1. Request validation at controller level
2. Bean validation annotations processed
3. Validation errors collected and formatted
4. Detailed error response with field-specific messages
5. Client receives actionable error information
```

## Design Principles

- **Centralization**: All cross-cutting MVC concerns managed centrally
- **Consistency**: Standardized response formats across all endpoints
- **SPA Support**: Full support for modern single-page application architecture
- **Documentation**: Comprehensive API documentation generation
- **Error Handling**: Robust, consistent error handling and reporting
- **Security Integration**: Seamless integration with security framework
- **Performance**: Optimized static resource serving and routing