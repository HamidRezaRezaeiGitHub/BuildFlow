package dev.hr.rezaei.buildflow.project.dto;

import dev.hr.rezaei.buildflow.project.ProjectDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.experimental.SuperBuilder;

/**
 * CreateProjectResponse representing response object containing created project information.
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
@Schema(description = "Response object containing the created project information")
public class CreateProjectResponse {
    @Schema(description = "The created project details")
    private ProjectDto projectDto;
}
