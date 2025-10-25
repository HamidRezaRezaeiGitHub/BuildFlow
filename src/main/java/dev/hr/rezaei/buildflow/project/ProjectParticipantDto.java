package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.dto.Dto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.UUID;

/**
 * ProjectParticipantDto representing participant information for API responses.
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
@Schema(description = "Project participant information")
public class ProjectParticipantDto implements Dto<ProjectParticipant> {
    
    @Schema(description = "Unique identifier of the participant", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;
    
    @Schema(description = "Role of the participant in the project", example = "OWNER")
    private String role;
    
    @Schema(description = "Contact ID of the participant", example = "123e4567-e89b-12d3-a456-426614174001")
    private UUID contactId;
}
