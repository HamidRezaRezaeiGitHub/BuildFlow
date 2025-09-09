# Data Transfer Objects (DTOs) Overview

This document consolidates all Data Transfer Objects (DTOs) for the BuildFlow application, grouped by domain (User, Project) and use case (creation/request, response). It covers structure, validation, relationships, and design principles for robust API contracts.

---

## User DTOs

### User Creation Flow (Request DTOs)
- **CreateUserRequest**: For creating new users.
  - `registered` (boolean, required)
  - `username` (String, required)
  - `contactRequestDto` (ContactRequestDto, required)
- **ContactRequestDto**: Contact info for user creation (no ID).
  - `firstName`, `lastName` (String, required, max 100)
  - `labels` (List<String>, required)
  - `email` (String, required, valid, max 100)
  - `phone` (String, optional, max 30)
  - `addressRequestDto` (ContactAddressRequestDto, required)
- **ContactAddressRequestDto**: Address info for contact creation (no ID). Inherits from BaseAddressDto.

### User Response Flow (Response DTOs)
- **UserDto**: User info in API responses.
  - `id` (UUID)
  - `username`, `email` (String)
  - `registered` (boolean)
  - `contactDto` (ContactDto)
- **ContactDto**: Complete contact info.
  - `id` (UUID)
  - `firstName`, `lastName` (String, required, max 100)
  - `labels` (List<String>, required)
  - `email` (String, required, valid, max 100)
  - `phone` (String, optional, max 30)
  - `addressDto` (ContactAddressDto, required)
- **ContactAddressDto**: Address info in responses. Inherits from BaseAddressDto, includes `id` (UUID).

#### User DTO Relationships Diagram
```
CreateUserRequest
    ├── username
    ├── registered
    └── ContactRequestDto
        └── ContactAddressRequestDto (extends BaseAddressDto)
UserDto
    └── ContactDto
        └── ContactAddressDto (extends BaseAddressDto)
```

---

## Project DTOs

### Project Creation Flow (Request DTOs)
- **CreateProjectRequest**: For creating new projects.
  - `builderId` (UUID, required)
  - `ownerId` (UUID, required)
  - `locationRequestDto` (ProjectLocationRequestDto, required)
- **ProjectLocationRequestDto**: Project location info for creation (no ID). Inherits from BaseAddressDto.

### Project Response Flow (Response DTOs)
- **ProjectDto**: Project info in API responses.
  - `id` (UUID)
  - `builderId`, `ownerId` (UUID)
  - `locationDto` (ProjectLocationDto)
  - Inherits: createdAt, lastUpdatedAt (from UpdatableEntityDto)
- **ProjectLocationDto**: Project location info in responses. Inherits from BaseAddressDto, includes `id` (UUID).
- **CreateProjectResponse**: Response for project creation.
  - `projectDto` (ProjectDto)

#### Project DTO Relationships Diagram
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

---

## Validation & API Documentation
- All DTOs use Bean Validation annotations for field constraints (e.g., @NotBlank, @Email, @Size, @NotNull).
- Swagger/OpenAPI annotations are present for all fields for API documentation.
- Request DTOs never include IDs for new entities; response DTOs always include IDs for entity references.

## Key Design Principles
- **Separation of Concerns:** Request and response DTOs are distinct; creation DTOs never expose IDs.
- **Nesting:** User and project DTOs always include nested DTOs for completeness.
- **Inheritance:** Address/location DTOs extend BaseAddressDto for consistency.
- **Validation:** All input is validated at the DTO level before reaching the service layer.

This structure ensures robust, maintainable, and well-documented API contracts for all user and project management operations.
