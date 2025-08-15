# Project DTO Package Overview

This package contains the Data Transfer Object (DTO) classes for project management operations in the BuildFlow application. The DTOs handle data transfer between the API layer and the service layer, providing structured request/response objects with proper validation and documentation.

## DTO Strategy

The project package follows a clear DTO strategy:
- **Simple DTOs**: Complete entity representations including ID fields for API responses
- **Request DTOs**: Input DTOs for creation operations without ID fields
- **Response DTOs**: Structured response objects wrapping core DTOs
- **Inheritance**: DTOs extend base classes (`BaseAddressDto`, `UpdatableEntityDto`) for common functionality

## Simple DTOs

### [ProjectDto](./ProjectDto.java)
- **Purpose:** Represents complete project information for API responses
- **Entity Mapping:** Maps to `Project` entity via `Dto<Project>` interface
- **Key Fields:**
  - `UUID id` - Unique project identifier
  - `UUID builderId` - ID of the builder user assigned to this project
  - `UUID ownerId` - ID of the project owner
  - `ProjectLocationDto locationDto` - Nested location information
- **Inheritance:** Extends `UpdatableEntityDto` (provides creation/update timestamps)
- **Validation:** Inherits validation from base class

### [ProjectLocationDto](./ProjectLocationDto.java)
- **Purpose:** Represents project location information for API responses
- **Entity Mapping:** Maps to `ProjectLocation` entity via `Dto<ProjectLocation>` interface
- **Key Fields:**
  - `UUID id` - Unique location identifier
- **Inheritance:** Extends `BaseAddressDto` (provides address fields like street, city, state, etc.)
- **Validation:** Inherits address validation from base class

## Request DTOs

### [CreateProjectRequest](./dto/CreateProjectRequest.java)
- **Purpose:** Request object for creating new projects
- **Key Fields:**
  - `@NotNull UUID builderId` - Required builder user ID
  - `@NotNull UUID ownerId` - Required owner user ID  
  - `@Valid @NotNull ProjectLocationRequestDto locationRequestDto` - Required location information
- **Validation:**
  - Builder user ID is required with message "Builder user ID is required"
  - Owner user ID is required with message "Owner user ID is required"
  - Location information is required with message "Location information is required"
  - Nested location DTO validation via `@Valid`
- **Swagger Documentation:** Includes OpenAPI schema descriptions for all fields

### [ProjectLocationRequestDto](./dto/ProjectLocationRequestDto.java)
- **Purpose:** Project location information for creation requests (without ID field)
- **Key Fields:** No additional fields beyond inherited address fields
- **Inheritance:** Extends `BaseAddressDto` for complete address functionality
- **Validation:** Inherits address validation from base class
- **Note:** Intentionally excludes ID field as this is for creation requests only

## Response DTOs

### [CreateProjectResponse](./dto/CreateProjectResponse.java)
- **Purpose:** Response object containing created project information
- **Key Fields:**
  - `ProjectDto projectDto` - The created project details
- **Swagger Documentation:** Includes schema description for the response structure
- **Usage:** Wraps the created project DTO in a structured response format

## DTO Relationships

### Entity Mappings
- `ProjectDto` ↔ `Project` entity
- `ProjectLocationDto` ↔ `ProjectLocation` entity

### Request/Response Pairs
- `CreateProjectRequest` → `CreateProjectResponse`
- `ProjectLocationRequestDto` → `ProjectLocationDto`

### Nested Relationships
- `ProjectDto` contains `ProjectLocationDto`
- `CreateProjectRequest` contains `ProjectLocationRequestDto`
- `CreateProjectResponse` contains `ProjectDto`

### Inheritance Hierarchy
```
BaseAddressDto
├── ProjectLocationDto
└── ProjectLocationRequestDto

UpdatableEntityDto
└── ProjectDto

Dto<Entity> Interface
├── ProjectDto implements Dto<Project>
└── ProjectLocationDto implements Dto<ProjectLocation>
```

## Validation Rules

### Required Fields
- All user IDs (builder and owner) are required for project creation
- Location information is mandatory for all projects
- Address validation inherited from `BaseAddressDto`

### Business Constraints
- Builder and owner users must exist in the system (validated at service layer)
- Location information is cascaded with project creation (no direct persistence of location IDs)
- All DTOs include proper null-safety annotations (`@NotNull`, `@Valid`)

## Field Documentation Standards

All DTOs follow consistent field documentation:
- **Type Safety:** UUID types for all entity identifiers
- **Validation:** Clear error messages for all constraints
- **Swagger Integration:** Complete OpenAPI documentation for API endpoints
- **Lombok Integration:** Uses `@Data`, `@SuperBuilder`, `@NoArgsConstructor` for code generation
- **Inheritance:** Proper use of `@EqualsAndHashCode(callSuper = true)` and `@ToString(callSuper = true)`
