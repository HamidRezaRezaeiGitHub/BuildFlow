/**
 * Centralized exports for all DTO types
 * This file provides a single import point for all DTOs used across the application
 */

export type {
    ErrorResponse as ApiErrorResponse, 
    MessageResponse as ApiMessageResponse
} from './MvcDtos';

export type {
    ContactDto as Contact,
    ContactAddressDto as ContactAddress,
    ContactRequestDto as ContactRequest,
    ContactAddressRequestDto as ContactAddressRequest,
    UserDto as User,
    UserRequestDto as UserRequest,
    UserAuthenticationDto as UserAuthentication
} from './UserDtos';

export type {
    LoginRequest as LoginCredentials, 
    SignUpRequest as SignUpData,
    CreateUserRequest,
    CreateUserResponse,
    AuthResponse as AuthResponse,
    ValidationResponse as ValidationResponse
} from './AuthDtos';

export type {
    BaseAddressDto as AddressData
} from './AddressDtos';

export type {
    CreateProjectRequest,
    CreateProjectResponse,
    ProjectDto,
    ProjectLocationRequestDto,
    ProjectLocationDto
} from './ProjectDtos';
