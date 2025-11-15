/**
 * Project-related DTOs matching backend structure
 * These DTOs correspond to the backend project management API
 */

import { BaseAddressDto } from './AddressDtos';

/**
 * Project role enum matching backend ProjectRole
 */
export type ProjectRole = 'BUILDER' | 'OWNER';

/**
 * Project participant DTO for representing participant information
 * Matches backend ProjectParticipantDto structure
 */
export interface ProjectParticipantDto {
  /** Unique identifier of the participant */
  id: string;
  
  /** Role of the participant in the project (BUILDER or OWNER) */
  role: string;
  
  /** Contact ID of the participant */
  contactId: string;
}

/**
 * Project participant request DTO for creating participants
 * Matches backend CreateProjectParticipantRequest structure
 */
export interface CreateProjectParticipantRequest {
  /** Role of the participant in the project (BUILDER or OWNER) */
  role: string;
  
  /** Contact ID of the participant */
  contactId: string;
}

/**
 * Project location request DTO for creating new project locations
 * Matches backend ProjectLocationRequestDto (extends BaseAddressDto without ID)
 */
export interface ProjectLocationRequestDto extends BaseAddressDto {
  // No additional fields - inherits all address fields from BaseAddressDto
}

/**
 * Request DTO for creating a new project
 * Matches backend CreateProjectRequest structure
 */
export interface CreateProjectRequest {
  /** ID of the user making the request */
  userId: string;
  
  /** Role of the user in the project (BUILDER or OWNER) */
  role: string;
  
  /** Location information for the project */
  location: ProjectLocationRequestDto;
}

/**
 * Project DTO for representing project information
 * Extends UpdatableEntityDto to include createdAt and lastUpdatedAt fields
 * Matches backend ProjectDto structure
 * Note: Backend serializes locationDto as "location" in JSON
 */
export interface ProjectDto {
  /** Project ID */
  id: string;

  /** User ID who created/owns the project */
  userId: string;

  /** Role of the main user in the project (BUILDER or OWNER) */
  role: string;

  /** Project location */
  location: ProjectLocationDto;

  /** Creation timestamp (ISO 8601 format) - inherited from UpdatableEntityDto */
  createdAt: string;

  /** Last update timestamp (ISO 8601 format) - inherited from UpdatableEntityDto */
  lastUpdatedAt: string;
}

/**
 * Project location DTO with ID (for responses)
 */
export interface ProjectLocationDto extends BaseAddressDto {
  /** Location ID */
  id: string;
}

/**
 * Response DTO containing the created project information
 * Matches backend CreateProjectResponse structure
 * Note: Backend serializes projectDto as "project" in JSON
 */
export interface CreateProjectResponse {
  /** The created project details */
  project: ProjectDto;
}