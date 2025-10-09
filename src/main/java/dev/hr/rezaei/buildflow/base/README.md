# Base Package

This package contains fundamental base classes, DTOs, exceptions, and utilities that provide common functionality across the entire BuildFlow application. All domain packages build upon these foundational components.

## Package Contents

### Base Classes and DTOs

| File | Description |
|------|-------------|
| [BaseAddress.java](BaseAddress.java) | Abstract JPA entity providing common address fields for all address-related entities |
| [BaseAddressDto.java](BaseAddressDto.java) | Abstract DTO providing common address fields for all address-related DTOs |
| [UpdatableEntity.java](UpdatableEntity.java) | Abstract JPA entity with audit fields (createdAt, lastUpdatedAt) |
| [UpdatableEntityDto.java](UpdatableEntityDto.java) | Abstract DTO with audit fields for API responses |
| [UpdatableEntityDtoMapper.java](UpdatableEntityDtoMapper.java) | Base mapper interface for entity-DTO conversions with audit field mapping |

### Exception Classes

| File | Description |
|------|-------------|
| [DuplicateUserException.java](DuplicateUserException.java) | Runtime exception for duplicate user creation attempts |
| [UserNotAuthorizedException.java](UserNotAuthorizedException.java) | Runtime exception for unauthorized access attempts |
| [UserNotFoundException.java](UserNotFoundException.java) | Runtime exception for user lookup failures |

## Technical Overview

### BaseAddress
Abstract JPA entity that standardizes address handling across the entire application.

**Key Features:**
- **Inheritance**: MappedSuperclass for JPA inheritance hierarchy
- **Standardization**: Consistent address fields across all address-containing entities
- **Database Optimization**: Appropriate column lengths for each address component
- **Flexibility**: Supports international address formats

**Structure:**
- `unitNumber` (String, 20 chars): Apartment/unit number (optional)
- `streetNumberAndName` (String, 220 chars): Combined street number and name (e.g., "123 Main Street")
- `city` (String, 100 chars): City name
- `stateOrProvince` (String, 100 chars): State or province
- `postalOrZipCode` (String, 20 chars): Postal or ZIP code
- `country` (String, 100 chars): Country name

### BaseAddressDto
Abstract DTO counterpart to BaseAddress for API operations.

**Key Features:**
- **DTO Pattern**: Provides data transfer structure for address information
- **Validation Support**: Foundation for address validation across DTOs
- **API Consistency**: Ensures consistent address representation in APIs
- **Inheritance**: Base for all address-related DTOs

### UpdatableEntity
Abstract JPA entity providing audit trail functionality.

**Key Features:**
- **Audit Trail**: Automatic tracking of creation and modification times
- **JPA Integration**: Uses JPA annotations for automatic timestamp management
- **UUID Primary Key**: Standardized UUID-based primary key across entities
- **Inheritance**: Base for all auditable entities

**Structure:**
- `id` (UUID): Primary key
- `createdAt` (Instant): Entity creation timestamp
- `lastUpdatedAt` (Instant): Last modification timestamp

### UpdatableEntityDto
Abstract DTO providing audit fields for API responses.

**Key Features:**
- **Audit Information**: Exposes creation and modification times in API responses
- **Consistency**: Standardizes audit field representation across DTOs
- **API Documentation**: Foundation for Swagger documentation of audit fields

### UpdatableEntityDtoMapper
Base mapper interface for entity-DTO conversions.

**Key Features:**
- **Mapping Framework**: Provides foundation for MapStruct-based mapping
- **Audit Mapping**: Handles automatic mapping of audit fields
- **Type Safety**: Generic interface ensuring type-safe conversions
- **Consistency**: Standardizes mapping patterns across the application

## Exception Hierarchy

### DuplicateUserException
Specialized runtime exception for user duplication scenarios.

**Usage:**
- Thrown when attempting to create a user with an existing username/email
- Handled by global exception handler for consistent error responses
- Provides clear error messaging for API consumers

### UserNotAuthorizedException
Security-focused exception for authorization failures.

**Usage:**
- Thrown when users attempt to access resources without proper permissions
- Integrates with Spring Security for authorization checks
- Provides secure error messaging without exposing sensitive information

### UserNotFoundException
Data access exception for user lookup failures.

**Usage:**
- Thrown when user lookups fail to find the requested user
- Used across user management operations
- Provides clear messaging for debugging and API responses

## Design Patterns

### Inheritance Hierarchy
```
BaseAddress (Abstract JPA Entity)
├── ContactAddress
├── ProjectLocation
└── QuoteLocation

UpdatableEntity (Abstract JPA Entity)
├── User
├── Contact
├── Project
├── WorkItem
├── Estimate
└── Quote
```

### DTO Inheritance
```
BaseAddressDto (Abstract DTO)
├── ContactAddressDto
├── ProjectLocationDto
└── QuoteLocationDto

UpdatableEntityDto (Abstract DTO)
├── UserDto
├── ContactDto
├── ProjectDto
├── WorkItemDto
├── EstimateDto
└── QuoteDto
```

## Integration Points

This package provides foundation for:
- **All Domain Packages**: Every domain extends these base classes
- **Security Framework**: Exception classes integrate with security
- **API Layer**: DTOs provide consistent API structure
- **Database Layer**: Base entities ensure consistent database design
- **Mapping Layer**: Base mappers standardize conversion patterns

## Validation Strategy

Base classes support validation through:
- **JPA Constraints**: Database-level constraints on base entities
- **DTO Validation**: Bean Validation annotations on DTOs
- **Custom Validation**: Extensible validation patterns for domain-specific rules

## Design Principles

- **DRY (Don't Repeat Yourself)**: Common functionality centralized in base classes
- **Consistency**: Standardized patterns across all domains
- **Extensibility**: Abstract classes allow domain-specific extensions
- **Type Safety**: Generic interfaces ensure compile-time type checking
- **Security**: Exception handling supports secure error messaging
- **Audit Trail**: Automatic tracking of entity lifecycle events