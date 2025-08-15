package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.AbstractModelTest;
import dev.hr.rezaei.buildflow.project.Project;
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
        UUID sameId = testProject.getId();
        Project randomProject = createRandomProject();
        Project p1 = Project.builder()
                .id(sameId)
                .builderUser(testProject.getBuilderUser())
                .owner(testProject.getOwner())
                .location(testProject.getLocation())
                .estimates(testProject.getEstimates())
                .build();
        Project p2 = Project.builder()
                .id(sameId)
                .builderUser(randomProject.getBuilderUser())
                .owner(randomProject.getOwner())
                .location(randomProject.getLocation())
                .estimates(randomProject.getEstimates())
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
        Project p1 = createRandomProject();
        p1.setId(UUID.randomUUID());
        Project p2 = createRandomProject();
        p2.setId(UUID.randomUUID());

        assertNotEquals(p1, p2);
        assertNotEquals(p1.hashCode(), p2.hashCode());
    }
}
