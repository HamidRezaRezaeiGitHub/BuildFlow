package dev.hr.rezaei.buildflow.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

/**
 * CreateProjectRequest representing request object for creating new projects.
 * <p>
 * Note: Remember to update the documentation when making changes to this class.
 * <ol>
 *     <li>Project package documentation: "ProjectDtos.md"</li>
 *     <li>Base package documentation: "../Dtos.md"</li>
 * </ol>
 * Instructions for updating the documentation: src/test/resources/instructions/*
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request object for creating a new project")
public class CreateProjectRequest {

    @Schema(description = "ID of the user making the request", example = "123e4567-e89b-12d3-a456-426614174000")
    @NotNull(message = "This user ID is required")
    private UUID userId;

    @Schema(description = "Flag indicating if the requesting user is the builder", example = "true")
    @NotNull(message = "isThisUserBuilder flag is required")
    @Builder.Default
    private boolean isBuilder = true;

    @Schema(description = "Location information for the project")
    @Valid
    @NotNull(message = "Location information is required")
    private ProjectLocationRequestDto locationRequestDto;
}
