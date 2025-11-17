/**
 * Date Filter DTOs for handling date range filtering in API requests
 * These DTOs match the backend DateFilter structure used in ProjectController and other controllers
 * 
 * Backend accepts ISO 8601 timestamp format (e.g., "2024-01-01T00:00:00Z")
 * All filter parameters are optional and can be used independently or combined
 */

/**
 * Date filter request parameters
 * These correspond to the backend DateFilter query parameters
 * All dates should be in ISO 8601 format
 */
export interface DateFilterParams {
  /** Filter records created after this timestamp (inclusive) */
  createdAfter?: string;
  
  /** Filter records created before this timestamp (inclusive) */
  createdBefore?: string;
  
  /** Filter records updated after this timestamp (inclusive) */
  updatedAfter?: string;
  
  /** Filter records updated before this timestamp (inclusive) */
  updatedBefore?: string;
}

/**
 * Helper function to convert Date object to ISO 8601 string format
 * Backend expects format: "2024-01-01T00:00:00Z"
 * 
 * @param date - JavaScript Date object
 * @returns ISO 8601 formatted string
 */
export function dateToISOString(date: Date): string {
  return date.toISOString();
}

/**
 * Helper function to create DateFilterParams from Date objects
 * Automatically converts Date objects to ISO 8601 strings
 * 
 * @param params - Date filter parameters with Date objects
 * @returns DateFilterParams with ISO 8601 strings
 */
export function createDateFilter(params: {
  createdAfter?: Date;
  createdBefore?: Date;
  updatedAfter?: Date;
  updatedBefore?: Date;
}): DateFilterParams {
  const filter: DateFilterParams = {};
  
  if (params.createdAfter) {
    filter.createdAfter = dateToISOString(params.createdAfter);
  }
  
  if (params.createdBefore) {
    filter.createdBefore = dateToISOString(params.createdBefore);
  }
  
  if (params.updatedAfter) {
    filter.updatedAfter = dateToISOString(params.updatedAfter);
  }
  
  if (params.updatedBefore) {
    filter.updatedBefore = dateToISOString(params.updatedBefore);
  }
  
  return filter;
}
