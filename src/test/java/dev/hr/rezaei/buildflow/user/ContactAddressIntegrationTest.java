package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.AbstractModelJpaTest;
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
        ContactAddress savedAddress = contactAddressRepository.save(testBuilderUserContactAddress);
        log.debug("Saved ContactAddress: {}", savedAddress);

        assertNotNull(testBuilderUserContactAddress.getId());
        assertTrue(contactAddressRepository.findById(testBuilderUserContactAddress.getId()).isPresent());
    }
}
