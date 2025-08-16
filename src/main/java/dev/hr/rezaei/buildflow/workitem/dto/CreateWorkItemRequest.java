package dev.hr.rezaei.buildflow.workitem.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

/**
 * CreateWorkItemRequest representing request object for creating new work items.
 * <p>
 * Note: Remember to update the documentation when making changes to this class.
 * <ol>
 *     <li>WorkItem package documentation: "../WorkItemDtos.md"</li>
 *     <li>Base package documentation: "../../Dtos.md"</li>
 * </ol>
 * Instructions for updating the documentation: src/test/resources/instructions/*
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Schema(description = "Request object for creating a new work item")
public class CreateWorkItemRequest {
    @Schema(description = "Unique code identifier for the work item", example = "S1-001")
    @NotBlank(message = "Code is required and cannot be blank")
    private String code;

    @Schema(description = "Display name of the work item", example = "Foundation Preparation")
    @NotBlank(message = "Name is required and cannot be blank")
    private String name;

    @Schema(description = "Detailed description of the work item", example = "Prepare the foundation area including excavation and leveling")
    private String description;

    @Schema(description = "Whether this work item is optional", example = "false")
    private boolean optional;

    @Schema(description = "ID of the user who owns this work item", example = "123e4567-e89b-12d3-a456-426614174000")
    @NotNull(message = "User ID is required")
    private UUID userId;

    @Schema(description = "Default group name for organizing work items", example = "Site Preparation")
    private String defaultGroupName;

    @Schema(description = "Domain/category of the work item", example = "PUBLIC", allowableValues = {"PUBLIC", "PRIVATE"})
    private String domain;
}
