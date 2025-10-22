# Core DTO Package

This package contains core DTO-related interfaces and exceptions that provide foundational functionality for the Data Transfer Object layer across the entire BuildFlow application.

## Summary

This package provides the foundational DTO framework with marker interfaces and exception handling that all domain DTOs build upon.

## JSON Serialization Conventions

**IMPORTANT**: All DTOs use `@JsonProperty` annotations to provide clean JSON field names without "Dto" suffixes.

### Naming Convention
- **Java Field Name**: May end with "Dto" for type clarity (e.g., `locationDto`, `contactDto`, `groupDtos`)
- **JSON Field Name**: Uses clean names without "Dto" suffix (e.g., `"location"`, `"contact"`, `"groups"`)
- **Type Names**: Keep "Dto" suffix in class names (e.g., `ProjectDto`, `UserDto`, `EstimateGroupDto`)

### Examples

**Project DTO:**
```java
public class ProjectDto extends UpdatableEntityDto implements Dto<Project> {
    private UUID id;
    private UUID builderId;
    private UUID ownerId;
    
    @JsonProperty("location")  // JSON key: "location"
    private ProjectLocationDto locationDto;  // Field name: locationDto
}
```

**Serialized JSON:**
```json
{
  "id": "123e4567-...",
  "builderId": "456e7890-...",
  "ownerId": "789e0123-...",
  "location": {  // Clean field name
    "streetNumberAndName": "123 Main St",
    "city": "Toronto"
  }
}
```

**User DTO:**
```java
public class UserDto {
    private UUID id;
    private String username;
    private String email;
    private boolean registered;
    
    @JsonProperty("contact")  // JSON key: "contact"
    private ContactDto contactDto;  // Field name: contactDto
}
```

**Estimate DTO:**
```java
public class EstimateDto extends UpdatableEntityDto implements Dto<Estimate> {
    private UUID id;
    private UUID projectId;
    private double overallMultiplier;
    
    @JsonProperty("groups")  // JSON key: "groups"
    private Set<EstimateGroupDto> groupDtos;  // Field name: groupDtos
}
```

**Response Wrapper DTOs:**
```java
public class CreateProjectResponse {
    @JsonProperty("project")  // JSON key: "project"
    private ProjectDto projectDto;  // Field name: projectDto
}

public class CreateUserResponse {
    @JsonProperty("user")  // JSON key: "user"
    private UserDto userDto;  // Field name: userDto
}
```

### Benefits
1. **Clean API Contract**: Clients see clean field names like `"user"`, `"project"`, `"location"`
2. **Type Safety**: Internal code maintains type clarity with "Dto" suffixes
3. **Consistency**: All DTO fields with nested DTOs follow the same pattern
4. **No Breaking Changes**: Field names updated via annotations only; Java code unchanged

## Files Structure

```
dto/
├── Dto.java                      # Marker interface for all DTOs
├── DtoMappingException.java      # Exception for DTO mapping failures
└── README.md                     # This file
```

## Package Contents

### Interfaces and Classes

| File | Description |
|------|-------------|
| [Dto.java](Dto.java) | Marker interface connecting DTOs with their respective entities |
| [DtoMappingException.java](DtoMappingException.java) | Runtime exception for DTO mapping failures |

## Technical Overview

### Dto Interface
A generic marker interface that establishes the contract between DTOs and their corresponding entities.

**Key Features:**
- **Type Safety**: Generic type parameter connects DTO to its entity type
- **Standardization**: Ensures all DTOs follow consistent patterns
- **Identification**: Requires UUID-based identification for all DTOs
- **Mapping Support**: Facilitates entity-DTO mapping operations

**Structure:**
- Generic type `T`: The entity type this DTO represents
- `getId()` method: Returns the UUID identifier

**Usage Pattern:**
```java
public class UserDto implements Dto<User> {
    private UUID id;
    // other fields...
    
    @Override
    public UUID getId() {
        return id;
    }
}
```

### DtoMappingException
Specialized runtime exception for DTO mapping operations.

**Key Features:**
- **Mapping Error Handling**: Provides specific exception type for mapping failures
- **Debugging Support**: Clear error messages for mapping issues
- **Integration**: Works with mapping frameworks and custom mappers
- **Error Propagation**: Allows controlled error handling in mapping layers

**Usage Scenarios:**
- Entity to DTO conversion failures
- DTO to Entity conversion failures
- Invalid data during mapping operations
- Missing required fields during mapping

## Design Patterns

### Marker Interface Pattern
The `Dto<T>` interface follows the marker interface pattern to:
- Provide type safety through generics
- Establish contracts without imposing implementation details
- Enable framework-level processing of DTOs
- Support automated mapping and validation

### Exception Hierarchy
```
RuntimeException
└── DtoMappingException
    ├── Entity mapping failures
    ├── DTO validation failures
    └── Conversion errors
```

## Integration Points

This package integrates with:
- **All Domain DTOs**: Every DTO implements the Dto interface
- **Mapping Framework**: MapStruct and custom mappers use these interfaces
- **Service Layer**: Services handle DtoMappingException for error responses
- **Base Package**: Works with base DTOs and mapping utilities

## Usage Across Domains

### Domain DTO Implementation
Every domain DTO implements the core interface:
```java
// User domain
UserDto implements Dto<User>
ContactDto implements Dto<Contact>

// Project domain  
ProjectDto implements Dto<Project>
ProjectLocationDto implements Dto<ProjectLocation>

// Work Item domain
WorkItemDto implements Dto<WorkItem>

// etc.
```

### Exception Handling
DtoMappingException is handled at multiple levels:
- **Mapper Level**: Thrown when mapping operations fail
- **Service Level**: Caught and converted to appropriate business exceptions
- **Controller Level**: Converted to proper HTTP error responses
- **Global Handler**: Provides consistent error response format

## Validation Strategy

The DTO framework supports validation through:
- **Interface Contracts**: Dto interface ensures ID presence
- **Exception Handling**: DtoMappingException for mapping failures
- **Type Safety**: Generic type parameters prevent type mismatches
- **Null Safety**: Proper handling of null values during mapping

## Benefits

### Type Safety
- Compile-time checking of DTO-Entity relationships
- Generic type parameters prevent casting errors
- Clear contracts between layers

### Consistency
- All DTOs follow the same interface pattern
- Standardized error handling across domains
- Uniform mapping operations

### Maintainability
- Clear separation of concerns
- Centralized exception handling
- Easy to extend and modify

## Design Principles

- **Interface Segregation**: Minimal interface with focused responsibility
- **Generic Programming**: Type-safe operations through generics
- **Fail-Fast**: Early detection of mapping errors through exceptions
- **Consistency**: Uniform DTO patterns across all domains
- **Extensibility**: Framework supports new domains without modification