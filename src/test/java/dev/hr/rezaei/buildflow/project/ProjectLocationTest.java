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
        UUID sameId = testProjectLocation.getId();
        ProjectLocation location1 = ProjectLocation.builder()
                .id(sameId)
                .unitNumber(testProjectLocation.getUnitNumber())
                .streetNumberAndName(testProjectLocation.getStreetNumberAndName())
                .city(testProjectLocation.getCity())
                .stateOrProvince(testProjectLocation.getStateOrProvince())
                .postalOrZipCode(testProjectLocation.getPostalOrZipCode())
                .country(testProjectLocation.getCountry())
                .build();
        ProjectLocation randomLocation = createRandomProjectLocation();
        ProjectLocation location2 = ProjectLocation.builder()
                .id(sameId)
                .unitNumber(randomLocation.getUnitNumber())
                .streetNumberAndName(randomLocation.getStreetNumberAndName())
                .city(randomLocation.getCity())
                .stateOrProvince(randomLocation.getStateOrProvince())
                .postalOrZipCode(randomLocation.getPostalOrZipCode())
                .country(randomLocation.getCountry())
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
        ProjectLocation location1 = createRandomProjectLocation();
        location1.setId(UUID.randomUUID());
        ProjectLocation location2 = createRandomProjectLocation();
        location2.setId(UUID.randomUUID());

        // Should not be equal because id is different
        assertNotEquals(location1, location2);
        assertNotEquals(location1.hashCode(), location2.hashCode());
    }
}
