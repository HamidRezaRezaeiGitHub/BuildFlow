package dev.hr.rezaei.buildflow.model.user;

import dev.hr.rezaei.buildflow.model.AbstractModelJpaTest;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@Slf4j
@DataJpaTest
class ContactIntegrationTest extends AbstractModelJpaTest {

    @Test
    void save_shouldPersist_whenAllMandatoryFieldsArePresent() {
        Contact savedContact = contactRepository.save(testContact);
        log.debug("Saved Contact: {}", savedContact);

        assertNotNull(testContact.getId());
        assertTrue(contactRepository.findById(testContact.getId()).isPresent());
    }

}
