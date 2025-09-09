# User DTOs Overview

This package defines all Data Transfer Objects (DTOs) for user management in BuildFlow. DTOs are grouped by use case: creation (request), response, and internal operations. The structure ensures clean API contracts, strong validation, and clear relationships between user, contact, and address data.

## DTO Structure & Relationships

### User Creation Flow (Request DTOs)

#### CreateUserRequest
- **Purpose:** Used for creating new users via API.
- **Fields:**
  - `registered` (boolean, required): Registration status
  - `username` (String, required): Username for the user
  - `contactRequestDto` (ContactRequestDto, required): Contact information

#### ContactRequestDto
- **Purpose:** Contact information for user creation (no ID field).
- **Fields:**
  - `firstName` (String, required, max 100)
  - `lastName` (String, required, max 100)
  - `labels` (List<String>, required): Contact labels/tags
  - `email` (String, required, valid email, max 100)
  - `phone` (String, optional, max 30)
  - `addressRequestDto` (ContactAddressRequestDto, required): Address information

#### ContactAddressRequestDto
- **Purpose:** Address information for contact creation (no ID field).
- **Inheritance:** Extends BaseAddressDto (unitNumber, streetNumber, streetName, city, stateOrProvince, postalOrZipCode, country)
- **Fields:** All inherited from BaseAddressDto

### User Response Flow (Response DTOs)

#### UserDto
- **Purpose:** Represents user information in API responses.
- **Fields:**
  - `id` (UUID): Unique identifier
  - `username` (String)
  - `email` (String)
  - `registered` (boolean)
  - `contactDto` (ContactDto): Associated contact information

#### ContactDto
- **Purpose:** Complete contact information for API responses.
- **Fields:**
  - `id` (UUID)
  - `firstName` (String, required, max 100)
  - `lastName` (String, required, max 100)
  - `labels` (List<String>, required)
  - `email` (String, required, valid email, max 100)
  - `phone` (String, optional, max 30)
  - `addressDto` (ContactAddressDto, required): Address information

#### ContactAddressDto
- **Purpose:** Complete address information for API responses.
- **Inheritance:** Extends BaseAddressDto
- **Fields:**
  - `id` (UUID)
  - All address fields from BaseAddressDto

### DTO Relationships Diagram

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

## Validation & API Documentation
- All DTOs use Bean Validation annotations for field constraints (e.g., @NotBlank, @Email, @Size).
- Swagger/OpenAPI annotations are present for all fields for API documentation.
- Request DTOs never include IDs; response DTOs always include IDs for entity references.

## Key Design Principles
- **Separation of Concerns:** Request and response DTOs are distinct; creation DTOs never expose IDs.
- **Nesting:** User DTOs always include nested contact and address DTOs for completeness.
- **Inheritance:** Address DTOs extend BaseAddressDto for consistency across the model.
- **Validation:** All input is validated at the DTO level before reaching the service layer.

This structure ensures robust, maintainable, and well-documented API contracts for all user management operations.
