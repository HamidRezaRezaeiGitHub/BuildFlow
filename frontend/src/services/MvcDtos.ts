/**
 * DTOs matching backend config/mvc/dto classes
 * These types correspond to the generic response DTOs used across the application
 */

/**
 * Response error type enumeration
 * Matches backend ResponseErrorType enum
 */
export enum ResponseErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  BUSINESS_LOGIC_ERROR = 'BUSINESS_LOGIC_ERROR',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR'
}

/**
 * Generic API response DTO
 * Matches backend MessageResponse.java
 */
export interface MessageResponse {
  /** Timestamp when the response was generated (ISO string format) */
  timestamp: string;
  
  /** Indicates if the operation was successful */
  success: boolean;
  
  /** HTTP status code of the response */
  status: string;
  
  /** Message related to the response */
  message: string;
}

/**
 * Unified error response for all types of errors
 * Matches backend ErrorResponse.java
 */
export interface ErrorResponse {
  /** Timestamp when the error occurred (ISO string format) */
  timestamp: string;
  
  /** HTTP status code */
  status: string;
  
  /** Error message describing the failure */
  message: string;
  
  /** List of specific error details */
  errors: string[];
  
  /** Request path where the error occurred */
  path: string;
  
  /** HTTP method */
  method: string;
  
  /** Type of error that occurred */
  errorType: ResponseErrorType;
}