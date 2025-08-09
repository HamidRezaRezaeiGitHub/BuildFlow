package dev.hr.rezaei.buildflow.estimate;

import dev.hr.rezaei.buildflow.workitem.WorkItem;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

class EstimateLineTest {
    private Estimate estimate;
    private WorkItem workItem;
    private EstimateLine line;

    @BeforeEach
    void setUp() {
        estimate = Mockito.mock(Estimate.class);
        workItem = Mockito.mock(WorkItem.class);

        line = EstimateLine.builder()
                .estimate(estimate)
                .workItem(workItem)
                .quantity(1.0)
                .estimateStrategy(EstimateLineStrategy.AVERAGE)
                .multiplier(1.0)
                .computedCost(BigDecimal.ONE)
                .build();
    }

    @Test
    void toString_shouldNotThrow_whenNoCycle() {
        assertDoesNotThrow(line::toString);
    }
}
