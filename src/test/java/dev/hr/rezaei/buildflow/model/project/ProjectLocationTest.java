package dev.hr.rezaei.buildflow.model.project;

import dev.hr.rezaei.buildflow.model.AbstractModelTest;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

public class ProjectLocationTest extends AbstractModelTest {
    @Test
    void toString_shouldNotThrow() {
        assertDoesNotThrow(() -> testProjectLocation.toString());
    }
}
