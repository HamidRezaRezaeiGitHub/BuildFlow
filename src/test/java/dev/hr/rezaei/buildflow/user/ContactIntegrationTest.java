package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.AbstractModelJpaTest;
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
        Contact savedContact = contactRepository.save(testBuilderUserContact);
        log.debug("Saved Contact: {}", savedContact);

        assertNotNull(testBuilderUserContact.getId());
        assertTrue(contactRepository.findById(testBuilderUserContact.getId()).isPresent());
    }

}
