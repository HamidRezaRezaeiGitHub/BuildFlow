package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.AbstractModelJpaTest;
import dev.hr.rezaei.buildflow.base.UserNotFoundException;
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
    void createUser_shouldCreateUser_whenValidRequest() {
        // Given
        Contact contact = createRandomContact();
        String username = "testuser_" + System.currentTimeMillis();
        boolean registered = true;

        // When
        User user = userService.createUser(contact, username, registered);

        // Then
        assertNotNull(user);
        assertNotNull(user.getId());
        assertEquals(username, user.getUsername());
        assertEquals(contact.getEmail(), user.getEmail());
        assertEquals(registered, user.isRegistered());
        assertNotNull(user.getContact());
    }

    @Test
    void createUser_shouldThrow_whenEmailAlreadyExists() {
        // Given
        Contact contact1 = createRandomContact();
        String username1 = "testuser1_" + System.currentTimeMillis();
        userService.createUser(contact1, username1, true);

        Contact contact2 = createRandomContact();
        contact2.setEmail(contact1.getEmail());
        String username2 = "testuser2_" + System.currentTimeMillis();

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> userService.createUser(contact2, username2, true));
    }

    @Test
    void update_shouldUpdateUser_whenUserIsPersisted() {
        // Given
        User user = createRandomBuilderUser();
        persistUserDependencies(user);
        user = userRepository.save(user);

        String newUsername = "updated_username";
        user.setUsername(newUsername);

        // When
        User updatedUser = userService.update(user);

        // Then
        assertEquals(newUsername, updatedUser.getUsername());
    }

    @Test
    void update_shouldThrow_whenUserIsNotPersisted() {
        User user = User.builder()
                .username("notpersisted")
                .email("notpersisted@example.com")
                .contact(testBuilderUserContact)
                .build();
        assertThrows(IllegalArgumentException.class, () -> userService.update(user));
    }

    @Test
    void delete_shouldDeleteUser_whenUserIsPersisted() {
        // Given
        User user = createRandomBuilderUser();
        persistUserDependencies(user);
        user = userRepository.save(user);
        UUID userId = user.getId();

        // When
        userService.delete(user);

        // Then
        assertFalse(userRepository.existsById(userId));
    }

    @Test
    void delete_shouldThrow_whenUserIsNotPersisted() {
        User user = User.builder()
                .username("notpersisted")
                .email("notpersisted@example.com")
                .contact(testBuilderUserContact)
                .build();
        assertThrows(IllegalArgumentException.class, () -> userService.delete(user));
    }

    @Test
    void isPersisted_shouldReturnTrue_whenUserExists() {
        // Given
        User user = createRandomBuilderUser();
        persistUserDependencies(user);
        user = userRepository.save(user);

        // When
        boolean isPersisted = userService.isPersisted(user);

        // Then
        assertTrue(isPersisted);
    }

    @Test
    void isPersisted_shouldReturnFalse_whenUserDoesNotExist() {
        // Given
        User user = createRandomBuilderUser();

        // When
        boolean isPersisted = userService.isPersisted(user);

        // Then
        assertFalse(isPersisted);
    }

    @Test
    void existsByEmail_shouldReturnTrue_whenUserExists() {
        // Given
        User user = createRandomBuilderUser();
        persistUserDependencies(user);
        userRepository.save(user);

        // When
        boolean exists = userService.existsByEmail(user.getEmail());

        // Then
        assertTrue(exists);
    }

    @Test
    void existsByEmail_shouldReturnFalse_whenUserDoesNotExist() {
        Contact randomContact = createRandomContact();
        assertFalse(userService.existsByEmail(randomContact.getEmail()));
    }

    @Test
    void existsByUsername_shouldReturnTrue_whenUserExists() {
        // Given
        User user = createRandomBuilderUser();
        persistUserDependencies(user);
        userRepository.save(user);

        // When
        boolean exists = userService.existsByUsername(user.getUsername());

        // Then
        assertTrue(exists);
    }

    @Test
    void existsByUsername_shouldReturnFalse_whenUserDoesNotExist() {
        User randomUser = createRandomBuilderUser();
        assertFalse(userService.existsByUsername(randomUser.getUsername()));
    }

    @Test
    void findById_shouldReturnUser_whenUserExists() {
        // Given
        User user = createRandomBuilderUser();
        persistUserDependencies(user);
        user = userRepository.save(user);

        // When
        Optional<User> foundUser = userService.findById(user.getId());

        // Then
        assertTrue(foundUser.isPresent());
        assertEquals(user.getId(), foundUser.get().getId());
        assertEquals(user.getUsername(), foundUser.get().getUsername());
    }

    @Test
    void findById_shouldReturnEmpty_whenNotExists() {
        assertTrue(userService.findById(UUID.randomUUID()).isEmpty());
    }

    @Test
    void findByEmail_shouldReturnUser_whenUserExists() {
        // Given
        User user = createRandomBuilderUser();
        persistUserDependencies(user);
        userRepository.save(user);

        // When
        Optional<User> foundUser = userService.findByEmail(user.getEmail());

        // Then
        assertTrue(foundUser.isPresent());
        assertEquals(user.getEmail(), foundUser.get().getEmail());
        assertEquals(user.getUsername(), foundUser.get().getUsername());
    }

    @Test
    void findByEmail_shouldReturnEmpty_whenNotExists() {
        Contact randomContact = createRandomContact();
        assertTrue(userService.findByEmail(randomContact.getEmail()).isEmpty());
    }

    @Test
    void findByUsername_shouldReturnUser_whenUserExists() {
        // Given
        User user = createRandomBuilderUser();
        persistUserDependencies(user);
        userRepository.save(user);

        // When
        Optional<User> foundUser = userService.findByUsername(user.getUsername());

        // Then
        assertTrue(foundUser.isPresent());
        assertEquals(user.getUsername(), foundUser.get().getUsername());
        assertEquals(user.getEmail(), foundUser.get().getEmail());
    }

    @Test
    void findByUsername_shouldReturnEmpty_whenNotExists() {
        User randomUser = createRandomBuilderUser();
        assertTrue(userService.findByUsername(randomUser.getUsername()).isEmpty());
    }

    @Test
    void getUserByUsername_shouldReturnUser_whenUserExists() {
        // Given
        User user = createRandomBuilderUser();
        persistUserDependencies(user);
        userRepository.save(user);

        // When
        User foundUser = userService.getUserByUsername(user.getUsername());

        // Then
        assertNotNull(foundUser);
        assertEquals(user.getUsername(), foundUser.getUsername());
        assertEquals(user.getEmail(), foundUser.getEmail());
        assertEquals(user.isRegistered(), foundUser.isRegistered());
    }

    @Test
    void getUserByUsername_shouldThrow_whenUserDoesNotExist() {
        // Given
        String nonExistentUsername = "nonexistent_user";

        // When & Then
        assertThrows(UserNotFoundException.class, () -> userService.getUserByUsername(nonExistentUsername));
    }
}
