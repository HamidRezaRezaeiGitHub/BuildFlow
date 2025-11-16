package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.config.mvc.PaginationHelper;
import org.springframework.data.domain.Sort;

import java.util.Set;

/**
 * Centralized query configuration for Project-related endpoints.
 * 
 * Combines pagination and date filtering configuration:
 * - Sortable fields (prevents SQL injection by whitelisting)
 * - Default sort field and direction
 * - Default page size
 * - Shared PaginationHelper instance
 * - Date filtering support via UpdatableEntitySpecification
 * 
 * Usage in controllers:
 * <pre>
 * // Pagination
 * Pageable pageable = ProjectQueryConfig.PAGINATION_HELPER.createPageable(
 *     page, size, sort, orderBy, direction
 * );
 * 
 * // Date filtering
 * DateFilter dateFilter = DateFilterHelper.createDateFilter(
 *     createdAfter, createdBefore, updatedAfter, updatedBefore
 * );
 * 
 * // Combined query
 * Page&lt;Project&gt; results = projectService.getProjects(pageable, dateFilter);
 * </pre>
 */
public final class ProjectQueryConfig {
    
    // ========================================
    // Pagination Configuration
    // ========================================
    
    /**
     * Fields that are allowed for sorting in project queries.
     * Prevents SQL injection by whitelisting valid sort fields.
     */
    public static final Set<String> SORTABLE_FIELDS = Set.of(
        "lastUpdatedAt",
        "createdAt"
    );
    
    /**
     * Default field to sort by when no sort parameter is provided.
     */
    public static final String DEFAULT_SORT_FIELD = "lastUpdatedAt";
    
    /**
     * Default sort direction when no direction is specified.
     */
    public static final Sort.Direction DEFAULT_SORT_DIRECTION = Sort.Direction.DESC;
    
    /**
     * Default page size for paginated queries.
     */
    public static final int DEFAULT_PAGE_SIZE = 25;
    
    /**
     * Shared PaginationHelper instance configured with project-specific defaults.
     * Reusable across all project controllers.
     */
    public static final PaginationHelper PAGINATION_HELPER = new PaginationHelper(
        SORTABLE_FIELDS,
        DEFAULT_SORT_FIELD,
        DEFAULT_SORT_DIRECTION
    );
    
    // ========================================
    // Date Filtering Configuration
    // ========================================
    
    /**
     * Note: Date filtering is handled through UpdatableEntitySpecification.
     * No additional configuration needed here as filtering uses the standard
     * createdAt and lastUpdatedAt fields from UpdatableEntity.
     * 
     * Date filters support:
     * - createdAfter: Filter projects created on or after this timestamp
     * - createdBefore: Filter projects created on or before this timestamp
     * - updatedAfter: Filter projects updated on or after this timestamp
     * - updatedBefore: Filter projects updated on or before this timestamp
     * 
     * All date filters are optional and use ISO 8601 format.
     * 
     * Example usage:
     * GET /api/v1/projects/user/{userId}?createdAfter=2024-01-01T00:00:00Z&updatedAfter=2024-11-01T00:00:00Z
     */
    
    /**
     * Private constructor prevents instantiation.
     * This is a utility class with only static members.
     */
    private ProjectQueryConfig() {
        throw new AssertionError("ProjectQueryConfig is a utility class and should not be instantiated");
    }
}
