# User Management DTOs

This package defines all Data Transfer Objects (DTOs) for user management operations in BuildFlow. DTOs are organized by use case to ensure clean API contracts, strong validation, and clear relationships between user, contact, and address data.

## Package Contents

### Classes

| File | Description |
|------|-------------|
| [ContactAddressRequestDto.java](ContactAddressRequestDto.java) | Address information for contact creation (without ID field) |
| [ContactRequestDto.java](ContactRequestDto.java) | Contact information for user creation with full contact details |
| [CreateUserRequest.java](CreateUserRequest.java) | Request object for creating new users with registration and contact data |
| [CreateUserResponse.java](CreateUserResponse.java) | Response object containing the created user details |

## Technical Overview

### CreateUserRequest
Primary request DTO for user creation operations.

**Key Features:**
- **Registration Control**: Manages user registration status
- **Username Management**: Handles unique username assignment
- **Contact Integration**: Embedded complete contact information
- **Validation Chain**: Cascading validation through nested contact objects

**Structure:**
- `registered` (boolean, required): Indicates if the user is registered
- `username` (String, required): Unique username for the user
- `contactRequestDto` (ContactRequestDto, required): Complete contact information

**Validation Rules:**
- All fields are required
- Username must be unique (handled at service level)
- Nested contact DTO must pass validation

### CreateUserResponse
Response DTO that wraps the created user information.

**Key Features:**
- **Complete User Data**: Returns full user details after creation
- **Contact Information**: Includes all related contact and address data
- **Consistent Structure**: Follows standard response patterns
- **API Documentation**: Swagger-annotated for client integration

**Structure:**
- `userDto` (UserDto): Complete details of the created user with nested contact data

### ContactRequestDto
Comprehensive contact information DTO for user creation.

**Key Features:**
- **Personal Information**: Full name and contact details
- **Label System**: Flexible labeling/tagging for contacts
- **Address Integration**: Embedded address information
- **Validation**: Strong validation rules for all contact fields

**Structure:**
- `firstName` (String, required, max 100): Contact's first name
- `lastName` (String, required, max 100): Contact's last name
- `labels` (List<String>, required): Contact labels/categories
- `email` (String, required, valid email, max 100): Email address
- `phone` (String, optional, max 30): Phone number
- `addressRequestDto` (ContactAddressRequestDto, required): Address information

**Validation Rules:**
- First and last names: Required, maximum 100 characters
- Email: Required, valid email format, maximum 100 characters
- Phone: Optional, maximum 30 characters
- Labels: Required list (can be empty)
- Address: Required nested validation

### ContactAddressRequestDto
Specialized address DTO for contact creation requests.

**Key Features:**
- **Address Inheritance**: Extends BaseAddressDto for consistent address handling
- **Creation Optimized**: Designed for new contact creation (no ID field)
- **Validation Integration**: Inherits all validation from base address DTO
- **Consistency**: Ensures all address data follows the same format across the system

**Structure:**
- Inherits all fields from BaseAddressDto:
  - `unitNumber` (String, optional): Apartment/unit number
  - `streetNumber` (String, required): Street number
  - `streetName` (String, required): Street name
  - `city` (String, required): City name
  - `stateOrProvince` (String, required): State or province
  - `postalOrZipCode` (String, required): Postal or ZIP code
  - `country` (String, required): Country name

## Data Flow Patterns

### User Creation Flow
```
1. Client sends CreateUserRequest
   ├── username (String)
   ├── registered (boolean)
   └── ContactRequestDto
       ├── firstName, lastName, email, phone
       ├── labels (List<String>)
       └── ContactAddressRequestDto (address details)

2. Service processes request and creates user/contact/address entities

3. Response returns CreateUserResponse
   └── UserDto (with ContactDto containing ContactAddressDto with IDs)
```

### Validation Chain
```
CreateUserRequest
├── Field validation (username, registered)
└── Nested validation on ContactRequestDto
    ├── Personal info validation (names, email, phone)
    ├── Label validation
    └── Nested validation on ContactAddressRequestDto
        └── BaseAddressDto validation chain
```

## Integration Points

This package integrates with:
- **UserController**: Uses these DTOs for all user creation endpoints
- **UserService**: Processes user creation requests and generates responses
- **ContactService**: Handles contact creation and management
- **User/Contact Entities**: Maps to/from domain entities through mappers
- **Base Address System**: Inherits validation and structure from base package

## Relationship to Core DTOs

These DTOs work in conjunction with core user management DTOs:
- **UserDto**: Used in responses for complete user representation
- **ContactDto**: Used in responses with complete contact information
- **ContactAddressDto**: Used in responses with ID information
- **BaseAddressDto**: Provides foundation for all address-related DTOs

## Label System

The contact label system provides flexible categorization:
- **Business Contacts**: "client", "contractor", "supplier"
- **Personal Contacts**: "family", "friend", "emergency"
- **Project Roles**: "architect", "engineer", "inspector"
- **Custom Labels**: User-defined categories

## Design Principles

- **Separation of Concerns**: Request DTOs never include entity IDs for new objects
- **Inheritance**: Leverages BaseAddressDto for consistent address handling
- **Validation**: Comprehensive validation at DTO level before service processing
- **Documentation**: Full OpenAPI/Swagger documentation for API clarity
- **Nesting**: Supports complex object creation with related data in single requests
- **Flexibility**: Label system allows for flexible contact categorization