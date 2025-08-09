package dev.hr.rezaei.buildflow.estimate;

import dev.hr.rezaei.buildflow.project.Project;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.HashSet;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

class EstimateTest {

    private Project project;
    private Estimate estimate;

    @BeforeEach
    void setUp() {
        project = Mockito.mock(Project.class);
        estimate = Estimate.builder()
                .project(project)
                .overallMultiplier(1.0)
                .groups(new HashSet<>())
                .build();
    }

    @Test
    void toString_shouldNotThrow_whenNoCycle() {
        assertDoesNotThrow(estimate::toString);
    }
}
