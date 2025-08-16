package dev.hr.rezaei.buildflow.workitem.dto;

import dev.hr.rezaei.buildflow.workitem.WorkItemDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * CreateWorkItemResponse representing response object containing created work item information.
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
@Schema(description = "Response object containing the created work item information")
public class CreateWorkItemResponse {
    @Schema(description = "The created work item details")
    private WorkItemDto workItemDto;
}