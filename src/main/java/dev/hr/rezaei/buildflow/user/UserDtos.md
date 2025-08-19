# User DTO Package Overview

## Introduction

This package contains Data Transfer Objects (DTOs) for user management operations in the BuildFlow application. The DTO strategy follows a clear separation between request and response objects to ensure clean API contracts and proper validation.

**Key Strategy:**
- **Request DTOs**: Used for API input, exclude ID fields for creation operations
- **Response DTOs**: Used for API output, contain complete data structures
- **Simple DTOs**: Represent complete entity data including IDs, used in responses and internal operations

## DTO Categories

### Simple DTOs

#### [UserDto](./UserDto.java)
- **Purpose**: Represents complete user information including contact details
- **Entity**: Maps to `User` entity
- **Fields**:
  - `UUID id` - Unique identifier for the user
  - `String username` - Username of the user
  - `String email` - Email address of the user
  - `boolean registered` - Registration status of the user  
  - `ContactDto contactDto` - Associated contact information

#### [ContactDto](./ContactDto.java)
- **Purpose**: Complete contact information with ID for responses
- **Entity**: Maps to `Contact` entity via `Dto<Contact>` interface
- **Fields**:
  - `UUID id` - Unique identifier for the contact
  - `String firstName` - First name (`@NotBlank`, `@Size(max=100)`)
  - `String lastName` - Last name (`@NotBlank`, `@Size(max=100)`)
  - `List<String> labels` - Contact labels/tags (`@NotNull`)
  - `String email` - Email address (`@NotBlank`, `@Email`, `@Size(max=100)`)
  - `String phone` - Phone number (`@Size(max=30)`, optional)
  - `ContactAddressDto addressDto` - Address information (`@NotNull`, `@Valid`)

#### [ContactAddressDto](./ContactAddressDto.java)
- **Purpose**: Complete address information with ID for responses
- **Entity**: Maps to `ContactAddress` entity via `Dto<ContactAddress>` interface
- **Inheritance**: Extends `BaseAddressDto` for common address fields
- **Fields**:
  - `UUID id` - Unique identifier for the address
  - Inherits from `BaseAddressDto`: unitNumber (`@Size(max=20)`), streetNumber (`@Size(max=20)`), streetName (`@Size(max=200)`), city (`@Size(max=100)`), stateOrProvince (`@Size(max=100)`), postalOrZipCode (`@Size(max=20)`), country (`@Size(max=100)`)

### Request DTOs

#### [CreateUserRequest](./dto/CreateUserRequest.java)
- **Purpose**: Request object for creating new users
- **Fields**:
  - `boolean registered` - Registration status (`@NotNull`)
  - `String username` - Username for the user (`@NotNull`, `@Valid`)
  - `ContactRequestDto contactRequestDto` - Contact information (`@NotNull`, `@Valid`)

#### [ContactRequestDto](./dto/ContactRequestDto.java)
- **Purpose**: Contact information for creation requests (without ID)
- **Fields**:
  - `String firstName` - First name (`@NotBlank`, `@Size(max=100)`)
  - `String lastName` - Last name (`@NotBlank`, `@Size(max=100)`)
  - `List<String> labels` - Contact labels/tags (`@NotNull`)
  - `String email` - Email address (`@NotBlank`, `@Email`, `@Size(max=100)`)
  - `String phone` - Phone number (`@Size(max=30)`, optional)
  - `ContactAddressRequestDto addressRequestDto` - Address information (`@NotNull`, `@Valid`)

#### [ContactAddressRequestDto](./dto/ContactAddressRequestDto.java)
- **Purpose**: Address information for creation requests (without ID)
- **Inheritance**: Extends `BaseAddressDto` for common address fields
- **Fields**: Inherits all fields from `BaseAddressDto` with same validation constraints (no ID field)

### Response DTOs

#### [CreateUserResponse](./dto/CreateUserResponse.java)
- **Purpose**: Response object containing created user information
- **Fields**:
  - `UserDto userDto` - The created user details

## DTO Relationships Diagram

```
Request Flow:
CreateUserRequest
    ├── username (String)
    ├── registered (boolean)
    └── ContactRequestDto
        └── ContactAddressRequestDto (extends BaseAddressDto)

Response Flow:
CreateUserResponse
    └── UserDto
        └── ContactDto (implements Dto<Contact>)
            └── ContactAddressDto (extends BaseAddressDto, implements Dto<ContactAddress>)
```

## Key Changes from Previous Version

- **Simplified User Creation**: Consolidated from separate `CreateBuilderRequest`/`CreateOwnerRequest` to a single `CreateUserRequest`
- **Username Field**: Added username field to user creation process
- **DTO Naming**: Updated field names to match current implementation (e.g., `contactRequestDto` instead of `contactDto` in requests)
- **Response Structure**: Simplified response structure with single `CreateUserResponse` instead of separate builder/owner responses
