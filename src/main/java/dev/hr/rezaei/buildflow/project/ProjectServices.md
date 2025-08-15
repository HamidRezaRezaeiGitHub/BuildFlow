# Project Services Overview

This package contains the service layer classes for project management in the BuildFlow application. The services handle business logic, coordinate between repositories and DTOs, and provide transactional boundaries for project and project location operations.

## Services

### [ProjectService](ProjectService.java)

- **Purpose:** Manages project lifecycle, creation, and business operations
- **Responsibilities:**
    - Project creation with builder and owner validation
    - Project location coordination and cascading
    - Project lifecycle management (create, update, delete)
    - Project querying by builder and owner
    - Business rule enforcement for project operations
- **Dependencies:**
    - [ProjectRepository](ProjectRepository.java) - Project entity persistence
    - [ProjectLocationService](ProjectLocationService.java) - Project location management
    - [UserService](../user/UserService.java) - User validation and retrieval
- **Key Methods:**
    - `createProject(CreateProjectRequest)` - Creates new project with location and user validation
    - `update(Project)` - Updates existing project with timestamp management
    - `delete(Project)` - Deletes persisted project
    - `findById(UUID)` - Retrieves project by ID
    - `findByBuilderId(UUID)` - Finds all projects for a specific builder
    - `findByOwnerId(UUID)` - Finds all projects for a specific owner
    - `isPersisted(Project)` - Validates if project exists in database
- **Transactions:**
    - Write operations: createProject, update, delete
    - Read operations: findById, findByBuilderId, findByOwnerId, isPersisted
- **Validation:**
    - Builder user existence validation
    - Owner user existence validation
    - Project location null-safety validation
    - Persistence state validation for updates and deletes
- **Error Handling:**
    - Throws `IllegalArgumentException` for non-existent builder user
    - Throws `IllegalArgumentException` for non-existent owner user
    - Throws `IllegalArgumentException` for null location
    - Throws `IllegalArgumentException` for direct location persistence attempts
    - Throws `IllegalArgumentException` for operations on non-persisted projects

### [ProjectLocationService](ProjectLocationService.java)

- **Purpose:** Manages project location lifecycle and address operations
- **Responsibilities:**
    - Project location retrieval and validation
    - Location update operations with persistence validation
    - Location existence checking
    - Persistence state management for locations
- **Dependencies:**
    - [ProjectLocationRepository](ProjectLocationRepository.java) - ProjectLocation entity persistence
- **Key Methods:**
    - `findById(UUID)` - Retrieves project location by ID
    - `update(ProjectLocation)` - Updates existing project location
    - `existsById(UUID)` - Checks if location exists by ID
    - `isPersisted(ProjectLocation)` - Validates if location exists in database
- **Transactions:**
    - Write operations: update
    - Read operations: findById, existsById, isPersisted
- **Validation:**
    - Persistence state validation for updates
    - ID null-safety validation
    - Existence validation before operations
- **Error Handling:**
    - Throws `IllegalArgumentException` for updates on non-persisted locations

## Business Rules

### Project Management
- **User Validation**: Both builder and owner users must exist in the system before project creation
- **Location Cascading**: Project locations are only created through project creation (cascade), not directly persisted
- **Unique Identification**: Each project must have a unique UUID identifier
- **Builder Assignment**: Each project must have exactly one assigned builder user
- **Owner Assignment**: Each project must have exactly one owner user
- **Location Requirement**: Every project must have a valid location with complete address information

### Project Location Management
- **Cascade Only**: Project locations are created only through project entity cascading
- **Update Restrictions**: Only persisted project locations can be updated
- **Address Inheritance**: Project locations inherit all address validation from BaseAddress entity
- **Persistence Validation**: All location operations require existence validation

### Data Integrity
- **Timestamp Management**: Projects automatically track creation and last update timestamps
- **Null Safety**: All operations include comprehensive null-safety validation
- **Persistence Checks**: Operations validate entity persistence state before execution
- **Relationship Integrity**: User-project relationships are validated at creation time

### Transaction Boundaries
- **Project Creation**: Single transaction including location creation and user validation
- **Update Operations**: Isolated transactions with timestamp management
- **Delete Operations**: Cascade deletion of related location entities
- **Read Operations**: Non-transactional for performance optimization

## Error Handling Patterns

### Validation Errors
- User existence validation fails → `IllegalArgumentException` with specific user ID
- Location null validation fails → `IllegalArgumentException` for null location
- Persistence validation fails → `IllegalArgumentException` for non-persisted entities

### Business Rule Violations
- Direct location persistence attempts → `IllegalArgumentException` with cascade message
- Operations on non-persisted entities → `IllegalArgumentException` with persistence requirement

### Data Consistency
- All service methods include comprehensive input validation
- Consistent error messaging across all service operations
- Proper exception propagation to controller layer
