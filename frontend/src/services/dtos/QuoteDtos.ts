/**
 * Quote-related DTOs matching backend structure
 * These DTOs correspond to the backend quote and supplier management API
 * 
 * Backend source: dev.hr.rezaei.buildflow.quote
 * - QuoteDto.java
 * - QuoteLocationDto.java
 */

import { BaseAddressDto } from './AddressDtos';

/**
 * Quote location DTO with ID (for responses)
 * Extends BaseAddressDto and adds ID field
 * Matches backend QuoteLocationDto structure
 * 
 * Backend: dev.hr.rezaei.buildflow.quote.QuoteLocationDto
 */
export interface QuoteLocationDto extends BaseAddressDto {
  /** Location ID */
  id: string;
}

/**
 * Quote DTO for supplier quotations
 * Extends UpdatableEntityDto to include createdAt and lastUpdatedAt fields
 * Matches backend QuoteDto structure
 * 
 * Backend: dev.hr.rezaei.buildflow.quote.QuoteDto
 */
export interface QuoteDto {
  /** Quote ID */
  id: string;

  /** Work item ID reference */
  workItemId: string;

  /** ID of the user who created this quote */
  createdByUserId: string;

  /** Supplier ID reference */
  supplierId: string;

  /** Unit of measurement for pricing (e.g., "EACH", "SQFT", "LNFT") */
  quoteUnit: string;

  /** Unit price for this quote (as string to preserve decimal precision) */
  unitPrice: string;

  /** Currency code (e.g., "USD", "CAD") */
  currency: string;

  /** Quote domain/category (e.g., "PUBLIC", "PRIVATE") */
  quoteDomain: string;

  /** Location information for this quote */
  locationDto: QuoteLocationDto;

  /** Whether this quote is still valid */
  valid: boolean;

  /** Creation timestamp (ISO 8601 format) - inherited from UpdatableEntityDto */
  createdAt: string;

  /** Last update timestamp (ISO 8601 format) - inherited from UpdatableEntityDto */
  lastUpdatedAt: string;
}
