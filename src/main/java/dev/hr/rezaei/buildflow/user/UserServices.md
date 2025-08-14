# User Services Overview

This package contains the service layer classes for user management in the BuildFlow application. The services handle business logic, coordinate between repositories and DTOs, and provide transactional boundaries for user, contact, and contact address operations.

## Services

### [UserService](UserService.java)

- **Purpose:** Manages user creation, registration, and lifecycle operations including builders and owners
- **Responsibilities:**
    - User creation and registration management
    - Builder and owner user type creation
    - User-contact relationship coordination
    - User persistence validation and CRUD operations
    - Email and username uniqueness validation
- **Dependencies:**
    - [UserRepository](UserRepository.java) - User entity persistence operations
    - [ContactService](ContactService.java) - Contact management and validation
    - [ContactDtoMapper](ContactDtoMapper.java) - Contact DTO to entity conversions
    - [UserDtoMapper](UserDtoMapper.java) - User entity to DTO conversions
- **Key Methods:**
    - `newUnregisteredUser(Contact, ContactLabel...)` - Creates unregistered user with contact labels
    - `newRegisteredUser(Contact, ContactLabel...)` - Creates registered user with contact labels
    - `createBuilder(CreateBuilderRequest)` - Creates builder user from request DTO
    - `createOwner(CreateOwnerRequest)` - Creates owner user from request DTO
    - `update(User)` - Updates existing persisted user
    - `delete(User)` - Deletes existing persisted user
    - `findById(UUID)` - Retrieves user by unique identifier
    - `findByEmail(String)` - Retrieves user by email address
    - `findByUsername(String)` - Retrieves user by username
    - `existsByEmail(String)` - Checks email existence
    - `existsByUsername(String)` - Checks username existence
- **Transactions:**
    - Write operations: user creation, update, delete
    - Read-only operations: find methods, existence checks
- **Validation:**
    - Ensures user is persisted before update/delete operations
    - Validates contact information through ContactService
- **Error Handling:**
    - IllegalArgumentException for invalid persistence state
    - Validation errors propagated from ContactService

### [ContactService](ContactService.java)

- **Purpose:** Manages contact information persistence and validation for users
- **Responsibilities:**
    - Contact entity CRUD operations
    - Email uniqueness validation
    - Contact persistence state management
    - Contact lifecycle validation
- **Dependencies:**
    - [ContactRepository](ContactRepository.java) - Contact entity persistence operations
- **Key Methods:**
    - `save(Contact)` - Saves new contact with validation
    - `update(Contact)` - Updates existing persisted contact
    - `delete(Contact)` - Deletes existing persisted contact
    - `findById(UUID)` - Retrieves contact by unique identifier
    - `findByEmail(String)` - Retrieves contact by email address
    - `existsByEmail(String)` - Checks email existence
    - `isPersisted(Contact)` - Validates contact persistence state
- **Transactions:**
    - Write operations: contact save, update, delete
    - Read-only operations: find methods, existence checks
- **Validation:**
    - Email uniqueness across all contacts
    - Contact persistence state before update/delete
    - Prevents duplicate contact persistence
- **Error Handling:**
    - IllegalArgumentException for persistence state violations
    - IllegalArgumentException for duplicate email addresses

### [ContactAddressService](ContactAddressService.java)

- **Purpose:** Manages contact address information with cascade operations from Contact
- **Responsibilities:**
    - Contact address retrieval operations
    - Contact address updates for existing addresses
    - Address persistence state validation
- **Dependencies:**
    - [ContactAddressRepository](ContactAddressRepository.java) - Contact address entity persistence operations
- **Key Methods:**
    - `findById(UUID)` - Retrieves contact address by unique identifier
    - `update(ContactAddress)` - Updates existing persisted contact address
- **Transactions:**
    - Write operations: address updates
    - Read-only operations: find methods
- **Validation:**
    - Address persistence state before updates
- **Error Handling:**
    - IllegalArgumentException for invalid persistence state
- **Note:** Save and delete operations are handled through cascade from Contact entity

## Business Rules

### User Management Rules

- User email must be unique across the system
- User username must be unique across the system
- Users must have associated contact information
- User registration status determines system access level

### Contact Management Rules

- Contact email must be unique across all contacts
- Contacts cannot be saved if already persisted
- Contact updates require existing persistence
- Contact deletion requires existing persistence

### Address Management Rules

- Contact addresses are managed through cascade operations from Contact
- Direct save/delete operations on ContactAddress should use Contact cascade
- Address updates require existing persistence
