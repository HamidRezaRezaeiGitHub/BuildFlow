# MVC Configuration & Utilities Overview

This document summarizes the purpose, structure, and key features of all components under the `config.mvc` package in BuildFlow. It is organized by logical concern: configuration, exception handling, response utilities, OpenAPI integration, and supporting DTOs.

## 1. Web MVC Configuration

### WebMvcConfig
- **Purpose:** Central Spring MVC configuration for the application.
- **Features:**
  - Registers custom resource resolvers (e.g., for SPA routing)
  - Configures CORS, static resources, and other MVC settings

### SpaPathResourceResolver
- **Purpose:** Custom resource resolver for Single Page Application (SPA) support.
- **Features:**
  - Ensures that unknown paths are routed to the SPA entry point (e.g., `index.html`)
  - Supports client-side routing in modern web apps

## 2. Exception Handling

### GlobalExceptionHandler
- **Purpose:** Centralized exception handler for all controllers.
- **Features:**
  - Handles validation errors, business exceptions, and generic errors
  - Returns structured `ErrorResponse` objects
  - Integrates with security exception handlers for consistent error output

## 3. Response Utilities

### ResponseFacilitator
- **Purpose:** Utility for building consistent API responses.
- **Features:**
  - Generates success and error responses
  - Used by controllers and exception handlers for uniform output

### ResponseErrorType
- **Purpose:** Enum for categorizing error types in API responses.
- **Features:**
  - Used in `ErrorResponse` to indicate the nature of the error (validation, rate limit, etc.)

## 4. OpenAPI & API Documentation

### OpenApiConfig
- **Purpose:** Configures OpenAPI/Swagger documentation for the API.
- **Features:**
  - Sets up API metadata, security schemes, and documentation grouping
  - Ensures all endpoints are documented and discoverable

## 5. Authorization Support

### AbstractAuthorizationHandler
- **Purpose:** Base class for implementing custom authorization logic.
- **Features:**
  - Provides extension points for project-specific or domain-specific authorization checks
  - Used by service-level authorization handlers (e.g., for project or user access)

## 6. DTOs for API Responses

### ErrorResponse
- **Purpose:** Standard structure for error responses from the API.
- **Fields:**
  - `timestamp`, `status`, `message`, `errors` (list), `path`, `method`, `errorType`
- **Usage:**
  - Returned by `GlobalExceptionHandler` and security exception handlers

### MessageResponse
- **Purpose:** Standard structure for simple success or informational messages.
- **Fields:**
  - `message`
- **Usage:**
  - Used for non-error, non-entity responses (e.g., status messages)

## Design Principles
- **Centralization:** All cross-cutting concerns (error handling, response formatting, documentation) are managed in one place.
- **Consistency:** All API responses follow a standard structure for both success and error cases.
- **Extensibility:** Abstract classes and enums allow for easy extension and customization.
- **Separation of Concerns:** Configuration, error handling, and documentation are decoupled from business logic.

This package ensures that the BuildFlow API is robust, well-documented, and provides a consistent developer and client experience.

