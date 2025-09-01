package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.base.UserNotFoundException;
import dev.hr.rezaei.buildflow.config.mvc.dto.ErrorResponse;
import dev.hr.rezaei.buildflow.project.auth.RequireProjectCreationAccess;
import dev.hr.rezaei.buildflow.project.dto.CreateProjectRequest;
import dev.hr.rezaei.buildflow.project.dto.CreateProjectResponse;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
@Tag(name = "Project Management", description = "API endpoints for managing construction projects")
@Hidden
public class ProjectController {

    private final ProjectService projectService;

    @Operation(summary = "Create a new project", description = "Creates a new construction project with builder, owner, and location information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Project created successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = CreateProjectResponse.class)))
    })
    @SecurityRequirement(name = "bearerAuth")
    @RequireProjectCreationAccess
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

    @Operation(summary = "Get projects by builder ID", description = "Retrieves all projects assigned to a specific builder")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Projects retrieved successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ProjectDto.class))),
            @ApiResponse(responseCode = "404", description = "Builder not found",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/builder/{builderId}")
    public ResponseEntity<List<ProjectDto>> getProjectsByBuilderId(
            @Parameter(description = "ID of the builder whose projects to retrieve")
            @PathVariable UUID builderId
    ) {
        log.info("Getting projects for builder ID: {}", builderId);

        try {
            List<ProjectDto> projects = projectService.getProjectsByBuilderId(builderId);
            return ResponseEntity.ok(projects);
        } catch (UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Get projects by owner ID", description = "Retrieves all projects owned by a specific property owner")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Projects retrieved successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ProjectDto.class))),
            @ApiResponse(responseCode = "404", description = "Owner not found",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<ProjectDto>> getProjectsByOwnerId(
            @Parameter(description = "ID of the owner whose projects to retrieve")
            @PathVariable UUID ownerId
    ) {
        log.info("Getting projects for owner ID: {}", ownerId);

        try {
            List<ProjectDto> projects = projectService.getProjectsByOwnerId(ownerId);
            return ResponseEntity.ok(projects);
        } catch (UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
