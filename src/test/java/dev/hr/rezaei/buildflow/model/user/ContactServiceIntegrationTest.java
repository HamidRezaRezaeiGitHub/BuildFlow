package dev.hr.rezaei.buildflow.model.user;

import dev.hr.rezaei.buildflow.model.AbstractModelJpaTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class ContactServiceIntegrationTest extends AbstractModelJpaTest {

    @Autowired
    private ContactService contactService;

    @Test
    void save_shouldPersistContact() {
        Contact saved = contactRepository.save(testContact);
        assertNotNull(saved.getId());
        assertTrue(contactService.isPersisted(saved));
    }

    @Test
    void findById_shouldReturnContact_whenPersisted() {
        Contact saved = contactRepository.save(testContact);
        Optional<Contact> found = contactService.findById(saved.getId());
        assertTrue(found.isPresent());
        assertEquals(saved.getId(), found.get().getId());
    }

    @Test
    void update_shouldThrow_whenContactIsNotPersisted() {
        assertThrows(IllegalArgumentException.class, () -> contactService.update(testContact));
    }

    @Test
    void update_shouldPersistChanges_whenContactIsPersisted() {
        Contact saved = contactRepository.save(testContact);
        saved.setFirstName("Updated");
        Contact updated = contactService.update(saved);
        assertEquals("Updated", updated.getFirstName());
    }

    @Test
    void delete_shouldThrow_whenContactIsNotPersisted() {
        assertThrows(IllegalArgumentException.class, () -> contactService.delete(testContact));
    }

    @Test
    void delete_shouldRemoveContact_whenContactIsPersisted() {
        Contact saved = contactRepository.save(testContact);
        contactService.delete(saved);
        assertFalse(contactRepository.existsById(saved.getId()));
    }
}
