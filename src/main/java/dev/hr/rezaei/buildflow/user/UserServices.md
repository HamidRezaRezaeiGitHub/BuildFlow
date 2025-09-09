# User Services Overview

This package contains the service layer classes for user management in the BuildFlow application. Services are grouped by domain responsibility and business rules, with transactional boundaries and validation at each layer.

## Service Layer Responsibilities

### UserService
- **Purpose:** Manages user creation, registration, update, deletion, and retrieval.
- **Key Operations:**
    - `createUser(CreateUserRequest)`: Transactional user creation with contact info, username, and registration status. Returns `CreateUserResponse`.
    - `update(User)`: Updates an existing user (must be persisted).
    - `delete(User)`: Deletes an existing user (must be persisted).
    - `getUserDtoByUsername(String)`: Retrieves user DTO by username (throws if not found).
    - Existence checks: by email, username, or ID.
- **Validation & Error Handling:**
    - Throws `IllegalArgumentException` for invalid persistence state or duplicate creation.
    - Throws `UserNotFoundException` for missing users.
    - Validates contact info through `ContactService`.
- **Transactions:**
    - Write operations (create, update, delete) are transactional.
    - Read operations are non-transactional.

### ContactService
- **Purpose:** Manages contact entity lifecycle and validation.
- **Key Operations:**
    - `save(Contact)`: Saves a new contact (must not be persisted, email must be unique).
    - `update(Contact)`: Updates an existing contact (must be persisted).
    - `delete(Contact)`: Deletes an existing contact (must be persisted).
    - `findById(UUID)`, `findByEmail(String)`: Retrieval by ID or email.
    - `existsByEmail(String)`: Email uniqueness check.
- **Validation & Error Handling:**
    - Throws `IllegalArgumentException` for duplicate or invalid persistence state.
- **Transactions:**
    - Write operations are transactional.
    - Read operations are non-transactional.

### ContactAddressService
- **Purpose:** Manages contact address updates and retrieval. Save/delete are always via cascade from `Contact`.
- **Key Operations:**
    - `findById(UUID)`: Retrieves address by ID.
    - `update(ContactAddress)`: Updates an existing address (must be persisted).
- **Validation & Error Handling:**
    - Throws `IllegalArgumentException` for invalid persistence state.
- **Transactions:**
    - Write operations are transactional.
    - Read operations are non-transactional.

## Business Rules & Validation
- User email and username must be unique across the system.
- Each user must have associated contact information.
- Contact email addresses must be unique across all contacts.
- Address save/delete is always performed via `Contact` (never directly).
- Registration status determines user access level.
- Address information cannot have pre-existing IDs during user creation.
- All persistence operations validate entity state before proceeding.

## Error Handling
- All service methods throw `IllegalArgumentException` for invalid state or duplicate data.
- `UserNotFoundException` is thrown for missing users.
- API returns structured error responses for validation and business rule violations.

This service layer ensures robust business logic, transactional safety, and strict validation for all user management operations, with clear API contracts and security enforcement.
