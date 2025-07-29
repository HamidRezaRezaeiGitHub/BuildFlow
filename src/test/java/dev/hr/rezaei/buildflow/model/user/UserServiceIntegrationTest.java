package dev.hr.rezaei.buildflow.model.user;

import dev.hr.rezaei.buildflow.model.AbstractModelJpaTest;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@Slf4j
@DataJpaTest
class UserServiceIntegrationTest extends AbstractModelJpaTest {

    @TestConfiguration
    static class UserServiceTestConfig {
        @Bean
        public ContactService contactService(ContactRepository contactRepository) {
            return new ContactService(contactRepository);
        }

        @Bean
        public UserService userService(UserRepository userRepository, ContactService contactService) {
            return new UserService(userRepository, contactService);
        }
    }

    @Autowired
    private UserService userService;

    @Test
    void newRegisteredUser_shouldPersistUser() {
        User user = userService.newRegisteredUser(testContact);
        log.debug("Saved user: {}", user);
        assertNotNull(user.getId());
        assertTrue(userService.isPersisted(user));
        assertEquals(testContact.getEmail(), user.getEmail());
        assertTrue(user.isRegistered());
    }

    @Test
    void newUnregisteredUser_shouldPersistUser() {
        User user = userService.newUnregisteredUser(testContact, ContactLabel.BUILDER);
        assertNotNull(user.getId());
        assertFalse(user.isRegistered());
        assertTrue(userService.isPersisted(user));
    }

    @Test
    void newRegisteredBuilder_shouldAddBuilderLabel() {
        User user = userService.newRegisteredBuilder(testContact);
        assertTrue(user.getContact().getLabels().contains(ContactLabel.BUILDER));
        assertTrue(user.isRegistered());
    }

    @Test
    void newRegisteredOwner_shouldAddOwnerLabel() {
        User user = userService.newRegisteredOwner(testContact);
        assertTrue(user.getContact().getLabels().contains(ContactLabel.OWNER));
        assertTrue(user.isRegistered());
    }

    @Test
    void update_shouldThrow_whenUserIsNotPersisted() {
        User user = User.builder()
                .username("notpersisted")
                .email("notpersisted@example.com")
                .contact(testContact)
                .build();
        assertThrows(IllegalArgumentException.class, () -> userService.update(user));
    }

    @Test
    void update_shouldPersistChanges_whenUserIsPersisted() {
        User user = userService.newRegisteredUser(testContact);
        user.setUsername("updatedUsername");
        User updated = userService.update(user);
        assertEquals("updatedUsername", updated.getUsername());
    }

    @Test
    void delete_shouldThrow_whenUserIsNotPersisted() {
        User user = User.builder()
                .username("notpersisted")
                .email("notpersisted@example.com")
                .contact(testContact)
                .build();
        assertThrows(IllegalArgumentException.class, () -> userService.delete(user));
    }

    @Test
    void delete_shouldRemoveUser_whenUserIsPersisted() {
        User user = userService.newRegisteredUser(testContact);
        userService.delete(user);
        assertFalse(userRepository.existsById(user.getId()));
    }

    @Test
    void existsByEmail_shouldReturnTrue_whenUserExists() {
        User user = userService.newRegisteredUser(testContact);
        assertTrue(userService.existsByEmail(user.getEmail()));
    }

    @Test
    void existsByEmail_shouldReturnFalse_whenUserDoesNotExist() {
        assertFalse(userService.existsByEmail("notfound@example.com"));
    }

    @Test
    void existsByUsername_shouldReturnTrue_whenUserExists() {
        User user = userService.newRegisteredUser(testContact);
        assertTrue(userService.existsByUsername(user.getUsername()));
    }

    @Test
    void existsByUsername_shouldReturnFalse_whenUserDoesNotExist() {
        assertFalse(userService.existsByUsername("notfounduser"));
    }

    @Test
    void findById_shouldReturnUser_whenExists() {
        User user = userService.newRegisteredUser(testContact);
        Optional<User> found = userService.findById(user.getId());
        assertTrue(found.isPresent());
        assertEquals(user.getId(), found.get().getId());
    }

    @Test
    void findById_shouldReturnEmpty_whenNotExists() {
        assertTrue(userService.findById(UUID.randomUUID()).isEmpty());
    }

    @Test
    void findByEmail_shouldReturnUser_whenExists() {
        User user = userService.newRegisteredUser(testContact);
        Optional<User> found = userService.findByEmail(user.getEmail());
        assertTrue(found.isPresent());
        assertEquals(user.getEmail(), found.get().getEmail());
    }

    @Test
    void findByEmail_shouldReturnEmpty_whenNotExists() {
        assertTrue(userService.findByEmail("notfound@example.com").isEmpty());
    }

    @Test
    void findByUsername_shouldReturnUser_whenExists() {
        User user = userService.newRegisteredUser(testContact);
        Optional<User> found = userService.findByUsername(user.getUsername());
        assertTrue(found.isPresent());
        assertEquals(user.getUsername(), found.get().getUsername());
    }

    @Test
    void findByUsername_shouldReturnEmpty_whenNotExists() {
        assertTrue(userService.findByUsername("notfounduser").isEmpty());
    }
}
