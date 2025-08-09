package dev.hr.rezaei.buildflow.estimate;

import dev.hr.rezaei.buildflow.dto.Dto;
import lombok.Data;
import lombok.NonNull;
import lombok.experimental.SuperBuilder;

import java.util.Set;
import java.util.UUID;

@Data
@SuperBuilder
public class EstimateGroupDto implements Dto<EstimateGroup> {
    private UUID id;
    private UUID workItemId;
    private String name;
    private String description;
    @NonNull
    private Set<EstimateLineDto> estimateLineDtos;
}

