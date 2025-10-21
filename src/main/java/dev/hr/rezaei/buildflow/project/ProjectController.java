package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.config.mvc.PagedResponseBuilder;
import dev.hr.rezaei.buildflow.config.mvc.PaginationHelper;
import dev.hr.rezaei.buildflow.project.dto.CreateProjectRequest;
import dev.hr.rezaei.buildflow.project.dto.CreateProjectResponse;
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

@Slf4j
@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
@Tag(name = "Project Management", description = "API endpoints for managing construction projects")
public class ProjectController {

    private final ProjectAuthService authorizationHandler;
    private final ProjectService projectService;
    private final PagedResponseBuilder<ProjectDto> pagedResponseBuilder;
    
    // Pagination helper configured with project-specific sort fields and defaults
    private final PaginationHelper paginationHelper = new PaginationHelper(
        Set.of("lastUpdatedAt", "createdAt"),
        "lastUpdatedAt",
        Sort.Direction.DESC
    );

    @Operation(summary = "Create a new project", description = "Creates a new construction project with builder, owner, and location information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Project created successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = CreateProjectResponse.class)))
    })
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAuthority('CREATE_PROJECT') and @projectAuthService.isCreateRequestAuthorized(#request)")
    @PostMapping
    public ResponseEntity<CreateProjectResponse> createProject(
            @Parameter(description = "Project creation request containing builder, owner, and location information")
            @Valid @RequestBody CreateProjectRequest request
    ) {
        log.info("Creating project with request: {}", request);
        CreateProjectResponse response = projectService.createProject(request);
        log.info("Successfully created project with ID: {}", response.getProjectDto().getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Get projects by builder ID", description = "Retrieves projects assigned to a specific builder with pagination support")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Projects retrieved successfully",
                    content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = ProjectDto.class))))
    })
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAuthority('VIEW_PROJECT') and @projectAuthService.isViewProjectsAuthorized(#builderId)")
    @GetMapping("/builder/{builderId}")
    public ResponseEntity<List<ProjectDto>> getProjectsByBuilderId(
            @Parameter(description = "ID of the builder whose projects to retrieve")
            @PathVariable UUID builderId,
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
        log.info("Getting projects for builder ID: {} with pagination", builderId);
        
        Pageable pageable = paginationHelper.createPageable(page, size, sort, orderBy, direction);
        Page<ProjectDto> projectPage = projectService.getProjectsByBuilderId(builderId, pageable);
        
        return pagedResponseBuilder.buildFromMappedPage(projectPage, "/api/v1/projects/builder/" + builderId);
    }

    @Operation(summary = "Get projects by owner ID", description = "Retrieves projects owned by a specific property owner with pagination support")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Projects retrieved successfully",
                    content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = ProjectDto.class))))
    })
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAuthority('VIEW_PROJECT') and @projectAuthService.isViewProjectsAuthorized(#ownerId)")
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<ProjectDto>> getProjectsByOwnerId(
            @Parameter(description = "ID of the owner whose projects to retrieve")
            @PathVariable UUID ownerId,
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
        log.info("Getting projects for owner ID: {} with pagination", ownerId);
        
        Pageable pageable = paginationHelper.createPageable(page, size, sort, orderBy, direction);
        Page<ProjectDto> projectPage = projectService.getProjectsByOwnerId(ownerId, pageable);
        
        return pagedResponseBuilder.buildFromMappedPage(projectPage, "/api/v1/projects/owner/" + ownerId);
    }
    
    @Operation(
        summary = "Get combined projects",
        description = "Retrieves projects where the user is either builder, owner, or both, with optional date filtering and pagination support"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Projects retrieved successfully",
                    content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = ProjectDto.class))))
    })
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAuthority('VIEW_PROJECT') and @projectAuthService.isViewProjectsAuthorized(#userId)")
    @GetMapping("/combined/{userId}")
    public ResponseEntity<List<ProjectDto>> getCombinedProjects(
            @Parameter(description = "ID of the user whose projects to retrieve")
            @PathVariable UUID userId,
            @Parameter(description = "Scope: 'builder', 'owner', or 'both' (default: both)")
            @RequestParam(required = false, defaultValue = "both") String scope,
            @Parameter(description = "Filter by created date from (ISO-8601 format)")
            @RequestParam(required = false) String createdFrom,
            @Parameter(description = "Filter by created date to (ISO-8601 format)")
            @RequestParam(required = false) String createdTo,
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
        log.info("Getting combined projects for user ID: {} with scope: {}", userId, scope);
        
        // Parse date filters
        java.time.Instant createdFromInstant = createdFrom != null ? java.time.Instant.parse(createdFrom) : null;
        java.time.Instant createdToInstant = createdTo != null ? java.time.Instant.parse(createdTo) : null;
        
        Pageable pageable = paginationHelper.createPageable(page, size, sort, orderBy, direction);
        Page<ProjectDto> projectPage = projectService.getCombinedProjects(
            userId, scope, createdFromInstant, createdToInstant, pageable
        );
        
        return pagedResponseBuilder.buildFromMappedPage(projectPage, "/api/v1/projects/combined/" + userId);
    }
}
