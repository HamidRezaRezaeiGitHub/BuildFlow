# Service Package Documentation Instructions

## Purpose
This document provides instructions for creating comprehensive documentation for service classes in the BuildFlow application. Each package containing service classes should have a `[PackageName]Services.md` file that documents the service layer architecture, responsibilities, and interactions.

## Documentation Structure

### File Naming Convention
- Create a `[PackageName]Services.md` file in each package that contains service classes
- Use PascalCase for the package name followed by "Services.md"
- Examples: `UserServices.md`, `ProjectServices.md`, `EstimateServices.md`, `WorkitemServices.md`, `QuoteServices.md`

### Document Template

```markdown
# [Package Name] Services Overview

This package contains the service layer classes for [domain area] in the BuildFlow application. The services handle business logic, coordinate between repositories and DTOs, and provide transactional boundaries.

## Services

### [ServiceName](ServiceName.java)

- **Purpose:** [Brief description of what this service handles]
- **Responsibilities:**
    - [List key responsibilities]
    - [Business logic operations]
    - [Data transformations]
- **Dependencies:**
    - [Repository](RepositoryName.java) - [purpose]
    - [OtherService](OtherServiceName.java) - [purpose]
    - [DtoMapper](DtoMapperName.java) - [purpose]
- **Key Methods:**
    - `methodName(params)` - [description]
    - `anotherMethod(params)` - [description]
- **Transactions:**
    - [Describe transactional boundaries]
    - [Read-only vs read-write operations]
- **Validation:**
    - [Input validation rules]
    - [Business rule validations]
- **Error Handling:**
    - [Custom exceptions thrown]
    - [Error scenarios handled]

## Service Interactions

### Cross-Package Dependencies

- [ServiceName] → [OtherPackage.ServiceName] - [relationship description]

### Repository Usage

- [ServiceName] uses [RepositoryName] for [CRUD operations' description]

### DTO Mapping

- [ServiceName] uses [DtoMapperName] for [entity-to-DTO conversions]

## Transaction Boundaries

- **Read Operations:** [List services/methods that are read-only]
- **Write Operations:** [List services/methods that modify data]
- **Batch Operations:** [List services that handle bulk operations]

## Business Rules

### [Domain Rule Category]

-

[Rule 1]: [Description]
-

[Rule 2]: [Description]

## Error Handling Strategy

- **Validation Errors:** [How validation errors are handled]
- **Not Found Scenarios:** [How missing entity errors are handled]
- **Business Rule Violations:** [How business rule violations are handled]
- **External Service Failures:** [How external dependencies failures are handled]
```

## Documentation Guidelines

### 1. Service Overview
- Provide a clear package-level summary
- Explain the domain area this service package covers
- Describe the role of services in the overall architecture

### 2. Individual Service Documentation
- **Purpose**: Single sentence describing the service's main responsibility
- **Responsibilities**: Bullet list of key business functions
- **Dependencies**: List all injected dependencies with their purposes
- **Key Methods**: Document public methods with their purposes (not implementation details)
- **Transactions**: Describe read vs write operations and transaction boundaries
- **Validation**: Document what validations are performed
- **Error Handling**: List custom exceptions and error scenarios

### 3. Service Interactions
- Document how services in this package interact with services in other packages
- Show the dependency flow between services
- Explain repository usage patterns
- Document DTO mapping responsibilities

### 4. Transaction Boundaries
- Clearly separate read-only from write operations
- Document batch operation strategies
- Explain transaction propagation where relevant

### 5. Business Rules
- Document domain-specific business rules enforced by services
- Group rules by logical categories
- Reference the business rule in the service method documentation

### 6. Error Handling Strategy
- Document the error handling approach used across services
- List common exception types and when they're thrown
- Explain error propagation strategies

## Best Practices

### Writing Style
- Use present tense ("handles", "validates", "creates")
- Be concise but comprehensive
- Focus on "what" and "why", not "how"
- Use consistent terminology across all service documentation

### Technical Details
- Document public API only (avoid private method details)
- Include parameter types for key methods where helpful
- Reference related entities, DTOs, and other services with links
- Use relative links to other files in the same package

### Maintenance
- Update documentation when service responsibilities change
- Keep business rules section current
- Review and update cross-service dependencies
- Ensure error handling documentation matches implementation

## Example Entries

### Service Entry Example
```markdown
### [UserService](UserService.java)

- **Purpose:** Manages user lifecycle, authentication, and profile operations.
- **Responsibilities:**
    - User registration and profile management
    - User authentication validation
    - Contact information coordination
    - Builder profile creation workflow
- **Dependencies:**
    - [UserRepository](UserRepository.java) - User entity persistence
    - [ContactService](ContactService.java) - Contact profile management
    - [UserDtoMapper](UserDtoMapper.java) - Entity-DTO conversions
- **Key Methods:**
    - `createBuilder(CreateBuilderRequest)` - Creates new builder user with contact
    - `findByEmail(String)` - Retrieves user by email address
    - `updateProfile(UserDto)` - Updates user profile information
- **Transactions:**
    - Write operations: createBuilder, updateProfile
    - Read operations: findByEmail, getAllBuilders
- **Validation:**
    - Email format and uniqueness validation
    - Contact information completeness validation
    - Builder-specific profile requirements
- **Error Handling:**
    - Throws `UserAlreadyExistsException` for duplicate email
    - Throws `InvalidContactException` for incomplete contact data
```

### Business Rules Example
```markdown
## Business Rules

### User Management
- **Unique Email**: Each user must have a unique email address across the system
- **Contact Requirement**: Every user must have a complete contact profile
- **Builder Registration**: Builder users must provide complete contact and address information

### Profile Validation
- **Email Format**: Must be valid email format
- **Name Requirements**: First and last names are required for all users
```

## Package Coverage

Document service classes in these packages:
- `user/` - Create `UserServices.md` for User, Contact, and ContactAddress services
- `project/` - Create `ProjectServices.md` for Project and ProjectLocation services  
- `estimate/` - Create `EstimateServices.md` for Estimate, EstimateGroup, and EstimateLine services
- `workitem/` - Create `WorkitemServices.md` for WorkItem services
- `quote/` - Create `QuoteServices.md` for Quote and QuoteLocation services

## Integration with Model Documentation

- Reference entity classes documented in `Model.md` files
- Cross-reference with repository documentation
- Link to DTO and mapper documentation where relevant
- Ensure consistency with overall architecture documentation
