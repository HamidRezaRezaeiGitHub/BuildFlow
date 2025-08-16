# Services Overview

This document provides a comprehensive overview of all service classes across the BuildFlow application. Services form the business logic layer, coordinating between repositories and DTOs while providing transactional boundaries and enforcing business rules.

## Application-Wide Service Architecture

The BuildFlow application follows a consistent service layer architecture across all packages:

### Service Responsibilities
- **Business Logic**: Encapsulate domain-specific business rules and workflows
- **Transaction Management**: Define transactional boundaries for data operations
- **Validation**: Perform business-level validation beyond DTO field validation
- **Coordination**: Orchestrate operations between multiple repositories and services
- **Error Handling**: Provide meaningful error handling and exception management

### Service Patterns
- **CRUD Operations**: Standard create, read, update, delete operations with validation
- **Persistence Validation**: Verify entity persistence state before operations
- **Cross-Service Dependencies**: Services coordinate through well-defined interfaces
- **DTO Integration**: Transform between DTOs and entities using mapper services

### Transaction Strategy
- **Write Operations**: Create, update, delete operations within transaction boundaries
- **Read Operations**: Non-transactional for performance optimization
- **Cascade Operations**: Related entity operations handled through cascading

## Package Overview

### [User Package Services](./user/UserServices.md)

**Purpose**: User management, contact information, and address operations

**Services**:
- **UserService** - User lifecycle management, builder/owner creation, email/username validation
- **ContactService** - Contact information persistence and email uniqueness validation
- **ContactAddressService** - Contact address management with cascade operations

**Key Features**:
- User registration and unregistered user management
- Builder and owner user type creation workflows
- Email and username uniqueness enforcement
- Contact-address relationship cascading
- Comprehensive persistence state validation

**Business Rules**:
- Unique email addresses across all users
- Unique usernames across all users
- Mandatory contact information for all users
- Registration status determines system access level

### [Project Package Services](./project/ProjectServices.md)

**Purpose**: Project management, location handling, and user relationship validation

**Services**:
- **ProjectService** - Project lifecycle management, user validation, location coordination
- **ProjectLocationService** - Project location management with cascade operations

**Key Features**:
- Project creation with builder and owner validation
- Project location cascading (no direct persistence)
- Project querying by builder and owner relationships
- Comprehensive user existence validation
- Timestamp management for project updates

**Business Rules**:
- Builder and owner users must exist before project creation
- Project locations created only through project cascading
- Each project requires exactly one builder and one owner
- All projects must have valid location information

### [Estimate Package Services](./estimate/EstimateServices.md)

**Purpose**: Cost estimation, estimate groups, and estimate line management

**Status**: Documentation in development - Services exist but detailed documentation pending

### [WorkItem Package Services](./workitem/WorkItemServices.md)

**Purpose**: Work item management and tracking

**Status**: Documentation in development - Services exist but detailed documentation pending

## Cross-Package Service Dependencies

### User-Project Integration
```
ProjectService
├── UserService (builder validation)
├── UserService (owner validation)
└── ProjectLocationService (location management)

UserService
├── ContactService (contact management)
└── ContactDtoMapper (DTO conversions)

ContactService
└── ContactAddressService (address cascading)
```

### Service Interaction Patterns

**User Creation Flow**:
1. UserService validates request data
2. ContactService creates contact with email validation
3. ContactAddressService handles address through cascade
4. UserService completes user creation with contact association

**Project Creation Flow**:
1. ProjectService validates CreateProjectRequest
2. UserService validates builder user existence
3. UserService validates owner user existence
4. ProjectLocationService prepares location (cascade only)
5. ProjectService creates project with all validations

## Common Service Patterns

### Persistence Validation Pattern
```java
public void update(Entity entity) {
    if (!isPersisted(entity)) {
        throw new IllegalArgumentException("Entity must be already persisted.");
    }
    // Perform update
}

public boolean isPersisted(Entity entity) {
    return entity.getId() != null && repository.existsById(entity.getId());
}
```

### Existence Validation Pattern
```java
public void validateUserExists(UUID userId) {
    Optional<User> user = userService.findById(userId);
    if (user.isEmpty()) {
        throw new IllegalArgumentException("User with ID " + userId + " does not exist.");
    }
}
```

### Cascade Operation Pattern
```java
// Parent entity saves child through cascade
Project project = Project.builder()
    .builderUser(builder)
    .owner(owner)
    .location(location) // Cascade save
    .build();
```

## Error Handling Strategies

### Validation Errors
- **IllegalArgumentException**: Used for business rule violations
- **Specific Messages**: Clear error messages with entity IDs and violation details
- **Persistence Checks**: Validate entity state before operations

### Business Rule Violations
- **User Existence**: Validate users exist before creating relationships
- **Email Uniqueness**: Prevent duplicate email addresses
- **Cascade Restrictions**: Prevent direct persistence of cascade-only entities

### Exception Propagation
- Service exceptions propagate to controller layer
- Consistent exception types across similar operations
- Meaningful error messages for API consumers

## Transaction Management

### Write Operations
- **User Creation**: Single transaction including contact and address
- **Project Creation**: Single transaction including location and user validation
- **Update Operations**: Isolated transactions with timestamp management
- **Delete Operations**: Cascade deletion of related entities

### Read Operations
- **Find Operations**: Non-transactional for performance
- **Existence Checks**: Non-transactional boolean operations
- **Query Operations**: Non-transactional list operations

### Performance Considerations
- Read operations avoid unnecessary transaction overhead
- Write operations maintain data consistency
- Cascade operations reduce database round trips

## Development Guidelines

### Adding New Services
1. Follow established naming conventions (`{Entity}Service`)
2. Implement standard CRUD operations with validation
3. Add persistence state validation for update/delete operations
4. Define clear transactional boundaries
5. Add comprehensive error handling with meaningful messages
6. Document business rules and dependencies
7. Update package-specific documentation
8. Update this overview document

### Service Design Principles
- **Single Responsibility**: Each service manages one domain area
- **Dependency Injection**: Use constructor injection for dependencies
- **Validation First**: Validate inputs before processing
- **Clear Contracts**: Define clear method signatures and return types
- **Error Clarity**: Provide specific error messages for failures

### Testing Strategy
- **Unit Tests**: Test business logic with mocked dependencies
- **Integration Tests**: Test service interactions with actual repositories
- **Validation Tests**: Test error conditions and business rule enforcement
- **Transaction Tests**: Verify transactional behavior

## Architecture Integration

The service layer integrates with other application layers:
- **Controllers**: Receive requests and delegate to services
- **Repositories**: Persist and retrieve entities
- **Mappers**: Convert between DTOs and entities
- **Validators**: Perform field-level and business validation
- **Security**: Enforce access control and authorization

## Future Enhancements

### Planned Service Additions
- **EstimateService**: Cost calculation and estimate management
- **WorkItemService**: Work tracking and progress management
- **QuoteService**: Quote generation and management
- **NotificationService**: User notification and communication

### Architecture Improvements
- **Event-Driven**: Consider event publishing for cross-service communication
- **Caching**: Add caching layer for frequently accessed data
- **Audit**: Implement audit logging for business operations
- **Metrics**: Add performance monitoring and business metrics