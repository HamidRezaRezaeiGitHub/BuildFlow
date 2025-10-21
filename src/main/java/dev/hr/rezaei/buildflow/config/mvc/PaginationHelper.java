package dev.hr.rezaei.buildflow.config.mvc;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Set;

/**
 * Helper utility for creating Pageable objects with validated sorting.
 * 
 * Provides centralized pagination logic to ensure consistency across controllers.
 * Handles:
 * - Default pagination values
 * - Sort parameter parsing (Spring's standard format: field,direction)
 * - orderBy + direction parameter parsing
 * - Sort field validation (prevents SQL injection)
 * - Direction validation
 * 
 * Usage:
 * <pre>
 * PaginationHelper helper = new PaginationHelper(
 *     Set.of("lastUpdatedAt", "createdAt"), 
 *     "lastUpdatedAt", 
 *     Sort.Direction.DESC
 * );
 * Pageable pageable = helper.createPageable(page, size, sort, orderBy, direction);
 * </pre>
 */
@Slf4j
public class PaginationHelper {
    
    private static final int DEFAULT_PAGE_SIZE = 25;
    
    private final Set<String> allowedSortFields;
    private final String defaultSortField;
    private final Sort.Direction defaultSortDirection;
    
    /**
     * Creates a PaginationHelper with custom allowed fields and defaults.
     * 
     * @param allowedSortFields Set of allowed sort field names (for validation)
     * @param defaultSortField Default field to sort by
     * @param defaultSortDirection Default sort direction
     */
    public PaginationHelper(Set<String> allowedSortFields, String defaultSortField, Sort.Direction defaultSortDirection) {
        this.allowedSortFields = allowedSortFields;
        this.defaultSortField = defaultSortField;
        this.defaultSortDirection = defaultSortDirection;
    }
    
    /**
     * Creates a Pageable object from request parameters.
     * Priority: sort parameter > orderBy+direction > default
     * 
     * @param page Page number (0-based), null defaults to 0
     * @param size Page size, null defaults to 25
     * @param sort Sort specification array (e.g., ["lastUpdatedAt,DESC"])
     * @param orderBy Single order field (alternative to sort)
     * @param direction Sort direction (used with orderBy)
     * @return Pageable object with validated parameters
     */
    public Pageable createPageable(Integer page, Integer size, String[] sort, String orderBy, String direction) {
        int pageNum = page != null ? page : 0;
        int pageSize = size != null ? size : DEFAULT_PAGE_SIZE;
        
        Sort sortObj = createSort(sort, orderBy, direction);
        return PageRequest.of(pageNum, pageSize, sortObj);
    }
    
    /**
     * Creates a Sort object from request parameters.
     * Validates sort fields to prevent SQL injection.
     * 
     * @param sort Sort specification array
     * @param orderBy Single order field
     * @param direction Sort direction
     * @return Sort object
     */
    private Sort createSort(String[] sort, String orderBy, String direction) {
        // If sort parameter is provided, use it (Spring's standard format)
        if (sort != null && sort.length > 0) {
            return parseSortParameter(sort);
        }
        
        // If orderBy is provided, use it with direction
        if (orderBy != null && !orderBy.isBlank()) {
            String validatedField = validateSortField(orderBy);
            Sort.Direction dir = parseDirection(direction);
            return Sort.by(dir, validatedField);
        }
        
        // Default sort
        return Sort.by(defaultSortDirection, defaultSortField);
    }
    
    /**
     * Parses Spring's standard sort parameter format: field,direction
     * 
     * @param sort Array of sort specifications
     * @return Sort object with validated fields
     */
    private Sort parseSortParameter(String[] sort) {
        Sort.Order[] orders = new Sort.Order[sort.length];
        for (int i = 0; i < sort.length; i++) {
            String[] parts = sort[i].split(",");
            String field = validateSortField(parts[0]);
            Sort.Direction dir = parts.length > 1 ? parseDirection(parts[1]) : defaultSortDirection;
            orders[i] = new Sort.Order(dir, field);
        }
        return Sort.by(orders);
    }
    
    /**
     * Validates and sanitizes sort field to prevent SQL injection.
     * Only allows fields in the allowedSortFields set.
     * 
     * @param field Field name to validate
     * @return Validated field name or default if invalid
     */
    private String validateSortField(String field) {
        if (field == null || field.isBlank()) {
            return defaultSortField;
        }
        
        String trimmedField = field.trim();
        if (!allowedSortFields.contains(trimmedField)) {
            log.warn("Invalid sort field requested: {}, using default: {}", trimmedField, defaultSortField);
            return defaultSortField;
        }
        
        return trimmedField;
    }
    
    /**
     * Parses sort direction string.
     * 
     * @param direction Direction string (ASC, DESC, asc, desc)
     * @return Sort.Direction or default if invalid
     */
    private Sort.Direction parseDirection(String direction) {
        if (direction == null || direction.isBlank()) {
            return defaultSortDirection;
        }
        
        try {
            return Sort.Direction.fromString(direction.trim());
        } catch (IllegalArgumentException e) {
            log.warn("Invalid sort direction: {}, using default: {}", direction, defaultSortDirection);
            return defaultSortDirection;
        }
    }
}
