/**
 * Project-related DTOs matching backend structure
 * These DTOs correspond to the backend project management API
 */

import { BaseAddressDto } from './AddressDtos';

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
  userId: string;
  isBuilder: boolean;
  locationRequestDto: ProjectLocationRequestDto;
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

  /** Builder user ID */
  builderId: string;

  /** Owner user ID */
  ownerId: string;

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