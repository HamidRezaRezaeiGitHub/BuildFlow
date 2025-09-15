# Security Configuration Package

This package provides comprehensive security functionality for the BuildFlow application, implementing JWT-based authentication with Spring Security and role-based access control (RBAC). The security system maintains separation of concerns and follows proper layered architecture patterns with comprehensive security enhancements.

## Package Contents

### Configuration Classes

| File | Description |
|------|-------------|
| [SecurityConfig.java](SecurityConfig.java) | Main Spring Security configuration orchestrating the entire security setup |

### Authentication Controllers

| File | Description |
|------|-------------|
| [AuthController.java](AuthController.java) | REST API controller for authentication operations (login, register, logout) |
| [SecurityController.java](SecurityController.java) | Additional security-related endpoint controllers |

### Service Classes

| File | Description |
|------|-------------|
| [AuthService.java](AuthService.java) | Core authentication business logic and user management |
| [CustomUserDetailsService.java](CustomUserDetailsService.java) | Spring Security UserDetailsService implementation |
| [SecurityAuditService.java](SecurityAuditService.java) | Security event logging and monitoring service |

### Filter Classes

| File | Description |
|------|-------------|
| [JwtAuthenticationFilter.java](JwtAuthenticationFilter.java) | JWT token validation and authentication filter |
| [RateLimitingFilter.java](RateLimitingFilter.java) | Brute force protection and rate limiting filter |

### JWT Components

| File | Description |
|------|-------------|
| [JwtTokenProvider.java](JwtTokenProvider.java) | JWT token creation, validation, and management |
| [UserPrincipal.java](UserPrincipal.java) | Spring Security UserDetails implementation with role authorities |

### Entity Classes

| File | Description |
|------|-------------|
| [UserAuthentication.java](UserAuthentication.java) | Authentication data entity (password, roles, status) |

### Repository Classes

| File | Description |
|------|-------------|
| [UserAuthenticationRepository.java](UserAuthenticationRepository.java) | Spring Data JPA repository for authentication data |

### Exception Handling

| File | Description |
|------|-------------|
| [SecurityExceptionHandler.java](SecurityExceptionHandler.java) | Specialized exception handler for security-related errors |

### Initialization

| File | Description |
|------|-------------|
| [AdminUserInitializer.java](AdminUserInitializer.java) | Bootstrap service for creating initial admin user |

### Enums

| File | Description |
|------|-------------|
| [Role.java](Role.java) | Role-based access control enumeration with hierarchical authorities |

### DTO Sub-package

| Directory | Description |
|-----------|-------------|
| [dto/](dto/) | Contains DTOs for authentication requests and responses |

## Technical Overview

### Security Architecture
The security system follows a layered approach with clear separation of concerns:

1. **Request Layer**: Controllers and DTOs handle HTTP requests/responses
2. **Filter Layer**: Rate limiting and JWT authentication filters 
3. **Service Layer**: Authentication services and business logic
4. **Data Layer**: Entities and repositories for authentication data
5. **Security Layer**: Spring Security configuration and utilities
6. **Audit Layer**: Security event logging and monitoring
7. **Authorization Layer**: Role-based access control and method-level security

### SecurityConfig
Main Spring Security configuration class orchestrating the entire security setup.

**Key Features:**
- **Method-Level Security**: Enabled with @EnableMethodSecurity for @PreAuthorize annotations
- **Environment-Aware Security**: Different configurations for development and production
- **Filter Chain Configuration**: Ordered filter chain with rate limiting and JWT authentication
- **Public URL Management**: Comprehensive list of public endpoints
- **Security Headers**: Production-grade security headers including CSP

**Environment-Specific Configurations:**
- **Development Mode**: H2 console access, relaxed CSRF, same-origin frame options
- **Production Mode**: Strict security headers, no H2 access, enhanced protection

**Filter Chain Order:**
```
1. RateLimitingFilter (brute force protection)
2. JwtAuthenticationFilter (token validation)
3. Standard Spring Security filters
```

### Role-Based Access Control System

#### Role Enum
Hierarchical role system with granular authority management.

**Available Roles:**
- **VIEWER**: Minimal access, no authorities
- **USER**: Standard user role with project CRUD authorities
- **PREMIUM_USER**: All USER authorities plus premium-specific authorities
- **ADMIN**: All USER and PREMIUM_USER authorities plus admin-only authorities

**Authority Structure:**
```
VIEWER: []
USER: [CREATE_PROJECT, VIEW_PROJECT, UPDATE_PROJECT, DELETE_PROJECT]
PREMIUM_USER: [USER authorities + premium-only authorities]
ADMIN: [PREMIUM_USER authorities + CREATE_ADMIN]
```

### Authentication Flow

#### Complete Authentication Process
```
1. Registration:
   User credentials → AuthController → AuthService → 
   Create User + UserAuthentication entities → 
   Assign default USER role

2. Login:
   User credentials → AuthController → AuthenticationManager → 
   CustomUserDetailsService → UserPrincipal → 
   JWT token generation with role authorities

3. Request Authentication:
   Bearer token → RateLimitingFilter → JwtAuthenticationFilter → 
   SecurityContext set with role authorities

4. Authorization:
   Protected endpoint → Spring Security → 
   UserPrincipal authorities check → 
   @PreAuthorize evaluation
```

### JWT Token Management

#### JwtTokenProvider
Comprehensive JWT token management service.

**Key Features:**
- **Token Generation**: Creates JWT tokens with user information and roles
- **Token Validation**: Validates token signature, expiration, and format
- **Claims Management**: Extracts user information from token claims
- **Security**: Configurable secret key and expiration times

**Token Structure:**
```
Header: Algorithm and token type
Payload: User ID, username, roles, issued/expiration times
Signature: HMAC signature for integrity verification
```

### Authentication Filters

#### JwtAuthenticationFilter
Processes JWT tokens for request authentication.

**Filter Process:**
```
1. Extract Bearer token from Authorization header
2. Validate token using JwtTokenProvider
3. Extract user information and authorities
4. Set SecurityContext with authenticated user
5. Continue filter chain
```

#### RateLimitingFilter
Protects against brute force attacks and excessive requests.

**Protection Features:**
- **Rate Limiting**: Limits requests per IP address per time window
- **Brute Force Protection**: Blocks IPs after failed authentication attempts
- **Configurable Limits**: Adjustable rate limits and block durations
- **Audit Integration**: Logs security events for monitoring

### User Authentication Management

#### UserAuthentication Entity
Dedicated entity for authentication data, separate from business user data.

**Key Features:**
- **Password Storage**: BCrypt-hashed passwords
- **Role Management**: User role assignments
- **Account Status**: Enabled/disabled account management
- **Security Separation**: Keeps authentication data separate from business user data

**Structure:**
- `id` (UUID): Primary key
- `username` (String): Unique username
- `password` (String): BCrypt-hashed password
- `role` (Role): Assigned role with authorities
- `enabled` (boolean): Account status

#### CustomUserDetailsService
Spring Security integration for user authentication.

**Key Features:**
- **User Loading**: Loads user details by username
- **Authority Mapping**: Maps roles to Spring Security authorities
- **Integration**: Seamless integration with Spring Security authentication
- **Performance**: Optimized user lookup and authority loading

### Security Services

#### AuthService
Core authentication business logic service.

**Key Features:**
- **User Registration**: Handles user creation with authentication setup
- **Login Processing**: Validates credentials and generates tokens
- **Password Management**: Secure password handling and validation
- **Role Assignment**: Manages user role assignments

#### SecurityAuditService
Comprehensive security event logging and monitoring.

**Audit Capabilities:**
- **Authentication Events**: Login attempts, successes, failures
- **Authorization Events**: Access grants and denials
- **Security Violations**: Rate limiting triggers, suspicious activity
- **System Events**: Configuration changes, admin actions

### Exception Handling

#### SecurityExceptionHandler
Specialized exception handling for security operations.

**Exception Types:**
- **Authentication Failures**: Invalid credentials, account disabled
- **Authorization Failures**: Insufficient permissions, access denied
- **JWT Errors**: Token validation failures, expired tokens
- **Rate Limiting**: Request rate exceeded, IP blocked

### Admin User Initialization

#### AdminUserInitializer
Bootstrap service ensuring system has initial admin access.

**Key Features:**
- **Default Admin**: Creates default admin user if none exists
- **Environment Aware**: Different credentials for different environments
- **Security**: Secure password generation and role assignment
- **Idempotent**: Safe to run multiple times without duplication

## Integration Points

This package integrates with:
- **User Package**: Links authentication data to business user entities
- **MVC Package**: Coordinates with global exception handling and response formatting
- **All Controllers**: Provides authentication and authorization for protected endpoints
- **Base Package**: Utilizes exception handling and validation patterns

## Security Best Practices

### Password Security
- **BCrypt Hashing**: Industry-standard password hashing
- **Salt Generation**: Automatic salt generation for each password
- **Configurable Strength**: Adjustable BCrypt strength for performance/security balance

### Token Security
- **JWT Standards**: Follows JWT best practices and standards
- **Secure Secrets**: Configurable secret keys for token signing
- **Expiration Management**: Configurable token expiration times
- **Signature Validation**: Comprehensive token signature verification

### Attack Protection
- **Rate Limiting**: Protects against brute force and DoS attacks
- **CSRF Protection**: Cross-site request forgery protection
- **XSS Protection**: Cross-site scripting prevention headers
- **Content Security Policy**: Strict CSP headers in production

## Design Principles

- **Separation of Concerns**: Authentication data separate from business data
- **Role-Based Security**: Hierarchical role system with granular permissions
- **Defense in Depth**: Multiple layers of security controls
- **Environment Awareness**: Different security configurations for different environments
- **Audit Trail**: Comprehensive logging of security events
- **Performance**: Optimized authentication and authorization processes
- **Extensibility**: Easy extension of roles, authorities, and security features