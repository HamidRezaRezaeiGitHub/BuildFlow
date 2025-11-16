/**
 * WorkItem-related DTOs matching backend structure
 * These DTOs correspond to the backend work item management API
 */

import type { UpdatableEntity } from '../address/AddressDtos';

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
 * Extends UpdatableEntity to include createdAt and lastUpdatedAt fields
 * Matches backend WorkItemDto structure
 */
export type WorkItem = UpdatableEntity & {
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
  domain: string;
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
 * Note: Backend serializes workItemDto as "workItem" in JSON
 */
export type CreateWorkItemResponse = {
  /** The created work item details */
  workItem: WorkItem;
};
