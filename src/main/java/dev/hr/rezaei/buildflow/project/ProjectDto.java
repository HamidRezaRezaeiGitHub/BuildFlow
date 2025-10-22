package dev.hr.rezaei.buildflow.project;

import com.fasterxml.jackson.annotation.JsonProperty;
import dev.hr.rezaei.buildflow.base.UpdatableEntityDto;
import dev.hr.rezaei.buildflow.dto.Dto;
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
    private UUID id;
    private UUID builderId;
    private UUID ownerId;
    
    @JsonProperty("location")
    private ProjectLocationDto locationDto;
}
