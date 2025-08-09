package dev.hr.rezaei.buildflow.workitem;

import dev.hr.rezaei.buildflow.base.UpdatableEntityDto;
import dev.hr.rezaei.buildflow.dto.Dto;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
@Data
@SuperBuilder
public class WorkItemDto extends UpdatableEntityDto implements Dto<WorkItem> {
    private UUID id;
    private String code;
    private String name;
    private String description;
    private boolean optional;
    private UUID userId;
    private String defaultGroupName;
    private String domain;
}
