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

#### [ContactRequestDto](./dto/ContactRequestDto.java)
- **Purpose**: Contact information for creation requests (without ID)
- **Fields**:
  - `String firstName` - First name (`@NotBlank`, `@Size(max=100)`)
  - `String lastName` - Last name (`@NotBlank`, `@Size(max=100)`)
  - `List<String> labels` - Contact labels/tags (`@NotNull`)
  - `String email` - Email address (`@NotBlank`, `@Email`, `@Size(max=100)`)
  - `String phone` - Phone number (`@Size(max=30)`, optional)
  - `ContactAddressRequestDto addressDto` - Address information (`@NotNull`, `@Valid`)

#### [ContactAddressRequestDto](./dto/ContactAddressRequestDto.java)
- **Purpose**: Address information for creation requests (without ID)
- **Inheritance**: Extends `BaseAddressDto` for common address fields
- **Fields**: Inherits all fields from `BaseAddressDto` with same validation constraints (no ID field)

#### [CreateBuilderRequest](./dto/CreateBuilderRequest.java)
- **Purpose**: Request object for creating builder users
- **Fields**:
  - `boolean registered` - Registration status (`@NotNull`)
  - `ContactRequestDto contactDto` - Contact information (`@NotNull`, `@Valid`)

#### [CreateOwnerRequest](./dto/CreateOwnerRequest.java)
- **Purpose**: Request object for creating owner users
- **Fields**:
  - `boolean registered` - Registration status (`@NotNull`)
  - `ContactRequestDto contactDto` - Contact information (`@NotNull`, `@Valid`)

### Response DTOs

#### [CreateBuilderResponse](./dto/CreateBuilderResponse.java)
- **Purpose**: Response object containing created builder user information
- **Fields**:
  - `UserDto userDto` - The created builder user details

#### [CreateOwnerResponse](./dto/CreateOwnerResponse.java)
- **Purpose**: Response object containing created owner user information
- **Fields**:
  - `UserDto userDto` - The created owner user details

## DTO Relationships Diagram

```
Request Flow:
CreateBuilderRequest/CreateOwnerRequest
    └── ContactRequestDto
        └── ContactAddressRequestDto (extends BaseAddressDto)

Response Flow:
CreateBuilderResponse/CreateOwnerResponse
    └── UserDto
        └── ContactDto (implements Dto<Contact>)
            └── ContactAddressDto (extends BaseAddressDto, implements Dto<ContactAddress>)
```
