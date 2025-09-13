/**
 * Centralized exports for all DTO types
 * This file provides a single import point for all DTOs used across the application
 */

// Export all MVC-related DTOs (generic response types)
export * from './MvcDtos';

// Export all User Domain DTOs
export * from './UserDtos';

// Export all Authentication-related DTOs
export * from './AuthDtos';

// Re-export commonly used types with aliases for convenience
export type {
    ErrorResponse as ApiErrorResponse, 
    MessageResponse as ApiMessageResponse, 
    ResponseErrorType as ApiResponseErrorType
} from './MvcDtos';

export type {
    ContactDto as DomainContact,
    ContactAddressDto as DomainContactAddress, 
    UserDto as DomainUser
} from './UserDtos';

export type {
    LoginRequest as LoginCredentials, 
    SignUpRequest as SignUpData
} from './AuthDtos';
