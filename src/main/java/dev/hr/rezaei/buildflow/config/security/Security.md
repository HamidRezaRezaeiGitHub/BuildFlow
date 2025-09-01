# BuildFlow Security Package Overview

This package contains all security-related components for the BuildFlow application, implementing JWT-based authentication with Spring Security and **role-based access control (RBAC)**. The security system maintains separation of concerns by keeping authentication data decoupled from the business domain models and follows proper layered architecture patterns with comprehensive security enhancements including rate limiting, audit logging, admin role management, and advanced threat protection.

## Security Architecture Overview

The security system follows a layered approach with clear separation of concerns:

1. **Request Layer** - Controllers and DTOs handle HTTP requests/responses
2. **Filter Layer** - Rate limiting and JWT authentication filters 
3. **Service Layer** - Authentication services and business logic
4. **Data Layer** - Entities and repositories for authentication data
5. **Security Layer** - Spring Security configuration and utilities
6. **Audit Layer** - Security event logging and monitoring
7. **Authorization Layer** - Role-based access control and method-level security

## Authentication Flow

The complete authentication flow works as follows:

1. **Registration**: User submits credentials → AuthController → AuthService → Creates User + UserAuthentication entities (with default USER role)
2. **Login**: User credentials → AuthController → AuthenticationManager → CustomUserDetailsService → UserPrincipal (with role-based authorities) → JWT token generated
3. **Request Authentication**: Bearer token → RateLimitingFilter → JwtAuthenticationFilter → SecurityContext set with role authorities
4. **Authorization**: Protected endpoint → Spring Security → UserPrincipal authorities checked → @PreAuthorize evaluates role permissions

## Role-Based Access Control System

### [Role](Role.java)
- **Purpose:** Enumeration defining user roles in the BuildFlow system.
- **Available Roles:**
  - `USER` - Standard user role with basic access to the system
  - `ADMIN` - Administrator role with elevated privileges and administrative functions
- **Design:** Simple enum for type safety and easy extensibility for future roles

## Core Configuration

### [SecurityConfig](SecurityConfig.java)
- **Purpose:** Main Spring Security configuration class that orchestrates the entire security setup.
- **Method-Level Security:** Enabled with `@EnableMethodSecurity(prePostEnabled = true)` for @PreAuthorize annotations
- **Environment-Aware Security:**
  - **Development Mode:** H2 console access, relaxed CSRF, same-origin frame options
  - **Production Mode:** Strict security headers, no H2 access, enhanced protection
- **Filter Chain Configuration:**
  - `Order 1`: RateLimitingFilter (brute force protection)
  - `Order 2`: JwtAuthenticationFilter (token validation)
  - Standard Spring Security filters follow
- **Security Headers (Production):**
  - Content Security Policy (CSP) with strict source policies
  - HTTP Strict Transport Security (HSTS) with 1-year max age and subdomain inclusion
  - X-XSS-Protection with block mode
  - Referrer-Policy with strict-origin-when-cross-origin
  - X-Content-Type-Options with nosniff
- **Public Routes:** `/`, `/home`, `/api/auth/**`, `/api/public/**`, `/actuator/health`, Swagger UI, static resources
- **Conditional Security:** Can be disabled via `spring.security.enabled=false` for testing

## Request Processing Layer

### [AuthController](AuthController.java)
- **Purpose:** Main REST controller handling authentication endpoints with comprehensive API documentation and role-based admin functions.
- **Standard Endpoints:**
  - `POST /api/auth/register` - User registration with contact information (creates USER role)
  - `POST /api/auth/login` - User authentication and JWT token generation
  - `GET /api/auth/current` - Get current authenticated user information
  - `POST /api/auth/refresh` - Refresh JWT token for authenticated users
  - `POST /api/auth/logout` - Logout and clear security context
  - `GET /api/auth/validate` - Validate JWT token
- **Admin-Only Endpoints:**
  - `POST /api/auth/admin` - Create admin users (requires ADMIN role via @PreAuthorize)
- **Features:**
  - Comprehensive Swagger/OpenAPI documentation
  - Validation integration with Bean Validation
  - Consistent error handling via ResponseFacilitator
  - Security audit logging integration
  - Role-based endpoint protection with method-level security

### [SecurityController](SecurityController.java)
- **Purpose:** Additional security-related endpoints and operations for administrative functions.

## Data Transfer Objects (DTOs)

### [SignUpRequest](dto/SignUpRequest.java)
- **Purpose:** Registration request with comprehensive validation rules.
- **Fields:**
  - `username` (3-50 characters, required)
  - `password` (8-128 characters with complexity requirements)
  - `contactRequestDto` (complete contact information)
- **Password Security Requirements:**
  - At least one lowercase letter
  - At least one uppercase letter  
  - At least one digit
  - At least one special character (@$!%*?&_)
  - 8-128 characters total length

### [LoginRequest](dto/LoginRequest.java)
- **Purpose:** Authentication request with input validation.
- **Fields:**
  - `username` (3-50 characters, required)
  - `password` (6-40 characters, required)

### [JwtAuthenticationResponse](dto/JwtAuthenticationResponse.java)
- **Purpose:** Successful authentication response containing JWT token and user information.

### [UserSummaryResponse](dto/UserSummaryResponse.java)
- **Purpose:** User information summary for authenticated user endpoints, now includes role information.

## Filter Layer (Security Pipeline)

### [RateLimitingFilter](RateLimitingFilter.java) - Order 1
- **Purpose:** Advanced brute force protection using sliding window algorithm.
- **Protection Strategy:**
  - 5 attempts per 15-minute sliding window
  - 30-minute automatic lockout after exceeding limits
  - IP-based tracking with proxy support (X-Forwarded-For, X-Real-IP)
  - Automatic cleanup of expired attempt records
- **Protected Endpoints:** `/api/auth/login`, `/api/auth/register`, `/api/auth/refresh`, `/api/auth/validate`
- **Response:** Structured JSON error responses with retry guidance
- **Integration:** Comprehensive audit logging for security monitoring

### [JwtAuthenticationFilter](JwtAuthenticationFilter.java) - Order 2
- **Purpose:** JWT token validation and security context establishment with role-based authorities.
- **Processing Flow:**
  1. Check if URL is public (bypass validation for open endpoints)
  2. Extract Bearer token from Authorization header
  3. Validate JWT token signature and expiration
  4. Load user details with role information via CustomUserDetailsService
  5. Set SecurityContext with authenticated user and role-based authorities
  6. Continue filter chain (graceful handling of failures)
- **Features:**
  - Public URL bypass for performance
  - Comprehensive error logging with audit integration
  - User details loading with business domain integration
  - Role-based authority assignment (ROLE_USER, ROLE_ADMIN)

## Service Layer

### [AuthService](AuthService.java)
- **Purpose:** High-level authentication orchestration with role management capabilities.
- **Registration Methods:**
  - `registerUser()` - Creates standard users with USER role (default)
  - `registerUserWithRole()` - Creates users with specified role
  - `createAdminUser()` - Creates users with ADMIN role (for admin creation)
- **Registration Process:**
  1. Validate username and email uniqueness across both auth and business domains
  2. Create business User entity via UserService (domain separation)
  3. Create UserAuthentication entity with BCrypt-encoded password and specified role
  4. Comprehensive audit logging for compliance including role assignment
- **Features:**
  - Transactional safety for data consistency
  - Duplicate prevention with meaningful error messages
  - Integration with business domain via UserService
  - Security audit trail for all operations including role changes

### [CustomUserDetailsService](CustomUserDetailsService.java)
- **Purpose:** Spring Security bridge between authentication and business domains with role integration.
- **Integration Strategy:**
  1. Load authentication credentials from UserAuthentication entity (including role)
  2. Load business user data via UserService (maintains domain boundaries)
  3. Create UserPrincipal combining both data sources with role-based authorities
- **Features:**
  - Read-only transactions for performance and safety
  - Clean separation of authentication and business concerns
  - Exception handling with meaningful error messages
  - Role-based authority mapping to Spring Security authorities

## Data Layer

### [UserAuthentication](UserAuthentication.java)
- **Purpose:** JPA entity storing authentication credentials and role information separate from business User entity.
- **Schema Design:**
  - `id` (UUID, primary key, auto-generated)
  - `username` (String, 100 chars, unique constraint, not null)
  - `passwordHash` (String, BCrypt-encoded, not null)
  - `role` (Role enum, STRING storage, not null, default USER)
  - `enabled` (boolean, account status, default true)
  - `createdAt` (Instant, registration timestamp, auto-set)
  - `lastLogin` (Instant, nullable, tracks authentication events)
- **Design Philosophy:** Complete separation from business domain User entity with role-based access control

### [UserAuthenticationRepository](UserAuthenticationRepository.java)
- **Purpose:** JPA repository for authentication data operations.
- **Key Methods:**
  - `findByUsername()` - Retrieve authentication data by username (includes role)
  - `existsByUsername()` - Username uniqueness validation

### [UserPrincipal](UserPrincipal.java)
- **Purpose:** Spring Security UserDetails implementation with role-based authority management.
- **Role Integration:**
  - Stores user role information
  - Converts role to Spring Security authorities (ROLE_USER, ROLE_ADMIN)
  - Provides flexible authority management for @PreAuthorize annotations
- **Design Benefits:**
  - Prevents pollution of business User entity with security concerns
  - Role-based authority generation for Spring Security
  - Complete user representation for security context including role information
- **Factory Pattern:** `create()` method constructs UserPrincipal from User and UserAuthentication (with role)

## Security Utilities

### [JwtTokenProvider](JwtTokenProvider.java)
- **Purpose:** JWT token lifecycle management with enhanced security.
- **Security Features:**
  - Configurable JWT secret validation (minimum 256 bits recommended)
  - HMAC-SHA256 signing with proper key derivation
  - Comprehensive token validation (malformed, expired, signature, claims)
  - Structured error handling with detailed logging
- **Configuration:**
  - `app.jwt.secret` - Signing secret (required, validated at startup)
  - `app.jwt.expiration` - Token TTL in milliseconds (default: 24 hours)
- **Core Methods:**
  - `generateToken()` - Create signed JWT with username and expiration
  - `getUsernameFromToken()` - Extract username from validated token
  - `isValid()` - Comprehensive token validation with error categorization

## Security Monitoring & Audit

### [SecurityAuditService](SecurityAuditService.java)
- **Purpose:** Comprehensive security event logging for compliance and monitoring including role-based events.
- **Event Categories:**
  - Authentication events (login success/failure, token operations)
  - Registration attempts (success/failure with reasons and role assignments)
  - Authorization failures (unauthorized access, invalid tokens)
  - Security violations (rate limiting, suspicious activity)
  - Administrative actions (password changes, account lockouts, admin user creation)
  - Role-based events (admin user creation, role assignments)
- **Client Identification:**
  - IP address detection with proxy support (X-Forwarded-For, X-Real-IP)
  - User agent logging for forensic analysis
  - Request context preservation
- **Security-First Logging:**
  - Structured log format with consistent categorization
  - Sensitive data masking (token prefixes only)
  - Timestamp precision for correlation
  - Role and administrative action tracking

### [SecurityExceptionHandler](SecurityExceptionHandler.java)
- **Purpose:** Centralized security exception handling ensuring consistent error responses.
- **Integration Points:**
  - Authentication entry point (401 unauthorized)
  - Access denied handler (403 forbidden) - includes role-based access denials
  - Delegates to GlobalExceptionHandler for response consistency
  - Automatic audit logging integration

## Role-Based Security Implementation

### Method-Level Security
- **@PreAuthorize Annotations:** Enabled for fine-grained access control
- **Admin Endpoint Protection:** `@PreAuthorize("hasRole('ADMIN')")` protects admin-only endpoints
- **Authority Format:** Spring Security standard format (ROLE_USER, ROLE_ADMIN)

### Role Assignment Strategy
- **Default Registration:** All new users receive USER role automatically
- **Admin Creation:** Only existing admin users can create new admin users
- **Role Persistence:** Roles stored in UserAuthentication entity, separate from business domain

### Admin Capabilities
- **Admin User Creation:** Create other admin users via protected endpoint
- **Administrative Functions:** Access to admin-only endpoints and operations
- **Audit Trail:** All admin actions logged for compliance and monitoring

## Security Best Practices Implementation

### Layered Defense Strategy
1. **Rate Limiting**: Prevents automated attacks at the network level
2. **Token Security**: HMAC-SHA256 with configurable secrets and expiration
3. **Password Security**: BCrypt with configurable rounds and complexity requirements  
4. **Header Security**: Comprehensive security headers (CSP, HSTS, XSS protection)
5. **Audit Logging**: Complete security event tracking for compliance
6. **Role-Based Access Control**: Fine-grained permissions with method-level security

### Clean Architecture Principles
- **Domain Separation**: Authentication data isolated from business entities
- **Role Management**: Security roles separate from business domain concepts
- **Dependency Direction**: Security layer depends on domain, not vice versa
- **Interface Segregation**: Focused interfaces for specific security concerns
- **Single Responsibility**: Each component has a clear, focused purpose

### Environment-Aware Security
- **Development**: H2 console access, relaxed settings for productivity
- **Production**: Strict security headers, enhanced protection, no dev tools
- **Testing**: Configurable security disable for integration testing

### Compliance and Monitoring
- **Audit Trail**: All security events logged with context and timestamps
- **Threat Detection**: Rate limiting and suspicious activity monitoring
- **Forensic Capability**: Client identification and request correlation
- **Error Security**: Structured error responses without information leakage
- **Role Tracking**: Complete audit trail for role assignments and admin actions

This security package provides enterprise-grade security features with comprehensive role-based access control while maintaining clean architecture principles, extensive audit capabilities, and environment-appropriate configuration for both development productivity and production security.
