/**
 * Pagination-related DTOs for handling paginated API responses
 * These DTOs match the backend pagination structure used in ProjectController and other controllers
 */

/**
 * Pagination metadata extracted from response headers
 * Backend provides these values through X-* headers
 */
export interface PaginationMetadata {
  /** Current page number (0-based) */
  page: number;
  
  /** Number of items per page */
  size: number;
  
  /** Total number of elements across all pages */
  totalElements: number;
  
  /** Total number of pages */
  totalPages: number;
  
  /** Whether there is a next page */
  hasNext: boolean;
  
  /** Whether there is a previous page */
  hasPrevious: boolean;
  
  /** Whether this is the first page */
  isFirst: boolean;
  
  /** Whether this is the last page */
  isLast: boolean;
}

/**
 * Paginated response wrapping data with pagination metadata
 */
export interface PagedResponse<T> {
  /** The actual data/content array */
  content: T[];
  
  /** Pagination metadata */
  pagination: PaginationMetadata;
}

/**
 * Pagination request parameters
 * These correspond to the backend query parameters
 */
export interface PaginationParams {
  /** Page number (0-based, default: 0) */
  page?: number;
  
  /** Page size (default: 25) */
  size?: number;
  
  /** Sort field (e.g., 'lastUpdatedAt' or 'createdAt') */
  orderBy?: string;
  
  /** Sort direction ('ASC' or 'DESC', default: 'DESC') */
  direction?: 'ASC' | 'DESC';
}

/**
 * Default pagination parameters matching backend defaults
 */
export const DEFAULT_PAGINATION: Required<PaginationParams> = {
  page: 0,
  size: 25,
  orderBy: 'lastUpdatedAt',
  direction: 'DESC'
};

/**
 * Extract pagination metadata from response headers
 * Reads X-* headers added by the backend pagination controller
 */
export function extractPaginationMetadata(headers: Headers): PaginationMetadata {
  const page = parseInt(headers.get('X-Page') || '0', 10);
  const size = parseInt(headers.get('X-Size') || '0', 10);
  const totalElements = parseInt(headers.get('X-Total-Count') || '0', 10);
  const totalPages = parseInt(headers.get('X-Total-Pages') || '0', 10);
  
  return {
    page,
    size,
    totalElements,
    totalPages,
    hasNext: page < totalPages - 1,
    hasPrevious: page > 0,
    isFirst: page === 0,
    isLast: page === totalPages - 1 || totalPages === 0
  };
}

/**
 * Build query string from pagination parameters
 * Handles optional parameters and uses defaults when not provided
 */
export function buildPaginationQuery(params?: PaginationParams): string {
  if (!params) {
    return '';
  }
  
  const queryParams = new URLSearchParams();
  
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
  
  const query = queryParams.toString();
  return query ? `?${query}` : '';
}
