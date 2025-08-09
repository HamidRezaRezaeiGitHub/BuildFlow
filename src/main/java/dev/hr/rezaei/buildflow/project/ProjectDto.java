package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.base.UpdatableEntityDto;
import dev.hr.rezaei.buildflow.dto.Dto;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Data
@SuperBuilder
public class ProjectDto extends UpdatableEntityDto implements Dto<Project> {
    private UUID id;
    private UUID builderUserId;
    private UUID ownerId;
    private ProjectLocationDto locationDto;
}

