# MVC Configuration DTOs

This package contains Data Transfer Objects (DTOs) for MVC configuration and error handling in the BuildFlow application.

## Summary

This package provides standardized response DTOs for both success and error scenarios across all API endpoints, ensuring consistent communication between the backend and frontend.

## Files Structure

```
dto/
├── ErrorResponse.java          # Unified error response for all types of errors
├── MessageResponse.java        # Generic message response for successful operations
└── README.md                   # This file
```

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
- `message` (String): Primary error message describing the failure
- `errors` (List<String>): Detailed list of specific error details
- `path` (String): Request path where the error occurred
- `method` (String): HTTP method used in the request
- `errorType` (ResponseErrorType): Type/category of error that occurred

### MessageResponse
A comprehensive response DTO for API operations that provides operation status and feedback messages.

**Key Features:**
- **Operation Confirmation**: Provides feedback for successful operations with success flag
- **Timestamp Tracking**: Records when the response was generated
- **HTTP Status Integration**: Includes HTTP status codes for proper REST API compliance
- **Consistent Messaging**: Standardizes success response format
- **API Documentation**: Swagger-annotated for API documentation

**Structure:**
- `timestamp` (Instant): When the response was generated
- `success` (boolean): Indicates if the operation was successful
- `status` (String): HTTP status code of the response
- `message` (String): Message related to the response

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