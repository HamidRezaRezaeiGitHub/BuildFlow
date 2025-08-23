package dev.hr.rezaei.buildflow.workitem;

import dev.hr.rezaei.buildflow.base.UserNotFoundException;
import dev.hr.rezaei.buildflow.config.mvc.dto.ErrorResponse;
import dev.hr.rezaei.buildflow.workitem.dto.CreateWorkItemRequest;
import dev.hr.rezaei.buildflow.workitem.dto.CreateWorkItemResponse;
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
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@Slf4j
@RestController
@RequestMapping("/api/v1/work-items")
@RequiredArgsConstructor
@Tag(name = "Work Item Management", description = "API endpoints for managing construction work items")
public class WorkItemController {

    private final WorkItemService workItemService;

    @Operation(summary = "Create a new work item", description = "Creates a new work item with code, name, description, and user assignment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Work item created successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = CreateWorkItemResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request data",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "User not found",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping
    public ResponseEntity<CreateWorkItemResponse> createWorkItem(
            @Parameter(description = "Work item creation request containing code, name, description, and user information")
            @Valid @RequestBody CreateWorkItemRequest request
    ) {
        log.info("Creating work item with request: {}", request);

        try {
            CreateWorkItemResponse response = workItemService.createWorkItem(request);
            log.info("Successfully created work item with ID: {}", response.getWorkItemDto().getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Get work items by user ID", description = "Retrieves all work items assigned to a specific user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Work items retrieved successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = WorkItemDto.class))),
            @ApiResponse(responseCode = "404", description = "User not found",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WorkItemDto>> getWorkItemsByUserId(
            @Parameter(description = "ID of the user whose work items to retrieve")
            @PathVariable UUID userId
    ) {
        log.info("Getting work items for user ID: {}", userId);

        try {
            List<WorkItemDto> workItemDtos = workItemService.getByUserId(userId);
            log.info("Found {} work items for user ID: {}", workItemDtos.size(), userId);
            return ResponseEntity.ok(workItemDtos);
        } catch (UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Get work items by domain", description = "Retrieves all work items within a specific domain (PUBLIC or PRIVATE)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Work items retrieved successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = WorkItemDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid domain parameter",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/domain/{domain}")
    public ResponseEntity<List<WorkItemDto>> getWorkItemsByDomain(
            @Parameter(description = "Domain to filter work items by (PUBLIC or PRIVATE)")
            @PathVariable String domain
    ) {
        log.info("Getting work items for domain: {}", domain);

        try {
            List<WorkItemDto> workItemDtos = workItemService.getByDomain(domain);

            log.info("Found {} work items for domain: {}", workItemDtos.size(), domain);
            return ResponseEntity.ok(workItemDtos);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
