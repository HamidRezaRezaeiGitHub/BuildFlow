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
  - `userId` (UUID, not null, unique constraint, links to business User entity)
  - `username` (String, length 100, not null, unique constraint)
  - `passwordHash` (String, not null, BCrypt encoded password)
  - `enabled` (boolean, not null, default true)
  - `createdAt` (LocalDateTime, not null, default now)
  - `lastLogin` (LocalDateTime, nullable)
- **Table:** `user_authentication`
- **Constraints:**
  - Unique constraint on `user_id` (`uk_user_auth_user_id`)
  - Unique constraint on `username` (`uk_user_auth_username`)
- **Lombok Annotations:** `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@Builder`

### [UserPrincipal](UserPrincipal.java)
- **Purpose:** Custom UserDetails implementation that wraps the business User entity for Spring Security.
- **Fields:**
  - `id` (UUID, user's unique identifier)
  - `username` (String, user's username)
  - `email` (String, user's email)
  - `password` (String, encoded password)
  - `enabled` (boolean, account status based on user registration)
- **Methods:**
  - `create(User user, String encodedPassword)` - Factory method to create UserPrincipal from User entity
  - `getAuthorities()` - Returns `ROLE_USER` for all authenticated users
  - **Complete UserDetails implementation:** All required Spring Security methods with secure defaults
    - `isAccountNonExpired()` - Returns true (accounts don't expire)
    - `isAccountNonLocked()` - Returns true (handled by rate limiting)
    - `isCredentialsNonExpired()` - Returns true (JWT handles expiration)
    - `isEnabled()` - Returns enabled status from user registration
- **Lombok Annotations:** `@Getter`, `@AllArgsConstructor`, `@SuperBuilder`

## Security Protection Systems

### [RateLimitingFilter](RateLimitingFilter.java)
- **Purpose:** Advanced rate limiting filter to prevent brute force attacks on authentication endpoints.
- **Algorithm:** Sliding window rate limiting with automatic cleanup
- **Configuration:**
  - **5 attempts** per 15-minute window for login/register endpoints
  - **30-minute lockout** after exceeding rate limits
  - **IP-based tracking** with proxy support (X-Forwarded-For, X-Real-IP headers)
- **Features:**
  - **Automatic cleanup** of old attempts outside the sliding window
  - **Concurrent HashMap** for thread-safe rate limit tracking
  - **Integrated audit logging** for all rate limit violations and lockouts
  - **HTTP 429** responses with retry-after information
  - **Order(1)** execution before other security filters
- **Protected Endpoints:** `/api/auth/login`, `/api/auth/register`
- **Response Format:** JSON with error message and retry-after timing

### [SecurityAuditService](SecurityAuditService.java)
- **Purpose:** Comprehensive security audit logging service for compliance and security monitoring.
- **Audit Events Tracked:**
  - **Login attempts** (successful/failed) with failure reasons
  - **Registration attempts** with validation failure details
  - **JWT token generation** with user context
  - **Token validation failures** with detailed error reasons
  - **Rate limit violations** with IP and endpoint tracking
  - **Account lockouts** with lockout reasons and duration
  - **Unauthorized access attempts** with endpoint and method tracking
  - **Password change attempts** (successful/failed)
  - **Generic security events** with custom data payload
- **Logging Context:**
  - **Client IP address** detection with proxy header support
  - **User agent** information for device tracking
  - **Timestamp** precision for incident correlation
  - **Request details** for forensic analysis
- **Integration Points:** AuthController, JwtAuthenticationFilter, RateLimitingFilter
- **Log Format:** Structured logging with `[SECURITY_AUDIT]` prefix for easy filtering

## Enhanced Authentication Services

### [AuthService](AuthService.java)
- **Purpose:** High-level authentication service that integrates with UserService while maintaining proper layered architecture.
- **Enhanced Features:**
  - **Integrated audit logging** for all registration and authentication events
  - **Comprehensive error handling** with detailed audit trails
  - **Transaction management** for data consistency
- **Dependencies:** Constructor injection of:
  - `UserService` - For business user operations
  - `UserAuthenticationRepository` - For authentication credential management
  - `PasswordEncoder` - For password hashing
- **Methods:**
  - `registerUser(SignUpRequest)` - Registers new user with complete contact information using UserService, handles both new users and upgrading existing users to registered status
  - `findUserByEmail(String)` - Delegates to UserService for user lookup
  - `findUserById(UUID)` - Delegates to UserService for user lookup by ID
- **Business Logic:**
  - Validates username uniqueness before registration
  - Supports upgrading existing unregistered users to registered status
  - Creates separate authentication records linked to business users
  - Maintains transactional consistency between user creation and authentication setup

### [CustomUserDetailsService](CustomUserDetailsService.java)
- **Purpose:** Custom UserDetailsService that loads user details from both the business User entity and the authentication UserAuthentication entity.
- **Dependencies:**
  - `UserService` - For loading business user data
  - `UserAuthenticationRepository` - For loading authentication credentials
- **Methods:**
  - `loadUserByUsername(String)` - Standard Spring Security method for username-based authentication
  - `loadUserById(String)` - Custom method for JWT token-based authentication
- **Features:**
  - Combines data from both authentication and business entities
  - Maintains separation of concerns between authentication and business domains
  - Supports both username/password and JWT token authentication flows

## Enhanced JWT Token Management

### [JwtTokenProvider](JwtTokenProvider.java)
- **Purpose:** JWT utility class for generating and validating JWT tokens with enhanced security.
- **Enhanced Security Features:**
  - **Mandatory secret validation** - Application startup fails without proper JWT secret
  - **256-bit key requirement** with validation warnings for shorter secrets
  - **Modern JJWT library** with enhanced security features
  - **Comprehensive error logging** for token validation failures
- **Configuration:**
  - `app.jwt.secret` - JWT signing secret (REQUIRED, minimum 32 characters recommended)
  - `app.jwt.expiration` - Token expiration time in milliseconds (default: 86400000 = 24 hours)
- **Methods:**
  - `generateToken(Authentication)` - Creates JWT token from authenticated user
  - `getUserIdFromToken(String)` - Extracts user ID from JWT token
  - `validateToken(String)` - Validates JWT token signature and expiration
  - `validateConfiguration()` - @PostConstruct method ensuring proper secret configuration
- **Security Features:**
  - Uses HMAC-SHA256 for token signing with proper key derivation
  - Includes token expiration validation with detailed error types
  - Comprehensive error handling for malformed, expired, unsupported, or invalid tokens
  - Startup validation prevents weak security configurations

### [JwtAuthenticationFilter](JwtAuthenticationFilter.java)
- **Purpose:** JWT authentication filter that validates JWT tokens and sets the authentication context with comprehensive audit logging.
- **Enhanced Features:**
  - **Integrated security audit logging** for token validation failures
  - **Detailed error categorization** for different token failure types
  - **Exception handling** without exposing internal security details
- **Dependencies:**
  - `JwtTokenProvider` - For token validation and user ID extraction
  - `CustomUserDetailsService` - For loading user details
  - `SecurityAuditService` - For audit logging of security events
- **Functionality:**
  - Extracts JWT from Authorization header (Bearer token format)
  - Validates token using JwtTokenProvider with detailed failure logging
  - Loads user details and sets Spring Security authentication context
  - Continues filter chain regardless of authentication outcome
  - Logs all token validation failures for security monitoring
- **Security Features:**
  - Proper error handling without exposing internal details
  - Sets authentication details for request tracking
  - Integrates seamlessly with Spring Security filter chain
  - Comprehensive audit trail for all token-related security events

## Enhanced REST Controllers

### [AuthController](AuthController.java)
- **Purpose:** Authentication controller that handles login, registration, and JWT token management with comprehensive audit logging.
- **Enhanced Features:**
  - **Comprehensive audit logging** for all authentication and registration events
  - **Enhanced error handling** with security event tracking
  - **Detailed failure analysis** with reason categorization
- **Dependencies:**
  - `AuthenticationManager` - For user authentication
  - `AuthService` - For user registration and lookup
  - `JwtTokenProvider` - For JWT token generation
  - `SecurityAuditService` - For security event logging
- **Endpoints:**
  - `POST /api/auth/login` - Authenticates user credentials and returns JWT token with audit logging
  - `POST /api/auth/register` - Registers new user with complete contact information and audit logging
  - `GET /api/auth/current` - Returns current authenticated user information
- **Features:**
  - Comprehensive OpenAPI/Swagger documentation
  - Proper HTTP status codes and error responses
  - Request validation with detailed error messages and audit trails
  - Security context integration for current user retrieval
  - Real-time security event logging for monitoring and compliance

### [SecurityController](SecurityController.java)
- **Purpose:** Testing controller for validating security configuration and authentication behavior.
- **Endpoints:**
  - `GET /api/security/public` - Public endpoint accessible without authentication
  - `GET /api/security/private` - Private endpoint requiring authentication
- **Features:**
  - OpenAPI documentation for security testing
  - Proper authentication status responses
  - Logging for security testing and debugging

## Enhanced Data Transfer Objects (DTOs)

### Authentication DTOs

#### [SignUpRequest](dto/SignUpRequest.java)
- **Purpose:** Request DTO for user registration with complete contact information and authentication credentials.
- **Enhanced Security Features:**
  - **Strong password validation** with complexity requirements
  - **Pattern matching** for secure password policies
  - **Extended length limits** for better security
- **Fields:**
  - `username` - Username for new account (3-50 characters, required)
  - `password` - Password for new account (8-128 characters, required with complexity)
    - Must contain lowercase letter, uppercase letter, digit, and special character
    - Pattern: `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$`
  - `contactRequestDto` - Complete contact information (required, validated)
- **Validation:** Comprehensive Jakarta validation with size constraints, pattern matching, and required field validation

#### [LoginRequest](dto/LoginRequest.java)
- **Purpose:** Request DTO for user authentication.
- **Fields:**
  - `username` - User's username
  - `password` - User's password

#### [JwtAuthenticationResponse](dto/JwtAuthenticationResponse.java)
- **Purpose:** Response DTO containing JWT token after successful authentication.
- **Fields:**
  - `accessToken` - JWT access token
  - `tokenType` - Token type (typically "Bearer")

#### [UserSummary](dto/UserSummary.java)
- **Purpose:** Response DTO with basic user information for current user endpoint.
- **Fields:**
  - `id` - User's unique identifier
  - `username` - User's username
  - `email` - User's email address

#### [GenericApiResponse](dto/GenericApiResponse.java)
- **Purpose:** Generic response DTO for API operations.
- **Fields:**
  - `success` - Boolean indicating operation success
  - `message` - Response message

## Repository Layer

### [UserAuthenticationRepository](UserAuthenticationRepository.java)
- **Purpose:** JPA repository for UserAuthentication entity operations.
- **Methods:**
  - `findByUsername(String)` - Finds authentication record by username
  - `findByUserId(UUID)` - Finds authentication record by user ID
  - `existsByUsername(String)` - Checks if username exists
  - `deleteByUserId(UUID)` - Deletes authentication record for user

## Security Architecture

### Enhanced Layered Architecture
- **Security Filter Layer:** RateLimitingFilter → JwtAuthenticationFilter → Spring Security filters
- **Controller Layer:** AuthController, SecurityController handle HTTP requests with audit logging
- **Service Layer:** AuthService, CustomUserDetailsService, SecurityAuditService provide business logic
- **Repository Layer:** UserAuthenticationRepository handles data persistence
- **Security Layer:** JWT filters, token providers, rate limiting, and security configuration

### Advanced Security Features
- **Rate Limiting:** Sliding window algorithm preventing brute force attacks
- **Audit Logging:** Comprehensive security event tracking for compliance
- **Environment Awareness:** Different security policies for development vs production
- **Enhanced Headers:** Modern web security headers (CSP, XSS, HSTS, referrer policy)
- **JWT Security:** Mandatory secret validation, proper key derivation, comprehensive error handling
- **Password Security:** Strong complexity requirements with pattern validation

### Separation of Concerns
- **Authentication Data:** Stored separately in UserAuthentication entity
- **Business Data:** Managed through UserService and User entity
- **Security Events:** Centralized audit logging through SecurityAuditService
- **Rate Limiting:** Isolated in dedicated filter with configurable policies
- **JWT Tokens:** Self-contained with user ID for stateless authentication
- **Security Configuration:** Conditional and environment-aware with enhanced protection

### Compliance and Monitoring
- **Security Audit Logs:** Dedicated logging configuration with separate log files
- **Event Tracking:** Real-time security event monitoring with structured logging
- **Forensic Analysis:** IP tracking, user agent logging, detailed failure analysis
- **Compliance Ready:** Comprehensive audit trails meeting security compliance requirements
- **Incident Response:** Detailed security event categorization for rapid incident response

## Configuration Requirements

### Required Application Properties
```yaml
app:
  jwt:
    secret: ${JWT_SECRET} # REQUIRED: Minimum 32 characters, set via environment variable
    expiration: 900000    # Optional: 15 minutes recommended (in milliseconds)
```

### Environment Variables
- `JWT_SECRET`: Strong 256-bit secret key for JWT token signing (REQUIRED)

### Logging Configuration
- **Security audit logs:** `logs/security-audit-{profile}.log`
- **Log retention:** 90 days for security events, 30 days for application logs
- **Log rotation:** Automatic compression and archival
- **Structured logging:** JSON-compatible format for security information systems
