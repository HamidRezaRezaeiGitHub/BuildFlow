# Base Package

This package contains fundamental base classes, DTOs, exceptions, and utilities that provide common functionality across the entire BuildFlow application. All domain packages build upon these foundational components.

## Summary

This package provides foundational infrastructure including base entities with audit trails, standardized address handling, base DTOs, and common exception types used across all domain packages.

## Files Structure

```
base/
├── BaseAddress.java                  # Abstract entity for address fields
├── BaseAddressDto.java               # Abstract DTO for address fields
├── UpdatableEntity.java              # Abstract entity with audit fields
├── UpdatableEntityDto.java           # Abstract DTO with audit fields
├── UpdatableEntityDtoMapper.java     # Base mapper for entity-DTO conversions
├── UserNotAuthorizedException.java   # Exception for authorization failures
└── README.md                         # This file
```

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
| [UserNotAuthorizedException.java](UserNotAuthorizedException.java) | Runtime exception for unauthorized access attempts (cross-domain) |

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

### UserNotAuthorizedException
Security-focused exception for authorization failures across all domains.

**Usage:**
- Thrown when users attempt to access resources without proper permissions
- Integrates with Spring Security for authorization checks
- Provides secure error messaging without exposing sensitive information
- Cross-domain exception that can be used by any package

**Note:** Domain-specific exceptions have been moved to their respective packages:
- `UserNotFoundException`, `DuplicateUserException`, `ContactNotFoundException` → [user package](../user/)
- `ProjectNotFoundException`, `ParticipantNotFoundException` → [project package](../project/)
- `EstimateNotFoundException` → [estimate package](../estimate/)

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