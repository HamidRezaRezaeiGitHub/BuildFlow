package dev.hr.rezaei.buildflow.workitem.dto;

import dev.hr.rezaei.buildflow.workitem.WorkItemDto;
import lombok.Data;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
public class CreateWorkItemResponse {
    private WorkItemDto workItemDto;
}