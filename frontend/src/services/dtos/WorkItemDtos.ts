/**
 * WorkItem-related DTOs matching backend structure
 * These DTOs correspond to the backend work item management API
 * 
 * Backend source: dev.hr.rezaei.buildflow.workitem
 * - WorkItemDto.java
 * - CreateWorkItemRequest.java (in dto/ subpackage)
 * - CreateWorkItemResponse.java (in dto/ subpackage)
 */

/**
 * Work item DTO for task and work breakdown structure
 * Extends UpdatableEntityDto to include createdAt and lastUpdatedAt fields
 * Matches backend WorkItemDto structure
 * 
 * Backend: dev.hr.rezaei.buildflow.workitem.WorkItemDto
 */
export interface WorkItemDto {
  /** Work item ID */
  id: string;

  /** Unique code identifier for the work item (e.g., "S1-001") */
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

  /** Domain/category of the work item (e.g., "PUBLIC", "PRIVATE") */
  domain: string;

  /** Creation timestamp (ISO 8601 format) - inherited from UpdatableEntityDto */
  createdAt: string;

  /** Last update timestamp (ISO 8601 format) - inherited from UpdatableEntityDto */
  lastUpdatedAt: string;
}

/**
 * Request DTO for creating a new work item
 * Matches backend CreateWorkItemRequest structure
 * 
 * Backend: dev.hr.rezaei.buildflow.workitem.dto.CreateWorkItemRequest
 */
export interface CreateWorkItemRequest {
  /** Unique code identifier for the work item (required) */
  code: string;

  /** Display name of the work item (required) */
  name: string;

  /** Detailed description of the work item */
  description?: string;

  /** Whether this work item is optional */
  optional: boolean;

  /** ID of the user who owns this work item (required) */
  userId: string;

  /** Default group name for organizing work items */
  defaultGroupName?: string;

  /** Domain/category of the work item (e.g., "PUBLIC", "PRIVATE") */
  domain?: string;
}

/**
 * Response DTO containing the created work item information
 * Matches backend CreateWorkItemResponse structure
 * 
 * Backend: dev.hr.rezaei.buildflow.workitem.dto.CreateWorkItemResponse
 */
export interface CreateWorkItemResponse {
  /** The created work item details */
  workItemDto: WorkItemDto;
}
