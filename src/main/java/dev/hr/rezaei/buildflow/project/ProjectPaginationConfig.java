package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.config.mvc.PaginationHelper;
import org.springframework.data.domain.Sort;

import java.util.Set;

/**
 * Centralized pagination configuration for Project-related endpoints.
 * 
 * Defines:
 * - Sortable fields (prevents SQL injection by whitelisting)
 * - Default sort field and direction
 * - Default page size
 * - Shared PaginationHelper instance
 * 
 * Usage in controllers:
 * <pre>
 * Pageable pageable = ProjectPaginationConfig.PAGINATION_HELPER.createPageable(
 *     page, size, sort, orderBy, direction
 * );
 * </pre>
 */
public final class ProjectPaginationConfig {
    
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
    
    /**
     * Private constructor prevents instantiation.
     * This is a utility class with only static members.
     */
    private ProjectPaginationConfig() {
        throw new AssertionError("ProjectPaginationConfig is a utility class and should not be instantiated");
    }
}
