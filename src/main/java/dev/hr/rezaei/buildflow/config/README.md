# Configuration Package

This package contains all configuration-related classes for the BuildFlow application, providing comprehensive setup for web/MVC functionality and security infrastructure. It organizes configuration concerns into specialized sub-packages for maintainability and separation of concerns.

## Summary

This package provides centralized application configuration with specialized sub-packages for MVC (web layer) and Security (authentication/authorization) concerns, enabling full-stack integration and comprehensive security.

## Files Structure

```
config/
├── mvc/
│   ├── dto/
│   │   ├── ErrorResponse.java                 # Unified error response
│   │   ├── MessageResponse.java               # Success message response
│   │   └── README.md                          # MVC DTO documentation
│   ├── AbstractAuthorizationHandler.java      # Base authorization handler
│   ├── GlobalExceptionHandler.java            # Centralized exception handling
│   ├── OpenApiConfig.java                     # API documentation config
│   ├── PagedResponseBuilder.java              # Paginated response builder
│   ├── PaginationHelper.java                  # Pagination helper utility
│   ├── README.md                              # MVC package documentation
│   ├── ResponseErrorType.java                 # Error type categorization
│   ├── ResponseFacilitator.java               # Response formatting utility
│   ├── SpaPathResourceResolver.java           # SPA routing resolver
│   └── WebMvcConfig.java                      # Central MVC configuration (includes CORS)
├── security/
│   ├── dto/
│   │   ├── JwtAuthenticationResponse.java     # JWT token response
│   │   ├── LoginRequest.java                  # Login request DTO
│   │   ├── SignUpRequest.java                 # Registration request DTO
│   │   ├── UserAuthenticationDto.java         # Secure user auth DTO
│   │   ├── UserSummaryResponse.java           # User summary response
│   │   └── README.md                          # Security DTO documentation
│   ├── AdminUserInitializer.java              # Admin user bootstrap
│   ├── AuthController.java                    # Authentication endpoints
│   ├── AuthService.java                       # Authentication service
│   ├── CustomUserDetailsService.java          # User details service
│   ├── JwtAuthenticationFilter.java           # JWT filter
│   ├── JwtTokenProvider.java                  # JWT provider
│   ├── MockDataInitializer.java               # Mock data generator
│   ├── README.md                              # Security package documentation
│   ├── RateLimitingFilter.java                # Rate limiting filter
│   ├── Role.java                              # Role enum
│   ├── SecurityAuditService.java              # Audit service
│   ├── SecurityConfig.java                    # Security configuration
│   ├── SecurityController.java                # Security test endpoints
│   ├── SecurityExceptionHandler.java          # Security exception handler
│   ├── UserAuthentication.java                # Authentication entity
│   ├── UserAuthenticationRepository.java      # Authentication repository
│   └── UserPrincipal.java                     # User principal
└── README.md                                  # This file
```

## Subfolder References

### [mvc/](mvc/) - MVC Configuration
Comprehensive Model-View-Controller configuration providing web layer setup, exception handling, SPA routing support, API documentation, and consistent response formatting.

**Key Features:**
- Single Page Application (React) integration
- Centralized exception handling
- OpenAPI/Swagger documentation
- Paginated response support
- Static resource serving

### [security/](security/) - Security Configuration
Complete security infrastructure with JWT authentication, role-based access control, rate limiting, security auditing, and authentication endpoints.

**Key Features:**
- JWT-based authentication
- Role-based access control (RBAC)
- Brute force protection
- Security event auditing
- Admin user management

## Package Structure

### Sub-packages

| Directory | Description |
|-----------|-------------|
| [mvc/](mvc/) | MVC configuration, exception handling, SPA support, API documentation, and CORS |
| [security/](security/) | Security configuration, authentication, authorization, and JWT management |

## Technical Overview

### MVC Configuration Sub-package
The **[mvc/](mvc/)** sub-package provides comprehensive Model-View-Controller configuration and utilities.

**Core Functionality:**
- **Frontend Integration**: Serves React SPA alongside Spring Boot API
- **Exception Handling**: Centralized error handling with consistent response formats
- **API Documentation**: OpenAPI/Swagger configuration for comprehensive API docs
- **Response Utilities**: Standardized response formatting across all endpoints
- **SPA Routing**: Client-side routing support with fallback strategies

**Key Components:**
- **WebMvcConfig**: Central MVC configuration for frontend and API integration
- **GlobalExceptionHandler**: Unified exception handling for all controllers
- **SpaPathResourceResolver**: Custom routing for single-page application support
- **ResponseFacilitator**: Consistent API response generation utilities
- **OpenApiConfig**: Comprehensive API documentation setup

### Security Configuration Sub-package
The **[security/](security/)** sub-package provides comprehensive security infrastructure.

**Core Functionality:**
- **JWT Authentication**: Token-based authentication with role-based access control
- **Role Management**: Hierarchical role system (VIEWER, USER, PREMIUM_USER, ADMIN)
- **Rate Limiting**: Brute force protection and request rate limiting
- **Security Filters**: Custom authentication and security filters
- **Audit Logging**: Comprehensive security event monitoring

**Key Components:**
- **SecurityConfig**: Main Spring Security configuration
- **JwtTokenProvider**: JWT token creation and validation
- **RateLimitingFilter**: Brute force and DoS protection
- **Role Enum**: Hierarchical role-based authority system
- **AuthService**: Core authentication business logic

## Integration Architecture

### Full-Stack Integration Pattern
```
Frontend (React SPA) ↔ MVC Config ↔ Security Config ↔ Backend APIs

1. Client requests hit MVC layer first
2. Security filters process authentication/authorization
3. Routes either serve SPA assets or process API calls
4. Consistent error handling and response formatting applied
```

### Configuration Coordination
```
MVC Configuration:
├── Serves frontend assets and handles SPA routing
├── Coordinates with security for protected endpoints
├── Provides unified exception handling
└── Generates comprehensive API documentation

Security Configuration:
├── Protects API endpoints with JWT authentication
├── Enforces role-based access control
├── Provides rate limiting and attack protection
└── Audits security events and violations
```

## Key Features

### Frontend-Backend Integration
- **Single JAR Deployment**: Complete application in one deployable artifact
- **Seamless Routing**: Client-side routes handled by React, API routes by Spring
- **Static Asset Serving**: Efficient serving of CSS, JS, and image assets
- **Development Support**: H2 console and actuator endpoints in development

### Security Infrastructure
- **JWT-Based Authentication**: Stateless authentication with role-based authorities
- **Hierarchical Roles**: Four-tier role system with granular permissions
- **Attack Protection**: Rate limiting, CSRF protection, and security headers
- **Audit Trail**: Comprehensive logging of authentication and authorization events

### API Management
- **Consistent Responses**: Standardized response formats for success and error cases
- **Exception Handling**: Centralized exception processing with detailed error information
- **Documentation**: Auto-generated OpenAPI documentation with security schemes
- **CORS Support**: Configurable cross-origin resource sharing

## Design Patterns

### Configuration Separation
```
Config Package
├── MVC (Web Layer Concerns)
│   ├── Request/Response handling
│   ├── Static resource serving
│   ├── Exception handling
│   └── API documentation
└── Security (Security Layer Concerns)
    ├── Authentication/Authorization
    ├── JWT token management
    ├── Rate limiting
    └── Security auditing
```

### Layered Security
```
Security Layers:
1. Rate Limiting Filter (DoS protection)
2. JWT Authentication Filter (token validation)
3. Spring Security Authorization (role-based access)
4. Method-Level Security (@PreAuthorize)
5. Audit Logging (security event tracking)
```

## Environment-Aware Configuration

### Development Environment
- **H2 Console**: Database management interface enabled
- **Relaxed Security**: Convenient development settings
- **CORS Enabled**: Allows frontend dev server (localhost:3000) to call backend API (localhost:8080)
- **Debug Logging**: Enhanced logging for development

### Production Environment
- **Strict Security**: Enhanced security headers and protection
- **No CORS Configuration**: Frontend served from same origin as backend (single JAR)
- **Performance Optimized**: Optimized static resource serving
- **Audit Enabled**: Comprehensive security event logging
- **Rate Limiting**: Active protection against attacks

## Business Value

### Development Productivity
- **Single Application**: Simplified deployment and development workflow
- **Consistent APIs**: Standardized request/response patterns reduce integration effort
- **Comprehensive Documentation**: Auto-generated API docs reduce documentation overhead
- **Security by Default**: Built-in security reduces security implementation effort

### Operational Excellence
- **Monitoring**: Built-in health checks and security audit trails
- **Performance**: Optimized static resource serving and authentication
- **Security**: Comprehensive protection against common web attacks
- **Maintainability**: Clear separation of concerns enables easier maintenance

## Integration Points

This package integrates with:
- **Frontend Application**: Serves React SPA and handles client-side routing
- **All Domain Packages**: Provides security and response formatting for all business logic
- **Base Package**: Utilizes common exception handling and validation patterns
- **External Systems**: Configures integration points for monitoring and logging

## Future Extensibility

### MVC Extensions
- **Additional Frontend Frameworks**: Support for other SPA frameworks
- **API Versioning**: Version-specific response formatting and documentation
- **Caching Strategies**: Advanced caching for static resources and API responses
- **Internationalization**: Multi-language support for error messages and responses

### Security Extensions
- **OAuth2 Integration**: Third-party authentication provider support
- **Advanced Roles**: More granular role and permission system
- **Multi-Factor Authentication**: Enhanced authentication security
- **Advanced Threat Detection**: Machine learning-based security monitoring

## Design Principles

- **Separation of Concerns**: Clear distinction between MVC and security responsibilities
- **Environment Awareness**: Different configurations for different deployment environments
- **Security First**: Security considerations built into every configuration decision
- **Performance Conscious**: Optimized for both development productivity and runtime performance
- **Extensibility**: Designed for easy extension and customization
- **Integration Ready**: Seamless integration with all other application packages