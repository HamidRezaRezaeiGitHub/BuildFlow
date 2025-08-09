package dev.hr.rezaei.buildflow.estimate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.HashSet;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

class EstimateGroupTest {
    private Estimate estimate;
    private EstimateGroup group;

    @BeforeEach
    void setUp() {
        estimate = Mockito.mock(Estimate.class);
        group = EstimateGroup.builder()
                .name("Group")
                .estimate(estimate)
                .estimateLines(new HashSet<>())
                .build();
    }

    @Test
    void toString_shouldNotThrow_whenNoCycle() {
        assertDoesNotThrow(group::toString);
    }
}
