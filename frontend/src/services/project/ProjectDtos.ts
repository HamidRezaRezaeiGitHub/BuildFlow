/**
 * Project-related DTOs matching backend structure
 * These DTOs correspond to the backend project management API
 */

import { BaseAddress } from '../address/AddressDtos';
import { Contact, ContactRequest } from '../contact/ContactDtos';

/**
 * Project role enum matching backend ProjectRole
 */
export type ProjectRole = 'BUILDER' | 'OWNER';

/**
 * Project participant DTO for representing participant information
 * Matches backend ProjectParticipantDto structure
 * Note: Backend now includes full Contact instead of just contactId
 */
export interface ProjectParticipant {
  /** Unique identifier of the participant */
  id: string;

  /** Role of the participant in the project (BUILDER or OWNER) */
  role: ProjectRole;

  /** Full contact information of the participant */
  contact: Contact;
}

/**
 * Project participant request DTO for creating participants
 * Matches backend CreateProjectParticipantRequest structure
 * Note: Backend expects "contact" as the JSON property name
 */
export interface CreateProjectParticipantRequest {
  /** Role of the participant in the project (BUILDER or OWNER) */
  role: ProjectRole;

  /** Contact information for the participant */
  contact: ContactRequest;
}

/**
 * Project location request DTO for creating new project locations
 * Matches backend ProjectLocationRequestDto (extends BaseAddress without ID)
 */
export interface ProjectLocationRequest extends BaseAddress {
  // No additional fields - inherits all address fields from BaseAddress
}

/**
 * Request DTO for creating a new project
 * Matches backend CreateProjectRequest structure
 */
export interface CreateProjectRequest {
  /** ID of the user making the request */
  userId: string;

  /** Role of the user in the project (BUILDER or OWNER) */
  role: ProjectRole;

  /** Location information for the project */
  location: ProjectLocationRequest;
}

/**
 * Project DTO for representing project information
 * Extends UpdatableEntity to include createdAt and lastUpdatedAt fields
 * Matches backend ProjectDto structure
 * Note: Backend serializes locationDto as "location" in JSON
 */
export interface Project {
  /** Project ID */
  id: string;

  /** User ID who created/owns the project */
  userId: string;

  /** Role of the main user in the project (BUILDER or OWNER) */
  role: ProjectRole;

  /** Project location */
  location: ProjectLocation;

  /** Creation timestamp (ISO 8601 format) - inherited from UpdatableEntity */
  createdAt: string;

  /** Last update timestamp (ISO 8601 format) - inherited from UpdatableEntity */
  lastUpdatedAt: string;
}

/**
 * Project location DTO with ID (for responses)
 */
export interface ProjectLocation extends BaseAddress {
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
  project: Project;
}
