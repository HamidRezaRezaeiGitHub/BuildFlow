package dev.hr.rezaei.buildflow.model.contact;

import dev.hr.rezaei.buildflow.model.address.Address;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class ContactRepositoryTest {

    @Autowired
    private ContactRepository contactRepository;

    private Contact contact;

    @BeforeEach
    void setUp() {
        Address address = Address.builder()
                .unitNumber("1A")
                .streetNumber("101")
                .streetName("First Ave")
                .city("Metropolis")
                .stateOrProvince("NY")
                .postalCode("10001")
                .country("USA")
                .build();
        contact = Contact.builder()
                .firstName("Clark")
                .lastName("Kent")
                .labels(new ArrayList<>(List.of(ContactLabel.OWNER, ContactLabel.BUILDER)))
                .email("clark.kent@dailyplanet.com")
                .phone("555-1234")
                .notes("Superman")
                .address(address)
                .build();
    }

    @AfterEach
    void tearDown() {
        contactRepository.deleteAll();
    }

    @Test
    void save_shouldPersistContact_whenContactIsValid() {
        Contact saved = contactRepository.save(contact);
        Optional<Contact> found = contactRepository.findById(saved.getId());
        assertTrue(found.isPresent());
        assertEquals("Clark", found.get().getFirstName());
        assertEquals("Kent", found.get().getLastName());
        assertEquals("clark.kent@dailyplanet.com", found.get().getEmail());
        assertEquals(List.of(ContactLabel.OWNER, ContactLabel.BUILDER), found.get().getLabels());
    }

    @Test
    void save_shouldUpdateContact_whenEmailIsChanged() {
        Contact saved = contactRepository.save(contact);
        saved.setEmail("superman@justiceleague.com");
        Contact updated = contactRepository.save(saved);
        assertEquals("superman@justiceleague.com", updated.getEmail());
    }

    @Test
    void deleteById_shouldRemoveContact_whenContactExists() {
        Contact saved = contactRepository.save(contact);
        contactRepository.deleteById(saved.getId());
        Optional<Contact> found = contactRepository.findById(saved.getId());
        assertFalse(found.isPresent());
    }

    @Test
    void findAll_shouldReturnAllContacts_whenMultipleContactsExist() {
        contactRepository.save(contact);
        Address address2 = Address.builder()
                .unitNumber("2B")
                .streetNumber("202")
                .streetName("Second Ave")
                .city("Gotham")
                .stateOrProvince("NJ")
                .postalCode("07001")
                .country("USA")
                .build();
        Contact contact2 = Contact.builder()
                .firstName("Bruce")
                .lastName("Wayne")
                .labels(new ArrayList<>(List.of(ContactLabel.OWNER)))
                .email("bruce.wayne@wayneenterprises.com")
                .phone("555-5678")
                .notes("Batman")
                .address(address2)
                .build();
        contactRepository.save(contact2);
        assertEquals(2, contactRepository.findAll().size());
    }
}
