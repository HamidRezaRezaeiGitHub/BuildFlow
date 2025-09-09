# API Controllers & Endpoints Overview

This document consolidates all REST API endpoint and controller information for the BuildFlow application. It covers user, project, authentication, and any other domain APIs, including endpoint paths, request/response structures, security, business rules, and error handling. Content is grouped by domain for clarity.

---

## Authentication Endpoints (AuthController)

### POST `/api/auth/register`
- **Purpose:** Register a new user with contact information and credentials.
- **Request Body:** `SignUpRequest`
- **Response:** `CreateUserResponse`
- **Status Codes:**
    - `201 Created`: User registered successfully
- **Notes:** Validates all input; logs registration events.

### POST `/api/auth/login`
- **Purpose:** Authenticate user and return JWT token.
- **Request Body:** `LoginRequest`
- **Response:** `JwtAuthenticationResponse`
- **Status Codes:**
    - `200 OK`: Authentication successful
- **Notes:** Logs authentication and token generation events.

### GET `/api/auth/current`
- **Purpose:** Get information about the currently authenticated user.
- **Response:** `UserSummaryResponse`
- **Security:** Bearer token required
- **Status Codes:**
    - `200 OK`: User information retrieved
- **Notes:** Uses authentication context; returns user summary.

### POST `/api/auth/refresh`
- **Purpose:** Refresh JWT token for authenticated user.
- **Response:** `JwtAuthenticationResponse`
- **Security:** Bearer token required
- **Status Codes:**
    - `200 OK`: Token refreshed
- **Notes:** Logs token generation event.

### POST `/api/auth/logout`
- **Purpose:** Logout user (client-side for JWT, clears security context).
- **Response:** `MessageResponse`
- **Security:** Bearer token required
- **Status Codes:**
    - `200 OK`: Logout successful
- **Notes:** Logs logout event.

### GET `/api/auth/validate`
- **Purpose:** Validate if the provided JWT token is still valid.
- **Response:** `MessageResponse` (valid) or `ErrorResponse` (invalid)
- **Security:** Bearer token required
- **Status Codes:**
    - `200 OK`: Token is valid
    - `401 Unauthorized`: Token is invalid

### POST `/api/auth/admin`
- **Purpose:** Create a new user with admin privileges (admin-only).
- **Request Body:** `SignUpRequest`
- **Response:** `CreateUserResponse`
- **Security:** Bearer token required, `CREATE_ADMIN` authority
- **Status Codes:**
    - `201 Created`: Admin user created
    - `403 Forbidden`: Access denied
- **Notes:** Logs admin user creation event.

---

## User Management Endpoints

### POST `/api/v1/users`
- **Purpose:** Create a new user with contact info, username, and registration status.
- **Request Body:** `CreateUserRequest`
- **Response:** `CreateUserResponse`
- **Security:** Bearer token, ADMIN role required
- **Notes:** Usernames and emails must be unique; all input validated.

### GET `/api/v1/users/{username}`
- **Purpose:** Retrieve a user by username.
- **Response:** `UserDto`
- **Security:** Bearer token, ADMIN role required

---

## Project Management Endpoints

### POST `/api/v1/projects`
- **Purpose:** Create a new construction project with builder, owner, and location information.
- **Request Body:** `CreateProjectRequest`
- **Response:** `CreateProjectResponse`
- **Security:** Bearer token, `CREATE_PROJECT` authority, custom authorization
- **Notes:** Builder and owner must exist; location must be provided and not pre-persisted.

### GET `/api/v1/projects/builder/{builderId}`
- **Purpose:** Retrieve all projects assigned to a specific builder.
- **Response:** List of `ProjectDto`
- **Security:** Bearer token, `VIEW_PROJECT` authority, custom authorization

### GET `/api/v1/projects/owner/{ownerId}`
- **Purpose:** Retrieve all projects owned by a specific property owner.
- **Response:** List of `ProjectDto`
- **Security:** Bearer token, `VIEW_PROJECT` authority, custom authorization

---

## Error Handling & Response Structure
- All endpoints return structured error responses for validation and business rule violations.
- Standard HTTP status codes for authentication, authorization, and validation errors.

---

## Design Principles
- **Security:** All endpoints require authentication and appropriate role/authority.
- **Validation:** All input is validated at the DTO level before reaching the service layer.
- **Consistency:** All API responses follow a standard structure for both success and error cases.

This document provides a single reference for all API endpoints, their request/response structures, security requirements, and business rules in the BuildFlow application.
