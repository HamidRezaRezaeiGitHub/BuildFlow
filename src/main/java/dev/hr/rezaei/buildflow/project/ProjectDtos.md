# Project DTOs Overview

This package defines all Data Transfer Objects (DTOs) for project management in BuildFlow. DTOs are grouped by use case: creation (request), response, and internal operations. The structure ensures clean API contracts, strong validation, and clear relationships between project and location data.

## DTO Structure & Relationships

### Project Creation Flow (Request DTOs)

#### CreateProjectRequest
- **Purpose:** Used for creating new projects via API.
- **Fields:**
  - `builderId` (UUID, required): ID of the builder user
  - `ownerId` (UUID, required): ID of the owner user
  - `locationRequestDto` (ProjectLocationRequestDto, required): Project location information

#### ProjectLocationRequestDto
- **Purpose:** Project location information for creation (no ID field).
- **Inheritance:** Extends BaseAddressDto (unitNumber, streetNumber, streetName, city, stateOrProvince, postalOrZipCode, country)
- **Fields:** All inherited from BaseAddressDto

### Project Response Flow (Response DTOs)

#### ProjectDto
- **Purpose:** Represents project information in API responses.
- **Fields:**
  - `id` (UUID): Unique identifier
  - `builderId` (UUID): ID of the builder user
  - `ownerId` (UUID): ID of the owner user
  - `locationDto` (ProjectLocationDto): Project location information
  - Inherits: createdAt, lastUpdatedAt (from UpdatableEntityDto)

#### ProjectLocationDto
- **Purpose:** Complete project location information for API responses.
- **Fields:**
  - `id` (UUID)
  - All address fields from BaseAddressDto

#### CreateProjectResponse
- **Purpose:** Response for project creation.
- **Fields:**
  - `projectDto` (ProjectDto): The created project details

### DTO Relationships Diagram

```
CreateProjectRequest
    ├── builderId
    ├── ownerId
    └── ProjectLocationRequestDto (extends BaseAddressDto)

ProjectDto
    └── ProjectLocationDto (extends BaseAddressDto)

CreateProjectResponse
    └── ProjectDto
        └── ProjectLocationDto
```

## Validation & API Documentation
- All DTOs use Bean Validation annotations for field constraints (e.g., @NotNull).
- Swagger/OpenAPI annotations are present for all fields for API documentation.
- Request DTOs never include IDs for new entities; response DTOs always include IDs for entity references.

## Key Design Principles
- **Separation of Concerns:** Request and response DTOs are distinct; creation DTOs never expose IDs.
- **Nesting:** Project DTOs always include nested location DTOs for completeness.
- **Inheritance:** Location DTOs extend BaseAddressDto for consistency across the model.
- **Validation:** All input is validated at the DTO level before reaching the service layer.

This structure ensures robust, maintainable, and well-documented API contracts for all project management operations.
