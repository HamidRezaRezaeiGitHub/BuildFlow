package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.config.mvc.DateFilter;
import dev.hr.rezaei.buildflow.config.mvc.DateFilterHelper;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static dev.hr.rezaei.buildflow.config.mvc.PagedResponseBuilder.build;
import static dev.hr.rezaei.buildflow.project.ProjectQueryConfig.PAGINATION_HELPER;

@Slf4j
@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
@Tag(name = "Project Management", description = "API endpoints for managing construction projects")
public class ProjectController {

    private final ProjectAuthService projectAuthService;
    private final ProjectService projectService;

    @Operation(summary = "Create a new project", description = "Creates a new construction project with builder, owner, and location information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Project created successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = CreateProjectResponse.class)))
    })
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAuthority('CREATE_PROJECT') and @projectAuthService.isCreateRequestAuthorized(#request)")
    @PostMapping
    public ResponseEntity<CreateProjectResponse> createProject(
            @Parameter(description = "Project creation request containing user ID, role, and location information")
            @Valid @RequestBody CreateProjectRequest request
    ) {
        log.info("Creating project with request: {}", request);
        
        // Map DTO to entity
        ProjectLocation location = ProjectLocationDtoMapper.toProjectLocationEntity(request.getLocationRequestDto());
        
        // Call service with entities
        Project project = projectService.createProject(request.getUserId(), request.getRole(), location);
        
        // Map entity back to DTO
        ProjectDto projectDto = ProjectDtoMapper.toProjectDto(project);
        CreateProjectResponse response = CreateProjectResponse.builder()
                .projectDto(projectDto)
                .build();
        
        log.info("Successfully created project with ID: {}", response.getProjectDto().getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Get projects by user ID", description = "Retrieves all projects for a specific user with pagination and optional date filtering support")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Projects retrieved successfully",
                    content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = ProjectDto.class))))
    })
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAuthority('VIEW_PROJECT') and @projectAuthService.isViewProjectsAuthorized(#userId)")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProjectDto>> getProjectsByUserId(
            @Parameter(description = "ID of the user whose projects to retrieve")
            @PathVariable UUID userId,
            @Parameter(description = "Page number (0-based, default: 0)")
            @RequestParam(required = false) Integer page,
            @Parameter(description = "Page size (default: 25)")
            @RequestParam(required = false) Integer size,
            @Parameter(description = "Sort specification (e.g., 'lastUpdatedAt,DESC')")
            @RequestParam(required = false) String[] sort,
            @Parameter(description = "Order by field (alternative to sort)")
            @RequestParam(required = false) String orderBy,
            @Parameter(description = "Sort direction (ASC or DESC, used with orderBy)")
            @RequestParam(required = false) String direction,
            @Parameter(description = "Filter projects created after this date (ISO 8601 format, e.g., '2024-01-01T00:00:00Z')")
            @RequestParam(required = false) String createdAfter,
            @Parameter(description = "Filter projects created before this date (ISO 8601 format, e.g., '2024-12-31T23:59:59Z')")
            @RequestParam(required = false) String createdBefore,
            @Parameter(description = "Filter projects updated after this date (ISO 8601 format, e.g., '2024-11-01T00:00:00Z')")
            @RequestParam(required = false) String updatedAfter,
            @Parameter(description = "Filter projects updated before this date (ISO 8601 format)")
            @RequestParam(required = false) String updatedBefore
    ) {
        log.info("Getting projects for user ID: {} with pagination and date filters", userId);
        
        Pageable pageable = PAGINATION_HELPER.createPageable(page, size, sort, orderBy, direction);
        DateFilter dateFilter = DateFilterHelper.createDateFilter(
            createdAfter, createdBefore, updatedAfter, updatedBefore
        );
        
        Page<Project> projectPage = projectService.getProjectsByUserId(userId, pageable, dateFilter);
        Page<ProjectDto> projectDtoPage = projectPage.map(ProjectDtoMapper::toProjectDto);
        
        return build(projectDtoPage, "/api/v1/projects/user/" + userId);
    }

    @Operation(summary = "Get project by ID", description = "Retrieves a single project by its unique identifier")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Project retrieved successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ProjectDto.class))),
            @ApiResponse(responseCode = "404", description = "Project not found"),
            @ApiResponse(responseCode = "403", description = "Not authorized to view this project")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAuthority('VIEW_PROJECT')")
    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectDto> getProjectById(
            @Parameter(description = "ID of the project to retrieve")
            @PathVariable UUID projectId
    ) {
        log.info("Getting project by ID: {}", projectId);
        
        // Fetch the project
        Project project = projectService.findById(projectId)
                .orElseThrow(() -> {
                    log.warn("Project not found with ID: {}", projectId);
                    return new ProjectNotFoundException("Project not found with ID: " + projectId);
                });
        
        // Post-authorization: Check if the user is authorized to view this specific project
        projectAuthService.postAuthorizeProjectView(project);
        
        ProjectDto projectDto = ProjectDtoMapper.toProjectDto(project);
        
        log.info("Successfully retrieved project with ID: {}", projectId);
        return ResponseEntity.ok(projectDto);
    }

    @Operation(summary = "Get all projects (Admin only)", description = "Retrieves all projects in the system with pagination and optional date filtering support. Requires ADMIN_USERS authority.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Projects retrieved successfully",
                    content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = ProjectDto.class))))
    })
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAuthority('ADMIN_USERS')")
    @GetMapping
    public ResponseEntity<List<ProjectDto>> getAllProjects(
            @Parameter(description = "Page number (0-based, default: 0)")
            @RequestParam(required = false) Integer page,
            @Parameter(description = "Page size (default: 25)")
            @RequestParam(required = false) Integer size,
            @Parameter(description = "Sort specification (e.g., 'lastUpdatedAt,DESC')")
            @RequestParam(required = false) String[] sort,
            @Parameter(description = "Order by field (alternative to sort)")
            @RequestParam(required = false) String orderBy,
            @Parameter(description = "Sort direction (ASC or DESC, used with orderBy)")
            @RequestParam(required = false) String direction,
            @Parameter(description = "Filter projects created after this date (ISO 8601 format, e.g., '2024-01-01T00:00:00Z')")
            @RequestParam(required = false) String createdAfter,
            @Parameter(description = "Filter projects created before this date (ISO 8601 format, e.g., '2024-12-31T23:59:59Z')")
            @RequestParam(required = false) String createdBefore,
            @Parameter(description = "Filter projects updated after this date (ISO 8601 format, e.g., '2024-11-01T00:00:00Z')")
            @RequestParam(required = false) String updatedAfter,
            @Parameter(description = "Filter projects updated before this date (ISO 8601 format)")
            @RequestParam(required = false) String updatedBefore
    ) {
        log.info("Admin getting all projects with pagination and date filters");
        
        Pageable pageable = PAGINATION_HELPER.createPageable(page, size, sort, orderBy, direction);
        DateFilter dateFilter = DateFilterHelper.createDateFilter(
            createdAfter, createdBefore, updatedAfter, updatedBefore
        );
        
        Page<Project> projectPage = projectService.getAllProjects(pageable, dateFilter);
        Page<ProjectDto> projectDtoPage = projectPage.map(ProjectDtoMapper::toProjectDto);
        
        return build(projectDtoPage, "/api/v1/projects");
    }
}
