package dev.hr.rezaei.buildflow.project;

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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static dev.hr.rezaei.buildflow.project.ProjectParticipantDtoMapper.toProjectParticipantDto;
import static dev.hr.rezaei.buildflow.user.ContactDtoMapper.toContactEntity;

/**
 * ProjectParticipantController handles sub-resource endpoints for project participants.
 * All endpoints are scoped under /api/v1/projects/{projectId}/participants.
 * 
 * Note: Pagination is not needed for participants since the number per project is expected to be small.
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

    @Operation(summary = "List participants for a project", description = "Retrieves all participants for a specific project")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Participants retrieved successfully",
                    content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = ProjectParticipantDto.class))))
    })
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAuthority('VIEW_PROJECT') and @participantAuthService.isViewParticipantsAuthorized(#projectId)")
    @GetMapping
    public ResponseEntity<List<ProjectParticipantDto>> getParticipants(
            @Parameter(description = "ID of the project whose participants to retrieve")
            @PathVariable UUID projectId
    ) {
        log.info("Getting participants for project ID: {}", projectId);
        
        List<ProjectParticipant> participants = participantService.findByProjectId(projectId);
        List<ProjectParticipantDto> participantDtos = participants.stream()
                .map(ProjectParticipantDtoMapper::toProjectParticipantDto)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(participantDtos);
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
        
        return ResponseEntity.ok(toProjectParticipantDto(participant));
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
        return ResponseEntity.status(HttpStatus.CREATED).body(toProjectParticipantDto(participant));
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
        return ResponseEntity.ok(toProjectParticipantDto(updated));
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
}