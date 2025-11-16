/**
 * Estimate-related DTOs matching backend structure
 * These DTOs correspond to the backend estimate management API
 */

import type { UpdatableEntity } from '../address/AddressDtos';

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
 * Extends UpdatableEntity to include createdAt and lastUpdatedAt fields
 * Matches backend EstimateLineDto structure
 */
export type EstimateLine = UpdatableEntity & {
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
 * Note: Backend serializes estimateLineDtos as "estimateLines" in JSON
 */
export type EstimateGroup = {
  /** Unique identifier for the estimate group */
  id: string;
  
  /** Work item ID associated with this group */
  workItemId: string;
  
  /** Name of the estimate group */
  name: string;
  
  /** Description of the estimate group */
  description?: string;
  
  /** Set of estimate line items in this group */
  estimateLines: EstimateLine[];
};

/**
 * Estimate DTO for project cost estimates
 * Extends UpdatableEntity to include createdAt and lastUpdatedAt fields
 * Matches backend EstimateDto structure
 * Note: Backend serializes groupDtos as "groups" in JSON
 */
export type Estimate = UpdatableEntity & {
  /** Unique identifier for the estimate */
  id: string;
  
  /** Project ID associated with this estimate */
  projectId: string;
  
  /** Overall multiplier applied to the entire estimate */
  overallMultiplier: number;
  
  /** Set of estimate groups in this estimate */
  groups: EstimateGroup[];
};
