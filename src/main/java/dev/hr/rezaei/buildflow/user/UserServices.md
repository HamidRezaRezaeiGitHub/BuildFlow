# User Services Overview

This package contains the service layer classes for user management in the BuildFlow application. The services handle business logic, coordinate between repositories and DTOs, and provide transactional boundaries for user, contact, and contact address operations.

## Services

### [UserService](UserService.java)

- **Purpose:** Manages user creation, registration, and lifecycle operations
- **Responsibilities:**
    - User creation and registration management
    - User-contact relationship coordination
    - User persistence validation and CRUD operations
    - Email and username uniqueness validation
- **Dependencies:**
    - [UserRepository](UserRepository.java) - User entity persistence operations
    - [ContactService](ContactService.java) - Contact management and validation
- **Key Methods:**
    - `createUser(CreateUserRequest)` - Creates new user with contact information from request DTO
    - `findByEmail(String)` - Retrieves user by email address
    - `findById(UUID)` - Retrieves user by unique identifier
    - `findByUsername(String)` - Retrieves user by username
    - `save(User)` - Saves new or existing user
    - `update(User)` - Updates existing persisted user
    - `delete(User)` - Deletes existing persisted user
    - `isPersisted(User)` - Validates user persistence state
    - `existsByEmail(String)` - Checks email existence
    - `existsByUsername(String)` - Checks username existence
    - `getUserByUsername(String)` - Retrieves user DTO by username (throws exception if not found)
- **Transactions:**
    - Write operations: user creation, update, delete
    - Read-only operations: find methods, existence checks
- **Validation:**
    - Ensures user is persisted before update/delete operations
    - Validates contact information through ContactService
    - Prevents creation with existing address IDs
- **Error Handling:**
    - IllegalArgumentException for invalid persistence state
    - IllegalArgumentException for existing address IDs during creation
    - IllegalArgumentException when user not found by username

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
    - `findById(UUID)` - Retrieves contact by unique identifier
    - `save(Contact)` - Saves new contact with validation
    - `update(Contact)` - Updates existing persisted contact
    - `delete(Contact)` - Deletes existing persisted contact
    - `isPersisted(Contact)` - Validates contact persistence state
    - `existsByEmail(String)` - Checks email existence
    - `findByEmail(String)` - Retrieves contact by email address
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
- Contact email addresses must be unique across all contacts
- Address information cannot have pre-existing IDs during user creation
