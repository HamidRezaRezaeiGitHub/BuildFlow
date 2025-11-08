package dev.hr.rezaei.buildflow.quote;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/quotes")
@RequiredArgsConstructor
@Tag(name = "Quote Management", description = "API endpoints for managing quotes")
public class QuoteController {

    private final QuoteService quoteService;

    @Operation(summary = "Get quotes by creator", description = "Retrieves all quotes created by a specific user with pagination")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Quotes retrieved successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Page.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request parameters"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping
    public ResponseEntity<Page<Quote>> getQuotesByCreator(
            @Parameter(description = "ID of the user who created the quotes")
            @RequestParam(required = false) UUID createdById,
            @Parameter(description = "ID of the supplier user")
            @RequestParam(required = false) UUID supplierId,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        if (createdById != null) {
            log.info("Getting quotes created by user ID: {} with pagination: {}", createdById, pageable);
            Page<Quote> quotes = quoteService.getQuotesByCreator(createdById, pageable);
            log.info("Found {} quotes created by user ID: {}", quotes.getTotalElements(), createdById);
            return ResponseEntity.ok(quotes);
        } else if (supplierId != null) {
            log.info("Getting quotes supplied by user ID: {} with pagination: {}", supplierId, pageable);
            Page<Quote> quotes = quoteService.getQuotesBySupplier(supplierId, pageable);
            log.info("Found {} quotes supplied by user ID: {}", quotes.getTotalElements(), supplierId);
            return ResponseEntity.ok(quotes);
        } else {
            log.warn("getQuotesByCreator called without createdById or supplierId parameter");
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Get quote counts by user", description = "Returns the count of quotes created and supplied by a specific user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Counts retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/count/{userId}")
    public ResponseEntity<Map<String, Long>> getQuoteCounts(
            @Parameter(description = "ID of the user")
            @PathVariable UUID userId
    ) {
        log.info("Getting quote counts for user ID: {}", userId);
        
        long createdCount = quoteService.countQuotesByCreator(userId);
        long suppliedCount = quoteService.countQuotesBySupplier(userId);
        
        Map<String, Long> counts = new HashMap<>();
        counts.put("createdCount", createdCount);
        counts.put("suppliedCount", suppliedCount);
        
        log.info("User {} has created {} quotes and supplied {} quotes", userId, createdCount, suppliedCount);
        
        return ResponseEntity.ok(counts);
    }
}
