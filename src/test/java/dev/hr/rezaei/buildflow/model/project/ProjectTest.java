package dev.hr.rezaei.buildflow.model.project;

import dev.hr.rezaei.buildflow.model.AbstractModelTest;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class ProjectTest extends AbstractModelTest {
    @Test
    void toString_shouldNotThrow_whenNoCycle() {
        assertDoesNotThrow(testProject::toString);
    }

    @Test
    void equals_shouldReturnTrue_forSameId() {
        Project p1 = Project.builder()
                .id(testProject.getId())
                .builderUser(testProject.getBuilderUser())
                .owner(testProject.getOwner())
                .location(testProject.getLocation())
                .estimates(testProject.getEstimates())
                .build();
        Project p2 = Project.builder()
                .id(testProject.getId())
                .builderUser(testProject.getBuilderUser())
                .owner(testProject.getOwner())
                .location(testProject.getLocation())
                .estimates(testProject.getEstimates())
                .build();
        assertDoesNotThrow(() -> p1.equals(p2));
        assertDoesNotThrow(() -> p2.equals(p1));
        assertDoesNotThrow(p1::hashCode);
        assertDoesNotThrow(p2::hashCode);
        assertEquals(p1, p2);
        assertEquals(p1.hashCode(), p2.hashCode());
    }

    @Test
    void equals_shouldReturnFalse_forDifferentId() {
        Project p1 = Project.builder()
                .id(UUID.randomUUID())
                .builderUser(testProject.getBuilderUser())
                .owner(testProject.getOwner())
                .location(testProject.getLocation())
                .estimates(testProject.getEstimates())
                .build();
        Project p2 = Project.builder()
                .id(UUID.randomUUID())
                .builderUser(testProject.getBuilderUser())
                .owner(testProject.getOwner())
                .location(testProject.getLocation())
                .estimates(testProject.getEstimates())
                .build();
        assertNotEquals(p1, p2);
        assertNotEquals(p1.hashCode(), p2.hashCode());
    }
}
