package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.AbstractModelJpaTest;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@Slf4j
@DataJpaTest
class ProjectLocationIntegrationTest extends AbstractModelJpaTest {
    @Test
    void save_shouldPersist_whenAllFieldsArePresent() {
        ProjectLocation savedLocation = projectLocationRepository.save(testProjectLocation);
        log.debug("Saved ProjectLocation: {}", savedLocation);

        assertNotNull(testProjectLocation.getId());
        assertTrue(projectLocationRepository.findById(testProjectLocation.getId()).isPresent());
    }
}
