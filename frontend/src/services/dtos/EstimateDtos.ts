/**
 * Estimate-related DTOs matching backend structure
 * These DTOs correspond to the backend estimate management API
 * 
 * Backend source: dev.hr.rezaei.buildflow.estimate
 * - EstimateDto.java
 * - EstimateGroupDto.java
 * - EstimateLineDto.java
 */

/**
 * Estimate line DTO representing individual line items in an estimate
 * Extends UpdatableEntityDto to include createdAt and lastUpdatedAt fields
 * Matches backend EstimateLineDto structure
 * 
 * Backend: dev.hr.rezaei.buildflow.estimate.EstimateLineDto
 */
export interface EstimateLineDto {
  /** Line item ID */
  id: string;

  /** Work item ID reference */
  workItemId: string;

  /** Quantity for this line item */
  quantity: number;

  /** Estimation strategy (e.g., AVERAGE, LATEST, LOWEST) */
  estimateStrategy: string;

  /** Multiplier applied to the base cost */
  multiplier: number;

  /** Computed cost for this line item (quantity × unit price × multiplier) */
  computedCost: string;

  /** Creation timestamp (ISO 8601 format) - inherited from UpdatableEntityDto */
  createdAt: string;

  /** Last update timestamp (ISO 8601 format) - inherited from UpdatableEntityDto */
  lastUpdatedAt: string;
}

/**
 * Estimate group DTO for organizing estimate line items
 * Groups multiple EstimateLineDto items together
 * Matches backend EstimateGroupDto structure
 * 
 * Backend: dev.hr.rezaei.buildflow.estimate.EstimateGroupDto
 */
export interface EstimateGroupDto {
  /** Group ID */
  id: string;

  /** Work item ID reference */
  workItemId: string;

  /** Group name */
  name: string;

  /** Group description */
  description?: string;

  /** Set of estimate line items in this group */
  estimateLineDtos: EstimateLineDto[];
}

/**
 * Estimate DTO for project cost estimates
 * Extends UpdatableEntityDto to include createdAt and lastUpdatedAt fields
 * Contains multiple EstimateGroupDto items for hierarchical organization
 * Matches backend EstimateDto structure
 * 
 * Backend: dev.hr.rezaei.buildflow.estimate.EstimateDto
 */
export interface EstimateDto {
  /** Estimate ID */
  id: string;

  /** Project ID reference */
  projectId: string;

  /** Overall multiplier applied to all groups */
  overallMultiplier: number;

  /** Set of estimate groups containing line items */
  groupDtos: EstimateGroupDto[];

  /** Creation timestamp (ISO 8601 format) - inherited from UpdatableEntityDto */
  createdAt: string;

  /** Last update timestamp (ISO 8601 format) - inherited from UpdatableEntityDto */
  lastUpdatedAt: string;
}
