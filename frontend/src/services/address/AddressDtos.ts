/**
 * Base DTO for entities with audit fields
 * Matches backend UpdatableEntityDto structure
 */
export type UpdatableEntity = {
  /** Timestamp when the entity was created (ISO 8601 format) */
  createdAt: string;
  
  /** Timestamp when the entity was last updated (ISO 8601 format) */
  lastUpdatedAt: string;
};

/**
 * Base address information DTO
 * Matches backend BaseAddressDto structure
 */
export interface BaseAddress {
  /** Unit or apartment number */
  unitNumber?: string;
  
  /** Street number and name */
  streetNumberAndName: string;
  
  /** City name */
  city: string;
  
  /** State or province */
  stateOrProvince: string;
  
  /** Postal or zip code */
  postalOrZipCode?: string;
  
  /** Country */
  country: string;
}