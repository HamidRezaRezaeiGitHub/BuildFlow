# Project Controller & API Endpoints Overview

This document describes all REST API endpoints for project management in the BuildFlow application. It consolidates endpoint information from the project package documentation, focusing on request/response structures, security, and business rules for each API.

## API Security
- **All endpoints require authentication and project-specific authority.**
- Security enforced via `@PreAuthorize` with required authority and custom service-level authorization checks.
- Bearer token authentication is required for all endpoints.

## Endpoints

### POST `/api/v1/projects`
- **Purpose:** Create a new construction project with builder, owner, and location information.
- **Request Body:** `CreateProjectRequest`
    - `builderId` (UUID, required): ID of the builder user
    - `ownerId` (UUID, required): ID of the owner user
    - `locationRequestDto` (ProjectLocationRequestDto, required): Project location information
- **Response:** `CreateProjectResponse`
    - `projectDto` (ProjectDto): The created project details
- **Status Codes:**
    - `201 Created`: Project created successfully
    - `400 Bad Request`: Validation or business rule violation
    - `401 Unauthorized`: Authentication required
    - `403 Forbidden`: Insufficient authority or failed custom authorization
- **Security:**
    - Requires `CREATE_PROJECT` authority
    - Custom authorization: `@projectAuthService.isCreateRequestAuthorized(#request)`
- **Notes:**
    - All input is validated at the DTO level
    - Builder and owner must exist
    - Location must be provided and not pre-persisted

### GET `/api/v1/projects/builder/{builderId}`
- **Purpose:** Retrieve all projects assigned to a specific builder.
- **Path Parameter:**
    - `builderId` (UUID): ID of the builder
- **Response:** List of `ProjectDto`
- **Status Codes:**
    - `200 OK`: Projects retrieved successfully
    - `401 Unauthorized`: Authentication required
    - `403 Forbidden`: Insufficient authority or failed custom authorization
- **Security:**
    - Requires `VIEW_PROJECT` authority
    - Custom authorization: `@projectAuthService.isViewProjectsAuthorized(#builderId)`

### GET `/api/v1/projects/owner/{ownerId}`
- **Purpose:** Retrieve all projects owned by a specific property owner.
- **Path Parameter:**
    - `ownerId` (UUID): ID of the owner
- **Response:** List of `ProjectDto`
- **Status Codes:**
    - `200 OK`: Projects retrieved successfully
    - `401 Unauthorized`: Authentication required
    - `403 Forbidden`: Insufficient authority or failed custom authorization
- **Security:**
    - Requires `VIEW_PROJECT` authority
    - Custom authorization: `@projectAuthService.isViewProjectsAuthorized(#ownerId)`

## Request/Response DTO Relationships

```
POST /api/v1/projects
    Request: CreateProjectRequest
        └── ProjectLocationRequestDto
    Response: CreateProjectResponse
        └── ProjectDto
            └── ProjectLocationDto

GET /api/v1/projects/builder/{builderId}
GET /api/v1/projects/owner/{ownerId}
    Response: List<ProjectDto>
        └── ProjectLocationDto
```

## Business Rules Enforced by API
- Builder and owner must exist
- Project location must be provided and not pre-persisted
- All input is validated for required fields and format
- Only authenticated users with the required authority and passing custom authorization can access these endpoints

## Error Handling
- Structured error responses for validation and business rule violations
- Standard HTTP status codes for authentication, authorization, and validation errors

This document provides a single reference for all project management API endpoints, their request/response structures, security requirements, and business rules in the BuildFlow application.

