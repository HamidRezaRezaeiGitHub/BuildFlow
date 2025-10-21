# User Management Package

This package provides comprehensive user and contact management functionality for BuildFlow construction project management. It handles user authentication, contact information, address management, and role-based access control.

## Summary

This package manages users, contacts, and addresses with comprehensive user lifecycle operations, flexible contact labeling, and REST endpoints for user administration.

## Files Structure

```
user/
├── dto/
│   ├── ContactAddressRequestDto.java      # Address info for contact creation (no ID)
│   ├── ContactRequestDto.java             # Contact info for user creation with full details
│   ├── CreateUserRequest.java             # Request for creating new users
│   ├── CreateUserResponse.java            # Response containing created user details
│   └── README.md                          # DTO package documentation
├── Contact.java                           # Contact information entity
├── ContactAddress.java                    # Address entity specific to contacts
├── ContactAddressDto.java                 # DTO for contact address operations
├── ContactAddressDtoMapper.java           # MapStruct mapper for ContactAddress conversions
├── ContactAddressRepository.java          # JPA repository for contact addresses
├── ContactAddressService.java             # Business logic for contact addresses
├── ContactDto.java                        # DTO for contact operations
├── ContactDtoMapper.java                  # MapStruct mapper for Contact conversions
├── ContactLabel.java                      # Contact role/type classification enum
├── ContactRepository.java                 # JPA repository for contacts
├── ContactService.java                    # Business logic for contact operations
├── User.java                              # Core user entity
├── UserController.java                    # REST API controller for user management
├── UserDto.java                           # DTO for user operations
├── UserDtoMapper.java                     # MapStruct mapper for User conversions
├── UserMockDataInitializer.java           # Mock data generator for development/testing
├── UserMockDataProperties.java            # Configuration properties for mock data
├── UserRepository.java                    # JPA repository for users
├── UserService.java                       # Business logic for user operations
└── README.md                              # This file
```

## Subfolder References

### [dto/](dto/) - User Management DTOs
Specialized Data Transfer Objects for user creation workflows with nested contact and address information.

## Package Contents

### Entity Classes

| File | Description |
|------|-------------|
| [User.java](User.java) | Core user entity for system authentication and project participation |
| [Contact.java](Contact.java) | Contact information entity linked to users |
| [ContactAddress.java](ContactAddress.java) | Address information specific to contacts |

### Controller Classes

| File | Description |
|------|-------------|
| [UserController.java](UserController.java) | REST API controller for user management operations |

### DTO Classes

| File | Description |
|------|-------------|
| [UserDto.java](UserDto.java) | Data transfer object for user API operations |
| [ContactDto.java](ContactDto.java) | Data transfer object for contact API operations |
| [ContactAddressDto.java](ContactAddressDto.java) | Data transfer object for contact address operations |

### DTO Sub-package

| Directory | Description |
|-----------|-------------|
| [dto/](dto/) | Contains specialized DTOs for user creation and management operations |

### Mapper Classes

| File | Description |
|------|-------------|
| [UserDtoMapper.java](UserDtoMapper.java) | MapStruct mapper for User entity-DTO conversions |
| [ContactDtoMapper.java](ContactDtoMapper.java) | MapStruct mapper for Contact entity-DTO conversions |
| [ContactAddressDtoMapper.java](ContactAddressDtoMapper.java) | MapStruct mapper for ContactAddress entity-DTO conversions |

### Repository Classes

| File | Description |
|------|-------------|
| [UserRepository.java](UserRepository.java) | Spring Data JPA repository for user persistence |
| [ContactRepository.java](ContactRepository.java) | Spring Data JPA repository for contact persistence |
| [ContactAddressRepository.java](ContactAddressRepository.java) | Spring Data JPA repository for contact address persistence |

### Service Classes

| File | Description |
|------|-------------|
| [UserService.java](UserService.java) | Business logic for user management operations |
| [ContactService.java](ContactService.java) | Business logic for contact management operations |
| [ContactAddressService.java](ContactAddressService.java) | Business logic for contact address management |

### Enums

| File | Description |
|------|-------------|
| [ContactLabel.java](ContactLabel.java) | Contact role/type classification enum |

### Initialization

| File | Description |
|------|-------------|
| [UserMockDataInitializer.java](UserMockDataInitializer.java) | Mock data generator for development and testing environments |
| [UserMockDataProperties.java](UserMockDataProperties.java) | Configuration properties for mock data generation |

## Endpoints

### UserController

| Method | Endpoint | Description | Authorization |
|--------|----------|-------------|---------------|
| `GET` | `/api/v1/users` | Retrieve all users in the system | `ADMIN_USERS` |
| `POST` | `/api/v1/users` | Create a new user with contact information | `ADMIN_USERS` |
| `GET` | `/api/v1/users/{username}` | Get user by username | `ADMIN_USERS` |

## Technical Overview

### User Entity
Core entity representing system users who participate in construction projects.

**Key Features:**
- **Unique Identification**: Username and email uniqueness constraints
- **Registration Status**: Tracks user registration completion
- **Contact Integration**: One-to-one relationship with contact information
- **Project Relationships**: Participates in projects as builders, owners, or other roles
- **Quote Relationships**: Can be quote creators or suppliers

**Structure:**
- `id` (UUID): Primary key
- `username` (String, 100 chars): Unique username
- `email` (String, 100 chars): Unique email address
- `registered` (boolean): Registration completion status
- `contact` (Contact): Associated contact information (one-to-one)

**Relationships:**
- **Contact**: One-to-one relationship with contact details
- **Projects**: Bidirectional relationships as builder/owner
- **Quotes**: Can create quotes or be suppliers
- **WorkItems**: Can be assigned work items

**Unique Constraints:**
- Username uniqueness across the system
- Email uniqueness across the system
- Contact ID uniqueness (one contact per user)

### Contact Entity
Detailed contact information entity providing personal and professional details.

**Key Features:**
- **Personal Information**: First name, last name, and contact details
- **Label System**: Flexible role/type classification through ContactLabel enum
- **Address Integration**: One-to-one relationship with address information
- **Communication Details**: Email and phone number management
- **Unique Constraints**: Email and address uniqueness

**Structure:**
- `id` (UUID): Primary key
- `firstName` (String, 100 chars): Contact's first name
- `lastName` (String, 100 chars): Contact's last name
- `labels` (List<ContactLabel>): Role/type classifications
- `email` (String, 100 chars): Unique email address
- `phone` (String, 30 chars): Phone number (optional)
- `address` (ContactAddress): Associated address (one-to-one)

**Relationships:**
- **ContactAddress**: One-to-one relationship with address details
- **User**: Referenced by User entity

**Unique Constraints:**
- Email uniqueness across contacts
- Address ID uniqueness (one address per contact)

### ContactAddress Entity
Address information specific to contacts, extending the base address structure.

**Key Features:**
- **Address Inheritance**: Extends BaseAddress for consistent address handling
- **Contact Integration**: Dedicated address entity for contact-specific addresses
- **Geographic Information**: Complete address details for contact location
- **Unique Identification**: UUID-based primary key

**Structure:**
- `id` (UUID): Primary key
- Inherits all address fields from BaseAddress:
  - `unitNumber`, `streetNumber`, `streetName`
  - `city`, `stateOrProvince`, `postalOrZipCode`, `country`

### ContactLabel Enum
Comprehensive role/type classification system for contacts.

**Business Roles:**
- **SUPPLIER**: Material and service suppliers
- **SUBCONTRACTOR**: Specialized contractors
- **LENDER**: Financial institutions and lenders
- **PERMIT_AUTHORITY**: Government and regulatory authorities
- **BUILDER**: Construction builders and contractors
- **OWNER**: Project owners and clients
- **ADMINISTRATOR**: System administrators

**General Categories:**
- **OTHER**: Miscellaneous contacts not fitting specific categories

**Usage:**
- Role-based access control
- Contact categorization and filtering
- Business process routing
- Reporting and analytics

## Business Logic

### User Management
- **Registration Workflow**: Manages user registration process
- **Authentication Support**: Integrates with security framework for authentication
- **Profile Management**: Handles user profile updates and maintenance
- **Role Assignment**: Supports role-based access through contact labels

### Contact Management
- **Contact Creation**: Manages contact information creation and validation
- **Label Management**: Handles multiple label assignments per contact
- **Communication Tracking**: Maintains email and phone contact information
- **Address Management**: Coordinates with address information

### Data Integrity
- **Uniqueness Enforcement**: Ensures username and email uniqueness
- **Referential Integrity**: Maintains proper relationships between entities
- **Validation**: Comprehensive validation of contact and address information
- **Audit Support**: Integration with audit trail functionality

## Data Flow Patterns

### User Registration Workflow
```
1. Create User entity with basic information
2. Create associated Contact entity:
   ├── Personal information (names, email, phone)
   ├── Label assignments (roles/types)
   └── Address information
3. Link User and Contact entities
4. Set registration status
5. Complete audit trail creation
```

### Contact Information Management
```
Contact Creation/Update:
1. Validate personal information
2. Process label assignments
3. Create/update address information
4. Maintain unique constraints
5. Update relationships
```

## Integration Points

This package integrates with:
- **Security Package**: User authentication and authorization
- **Project Package**: Users participate in projects as builders/owners
- **Quote Package**: Users create quotes and serve as suppliers
- **WorkItem Package**: Users are assigned work items
- **Base Package**: Inherits address functionality and validation

## API Layer

### UserController
Provides REST endpoints for user management:
- **User CRUD**: Create, read, update, delete users
- **Profile Management**: Update user profiles and contact information
- **Search Operations**: Find users by various criteria
- **Role Management**: Handle user role assignments

#### Available Endpoints

| Method | Endpoint | Description | Authorization |
|--------|----------|-------------|---------------|
| `GET` | `/api/v1/users` | Retrieve all users in the system | `ADMIN_USERS` |
| `POST` | `/api/v1/users` | Create a new user | `ADMIN_USERS` |
| `GET` | `/api/v1/users/{username}` | Get user by username | `ADMIN_USERS` |

**Endpoint Details:**

**GET /api/v1/users**
- **Description**: Retrieves all users in the system
- **Authorization**: Requires `ADMIN_USERS` authority
- **Response**: Array of `UserDto` objects
- **Use Case**: Admin dashboard user management, bulk operations

**POST /api/v1/users**
- **Description**: Creates a new user with contact information
- **Authorization**: Requires `ADMIN_USERS` authority
- **Request Body**: `CreateUserRequest` (includes username, registration status, contact details)
- **Response**: `CreateUserResponse` containing created user information

**GET /api/v1/users/{username}**
- **Description**: Retrieves a specific user by username
- **Authorization**: Requires `ADMIN_USERS` authority
- **Path Parameter**: `username` - The username of the user to retrieve
- **Response**: `UserDto` object

### Request/Response Patterns
```
User Operations:
- Create User → UserService → ContactService → UserResponse
- Update Profile → Validation → Service → Database → Response
- Search Users → Criteria → Repository → DTO Mapping → Response
```

## Service Architecture

### UserService
Core business logic for user operations:
- **User Lifecycle**: Manages user creation, updates, and deletion
- **Registration Logic**: Handles user registration workflow
- **Profile Management**: Coordinates profile updates
- **Security Integration**: Works with authentication services

#### Key Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `createUser(CreateUserRequest)` | Creates a new user with contact information | `CreateUserResponse` |
| `getAllUserDtos()` | Retrieves all users as DTOs | `List<UserDto>` |
| `getUserDtoByUsername(String)` | Gets a specific user by username | `UserDto` |
| `update(User)` | Updates an existing user | `User` |
| `delete(User)` | Deletes a user | `void` |
| `findByUsername(String)` | Finds user by username | `Optional<User>` |
| `findByEmail(String)` | Finds user by email | `Optional<User>` |
| `existsByUsername(String)` | Checks if username exists | `boolean` |
| `existsByEmail(String)` | Checks if email exists | `boolean` |

### ContactService
Contact-specific business logic:
- **Contact Management**: Handles contact CRUD operations
- **Label Processing**: Manages contact label assignments
- **Validation**: Ensures contact data integrity
- **Address Coordination**: Works with address services

### ContactAddressService
Address-specific functionality:
- **Address Management**: Handles address CRUD operations
- **Validation**: Ensures address data integrity
- **Geographic Services**: Address validation and formatting

## Repository Patterns

### Repository Design
All repositories follow Spring Data JPA patterns:
- **Standard CRUD**: Basic operations for all entities
- **Custom Queries**: Business-specific query methods
- **Unique Constraint Handling**: Proper constraint violation handling
- **Performance Optimization**: Efficient relationship loading

### Query Capabilities
- **User Queries**: Find by username, email, registration status
- **Contact Queries**: Search by name, email, labels
- **Address Queries**: Geographic and address-based searches
- **Relationship Queries**: Complex queries across entity relationships

## Security and Validation

### Data Security
- **Authentication Integration**: Seamless integration with security framework
- **Access Control**: Role-based access through contact labels
- **Data Privacy**: Proper handling of personal information
- **Audit Trail**: Complete tracking of user and contact changes

### Validation Strategy
- **Field Validation**: Length, format, and constraint validation
- **Business Rules**: Domain-specific validation logic
- **Unique Constraints**: Database-level uniqueness enforcement
- **Relationship Validation**: Ensures proper entity relationships

## Design Principles

- **User-Centric**: Designed around comprehensive user management
- **Contact Integration**: Seamless integration of user and contact information
- **Role Flexibility**: Flexible role assignment through label system
- **Data Integrity**: Strong constraints and validation
- **Security Awareness**: Built-in security and privacy considerations
- **Extensibility**: Easy extension for additional contact types and roles
- **Integration Ready**: Designed for integration with all other domain packages