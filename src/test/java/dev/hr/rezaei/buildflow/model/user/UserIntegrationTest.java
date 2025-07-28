package dev.hr.rezaei.buildflow.model.user;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class UserIntegrationTest {
    @Autowired
    private UserRepository userRepository;

    @PersistenceContext
    private EntityManager entityManager;

    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .username("testuser")
                .email("testuser@example.com")
                .registered(true)
                .contact(Contact.builder()
                        .firstName("Test")
                        .lastName("User")
                        .email("testuser@example.com")
                        .phone("1234567890")
                        .address(ContactAddress.builder()
                                .unitNumber("1")
                                .streetNumber("100")
                                .streetName("Main St")
                                .city("Testville")
                                .stateOrProvince("TS")
                                .postalOrZipCode("12345")
                                .country("Testland")
                                .build())
                        .build())
                .build();
    }

    @Test
    @Transactional
    void save_shouldPersistUser_whenUserIsValid() {
        User saved = userRepository.save(user);
        entityManager.flush();
        entityManager.clear();
        User found = userRepository.findById(saved.getId()).orElse(null);
        assertNotNull(found);
        assertEquals("testuser", found.getUsername());
        assertEquals("testuser@example.com", found.getEmail());
        assertTrue(found.isRegistered());
        assertNotNull(found.getContact());
        assertEquals("Test", found.getContact().getFirstName());
        assertNotNull(found.getContact().getAddress());
        assertEquals("Main St", found.getContact().getAddress().getStreetName());
    }

    @Test
    @Transactional
    void save_shouldCascadeContact_whenUserIsSaved() {
        User saved = userRepository.save(user);
        entityManager.flush();
        entityManager.clear();
        User found = userRepository.findById(saved.getId()).orElse(null);
        assertNotNull(found);
        assertNotNull(found.getContact());
        assertNotNull(found.getContact().getId());
        assertNotNull(found.getContact().getAddress());
        assertNotNull(found.getContact().getAddress().getId());
    }
}

