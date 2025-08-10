package dev.hr.rezaei.buildflow.workitem.dto;

import lombok.Data;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Data
@SuperBuilder
public class CreateWorkItemRequest {
    private String code;
    private String name;
    private String description;
    private boolean optional;
    private UUID userId;
    private String defaultGroupName;
    private String domain;
}
