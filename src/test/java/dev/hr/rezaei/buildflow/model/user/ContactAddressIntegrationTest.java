package dev.hr.rezaei.buildflow.model.user;

import dev.hr.rezaei.buildflow.model.AbstractModelJpaTest;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@Slf4j
@DataJpaTest
class ContactAddressIntegrationTest extends AbstractModelJpaTest {

    @Test
    void save_shouldPersist_whenAllFieldsArePresent() {
        ContactAddress savedAddress = contactAddressRepository.save(testContactAddress);
        log.debug("Saved ContactAddress: {}", savedAddress);

        assertNotNull(testContactAddress.getId());
        assertTrue(contactAddressRepository.findById(testContactAddress.getId()).isPresent());
    }
}
