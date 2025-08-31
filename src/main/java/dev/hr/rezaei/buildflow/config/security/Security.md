# BuildFlow Security Package Overview

This package contains all security-related components for the BuildFlow application, implementing JWT-based authentication with Spring Security. The security system maintains separation of concerns by keeping authentication data decoupled from the business domain models and follows proper layered architecture patterns with comprehensive security enhancements including rate limiting, audit logging, and advanced threat protection.

## Core Security Components

### [SecurityConfig](SecurityConfig.java)
- **Purpose:** Main Spring Security configuration class that sets up authentication and authorization rules.
- **Enhanced Features:**
  - **Environment-aware security:** Profile-based configuration for development vs production
  - **H2 console protection:** Only accessible in development profiles, completely disabled in production
  - **Enhanced security headers:** CSP, XSS protection, referrer policy, HSTS with subdomain inclusion
  - **Rate limiting integration:** Ordered filter chain with rate limiting before JWT authentication
  - **Modern Spring Security 6.x:** Updated syntax removing deprecated methods
  - Conditional security configuration based on `spring.security.enabled` property
  - JWT-based stateless authentication with custom JWT filter integration
  - Comprehensive public route configuration for home page, authentication endpoints, API documentation, and static resources
  - BCrypt password encoding
  - CSRF protection disabled for API endpoints but enabled for web pages
  - Custom logout configuration with success URL redirection
  - Swagger UI and OpenAPI documentation access
- **Security Filters:**
  - `publicFilterChain()` - Disables all security when `spring.security.enabled=false`
  - `secureFilterChain()` - Full JWT-based security configuration with rate limiting and enhanced headers (default)
- **Public Routes:** `/`, `/home`, `/register`, `/api/auth/**`, `/api/public/**`, `/h2-console/**` (dev only), `/actuator/health`, Swagger UI, static resources
- **Security Headers:**
  - Content Security Policy (CSP) with strict source policies
  - X-XSS-Protection with block mode
  - Referrer-Policy with strict-origin-when-cross-origin
  - X-Content-Type-Options with nosniff
  - HTTP Strict Transport Security (HSTS) with 1-year max age and subdomain inclusion

### [UserAuthentication](UserAuthentication.java)
- **Purpose:** JPA entity to store user credentials separately from the business User entity.
- **Fields:**
  - `id` (UUID, primary key, generated)
  - `username` (String, length 100, not null, unique constraint)
  - `passwordHash` (String, not null, BCrypt encoded password)
  - `enabled` (boolean, not null, default true)
  - `createdAt` (Instant, not null, default now)
  - `lastLogin` (Instant, nullable, tracks last successful login)
- **Design Philosophy:** Maintains separation of concerns by keeping authentication data separate from business domain User entity

### [JwtTokenProvider](JwtTokenProvider.java)
- **Purpose:** JWT utility class for generating and validating JWT tokens with enhanced security features.
- **Key Features:**
  - **Configurable JWT settings:** Secret key and expiration time via application properties
  - **Strong key validation:** Validates JWT secret strength (minimum 256 bits recommended)
  - **Secure key generation:** Uses HMAC-SHA with proper key derivation
  - **Comprehensive token validation:** Handles malformed, expired, unsupported, and invalid signature cases
  - **Structured error handling:** Detailed logging for different JWT validation failures
- **Configuration:**
  - `app.jwt.secret` - JWT signing secret (must be configured)
  - `app.jwt.expiration` - Token expiration time in milliseconds (default: 24 hours)
- **Methods:**
  - `generateToken()` - Creates JWT with username as subject and expiration
  - `getUsernameFromToken()` - Extracts username from valid JWT
  - `isValid()` - Validates JWT signature and expiration

### [JwtAuthenticationFilter](JwtAuthenticationFilter.java)
- **Purpose:** Custom filter that validates JWT tokens and sets authentication context.
- **Key Features:**
  - **Order 2 execution:** Runs after rate limiting but before other authentication filters
  - **Public URL bypass:** Skips JWT validation for public endpoints
  - **Security audit integration:** Logs token validation failures for monitoring
  - **Graceful error handling:** Continues filter chain even on authentication failures
  - **User details integration:** Loads full user details from CustomUserDetailsService
- **Process Flow:**
  1. Check if URL is public (skip JWT validation)
  2. Extract JWT from Authorization header (Bearer token)
  3. Validate JWT token
  4. Load user details and set authentication context
  5. Continue filter chain

### [CustomUserDetailsService](CustomUserDetailsService.java)
- **Purpose:** Spring Security UserDetailsService implementation that bridges authentication and business domains.
- **Key Features:**
  - **Dual entity integration:** Loads from both UserAuthentication (credentials) and User (business data)
  - **Transactional safety:** Read-only transaction for data consistency
  - **Domain separation:** Maintains clean separation between auth and business concerns
- **Process:**
  1. Load authentication credentials from UserAuthentication entity
  2. Load business user data via UserService
  3. Create UserPrincipal combining both data sources

### [UserPrincipal](UserPrincipal.java)
- **Purpose:** Custom UserDetails implementation that wraps User entity for Spring Security.
- **Key Features:**
  - **Domain model protection:** Prevents pollution of business User entity with security concerns
  - **Flexible authority management:** Currently assigns ROLE_USER, extensible for future role-based access
  - **Complete user representation:** Includes username, email, password hash, and enabled status
- **Fields:**
  - `username` - User's login identifier
  - `email` - User's email address
  - `password` - BCrypt encoded password hash
  - `enabled` - Account activation status
- **Factory Method:** `create()` method constructs UserPrincipal from User and encoded password

### [AuthService](AuthService.java)
- **Purpose:** High-level authentication service that orchestrates user registration and authentication operations.
- **Key Features:**
  - **Layered architecture compliance:** Uses UserService for business operations
  - **Duplicate prevention:** Checks for existing username and email
  - **Security audit integration:** Logs all registration attempts
  - **Transactional safety:** Ensures data consistency during registration
  - **Password security:** BCrypt encoding for all stored passwords
- **Registration Process:**
  1. Validate username and email uniqueness
  2. Create business User entity via UserService
  3. Create UserAuthentication entity with encoded password
  4. Log registration attempt for audit trail

### [RateLimitingFilter](RateLimitingFilter.java)
- **Purpose:** Advanced rate limiting filter to prevent brute force attacks on authentication endpoints.
- **Key Features:**
  - **Order 1 execution:** Runs before all other security filters
  - **Sliding window algorithm:** 5 attempts per 15-minute window
  - **Automatic lockout:** 30-minute lockout after exceeding rate limit
  - **IP-based tracking:** Uses X-Forwarded-For for proxy environments
  - **Automatic cleanup:** Removes expired attempt records
  - **Comprehensive error responses:** Structured JSON error responses
- **Configuration:**
  - `MAX_ATTEMPTS_PER_WINDOW`: 5 attempts
  - `WINDOW_SIZE_MINUTES`: 15 minutes
  - `LOCKOUT_DURATION_MINUTES`: 30 minutes
- **Protected Endpoints:** `/api/auth/login`, `/api/auth/register`, `/api/auth/refresh`, `/api/auth/validate`

### [SecurityAuditService](SecurityAuditService.java)
- **Purpose:** Comprehensive security event logging service for monitoring and compliance.
- **Key Features:**
  - **Comprehensive event tracking:** Login attempts, registrations, token operations, unauthorized access
  - **Client identification:** IP address detection with proxy support (X-Forwarded-For, X-Real-IP)
  - **User agent logging:** Browser/client identification for forensic analysis
  - **Structured logging:** Consistent log format with timestamps and categorization
  - **Security-focused:** Masks sensitive data (token prefixes only)
- **Logged Events:**
  - Authentication attempts (success/failure)
  - User registration attempts
  - JWT token generation and validation failures
  - Unauthorized access attempts
  - Rate limit violations
  - Password change attempts
  - Account lockouts
  - Custom security events

### [SecurityExceptionHandler](SecurityExceptionHandler.java)
- **Purpose:** Centralized security exception handling for consistent error responses.
- **Key Features:**
  - **Consistent error handling:** Delegates to GlobalExceptionHandler for uniform responses
  - **Authentication entry point:** Handles unauthorized access (401 errors)
  - **Access denied handler:** Handles forbidden access (403 errors)
  - **Integration with audit logging:** Security events are logged through the audit service

### [UserAuthenticationRepository](UserAuthenticationRepository.java)
- **Purpose:** JPA repository for UserAuthentication entity operations.
- **Key Methods:**
  - `findByUsername()` - Retrieves authentication data by username
  - `existsByUsername()` - Checks username existence for validation

## Data Transfer Objects (DTOs)

### [LoginRequest](dto/LoginRequest.java)
- **Purpose:** Request DTO for user authentication.
- **Fields:**
  - `username` - 3-50 characters, required
  - `password` - 6-40 characters, required
- **Validation:** Bean Validation annotations for input validation

### [SignUpRequest](dto/SignUpRequest.java)
- **Purpose:** Request DTO for user registration with comprehensive validation.
- **Fields:**
  - `username` - 3-50 characters, required
  - `password` - 8-128 characters with complexity requirements
  - `contactRequestDto` - Complete contact information
- **Password Requirements:**
  - At least one lowercase letter
  - At least one uppercase letter
  - At least one digit
  - At least one special character (@$!%*?&_)
  - 8-128 characters total length

### [JwtAuthenticationResponse](dto/JwtAuthenticationResponse.java)
- **Purpose:** Response DTO containing JWT token and user information after successful authentication.

### [UserSummaryResponse](dto/UserSummaryResponse.java)
- **Purpose:** Response DTO for user information summary.

## Controllers

### [AuthController](AuthController.java)
- **Purpose:** REST controller handling authentication endpoints.
- **Endpoints:**
  - `POST /api/auth/login` - User authentication
  - `POST /api/auth/register` - User registration
  - Additional authentication-related endpoints

### [SecurityController](SecurityController.java)
- **Purpose:** Additional security-related endpoints and operations.

## Security Architecture Highlights

### Layered Security Approach
1. **Rate Limiting Layer** - Prevents brute force attacks
2. **JWT Authentication Layer** - Validates tokens and sets security context
3. **Authorization Layer** - Enforces access control rules
4. **Audit Layer** - Logs all security events

### Separation of Concerns
- **Authentication Data:** Stored in UserAuthentication entity (security package)
- **Business Data:** Stored in User entity (business domain)
- **Security Operations:** Handled by security package services
- **Business Operations:** Delegated to domain services

### Security Best Practices
- **Password Security:** BCrypt encoding with configurable strength
- **Token Security:** HMAC-SHA256 with configurable secrets and expiration
- **Rate Limiting:** Sliding window algorithm with automatic cleanup
- **Audit Logging:** Comprehensive security event tracking
- **Error Handling:** Consistent, secure error responses
- **Header Security:** Comprehensive security headers (CSP, HSTS, XSS protection)
- **Environment Awareness:** Different security configurations for dev/prod

### Compliance and Monitoring
- **Audit Logging:** All security events logged with timestamps and context
- **Rate Limiting:** Prevents automated attacks
- **Client Identification:** IP address and user agent tracking
- **Token Security:** Secure token generation and validation
- **Error Logging:** Detailed logging for security analysis

This security package provides enterprise-grade security features while maintaining clean architecture principles and comprehensive audit capabilities for compliance and monitoring requirements.
