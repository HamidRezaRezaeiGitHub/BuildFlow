/**
 * Query Parameters Builder - Centralized query string construction
 * 
 * This module provides utilities for building URL query strings from various parameter types.
 * It maintains separation of concerns by keeping DTOs pure (data-only) while providing
 * a single location for all query building logic.
 * 
 * Key responsibilities:
 * - Build query strings from pagination parameters
 * - Build query strings from date filter parameters
 * - Combine multiple query parameter sets into a single URL query string
 * 
 * Design principles:
 * - DTOs remain pure data structures
 * - Query builders are stateless utility functions
 * - Extensible for future filter types (status, tags, search, etc.)
 * - Parallel/agnostic handling - no coupling between different parameter types
 */

import type { DateFilterParams } from './DateFilterDtos';
import type { PaginationParams } from './PaginationDtos';

/**
 * Build URLSearchParams from pagination parameters
 * Handles optional parameters and excludes undefined values
 * 
 * @param params - Optional pagination parameters
 * @returns URLSearchParams object with pagination query parameters
 */
export function buildPaginationQuery(params?: PaginationParams): URLSearchParams {
  const queryParams = new URLSearchParams();
  
  if (!params) {
    return queryParams;
  }
  
  if (params.page !== undefined) {
    queryParams.append('page', params.page.toString());
  }
  
  if (params.size !== undefined) {
    queryParams.append('size', params.size.toString());
  }
  
  if (params.orderBy) {
    queryParams.append('orderBy', params.orderBy);
  }
  
  if (params.direction) {
    queryParams.append('direction', params.direction);
  }
  
  return queryParams;
}

/**
 * Build URLSearchParams from date filter parameters
 * All date values should be in ISO 8601 format
 * 
 * @param params - Optional date filter parameters
 * @returns URLSearchParams object with date filter query parameters
 */
export function buildDateFilterQuery(params?: DateFilterParams): URLSearchParams {
  const queryParams = new URLSearchParams();
  
  if (!params) {
    return queryParams;
  }
  
  if (params.createdAfter) {
    queryParams.append('createdAfter', params.createdAfter);
  }
  
  if (params.createdBefore) {
    queryParams.append('createdBefore', params.createdBefore);
  }
  
  if (params.updatedAfter) {
    queryParams.append('updatedAfter', params.updatedAfter);
  }
  
  if (params.updatedBefore) {
    queryParams.append('updatedBefore', params.updatedBefore);
  }
  
  return queryParams;
}

/**
 * Combine multiple URLSearchParams objects into a single query string
 * This function is agnostic to the type of parameters being combined
 * 
 * @param queries - Variable number of URLSearchParams objects to combine
 * @returns Complete query string with leading '?' (e.g., "?page=0&size=25&createdAfter=2024-01-01T00:00:00Z")
 *          or empty string if no parameters provided
 * 
 * @example
 * const paginationQuery = buildPaginationQuery({ page: 0, size: 25 });
 * const dateFilterQuery = buildDateFilterQuery({ createdAfter: '2024-01-01T00:00:00Z' });
 * const combined = combineQueries(paginationQuery, dateFilterQuery);
 * // Result: "?page=0&size=25&createdAfter=2024-01-01T00:00:00Z"
 */
export function combineQueries(...queries: URLSearchParams[]): string {
  const combined = new URLSearchParams();
  
  // Merge all query parameters
  for (const query of queries) {
    query.forEach((value, key) => {
      combined.append(key, value);
    });
  }
  
  const queryString = combined.toString();
  return queryString ? `?${queryString}` : '';
}
