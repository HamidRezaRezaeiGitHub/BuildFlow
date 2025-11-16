package dev.hr.rezaei.buildflow.config.mvc;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.Optional;

/**
 * Reusable date filtering for UpdatableEntity-based entities.
 * Provides optional filtering by createdAt and lastUpdatedAt fields.
 * 
 * Usage in controllers:
 * <pre>
 * DateFilter dateFilter = DateFilterHelper.createDateFilter(
 *     createdAfter, createdBefore, updatedAfter, updatedBefore
 * );
 * Page<Entity> results = service.getEntities(pageable, dateFilter);
 * </pre>
 */
@Data
@Builder
public class DateFilter {
    private final Instant createdAfter;
    private final Instant createdBefore;
    private final Instant updatedAfter;
    private final Instant updatedBefore;
    
    /**
     * Get createdAfter filter value as Optional.
     * @return Optional containing the timestamp, or empty if not set
     */
    public Optional<Instant> getCreatedAfter() {
        return Optional.ofNullable(createdAfter);
    }
    
    /**
     * Get createdBefore filter value as Optional.
     * @return Optional containing the timestamp, or empty if not set
     */
    public Optional<Instant> getCreatedBefore() {
        return Optional.ofNullable(createdBefore);
    }
    
    /**
     * Get updatedAfter filter value as Optional.
     * @return Optional containing the timestamp, or empty if not set
     */
    public Optional<Instant> getUpdatedAfter() {
        return Optional.ofNullable(updatedAfter);
    }
    
    /**
     * Get updatedBefore filter value as Optional.
     * @return Optional containing the timestamp, or empty if not set
     */
    public Optional<Instant> getUpdatedBefore() {
        return Optional.ofNullable(updatedBefore);
    }
    
    /**
     * Check if any date filters are applied.
     * @return true if at least one filter is set, false otherwise
     */
    public boolean hasFilters() {
        return createdAfter != null || createdBefore != null 
            || updatedAfter != null || updatedBefore != null;
    }
    
    /**
     * Create an empty DateFilter with no filters applied.
     * @return DateFilter with all fields null
     */
    public static DateFilter empty() {
        return DateFilter.builder().build();
    }
}
