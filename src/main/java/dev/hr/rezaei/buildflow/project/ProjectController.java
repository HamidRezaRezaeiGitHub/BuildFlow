package dev.hr.rezaei.buildflow.project;

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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

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
    
    private static final int DEFAULT_PAGE_SIZE = 25;
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("lastUpdatedAt", "createdAt");
    private static final String DEFAULT_SORT_FIELD = "lastUpdatedAt";
    private static final Sort.Direction DEFAULT_SORT_DIRECTION = Sort.Direction.DESC;

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
        
        Pageable pageable = createPageable(page, size, sort, orderBy, direction);
        Page<ProjectDto> projectPage = projectService.getProjectsByBuilderId(builderId, pageable);
        
        HttpHeaders headers = createPaginationHeaders(projectPage, "/api/v1/projects/builder/" + builderId);
        return ResponseEntity.ok().headers(headers).body(projectPage.getContent());
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
        
        Pageable pageable = createPageable(page, size, sort, orderBy, direction);
        Page<ProjectDto> projectPage = projectService.getProjectsByOwnerId(ownerId, pageable);
        
        HttpHeaders headers = createPaginationHeaders(projectPage, "/api/v1/projects/owner/" + ownerId);
        return ResponseEntity.ok().headers(headers).body(projectPage.getContent());
    }
    
    /**
     * Creates a Pageable object from request parameters.
     * Priority: sort parameter > orderBy+direction > default (lastUpdatedAt,DESC)
     */
    private Pageable createPageable(Integer page, Integer size, String[] sort, String orderBy, String direction) {
        int pageNum = page != null ? page : 0;
        int pageSize = size != null ? size : DEFAULT_PAGE_SIZE;
        
        Sort sortObj = createSort(sort, orderBy, direction);
        return PageRequest.of(pageNum, pageSize, sortObj);
    }
    
    /**
     * Creates a Sort object from request parameters.
     * Validates sort fields to prevent SQL injection.
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
        return Sort.by(DEFAULT_SORT_DIRECTION, DEFAULT_SORT_FIELD);
    }
    
    /**
     * Parses Spring's standard sort parameter format: field,direction
     */
    private Sort parseSortParameter(String[] sort) {
        Sort.Order[] orders = new Sort.Order[sort.length];
        for (int i = 0; i < sort.length; i++) {
            String[] parts = sort[i].split(",");
            String field = validateSortField(parts[0]);
            Sort.Direction dir = parts.length > 1 ? parseDirection(parts[1]) : DEFAULT_SORT_DIRECTION;
            orders[i] = new Sort.Order(dir, field);
        }
        return Sort.by(orders);
    }
    
    /**
     * Validates and sanitizes sort field to prevent SQL injection.
     */
    private String validateSortField(String field) {
        if (field == null || field.isBlank()) {
            return DEFAULT_SORT_FIELD;
        }
        
        String trimmedField = field.trim();
        if (!ALLOWED_SORT_FIELDS.contains(trimmedField)) {
            log.warn("Invalid sort field requested: {}, using default: {}", trimmedField, DEFAULT_SORT_FIELD);
            return DEFAULT_SORT_FIELD;
        }
        
        return trimmedField;
    }
    
    /**
     * Parses sort direction string.
     */
    private Sort.Direction parseDirection(String direction) {
        if (direction == null || direction.isBlank()) {
            return DEFAULT_SORT_DIRECTION;
        }
        
        try {
            return Sort.Direction.fromString(direction.trim());
        } catch (IllegalArgumentException e) {
            log.warn("Invalid sort direction: {}, using default: {}", direction, DEFAULT_SORT_DIRECTION);
            return DEFAULT_SORT_DIRECTION;
        }
    }
    
    /**
     * Creates pagination headers for the response.
     */
    private HttpHeaders createPaginationHeaders(Page<?> page, String basePath) {
        HttpHeaders headers = new HttpHeaders();
        
        // Add custom pagination headers
        headers.add("X-Total-Count", String.valueOf(page.getTotalElements()));
        headers.add("X-Total-Pages", String.valueOf(page.getTotalPages()));
        headers.add("X-Page", String.valueOf(page.getNumber()));
        headers.add("X-Size", String.valueOf(page.getSize()));
        
        // Add RFC 5988 Link header
        String linkHeader = buildLinkHeader(page, basePath);
        if (!linkHeader.isEmpty()) {
            headers.add(HttpHeaders.LINK, linkHeader);
        }
        
        return headers;
    }
    
    /**
     * Builds RFC 5988 Link header with pagination links.
     */
    private String buildLinkHeader(Page<?> page, String basePath) {
        StringBuilder linkHeader = new StringBuilder();
        
        String baseUrl = ServletUriComponentsBuilder.fromCurrentRequest()
                .replacePath(basePath)
                .replaceQuery("")
                .toUriString();
        
        // First page link
        linkHeader.append(String.format("<%s?page=0&size=%d>; rel=\"first\"", baseUrl, page.getSize()));
        
        // Previous page link
        if (page.hasPrevious()) {
            linkHeader.append(String.format(", <%s?page=%d&size=%d>; rel=\"prev\"", 
                    baseUrl, page.getNumber() - 1, page.getSize()));
        }
        
        // Next page link
        if (page.hasNext()) {
            linkHeader.append(String.format(", <%s?page=%d&size=%d>; rel=\"next\"", 
                    baseUrl, page.getNumber() + 1, page.getSize()));
        }
        
        // Last page link
        if (page.getTotalPages() > 0) {
            linkHeader.append(String.format(", <%s?page=%d&size=%d>; rel=\"last\"", 
                    baseUrl, page.getTotalPages() - 1, page.getSize()));
        }
        
        return linkHeader.toString();
    }
}
