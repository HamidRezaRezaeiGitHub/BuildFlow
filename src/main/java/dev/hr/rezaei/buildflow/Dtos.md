# DTOs Overview

This document provides a comprehensive overview of all Data Transfer Object (DTO) classes across the BuildFlow application. DTOs serve as the data transfer layer between the API and service layers, ensuring clean separation of concerns and proper validation.

## Application-Wide DTO Strategy

The BuildFlow application follows a consistent DTO strategy across all packages:

### DTO Categories
- **Simple DTOs**: Complete entity representations including ID fields for API responses
- **Request DTOs**: Input DTOs for creation operations, typically excluding ID fields
- **Response DTOs**: Structured response objects that wrap core DTOs
- **Inheritance**: DTOs extend base classes (`BaseAddressDto`, `UpdatableEntityDto`) for common functionality

### Naming Conventions
- Entity DTOs: `{Entity}Dto` (e.g., `UserDto`, `ProjectDto`)
- Request DTOs: `Create{Entity}Request` or `{Entity}RequestDto`
- Response DTOs: `Create{Entity}Response`

### Validation Strategy
- Jakarta Bean Validation annotations for field-level validation
- Nested validation using `@Valid` for complex object relationships
- Custom validation messages for user-friendly error reporting

## Package Overview

### [User Package DTOs](./user/UserDtos.md)

**Purpose**: User management, contact information, and address handling

**Key DTOs**:
- **UserDto** - Complete user information with contact details
- **ContactDto** - Contact information with validation and address
- **ContactAddressDto** - Address information extending BaseAddressDto
- **CreateBuilderRequest/Response** - Builder user creation workflow
- **CreateOwnerRequest/Response** - Owner user creation workflow
- **ContactRequestDto** - Contact creation without ID fields
- **ContactAddressRequestDto** - Address creation without ID fields

**Strategy Highlights**:
- Separate request/response DTOs for user types (Builder, Owner)
- Complete contact and address validation
- Email uniqueness and format validation
- Phone number optional with size constraints

### [Project Package DTOs](./project/ProjectDtos.md)

**Purpose**: Project management, location handling, and user relationship management

**Key DTOs**:
- **ProjectDto** - Complete project information with timestamps
- **ProjectLocationDto** - Project location extending BaseAddressDto
- **CreateProjectRequest/Response** - Project creation workflow
- **ProjectLocationRequestDto** - Location creation without ID fields

**Strategy Highlights**:
- Builder and owner user relationship validation
- Cascaded location creation through project creation
- Inheritance from UpdatableEntityDto for timestamp management
- Comprehensive Swagger/OpenAPI documentation

### [Estimate Package DTOs](./estimate/EstimateDtos.md)

**Purpose**: Cost estimation, estimate groups, and estimate line items

**Status**: Documentation in development - DTOs exist but detailed documentation pending

### [WorkItem Package DTOs](./workitem/WorkItemDtos.md)

**Purpose**: Work item management and tracking

**Status**: Documentation in development - DTOs exist but detailed documentation pending

## Common DTO Patterns

### Base Class Inheritance

```
BaseAddressDto
├── ContactAddressDto (user package)
├── ProjectLocationDto (project package)
├── ContactAddressRequestDto (user package)
└── ProjectLocationRequestDto (project package)

UpdatableEntityDto
├── ProjectDto (project package)
└── [Other timestamped entities]

Dto<Entity> Interface
├── UserDto implements Dto<User>
├── ContactDto implements Dto<Contact>
├── ContactAddressDto implements Dto<ContactAddress>
├── ProjectDto implements Dto<Project>
└── ProjectLocationDto implements Dto<ProjectLocation>
```

### Request/Response Pairing

All creation operations follow the pattern:
- `Create{Entity}Request` → Service Layer → `Create{Entity}Response`
- Request DTOs exclude auto-generated fields (IDs, timestamps)
- Response DTOs include complete entity information

### Validation Patterns

**Required Fields**:
- `@NotNull` for mandatory object references
- `@NotBlank` for mandatory string fields
- `@Valid` for nested object validation

**Size Constraints**:
- String fields have `@Size(max=X)` constraints
- Email fields use `@Email` validation
- Phone numbers are optional with size limits

**Business Validation**:
- Email uniqueness enforced at service layer
- User existence validation for relationships
- Cascade validation for related entities

## Cross-Package Relationships

### User-Project Integration
- Projects reference Users through `builderId` and `ownerId`
- User validation occurs in ProjectService through UserService dependency
- Contact information flows from User creation to Project assignment

### Address Standardization
- All address information uses BaseAddressDto inheritance
- Consistent validation across user contacts and project locations
- Shared address fields: street, city, state, postal code, country

### Error Handling Integration
- Consistent exception handling across all DTO operations
- Service layer validation complements DTO field validation
- Clear error messages for API consumers

## Development Guidelines

### Adding New DTOs
1. Follow established naming conventions
2. Extend appropriate base classes when applicable
3. Implement `Dto<Entity>` interface for entity mappers
4. Add comprehensive validation annotations
5. Include Swagger/OpenAPI documentation
6. Update package-specific documentation
7. Update this overview document

### Validation Best Practices
- Use specific validation messages
- Prefer `@NotBlank` over `@NotNull` for strings
- Apply `@Valid` for all nested object relationships
- Keep size constraints realistic for database schema

### Documentation Maintenance
- Update package documentation when DTOs change
- Keep this overview synchronized with package changes
- Document business rules that affect DTO design
- Reference related entity classes and services

## Architecture Integration

The DTO layer integrates with other application layers:
- **Controllers**: Receive and return DTOs for API operations
- **Services**: Transform DTOs to/from entities using mappers
- **Mappers**: Handle DTO-Entity conversions (MapStruct-based)
- **Validation**: Jakarta Bean Validation with custom validators
- **Documentation**: OpenAPI/Swagger integration for API docs
