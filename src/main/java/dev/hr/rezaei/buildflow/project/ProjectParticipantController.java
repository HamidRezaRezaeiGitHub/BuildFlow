package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.project.ParticipantNotFoundException;
import dev.hr.rezaei.buildflow.config.mvc.PaginationHelper;
import dev.hr.rezaei.buildflow.project.dto.CreateProjectParticipantRequest;
import dev.hr.rezaei.buildflow.user.Contact;
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
import static dev.hr.rezaei.buildflow.user.ContactDtoMapper.toContactEntity;

/**
 * ProjectParticipantController handles sub-resource endpoints for project participants.
 * All endpoints are scoped under /api/v1/projects/{projectId}/participants.
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/projects/{projectId}/participants")
@RequiredArgsConstructor
@Tag(name = "Project Participants", description = "API endpoints for managing project participants")
public class ProjectParticipantController {

    @SuppressWarnings("unused")
    private final ProjectParticipantAuthService participantAuthService;
    private final ProjectParticipantService participantService;

    // Pagination helper configured with participant-specific sort fields
    private final PaginationHelper paginationHelper = new PaginationHelper(
        Set.of("contact.id", "role"),
        "contact.id",
        Sort.Direction.ASC
    );

    @Operation(summary = "List participants for a project", description = "Retrieves all participants for a specific project with pagination support")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Participants retrieved successfully",
                    content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = ProjectParticipantDto.class))))
    })
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAuthority('VIEW_PROJECT') and @participantAuthService.isViewParticipantsAuthorized(#projectId)")
    @GetMapping
    public ResponseEntity<List<ProjectParticipantDto>> getParticipants(
            @Parameter(description = "ID of the project whose participants to retrieve")
            @PathVariable UUID projectId,
            @Parameter(description = "Page number (0-based, default: 0)")
            @RequestParam(required = false) Integer page,
            @Parameter(description = "Page size (default: 25)")
            @RequestParam(required = false) Integer size,
            @Parameter(description = "Sort specification (e.g., 'contact.id,ASC')")
            @RequestParam(required = false) String[] sort,
            @Parameter(description = "Order by field (alternative to sort)")
            @RequestParam(required = false) String orderBy,
            @Parameter(description = "Sort direction (ASC or DESC, used with orderBy)")
            @RequestParam(required = false) String direction
    ) {
        log.info("Getting participants for project ID: {} with pagination", projectId);
        
        Pageable pageable = paginationHelper.createPageable(page, size, sort, orderBy, direction);
        Page<ProjectParticipant> participantPage = participantService.getParticipantsByProjectId(projectId, pageable);
        Page<ProjectParticipantDto> participantDtoPage = participantPage.map(this::toDto);
        
        return build(participantDtoPage, "/api/v1/projects/" + projectId + "/participants");
    }

    @Operation(summary = "Get a specific participant", description = "Retrieves a specific participant by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Participant retrieved successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ProjectParticipantDto.class))),
            @ApiResponse(responseCode = "404", description = "Participant not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAuthority('VIEW_PROJECT') and @participantAuthService.isViewParticipantsAuthorized(#projectId)")
    @GetMapping("/{participantId}")
    public ResponseEntity<ProjectParticipantDto> getParticipant(
            @Parameter(description = "ID of the project")
            @PathVariable UUID projectId,
            @Parameter(description = "ID of the participant to retrieve")
            @PathVariable UUID participantId
    ) {
        log.info("Getting participant ID: {} for project ID: {}", participantId, projectId);
        
        ProjectParticipant participant = participantService.findById(participantId)
                .orElseThrow(() -> new ParticipantNotFoundException("Participant with ID " + participantId + " not found"));
        
        // Verify participant belongs to the requested project
        if (!participant.getProject().getId().equals(projectId)) {
            throw new IllegalArgumentException("Participant " + participantId + " does not belong to project " + projectId);
        }
        
        return ResponseEntity.ok(toDto(participant));
    }

    @Operation(summary = "Create a new participant", description = "Adds a new participant to the project")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Participant created successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ProjectParticipantDto.class)))
    })
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAuthority('CREATE_PROJECT') and @participantAuthService.isCreateParticipantAuthorized(#projectId)")
    @PostMapping
    public ResponseEntity<ProjectParticipantDto> createParticipant(
            @Parameter(description = "ID of the project")
            @PathVariable UUID projectId,
            @Parameter(description = "Participant creation request")
            @Valid @RequestBody CreateProjectParticipantRequest request
    ) {
        log.info("Creating participant for project ID: {} with request: {}", projectId, request);
        
        // Map ContactRequestDto to Contact entity
        Contact contact = toContactEntity(request.getContactRequestDto());
        
        ProjectParticipant participant = participantService.createParticipant(
                projectId, 
                contact, 
                request.getRole()
        );
        
        log.info("Successfully created participant with ID: {} for project ID: {}", participant.getId(), projectId);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(participant));
    }

    @Operation(summary = "Update a participant", description = "Updates an existing participant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Participant updated successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ProjectParticipantDto.class))),
            @ApiResponse(responseCode = "404", description = "Participant not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAuthority('EDIT_PROJECT') and @participantAuthService.isModifyParticipantAuthorized(#projectId)")
    @PutMapping("/{participantId}")
    public ResponseEntity<ProjectParticipantDto> updateParticipant(
            @Parameter(description = "ID of the project")
            @PathVariable UUID projectId,
            @Parameter(description = "ID of the participant to update")
            @PathVariable UUID participantId,
            @Parameter(description = "Participant update request")
            @Valid @RequestBody CreateProjectParticipantRequest request
    ) {
        log.info("Updating participant ID: {} for project ID: {} with request: {}", participantId, projectId, request);
        
        // Verify participant exists and belongs to project
        ProjectParticipant existing = participantService.findById(participantId)
                .orElseThrow(() -> new ParticipantNotFoundException("Participant with ID " + participantId + " not found"));
        
        if (!existing.getProject().getId().equals(projectId)) {
            throw new IllegalArgumentException("Participant " + participantId + " does not belong to project " + projectId);
        }
        
        // Map ContactRequestDto to Contact entity
        Contact contact = toContactEntity(request.getContactRequestDto());
        
        ProjectParticipant updated = participantService.updateParticipant(
                participantId, 
                contact, 
                request.getRole()
        );
        
        log.info("Successfully updated participant ID: {}", participantId);
        return ResponseEntity.ok(toDto(updated));
    }

    @Operation(summary = "Delete a participant", description = "Removes a participant from the project")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Participant deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Participant not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAuthority('DELETE_PROJECT') and @participantAuthService.isDeleteParticipantAuthorized(#projectId)")
    @DeleteMapping("/{participantId}")
    public ResponseEntity<Void> deleteParticipant(
            @Parameter(description = "ID of the project")
            @PathVariable UUID projectId,
            @Parameter(description = "ID of the participant to delete")
            @PathVariable UUID participantId
    ) {
        log.info("Deleting participant ID: {} from project ID: {}", participantId, projectId);
        
        // Verify participant exists and belongs to project
        ProjectParticipant existing = participantService.findById(participantId)
                .orElseThrow(() -> new ParticipantNotFoundException("Participant with ID " + participantId + " not found"));
        
        if (!existing.getProject().getId().equals(projectId)) {
            throw new IllegalArgumentException("Participant " + participantId + " does not belong to project " + projectId);
        }
        
        participantService.deleteParticipant(participantId);
        
        log.info("Successfully deleted participant ID: {}", participantId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Map ProjectParticipant entity to DTO.
     */
    private ProjectParticipantDto toDto(ProjectParticipant participant) {
        return ProjectParticipantDto.builder()
                .id(participant.getId())
                .role(participant.getRole() != null ? participant.getRole().name() : null)
                .contactId(participant.getContact() != null ? participant.getContact().getId() : null)
                .build();
    }
}
