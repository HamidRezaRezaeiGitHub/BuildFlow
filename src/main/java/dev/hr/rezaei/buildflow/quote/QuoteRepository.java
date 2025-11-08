package dev.hr.rezaei.buildflow.quote;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface QuoteRepository extends JpaRepository<Quote, UUID> {
    
    /**
     * Find all quotes created by a specific user.
     * @param createdById the UUID of the user who created the quotes
     * @param pageable pagination information
     * @return paginated list of quotes created by the user
     */
    Page<Quote> findByCreatedById(UUID createdById, Pageable pageable);
    
    /**
     * Find all quotes supplied by a specific user.
     * @param supplierId the UUID of the supplier user
     * @param pageable pagination information
     * @return paginated list of quotes supplied by the user
     */
    Page<Quote> findBySupplierId(UUID supplierId, Pageable pageable);
    
    /**
     * Count quotes created by a specific user.
     * @param createdById the UUID of the user who created the quotes
     * @return count of quotes created by the user
     */
    long countByCreatedById(UUID createdById);
    
    /**
     * Count quotes supplied by a specific user.
     * @param supplierId the UUID of the supplier user
     * @return count of quotes supplied by the user
     */
    long countBySupplierId(UUID supplierId);
}

