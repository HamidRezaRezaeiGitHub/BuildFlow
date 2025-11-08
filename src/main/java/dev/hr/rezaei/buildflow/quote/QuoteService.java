package dev.hr.rezaei.buildflow.quote;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuoteService {
    
    private final QuoteRepository quoteRepository;
    
    /**
     * Get all quotes created by a specific user.
     * @param createdById the UUID of the user who created the quotes
     * @param pageable pagination information
     * @return paginated list of quotes
     */
    public Page<Quote> getQuotesByCreator(UUID createdById, Pageable pageable) {
        return quoteRepository.findByCreatedById(createdById, pageable);
    }
    
    /**
     * Get all quotes supplied by a specific user.
     * @param supplierId the UUID of the supplier user
     * @param pageable pagination information
     * @return paginated list of quotes
     */
    public Page<Quote> getQuotesBySupplier(UUID supplierId, Pageable pageable) {
        return quoteRepository.findBySupplierId(supplierId, pageable);
    }
    
    /**
     * Count quotes created by a specific user.
     * @param createdById the UUID of the user who created the quotes
     * @return count of quotes
     */
    public long countQuotesByCreator(UUID createdById) {
        return quoteRepository.countByCreatedById(createdById);
    }
    
    /**
     * Count quotes supplied by a specific user.
     * @param supplierId the UUID of the supplier user
     * @return count of quotes
     */
    public long countQuotesBySupplier(UUID supplierId) {
        return quoteRepository.countBySupplierId(supplierId);
    }
}

