# Utility Package

This package contains utility classes providing common functionality and helper methods used across the entire BuildFlow application.

## Summary

This package provides essential utility functions for enum processing, string manipulation, validation, and data sanitization used throughout all domain packages.

## Files Structure

```
util/
├── EnumUtil.java             # Enum conversion and validation utilities
├── StringUtil.java           # String manipulation and validation utilities
└── README.md                 # This file
```

## Package Contents

### Utility Classes

| File | Description |
|------|-------------|
| [EnumUtil.java](EnumUtil.java) | Utility class for enum operations including case-insensitive conversion and validation |
| [StringUtil.java](StringUtil.java) | Utility class for string manipulation and validation operations |

## Technical Overview

### EnumUtil
Comprehensive utility class for enum operations throughout the application.

**Key Features:**
- **Case-Insensitive Conversion**: Converts strings to enum values regardless of case
- **Null Safety**: Handles null values gracefully without throwing exceptions
- **Default Value Support**: Provides fallback values when conversion fails
- **Generic Implementation**: Works with any enum type through generics
- **Validation Support**: Checks enum value validity before conversion

**Methods:**
- `fromString(Class<T>, String)`: Converts string to enum, returns null if invalid
- `fromStringOrDefault(Class<T>, String, T)`: Converts with default fallback
- `getValues(Class<T>)`: Returns all enum values as list
- `isValid(Class<T>, String)`: Validates if string represents valid enum value

**Usage Examples:**
```java
// Convert string to enum
WorkItemDomain domain = EnumUtil.fromString(WorkItemDomain.class, "construction");

// Convert with default
Role role = EnumUtil.fromStringOrDefault(Role.class, "invalid", Role.USER);

// Validate enum value
boolean isValid = EnumUtil.isValid(ContactLabel.class, "CLIENT");
```

### StringUtil
Essential string manipulation and validation utilities.

**Key Features:**
- **Null Safety**: All methods handle null inputs gracefully
- **Validation**: Common string validation patterns
- **Transformation**: String formatting and cleaning operations
- **Case Handling**: Case-insensitive operations and normalization
- **Trimming**: Various trimming and whitespace handling methods

**Methods:**
- `isBlank(String)`: Checks if string is null, empty, or whitespace
- `isNotBlank(String)`: Inverse of isBlank
- `capitalize(String)`: Capitalizes first letter
- `normalizeWhitespace(String)`: Normalizes internal whitespace
- `truncate(String, int)`: Safely truncates strings to specified length
- `sanitize(String)`: Removes potentially harmful characters

**Usage Examples:**
```java
// Validation
if (StringUtil.isNotBlank(username)) {
    // process username
}

// Formatting
String formatted = StringUtil.capitalize(firstName);

// Sanitization
String safe = StringUtil.sanitize(userInput);
```

## Integration Points

This package provides utilities for:
- **Enum Processing**: Used across all domains for enum conversion and validation
- **String Validation**: Input validation in DTOs and services
- **Data Sanitization**: Security-focused string cleaning operations
- **API Layer**: Request/response data processing
- **Database Layer**: Data preparation and formatting

## Usage Across Domains

### Enum Utilities in Domain Operations
```java
// Security domain
Role userRole = EnumUtil.fromString(Role.class, roleString);

// Work item domain
WorkItemDomain domain = EnumUtil.fromStringOrDefault(
    WorkItemDomain.class, 
    domainInput, 
    WorkItemDomain.GENERAL
);

// Contact domain
ContactLabel label = EnumUtil.fromString(ContactLabel.class, labelInput);
```

### String Utilities in Data Processing
```java
// User input validation
if (StringUtil.isBlank(request.getUsername())) {
    throw new ValidationException("Username required");
}

// Data formatting
contact.setFirstName(StringUtil.capitalize(request.getFirstName()));

// Security sanitization
String cleanInput = StringUtil.sanitize(userProvidedData);
```

## Error Handling

Utility classes follow defensive programming principles:
- **Null-Safe Operations**: All methods handle null inputs
- **Graceful Degradation**: Return sensible defaults rather than throwing exceptions
- **Validation First**: Check preconditions before processing
- **Clear Documentation**: Method contracts clearly specify behavior

## Performance Considerations

Utility classes are optimized for performance:
- **Static Methods**: No instance creation overhead
- **Efficient Algorithms**: Optimized string and enum operations
- **Memory Conscious**: Minimal object allocation
- **Caching**: Enum reflection results cached where appropriate

## Security Features

String utilities include security-focused methods:
- **Input Sanitization**: Removes potentially harmful characters
- **XSS Prevention**: Escapes HTML/JavaScript characters
- **SQL Injection Prevention**: Validates and cleans database inputs
- **Path Traversal Prevention**: Validates file paths and names

## Design Principles

- **Utility Pattern**: Static methods for stateless operations
- **Defensive Programming**: Handle edge cases gracefully
- **Single Responsibility**: Each class focuses on specific utility domain
- **Performance**: Optimized for frequent use across the application
- **Security**: Security-conscious implementations for user input handling
- **Reusability**: Generic implementations work across all domains

## Testing Strategy

Utility classes have comprehensive test coverage:
- **Null Input Testing**: All methods tested with null inputs
- **Edge Case Testing**: Empty strings, boundary values, special characters
- **Performance Testing**: Ensure acceptable performance under load
- **Security Testing**: Validate sanitization and security features