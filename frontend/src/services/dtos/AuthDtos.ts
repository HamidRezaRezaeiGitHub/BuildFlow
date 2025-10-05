import type { ContactRequestDto, UserDto } from './UserDtos';

/**
 * User roles enum
 * Matches backend Role.java enum
 */
export enum Role {
  VIEWER = 'VIEWER',
  USER = 'USER',
  PREMIUM_USER = 'PREMIUM_USER',
  ADMIN = 'ADMIN'
}

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

/**
 * User creation request DTO for admin operations
 * Matches backend CreateUserRequest.java
 */
export interface CreateUserRequest {
  /** Registration status of the user */
  registered: boolean;

  /** Username for the user */
  username: string;

  /** Contact information for the user */
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
  /** Token type (typically "Bearer") */
  tokenType: string;
  
  /** JWT access token for API authentication */
  accessToken: string;
  
  /** Expiration date and time of the token in ISO 8601 format */
  expiryDate: string;
  
  /** Time in seconds until the token expires */
  expiresInSeconds: number;
}

/**
 * User summary response DTO
 * Matches backend UserSummaryResponse.java
 * Returned by the /auth/current endpoint
 */
export interface UserSummary {
    /** User unique identifier */
    id: string;
    
    /** Username */
    username: string;
    
    /** Email address */
    email: string;
    
    /** User role */
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