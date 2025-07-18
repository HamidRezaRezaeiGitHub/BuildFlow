package dev.hr.rezaei.buildflow.model.estimate;

import dev.hr.rezaei.buildflow.model.workitem.WorkItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstimateLine {
    private UUID id;
    private Estimate estimate;
    private WorkItem workItem;
    private double quantity;
    private QuoteStrategy quoteStrategy;
    private double multiplier;
    private BigDecimal computedCost;
}

