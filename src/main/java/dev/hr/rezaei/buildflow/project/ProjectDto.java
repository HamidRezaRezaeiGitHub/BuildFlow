package dev.hr.rezaei.buildflow.project;

import com.fasterxml.jackson.annotation.JsonProperty;
import dev.hr.rezaei.buildflow.base.UpdatableEntityDto;
import dev.hr.rezaei.buildflow.dto.Dto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

/**
 * ProjectDto representing project information for API responses.
 * <p>
 * Note: Remember to update the documentation when making changes to this class.
 * <ol>
 *     <li>Project package documentation: "ProjectDtos.md"</li>
 *     <li>Base package documentation: "../Dtos.md"</li>
 * </ol>
 * Instructions for updating the documentation: src/test/resources/instructions/*
 */
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDto extends UpdatableEntityDto implements Dto<Project> {
    
    @Schema(description = "Unique identifier of the project", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;
    
    @Schema(description = "User ID who created/owns the project", example = "123e4567-e89b-12d3-a456-426614174001")
    private UUID userId;
    
    @Schema(description = "Role of the main user in the project", example = "BUILDER")
    private String role;
    
    @JsonProperty("location")
    @Schema(description = "Location information for the project")
    private ProjectLocationDto locationDto;
}
