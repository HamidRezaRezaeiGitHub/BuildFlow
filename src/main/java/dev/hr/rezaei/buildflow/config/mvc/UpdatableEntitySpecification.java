package dev.hr.rezaei.buildflow.config.mvc;

import dev.hr.rezaei.buildflow.base.UpdatableEntity;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

/**
 * Reusable JPA Specification for filtering UpdatableEntity-based entities by date.
 * Provides type-safe, composable filtering that prevents SQL injection.
 * 
 * This specification filters entities by their createdAt and lastUpdatedAt fields
 * using the DateFilter object. All filters are optional and can be combined.
 * 
 * Usage:
 * <pre>
 * DateFilter filter = DateFilterHelper.createDateFilter(...);
 * Specification&lt;Project&gt; spec = UpdatableEntitySpecification.withDateFilter(filter);
 * Page&lt;Project&gt; results = repository.findAll(spec, pageable);
 * </pre>
 * 
 * Combining with other specifications:
 * <pre>
 * Specification&lt;Project&gt; userSpec = (root, query, cb) -> 
 *     cb.equal(root.get("user").get("id"), userId);
 * Specification&lt;Project&gt; combinedSpec = userSpec.and(
 *     UpdatableEntitySpecification.withDateFilter(dateFilter)
 * );
 * </pre>
 */
public class UpdatableEntitySpecification {
    
    /**
     * Private constructor prevents instantiation.
     * This is a utility class with only static methods.
     */
    private UpdatableEntitySpecification() {
        throw new AssertionError("UpdatableEntitySpecification is a utility class and should not be instantiated");
    }
    
    /**
     * Creates a Specification that filters by createdAt and lastUpdatedAt.
     * All filters are optional - null or missing values are ignored.
     * 
     * Supported filters:
     * - createdAfter: createdAt >= value
     * - createdBefore: createdAt <= value
     * - updatedAfter: lastUpdatedAt >= value
     * - updatedBefore: lastUpdatedAt <= value
     * 
     * @param dateFilter The date filter criteria (may be null or empty)
     * @param <T> Entity type extending UpdatableEntity
     * @return Specification for querying (returns conjunction/true if no filters)
     */
    public static <T extends UpdatableEntity> Specification<T> withDateFilter(DateFilter dateFilter) {
        return (Root<T> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            if (dateFilter == null || !dateFilter.hasFilters()) {
                return cb.conjunction(); // No filter = always true (select all)
            }
            
            List<Predicate> predicates = new ArrayList<>();
            
            // createdAt filters
            dateFilter.getCreatedAfter().ifPresent(instant -> 
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), instant))
            );
            
            dateFilter.getCreatedBefore().ifPresent(instant -> 
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), instant))
            );
            
            // lastUpdatedAt filters
            dateFilter.getUpdatedAfter().ifPresent(instant -> 
                predicates.add(cb.greaterThanOrEqualTo(root.get("lastUpdatedAt"), instant))
            );
            
            dateFilter.getUpdatedBefore().ifPresent(instant -> 
                predicates.add(cb.lessThanOrEqualTo(root.get("lastUpdatedAt"), instant))
            );
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
    
    /**
     * Combines date filter with additional specifications using AND logic.
     * Useful for building complex queries with multiple filtering criteria.
     * 
     * @param dateFilter The date filter criteria
     * @param additionalSpec Additional filtering logic to AND with date filter
     * @param <T> Entity type extending UpdatableEntity
     * @return Combined specification (dateFilter AND additionalSpec)
     */
    public static <T extends UpdatableEntity> Specification<T> withDateFilterAnd(
            DateFilter dateFilter, 
            Specification<T> additionalSpec
    ) {
        Specification<T> dateSpec = withDateFilter(dateFilter);
        return dateSpec.and(additionalSpec);
    }
}
