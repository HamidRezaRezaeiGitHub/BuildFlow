/**
 * Centralized exports for all DTO types
 * This file provides a single import point for all DTOs used across the application
 */

export type {
    ErrorResponse as ApiErrorResponse, 
    MessageResponse as ApiMessageResponse
} from './MvcDtos';

export type {
    ContactDto as DomainContact,
    ContactAddressDto as DomainContactAddress, 
    UserDto as DomainUser
} from './UserDtos';

export type {
    LoginRequest as LoginCredentials, 
    SignUpRequest as SignUpData,
    AuthResponse as AuthResponse,
    ValidationResponse as ValidationResponse
} from './AuthDtos';

export type {
    BaseAddressDto as AddressData
} from './AddressDtos';
