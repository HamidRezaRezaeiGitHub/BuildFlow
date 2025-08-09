package dev.hr.rezaei.buildflow.estimate;

import dev.hr.rezaei.buildflow.base.UpdatableEntityDto;
import dev.hr.rezaei.buildflow.dto.Dto;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Data
@SuperBuilder
public class EstimateLineDto extends UpdatableEntityDto implements Dto<EstimateLine> {
    private UUID id;
    private UUID workItemId;
    private double quantity;
    private String estimateStrategy;
    private double multiplier;
    private BigDecimal computedCost;
}

