package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.base.BaseAddressDto;
import dev.hr.rezaei.buildflow.dto.Dto;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

/**
 * ProjectLocationDto representing project location information for API responses.
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
public class ProjectLocationDto extends BaseAddressDto implements Dto<ProjectLocation> {
    private UUID id;
}
