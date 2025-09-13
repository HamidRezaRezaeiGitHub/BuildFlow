import type { ContactRequestDto, UserDto } from './UserDtos';

/**
 * User registration request DTO
 * Matches backend SignUpRequest.java
 */
export interface SignUpRequest {
  /** Username for the new account (3-50 characters) */
  username: string;
  
  /** Password for the new account (8-128 characters with complexity requirements) */
  password: string;
  
  /** Contact information for the new user */
  contactRequestDto: ContactRequestDto;
}

export interface CreateUserResponse {
    userDto: UserDto;
}

/**
 * User login credentials DTO
 * Matches backend LoginRequest.java
 */
export interface LoginRequest {
  /** Username or email */
  username: string;
  
  /** User password */
  password: string;
}

/**
 * JWT authentication response DTO
 * Matches backend JwtAuthenticationResponse.java
 */
export interface AuthResponse {
  /** JWT access token for API authentication */
  accessToken: string;
  
  /** Token type (typically "Bearer") */
  tokenType: string;
}

export interface UserSummary {
    id: string;
    username: string;
    email: string;
    role: string;
}

/**
 * Token validation response DTO
 * Response from token validation endpoints
 */
export interface ValidationResponse {
  /** Validation result message */
  message: string;
}