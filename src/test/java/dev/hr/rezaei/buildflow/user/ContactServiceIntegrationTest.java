package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.AbstractModelJpaTest;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

import static org.junit.jupiter.api.Assertions.*;

@Slf4j
@DataJpaTest
class ContactServiceIntegrationTest extends AbstractModelJpaTest {

    @TestConfiguration
    static class ContactServiceTestConfig {
        @Bean
        public ContactService contactService(ContactRepository contactRepository) {
            return new ContactService(contactRepository);
        }
    }

    @Autowired
    private ContactService contactService;

    @Test
    void save_shouldPersistContact() {
        Contact saved = contactRepository.save(testBuilderUserContact);
        log.debug("Saved contact: {}", saved);

        assertNotNull(saved.getId());
        assertTrue(contactService.isPersisted(saved));
    }

    @Test
    void update_shouldThrow_whenContactIsNotPersisted() {
        assertThrows(IllegalArgumentException.class, () -> contactService.update(testBuilderUserContact));
    }

    @Test
    void update_shouldPersistChanges_whenContactIsPersisted() {
        Contact saved = contactRepository.save(testBuilderUserContact);

        saved.setFirstName("Updated");
        Contact updated = contactService.update(saved);

        assertEquals("Updated", updated.getFirstName());
    }

    @Test
    void delete_shouldThrow_whenContactIsNotPersisted() {
        assertThrows(IllegalArgumentException.class, () -> contactService.delete(testBuilderUserContact));
    }

    @Test
    void delete_shouldRemoveContact_whenContactIsPersisted() {
        Contact saved = contactRepository.save(testBuilderUserContact);
        contactService.delete(saved);

        assertFalse(contactRepository.existsById(saved.getId()));
    }

    @Test
    void save_shouldPersistContact_whenEmailIsUnique() {
        Contact saved = contactService.save(testBuilderUserContact);

        assertNotNull(saved.getId());
        assertTrue(contactService.isPersisted(saved));
    }

    @Test
    void save_shouldThrow_whenEmailIsDuplicate() {
        contactService.save(testBuilderUserContact);
        Contact duplicate = Contact.builder()
                .firstName("Duplicate")
                .lastName("User")
                .email(testBuilderUserContact.getEmail())
                .address(testBuilderUserContact.getAddress())
                .labels(testBuilderUserContact.getLabels())
                .build();
        assertThrows(RuntimeException.class, () -> contactService.save(duplicate));
    }

    @Test
    void existsByEmail_shouldReturnTrue_whenContactExists() {
        contactRepository.save(testBuilderUserContact);
        assertTrue(contactService.existsByEmail(testBuilderUserContact.getEmail()));
    }

    @Test
    void existsByEmail_shouldReturnFalse_whenContactDoesNotExist() {
        Contact randomContact = createRandomContact();
        assertFalse(contactService.existsByEmail(randomContact.getEmail()));
    }

    @Test
    void findByEmail_shouldReturnContact_whenExists() {
        Contact saved = contactRepository.save(testBuilderUserContact);
        assertTrue(contactService.findByEmail(saved.getEmail()).isPresent());
    }

    @Test
    void findByEmail_shouldReturnEmpty_whenNotExists() {
        Contact randomContact = createRandomContact();
        assertTrue(contactService.findByEmail(randomContact.getEmail()).isEmpty());
    }
}
