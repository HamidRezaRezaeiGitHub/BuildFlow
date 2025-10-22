/**
 * Estimate-related DTOs matching backend structure
 * These DTOs correspond to the backend estimate management API
 */

import type { UpdatableEntityDto } from './AddressDtos';

/**
 * Estimate line strategy enum
 * Matches backend EstimateLineStrategy enum
 */
export enum EstimateLineStrategy {
  AVERAGE = 'AVERAGE',
  LATEST = 'LATEST',
  LOWEST = 'LOWEST'
}

/**
 * Estimate line DTO for individual line items
 * Extends UpdatableEntityDto to include createdAt and lastUpdatedAt fields
 * Matches backend EstimateLineDto structure
 */
export type EstimateLineDto = UpdatableEntityDto & {
  /** Unique identifier for the estimate line */
  id: string;
  
  /** Work item ID associated with this line */
  workItemId: string;
  
  /** Quantity for this line item */
  quantity: number;
  
  /** Strategy used for estimation (AVERAGE, LATEST, LOWEST) */
  estimateStrategy: string;
  
  /** Multiplier applied to the line item cost */
  multiplier: number;
  
  /** Computed cost for this line item (BigDecimal in backend) */
  computedCost: string;
};

/**
 * Estimate group DTO for grouping line items
 * Matches backend EstimateGroupDto structure
 */
export type EstimateGroupDto = {
  /** Unique identifier for the estimate group */
  id: string;
  
  /** Work item ID associated with this group */
  workItemId: string;
  
  /** Name of the estimate group */
  name: string;
  
  /** Description of the estimate group */
  description?: string;
  
  /** Set of estimate line items in this group */
  estimateLineDtos: EstimateLineDto[];
};

/**
 * Estimate DTO for project cost estimates
 * Extends UpdatableEntityDto to include createdAt and lastUpdatedAt fields
 * Matches backend EstimateDto structure
 */
export type EstimateDto = UpdatableEntityDto & {
  /** Unique identifier for the estimate */
  id: string;
  
  /** Project ID associated with this estimate */
  projectId: string;
  
  /** Overall multiplier applied to the entire estimate */
  overallMultiplier: number;
  
  /** Set of estimate groups in this estimate */
  groupDtos: EstimateGroupDto[];
};
