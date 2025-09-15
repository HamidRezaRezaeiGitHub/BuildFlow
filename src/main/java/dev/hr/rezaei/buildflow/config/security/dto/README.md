# Security Configuration DTOs

This package contains Data Transfer Objects (DTOs) for authentication and security operations in the BuildFlow application.

## Package Contents

### Classes

| File | Description |
|------|-------------|
| [JwtAuthenticationResponse.java](JwtAuthenticationResponse.java) | Response containing JWT token and user information after successful authentication |
| [LoginRequest.java](LoginRequest.java) | Request object for user authentication with username/email and password |
| [SignUpRequest.java](SignUpRequest.java) | Request object for user registration with complete user details |
| [UserSummaryResponse.java](UserSummaryResponse.java) | Summary response containing basic user information |

## Technical Overview

### JwtAuthenticationResponse
Comprehensive authentication response DTO that provides all necessary information after successful login.

**Key Features:**
- **JWT Token Delivery**: Contains the access token for authenticated requests
- **Token Metadata**: Includes token type and expiration information
- **User Information**: Provides basic user details post-authentication
- **Security Headers**: Supports proper security header configuration

**Structure:**
- `accessToken` (String): JWT access token
- `tokenType` (String): Type of token (typically "Bearer")
- `expiresIn` (Long): Token expiration time in seconds
- `userSummary` (UserSummaryResponse): Basic user information

### LoginRequest
Secure login request DTO with comprehensive validation.

**Key Features:**
- **Dual Authentication**: Accepts either username or email for login
- **Strong Validation**: Bean validation annotations ensure data integrity
- **Security Constraints**: Password complexity requirements
- **API Documentation**: Complete Swagger documentation

**Structure:**
- `username` (String): Username or email (3-100 characters)
- `password` (String): Password (6-40 characters)

**Validation Rules:**
- Username/email: Required, 3-100 characters
- Password: Required, 6-40 characters

### SignUpRequest
Comprehensive user registration request DTO.

**Key Features:**
- **Complete User Creation**: Includes all necessary user registration data
- **Contact Integration**: Embeds contact information for full user profile
- **Validation Chain**: Cascading validation through nested objects
- **Role Assignment**: Initial role configuration during registration

**Structure:**
- `username` (String): Unique username
- `email` (String): User's email address
- `password` (String): User's password
- `firstName` (String): User's first name
- `lastName` (String): User's last name
- `contactRequestDto` (ContactRequestDto): Additional contact details

### UserSummaryResponse
Lightweight user information response DTO.

**Key Features:**
- **Essential Information**: Contains only necessary user data for responses
- **Security Conscious**: Excludes sensitive information like passwords
- **Role Information**: Includes user roles and permissions
- **Profile Data**: Basic profile information for UI display

**Structure:**
- `id` (UUID): User unique identifier
- `username` (String): Username
- `email` (String): Email address
- `roles` (Set<String>): User roles and permissions
- `firstName` (String): First name
- `lastName` (String): Last name

## Authentication Flow

```
1. User Registration (SignUpRequest) → JWT + UserSummaryResponse
2. User Login (LoginRequest) → JwtAuthenticationResponse
3. Token Usage → Access to protected resources
4. User Info Retrieval → UserSummaryResponse
```

## Integration Points

This package integrates with:
- **AuthController**: Uses all DTOs for authentication endpoints
- **AuthService**: Processes authentication requests and generates responses
- **JwtTokenProvider**: Works with JwtAuthenticationResponse for token management
- **UserService**: Integrates with user management for registration and profile data

## Security Features

- **Password Security**: Enforced password complexity requirements
- **Token Security**: JWT-based authentication with expiration
- **Input Validation**: Comprehensive validation to prevent injection attacks
- **Data Sanitization**: Proper handling of user input data

## Design Principles

- **Security First**: All DTOs designed with security considerations
- **Validation**: Comprehensive input validation at DTO level
- **Documentation**: Full OpenAPI/Swagger documentation
- **Separation of Concerns**: Clear distinction between request and response DTOs