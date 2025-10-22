package dev.hr.rezaei.buildflow.estimate;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty("estimateLines")
    private Set<EstimateLineDto> estimateLineDtos;
}

