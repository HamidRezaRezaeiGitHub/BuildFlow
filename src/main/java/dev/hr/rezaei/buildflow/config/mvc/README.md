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
├── GlobalExceptionHandler.java            # Centralized exception handler for all controllers
├── OpenApiConfig.java                     # OpenAPI/Swagger documentation configuration
├── PagedResponseBuilder.java              # Utility for building paginated responses
├── PaginationHelper.java                  # Helper for pagination parameter processing
├── README.md                              # This file
├── ResponseErrorType.java                 # Enum for categorizing error types
├── ResponseFacilitator.java               # Utility for building consistent API responses
├── SpaPathResourceResolver.java           # Custom resolver for SPA routing
└── WebMvcConfig.java                      # Central Spring MVC configuration
```

## Subfolder References

### [dto/](dto/) - MVC Response DTOs
Data Transfer Objects for standardized error and success message responses across all API endpoints.

## Package Contents

### Configuration Classes

| File | Description |
|------|-------------|
| [WebMvcConfig.java](WebMvcConfig.java) | Central Spring MVC configuration for frontend and API integration |
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
Central Spring MVC configuration enabling full-stack application deployment.

**Key Features:**
- **Frontend Integration**: Serves React frontend assets from classpath
- **Client-Side Routing**: Handles SPA routing with fallback to index.html
- **Static Resource Management**: Configures serving of JS, CSS, and image assets
- **Route Preservation**: Maintains API endpoints and administrative interfaces

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