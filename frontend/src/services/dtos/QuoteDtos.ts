/**
 * Quote-related DTOs matching backend structure
 * These DTOs correspond to the backend quote management API
 */

import type { BaseAddressDto, UpdatableEntityDto } from './AddressDtos';

/**
 * Quote domain enum
 * Matches backend QuoteDomain enum
 */
export enum QuoteDomain {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

/**
 * Quote unit enum with display values
 * Matches backend QuoteUnit enum
 */
export enum QuoteUnit {
  SQUARE_METER = 'SQUARE_METER',
  SQUARE_FOOT = 'SQUARE_FOOT',
  CUBIC_METER = 'CUBIC_METER',
  CUBIC_FOOT = 'CUBIC_FOOT',
  METER = 'METER',
  FOOT = 'FOOT',
  EACH = 'EACH',
  KILOGRAM = 'KILOGRAM',
  TON = 'TON',
  LITER = 'LITER',
  MILLILITER = 'MILLILITER',
  HOUR = 'HOUR',
  DAY = 'DAY'
}

/**
 * Mapping of QuoteUnit enum to display strings
 * Matches backend QuoteUnit.getUnit() values
 */
export const QuoteUnitDisplay: Record<QuoteUnit, string> = {
  [QuoteUnit.SQUARE_METER]: 'm²',
  [QuoteUnit.SQUARE_FOOT]: 'ft²',
  [QuoteUnit.CUBIC_METER]: 'm³',
  [QuoteUnit.CUBIC_FOOT]: 'ft³',
  [QuoteUnit.METER]: 'm',
  [QuoteUnit.FOOT]: 'ft',
  [QuoteUnit.EACH]: 'each',
  [QuoteUnit.KILOGRAM]: 'kg',
  [QuoteUnit.TON]: 'ton',
  [QuoteUnit.LITER]: 'L',
  [QuoteUnit.MILLILITER]: 'mL',
  [QuoteUnit.HOUR]: 'hr',
  [QuoteUnit.DAY]: 'day'
};

/**
 * Quote location DTO with ID (for responses)
 * Extends BaseAddressDto and adds ID field
 * Matches backend QuoteLocationDto structure
 */
export type QuoteLocationDto = BaseAddressDto & {
  /** Unique identifier for the quote location */
  id: string;
};

/**
 * Quote DTO for representing quote information
 * Extends UpdatableEntityDto to include createdAt and lastUpdatedAt fields
 * Matches backend QuoteDto structure
 * Note: Backend serializes locationDto as "location" in JSON
 */
export type QuoteDto = UpdatableEntityDto & {
  /** Unique identifier for the quote */
  id: string;
  
  /** Work item ID associated with this quote */
  workItemId: string;
  
  /** ID of the user who created this quote */
  createdByUserId: string;
  
  /** Supplier ID for this quote */
  supplierId: string;
  
  /** Unit of measurement for the quote */
  quoteUnit: string;
  
  /** Unit price (BigDecimal in backend) */
  unitPrice: string;
  
  /** Currency code (e.g., 'CAD', 'USD') */
  currency: string;
  
  /** Domain/category of the quote (PUBLIC or PRIVATE) */
  quoteDomain: string;
  
  /** Location information for the quote */
  location: QuoteLocationDto;
  
  /** Whether the quote is valid */
  valid: boolean;
};
