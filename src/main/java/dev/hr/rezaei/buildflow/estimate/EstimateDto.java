package dev.hr.rezaei.buildflow.estimate;

import com.fasterxml.jackson.annotation.JsonProperty;
import dev.hr.rezaei.buildflow.base.UpdatableEntityDto;
import dev.hr.rezaei.buildflow.dto.Dto;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.util.Set;
import java.util.UUID;

@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
@Data
@SuperBuilder
public class EstimateDto extends UpdatableEntityDto implements Dto<Estimate> {
    private UUID id;
    private UUID projectId;
    private double overallMultiplier;
    
    @JsonProperty("groups")
    private Set<EstimateGroupDto> groupDtos;
}

