/**
 * WorkItem-related DTOs matching backend structure
 * These DTOs correspond to the backend work item management API
 */

import type { UpdatableEntityDto } from './AddressDtos';

/**
 * Work item domain enum
 * Matches backend WorkItemDomain enum
 */
export enum WorkItemDomain {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

/**
 * Work item DTO for representing work item information
 * Extends UpdatableEntityDto to include createdAt and lastUpdatedAt fields
 * Matches backend WorkItemDto structure
 */
export type WorkItemDto = UpdatableEntityDto & {
  /** Unique identifier for the work item */
  id: string;
  
  /** Unique code identifier for the work item */
  code: string;
  
  /** Display name of the work item */
  name: string;
  
  /** Detailed description of the work item */
  description?: string;
  
  /** Whether this work item is optional */
  optional: boolean;
  
  /** ID of the user who owns this work item */
  userId: string;
  
  /** Default group name for organizing work items */
  defaultGroupName?: string;
  
  /** Domain/category of the work item (PUBLIC or PRIVATE) */
  domain: WorkItemDomain;
};

/**
 * Request DTO for creating a new work item
 * Matches backend CreateWorkItemRequest structure
 */
export type CreateWorkItemRequest = {
  /** Unique code identifier for the work item */
  code: string;
  
  /** Display name of the work item */
  name: string;
  
  /** Detailed description of the work item */
  description?: string;
  
  /** Whether this work item is optional */
  optional: boolean;
  
  /** ID of the user who owns this work item */
  userId: string;
  
  /** Default group name for organizing work items */
  defaultGroupName?: string;
  
  /** Domain/category of the work item (PUBLIC or PRIVATE) */
  domain?: string;
};

/**
 * Response DTO containing the created work item information
 * Matches backend CreateWorkItemResponse structure
 */
export type CreateWorkItemResponse = {
  /** The created work item details */
  workItemDto: WorkItemDto;
};
