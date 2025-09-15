# MVC Configuration DTOs

This package contains Data Transfer Objects (DTOs) for MVC configuration and error handling in the BuildFlow application.

## Package Contents

### Classes

| File | Description |
|------|-------------|
| [ErrorResponse.java](ErrorResponse.java) | Unified error response for all types of errors |
| [MessageResponse.java](MessageResponse.java) | Generic message response for successful operations |

## Technical Overview

### ErrorResponse
A comprehensive error response DTO designed to provide consistent error reporting across the entire application.

**Key Features:**
- **Unified Error Handling**: Standardizes error responses across all API endpoints
- **Timestamp Tracking**: Records when errors occurred for debugging purposes
- **HTTP Status Integration**: Includes HTTP status codes for proper REST API compliance
- **Detailed Error Information**: Supports both general error messages and specific error lists
- **Swagger Documentation**: Fully documented for OpenAPI/Swagger integration

**Structure:**
- `timestamp` (Instant): When the error occurred
- `status` (String): HTTP status code
- `message` (String): Primary error message
- `errors` (List<String>): Detailed list of specific errors

### MessageResponse
A simple response DTO for successful operations that need to return confirmation messages.

**Key Features:**
- **Operation Confirmation**: Provides feedback for successful operations
- **Consistent Messaging**: Standardizes success response format
- **API Documentation**: Swagger-annotated for API documentation

**Usage Pattern:**
Used primarily by controllers and exception handlers to provide consistent response structures for both success and error scenarios.

## Integration Points

This package integrates with:
- **GlobalExceptionHandler**: Uses ErrorResponse for exception handling
- **ResponseFacilitator**: Utilizes both DTOs for response generation
- **All Controllers**: Inherit standardized response patterns through the MVC configuration

## Design Principles

- **Consistency**: All error responses follow the same structure
- **Extensibility**: Error structure supports multiple error types and details
- **Documentation**: Full OpenAPI/Swagger documentation for API consumers
- **Validation**: Proper field validation and constraints