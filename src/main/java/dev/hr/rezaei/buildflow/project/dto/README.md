# Project Management DTOs

This package defines all Data Transfer Objects (DTOs) for project management operations in BuildFlow. DTOs are organized by use case to ensure clean API contracts, strong validation, and clear relationships between project and location data.

## Summary

This package contains specialized DTOs for project creation workflows, providing clean separation between request and response contracts with comprehensive address integration.

## Files Structure

```
dto/
├── CreateProjectRequest.java          # Request for creating new projects
├── CreateProjectResponse.java         # Response containing created project details
├── ProjectLocationRequestDto.java     # Location info for project creation (no ID)
└── README.md                          # This file
```

## Package Contents

### Classes

| File | Description |
|------|-------------|
| [CreateProjectRequest.java](CreateProjectRequest.java) | Request object for creating new projects with user, builder flag, and location |
| [CreateProjectResponse.java](CreateProjectResponse.java) | Response object containing the created project details |
| [ProjectLocationRequestDto.java](ProjectLocationRequestDto.java) | Location information for project creation (without ID field) |

## Technical Overview

### CreateProjectRequest
Primary request DTO for project creation operations.

**Key Features:**
- **User Association**: Identifies the user making the request and whether they are the builder
- **Location Integration**: Embedded location details for complete project setup
- **Validation Chain**: Cascading validation through nested objects
- **API Documentation**: Full Swagger documentation for API consumers

**Structure:**
- `userId` (UUID, required): ID of the user making the request
- `isBuilder` (boolean, required): Flag indicating if the requesting user is the builder
- `locationRequestDto` (ProjectLocationRequestDto, required): Complete project location information

**Validation Rules:**
- All fields are required (`@NotNull` validation)
- UUID must be valid format
- Nested location DTO must pass validation

### CreateProjectResponse
Response DTO that wraps the created project information.

**Key Features:**
- **Complete Project Data**: Returns full project details after creation
- **Nested Information**: Includes all related data (location, user references)
- **Consistent Structure**: Follows standard response patterns
- **API Documentation**: Swagger-annotated for client integration

**Structure:**
- `projectDto` (ProjectDto): Complete details of the created project

### ProjectLocationRequestDto
Specialized location DTO for project creation requests.

**Key Features:**
- **Address Inheritance**: Extends BaseAddressDto for consistent address handling
- **Creation Optimized**: Designed specifically for new project creation (no ID field)
- **Validation Integration**: Inherits validation from base address DTO
- **Consistency**: Ensures all location data follows the same format

**Structure:**
- Inherits all fields from BaseAddressDto:
  - `unitNumber` (String, optional)
  - `streetNumber` (String, required)
  - `streetName` (String, required)
  - `city` (String, required)
  - `stateOrProvince` (String, required)
  - `postalOrZipCode` (String, required)
  - `country` (String, required)

## Data Flow Patterns

### Project Creation Flow
```
1. Client sends CreateProjectRequest
   ├── userId (UUID)
   ├── isBuilder (boolean)
   └── ProjectLocationRequestDto (address details)

2. Service processes request and creates entities

3. Response returns CreateProjectResponse
   └── ProjectDto (with ProjectLocationDto containing ID)
```

### Validation Chain
```
CreateProjectRequest
├── Field validation (@NotNull annotations)
├── UUID format validation
└── Nested validation on ProjectLocationRequestDto
    └── BaseAddressDto validation chain
```

## Integration Points

This package integrates with:
- **ProjectController**: Uses these DTOs for all project creation endpoints
- **ProjectService**: Processes requests and generates responses
- **Project Entities**: Maps to/from domain entities through mappers
- **Base Address System**: Inherits validation and structure from base package

## Relationship to Core DTOs

These DTOs work in conjunction with core project DTOs:
- **ProjectDto**: Used in responses for complete project representation
- **ProjectLocationDto**: Used in responses with ID information
- **BaseAddressDto**: Provides foundation for all address-related DTOs

## Design Principles

- **Separation of Concerns**: Request DTOs never include entity IDs for new objects
- **Inheritance**: Leverages BaseAddressDto for consistent address handling
- **Validation**: Comprehensive validation at DTO level before service processing
- **Documentation**: Full OpenAPI/Swagger documentation for API clarity
- **Nesting**: Supports complex object creation with related data in single requests