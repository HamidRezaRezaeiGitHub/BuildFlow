# User Controller & API Endpoints Overview

This document describes all REST API endpoints for user management in the BuildFlow application. It consolidates endpoint information from the user package documentation, focusing on request/response structures, security, and business rules for each API.

## API Security
- **All endpoints require authentication and ADMIN role.**
- Security enforced via `@PreAuthorize("hasRole('ADMIN')")` and bearer token authentication.

## Endpoints

### POST `/api/v1/users`
- **Purpose:** Create a new user with contact info, username, and registration status.
- **Request Body:** `CreateUserRequest`
    - `registered` (boolean, required): Registration status
    - `username` (String, required): Username for the user
    - `contactRequestDto` (ContactRequestDto, required): Contact information
- **Response:** `CreateUserResponse`
    - `userDto` (UserDto): The created user details
- **Status Codes:**
    - `201 Created`: User created successfully
    - `400 Bad Request`: Validation or business rule violation
    - `401 Unauthorized`: Authentication required
    - `403 Forbidden`: Admin role required
- **Notes:**
    - All input is validated at the DTO level
    - Usernames and emails must be unique
    - Contact and address info must be provided and valid

### GET `/api/v1/users/{username}`
- **Purpose:** Retrieve a user by username.
- **Path Parameter:**
    - `username` (String): Username of the user to retrieve
- **Response:** `UserDto`
    - `id` (UUID): Unique identifier
    - `username` (String)
    - `email` (String)
    - `registered` (boolean)
    - `contactDto` (ContactDto): Associated contact information
- **Status Codes:**
    - `200 OK`: User found successfully
    - `404 Not Found`: User not found
    - `401 Unauthorized`: Authentication required
    - `403 Forbidden`: Admin role required

## Request/Response DTO Relationships

```
POST /api/v1/users
    Request: CreateUserRequest
        └── ContactRequestDto
            └── ContactAddressRequestDto
    Response: CreateUserResponse
        └── UserDto
            └── ContactDto
                └── ContactAddressDto

GET /api/v1/users/{username}
    Response: UserDto
        └── ContactDto
            └── ContactAddressDto
```

## Business Rules Enforced by API
- Usernames and emails must be unique
- Each user must have associated contact and address information
- All input is validated for required fields and format
- Only authenticated users with ADMIN role can access these endpoints

## Error Handling
- Structured error responses for validation and business rule violations
- Standard HTTP status codes for authentication, authorization, and validation errors

This document provides a single reference for all user management API endpoints, their request/response structures, security requirements, and business rules in the BuildFlow application.

