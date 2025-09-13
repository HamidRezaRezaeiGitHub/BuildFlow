/**
 * Base address information DTO
 * Matches backend BaseAddressDto structure
 */
export interface BaseAddressDto {
  /** Unit or apartment number */
  unitNumber?: string;
  
  /** Street number */
  streetNumber?: string;
  
  /** Street name */
  streetName: string;
  
  /** City name */
  city: string;
  
  /** State or province */
  stateOrProvince: string;
  
  /** Postal or zip code */
  postalOrZipCode?: string;
  
  /** Country */
  country: string;
}