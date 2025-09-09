# Project Services Overview

This package contains the service layer classes for project management in the BuildFlow application. Services are grouped by domain responsibility and business rules, with transactional boundaries and validation at each layer.

## Service Layer Responsibilities

### ProjectService
- **Purpose:** Manages project creation, update, and retrieval.
- **Key Operations:**
    - `createProject(CreateProjectRequest)`: Validates builder/owner existence, location presence, and that location is not pre-persisted. Creates and saves a new project, returning a `CreateProjectResponse`.
    - `update(Project)`: Updates an existing project, enforcing persistence and updating the timestamp.
    - Existence checks: by project ID, builder ID, owner ID.
- **Validation & Error Handling:**
    - Throws `UserNotFoundException` if builder/owner not found.
    - Throws `IllegalArgumentException` for invalid state (e.g., null or pre-persisted location).
    - All persistence operations validate entity state before proceeding.
- **Transactions:**
    - Write operations (create, update) are transactional.
    - Read operations are non-transactional.

### ProjectLocationService
- **Purpose:** Manages project location updates and retrieval. Save/delete are always via cascade from `Project`.
- **Key Operations:**
    - Retrieval and update of project locations.
- **Validation & Error Handling:**
    - Throws `IllegalArgumentException` for invalid persistence state.
- **Transactions:**
    - Write operations are transactional.
    - Read operations are non-transactional.

## Business Rules & Validation
- Each project must have a unique location.
- Each project must have a builder and an owner (both users must exist).
- Project locations are uniquely associated with projects (one-to-one constraint).
- Address information cannot have pre-existing IDs during project creation.
- All persistence operations validate entity state before proceeding.

## Error Handling
- All service methods throw `IllegalArgumentException` for invalid state or duplicate data.
- `UserNotFoundException` is thrown for missing users.
- API returns structured error responses for validation and business rule violations.

This service layer ensures robust business logic, transactional safety, and strict validation for all project management operations, with clear API contracts and security enforcement.
