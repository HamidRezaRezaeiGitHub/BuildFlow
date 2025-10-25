package dev.hr.rezaei.buildflow.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * CreateProjectParticipantRequest representing request object for adding participants to a project.
 * <p>
 * Note: Remember to update the documentation when making changes to this class.
 * <ol>
 *     <li>Project package documentation: "ProjectDtos.md"</li>
 *     <li>Base package documentation: "../Dtos.md"</li>
 * </ol>
 * Instructions for updating the documentation: src/test/resources/instructions/*
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request object for adding a participant to a project")
public class CreateProjectParticipantRequest {

    @Schema(description = "Role of the participant in the project (BUILDER or OWNER)", example = "OWNER")
    @NotNull(message = "Role is required")
    private String role;

    @Schema(description = "Contact ID of the participant", example = "123e4567-e89b-12d3-a456-426614174001")
    @NotNull(message = "Contact ID is required")
    private UUID contactId;
}
