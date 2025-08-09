package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.AbstractModelTest;
import dev.hr.rezaei.buildflow.project.ProjectLocation;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

public class ProjectLocationTest extends AbstractModelTest {
    @Test
    void toString_shouldNotThrow() {
        assertDoesNotThrow(() -> testProjectLocation.toString());
    }

    @Test
    void equals_shouldReturnTrue_forSameId() {
        ProjectLocation location1 = ProjectLocation.builder()
                .id(testProjectLocation.getId())
                .unitNumber("1")
                .streetNumber("100")
                .streetName("Main St")
                .city("Testville")
                .stateOrProvince("TS")
                .postalOrZipCode("12345")
                .country("Testland")
                .build();
        ProjectLocation location2 = ProjectLocation.builder()
                .id(testProjectLocation.getId())
                .unitNumber("2")
                .streetNumber("200")
                .streetName("Other St")
                .city("Otherville")
                .stateOrProvince("OS")
                .postalOrZipCode("54321")
                .country("Otherland")
                .build();
        // Should be equal because id is the same
        assertDoesNotThrow(() -> location1.equals(location2));
        assertDoesNotThrow(() -> location2.equals(location1));
        assertDoesNotThrow(location1::hashCode);
        assertDoesNotThrow(location2::hashCode);
        assertEquals(location1, location2);
        assertEquals(location1.hashCode(), location2.hashCode());
    }

    @Test
    void equals_shouldReturnFalse_forDifferentId() {
        ProjectLocation location1 = ProjectLocation.builder()
                .id(UUID.randomUUID())
                .unitNumber("1")
                .streetNumber("100")
                .streetName("Main St")
                .city("Testville")
                .stateOrProvince("TS")
                .postalOrZipCode("12345")
                .country("Testland")
                .build();
        ProjectLocation location2 = ProjectLocation.builder()
                .id(UUID.randomUUID())
                .unitNumber("1")
                .streetNumber("100")
                .streetName("Main St")
                .city("Testville")
                .stateOrProvince("TS")
                .postalOrZipCode("12345")
                .country("Testland")
                .build();
        // Should not be equal because id is different
        assertNotEquals(location1, location2);
        assertNotEquals(location1.hashCode(), location2.hashCode());
    }
}
