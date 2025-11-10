package dev.hr.rezaei.buildflow.estimate;

import dev.hr.rezaei.buildflow.estimate.EstimateNotFoundException;
import dev.hr.rezaei.buildflow.config.mvc.PaginationHelper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import static dev.hr.rezaei.buildflow.config.mvc.PagedResponseBuilder.build;

/**
 * EstimateController handles sub-resource endpoints for project estimates.
 * All endpoints are scoped under /api/v1/projects/{projectId}/estimates.
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/projects/{projectId}/estimates")
@RequiredArgsConstructor
@Tag(name = "Project Estimates", description = "API endpoints for managing project estimates")
public class EstimateController {

    @SuppressWarnings("unused")
    private final EstimateAuthService estimateAuthService;
    private final EstimateService estimateService;

    // Pagination helper configured with estimate-specific sort fields
    private final PaginationHelper paginationHelper = new PaginationHelper(
        Set.of("lastUpdatedAt", "createdAt"),
        "lastUpdatedAt",
        Sort.Direction.DESC
    );

    @Operation(summary = "List estimates for a project", description = "Retrieves all estimates for a specific project with pagination support")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Estimates retrieved successfully",
                    content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = EstimateDto.class))))
    })
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAuthority('VIEW_PROJECT') and @estimateAuthService.isViewEstimatesAuthorized(#projectId)")
    @GetMapping
    public ResponseEntity<List<EstimateDto>> getEstimates(
            @Parameter(description = "ID of the project whose estimates to retrieve")
            @PathVariable UUID projectId,
            @Parameter(description = "Page number (0-based, default: 0)")
            @RequestParam(required = false) Integer page,
            @Parameter(description = "Page size (default: 25)")
            @RequestParam(required = false) Integer size,
            @Parameter(description = "Sort specification (e.g., 'lastUpdatedAt,DESC')")
            @RequestParam(required = false) String[] sort,
            @Parameter(description = "Order by field (alternative to sort)")
            @RequestParam(required = false) String orderBy,
            @Parameter(description = "Sort direction (ASC or DESC, used with orderBy)")
            @RequestParam(required = false) String direction
    ) {
        log.info("Getting estimates for project ID: {} with pagination", projectId);
        
        Pageable pageable = paginationHelper.createPageable(page, size, sort, orderBy, direction);
        Page<Estimate> estimatePage = estimateService.getEstimatesByProjectId(projectId, pageable);
        Page<EstimateDto> estimateDtoPage = estimatePage.map(EstimateDtoMapper::fromModel);
        
        return build(estimateDtoPage, "/api/v1/projects/" + projectId + "/estimates");
    }

    @Operation(summary = "Get a specific estimate", description = "Retrieves a specific estimate by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Estimate retrieved successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = EstimateDto.class))),
            @ApiResponse(responseCode = "404", description = "Estimate not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAuthority('VIEW_PROJECT') and @estimateAuthService.isViewEstimatesAuthorized(#projectId)")
    @GetMapping("/{estimateId}")
    public ResponseEntity<EstimateDto> getEstimate(
            @Parameter(description = "ID of the project")
            @PathVariable UUID projectId,
            @Parameter(description = "ID of the estimate to retrieve")
            @PathVariable UUID estimateId
    ) {
        log.info("Getting estimate ID: {} for project ID: {}", estimateId, projectId);
        
        Estimate estimate = estimateService.findById(estimateId)
                .orElseThrow(() -> new EstimateNotFoundException("Estimate with ID " + estimateId + " not found"));
        
        // Verify estimate belongs to the requested project
        if (!estimate.getProject().getId().equals(projectId)) {
            throw new IllegalArgumentException("Estimate " + estimateId + " does not belong to project " + projectId);
        }
        
        return ResponseEntity.ok(EstimateDtoMapper.fromModel(estimate));
    }

    @Operation(summary = "Create a new estimate", description = "Adds a new estimate to the project")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Estimate created successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = EstimateDto.class)))
    })
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAuthority('CREATE_PROJECT') and @estimateAuthService.isCreateEstimateAuthorized(#projectId)")
    @PostMapping
    public ResponseEntity<EstimateDto> createEstimate(
            @Parameter(description = "ID of the project")
            @PathVariable UUID projectId,
            @Parameter(description = "Estimate creation request")
            @Valid @RequestBody CreateEstimateRequest request
    ) {
        log.info("Creating estimate for project ID: {} with request: {}", projectId, request);
        
        Estimate estimate = estimateService.createEstimate(
                projectId, 
                request.overallMultiplier()
        );
        
        log.info("Successfully created estimate with ID: {} for project ID: {}", estimate.getId(), projectId);
        return ResponseEntity.status(HttpStatus.CREATED).body(EstimateDtoMapper.fromModel(estimate));
    }

    @Operation(summary = "Update an estimate", description = "Updates an existing estimate")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Estimate updated successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = EstimateDto.class))),
            @ApiResponse(responseCode = "404", description = "Estimate not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAuthority('UPDATE_PROJECT') and @estimateAuthService.isModifyEstimateAuthorized(#projectId)")
    @PutMapping("/{estimateId}")
    public ResponseEntity<EstimateDto> updateEstimate(
            @Parameter(description = "ID of the project")
            @PathVariable UUID projectId,
            @Parameter(description = "ID of the estimate to update")
            @PathVariable UUID estimateId,
            @Parameter(description = "Estimate update request")
            @Valid @RequestBody UpdateEstimateRequest request
    ) {
        log.info("Updating estimate ID: {} for project ID: {} with request: {}", estimateId, projectId, request);
        
        // Verify estimate exists and belongs to project
        Estimate existing = estimateService.findById(estimateId)
                .orElseThrow(() -> new EstimateNotFoundException("Estimate with ID " + estimateId + " not found"));
        
        if (!existing.getProject().getId().equals(projectId)) {
            throw new IllegalArgumentException("Estimate " + estimateId + " does not belong to project " + projectId);
        }
        
        Estimate updated = estimateService.updateEstimate(
                estimateId, 
                request.overallMultiplier()
        );
        
        log.info("Successfully updated estimate ID: {}", estimateId);
        return ResponseEntity.ok(EstimateDtoMapper.fromModel(updated));
    }

    @Operation(summary = "Delete an estimate", description = "Removes an estimate from the project")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Estimate deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Estimate not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAuthority('DELETE_PROJECT') and @estimateAuthService.isDeleteEstimateAuthorized(#projectId)")
    @DeleteMapping("/{estimateId}")
    public ResponseEntity<Void> deleteEstimate(
            @Parameter(description = "ID of the project")
            @PathVariable UUID projectId,
            @Parameter(description = "ID of the estimate to delete")
            @PathVariable UUID estimateId
    ) {
        log.info("Deleting estimate ID: {} from project ID: {}", estimateId, projectId);
        
        // Verify estimate exists and belongs to project
        Estimate existing = estimateService.findById(estimateId)
                .orElseThrow(() -> new EstimateNotFoundException("Estimate with ID " + estimateId + " not found"));
        
        if (!existing.getProject().getId().equals(projectId)) {
            throw new IllegalArgumentException("Estimate " + estimateId + " does not belong to project " + projectId);
        }
        
        estimateService.deleteEstimate(estimateId);
        
        log.info("Successfully deleted estimate ID: {}", estimateId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Request DTO for creating an estimate.
     */
    @Schema(description = "Request object for creating an estimate")
    public record CreateEstimateRequest(
            @Schema(description = "Overall multiplier for the estimate", example = "1.0")
            double overallMultiplier
    ) {}

    /**
     * Request DTO for updating an estimate.
     */
    @Schema(description = "Request object for updating an estimate")
    public record UpdateEstimateRequest(
            @Schema(description = "Overall multiplier for the estimate", example = "1.0")
            double overallMultiplier
    ) {}
}
