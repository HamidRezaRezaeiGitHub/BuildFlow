package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.config.mvc.ValidationErrorResponse;
import dev.hr.rezaei.buildflow.project.dto.CreateProjectRequest;
import dev.hr.rezaei.buildflow.project.dto.CreateProjectResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
@Tag(name = "Project Management", description = "API endpoints for managing construction projects")
public class ProjectController {

    private final ProjectService projectService;

    @Operation(
            summary = "Create a new project",
            description = "Creates a new construction project with builder, owner, and location information"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Project created successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = CreateProjectResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid request data",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ValidationErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error"
            )
    })
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
}
