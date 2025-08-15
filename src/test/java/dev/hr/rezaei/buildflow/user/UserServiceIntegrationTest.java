package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.AbstractModelJpaTest;
import dev.hr.rezaei.buildflow.user.dto.*;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

import java.util.Optional;
import java.util.UUID;

import static dev.hr.rezaei.buildflow.user.ContactDtoMapper.toContactDto;
import static dev.hr.rezaei.buildflow.user.ContactDtoMapper.toContactRequestDto;
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
        User user = userService.newRegisteredUser(testBuilderUserContact);
        log.debug("Saved user: {}", user);
        assertNotNull(user.getId());
        assertTrue(userService.isPersisted(user));
        assertEquals(testBuilderUserContact.getEmail(), user.getEmail());
        assertTrue(user.isRegistered());
    }

    @Test
    void newUnregisteredUser_shouldPersistUser() {
        User user = userService.newUnregisteredUser(testBuilderUserContact, ContactLabel.BUILDER);
        assertNotNull(user.getId());
        assertFalse(user.isRegistered());
        assertTrue(userService.isPersisted(user));
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
    void update_shouldPersistChanges_whenUserIsPersisted() {
        User user = userService.newRegisteredUser(testBuilderUserContact);
        user.setUsername("updatedUsername");
        User updated = userService.update(user);
        assertEquals("updatedUsername", updated.getUsername());
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
    void delete_shouldRemoveUser_whenUserIsPersisted() {
        User user = userService.newRegisteredUser(testBuilderUserContact);
        userService.delete(user);
        assertFalse(userRepository.existsById(user.getId()));
    }

    @Test
    void existsByEmail_shouldReturnTrue_whenUserExists() {
        User user = userService.newRegisteredUser(testBuilderUserContact);
        assertTrue(userService.existsByEmail(user.getEmail()));
    }

    @Test
    void existsByEmail_shouldReturnFalse_whenUserDoesNotExist() {
        Contact randomContact = createRandomContact();
        assertFalse(userService.existsByEmail(randomContact.getEmail()));
    }

    @Test
    void existsByUsername_shouldReturnTrue_whenUserExists() {
        User user = userService.newRegisteredUser(testBuilderUserContact);
        assertTrue(userService.existsByUsername(user.getUsername()));
    }

    @Test
    void existsByUsername_shouldReturnFalse_whenUserDoesNotExist() {
        User randomUser = createRandomBuilderUser();
        assertFalse(userService.existsByUsername(randomUser.getUsername()));
    }

    @Test
    void findById_shouldReturnUser_whenExists() {
        User user = userService.newRegisteredUser(testBuilderUserContact);
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
        User user = userService.newRegisteredUser(testBuilderUserContact);
        Optional<User> found = userService.findByEmail(user.getEmail());
        assertTrue(found.isPresent());
        assertEquals(user.getEmail(), found.get().getEmail());
    }

    @Test
    void findByEmail_shouldReturnEmpty_whenNotExists() {
        Contact randomContact = createRandomContact();
        assertTrue(userService.findByEmail(randomContact.getEmail()).isEmpty());
    }

    @Test
    void findByUsername_shouldReturnUser_whenExists() {
        User user = userService.newRegisteredUser(testBuilderUserContact);
        Optional<User> found = userService.findByUsername(user.getUsername());
        assertTrue(found.isPresent());
        assertEquals(user.getUsername(), found.get().getUsername());
    }

    @Test
    void findByUsername_shouldReturnEmpty_whenNotExists() {
        User randomUser = createRandomBuilderUser();
        assertTrue(userService.findByUsername(randomUser.getUsername()).isEmpty());
    }

    @Test
    void createBuilder_shouldPersistRegisteredBuilder() {
        // Arrange
        ContactRequestDto contactRequestDto = toContactRequestDto(toContactDto(testBuilderUser.getContact()));

        CreateBuilderRequest request = CreateBuilderRequest.builder()
                .registered(true)
                .contactRequestDto(contactRequestDto)
                .build();

        // Act
        CreateBuilderResponse response = userService.createBuilder(request);

        // Assert
        assertNotNull(response);
        assertNotNull(response.getUserDto());
        UserDto userDto = response.getUserDto();
        assertNotNull(userDto.getId());
        assertTrue(userDto.isRegistered());
        assertEquals(testBuilderUserContact.getEmail(), userDto.getEmail());
        assertNotNull(userDto.getContactDto());
        assertTrue(userDto.getContactDto().getLabels().contains(ContactLabel.BUILDER.name()));

        // Verify persistence by finding the user in the database
        Optional<User> persistedUser = userService.findById(userDto.getId());
        assertTrue(persistedUser.isPresent());
        User foundUser = persistedUser.get();
        assertEquals(userDto.getId(), foundUser.getId());
        assertEquals(userDto.getEmail(), foundUser.getEmail());
        assertTrue(foundUser.isRegistered());
        assertTrue(foundUser.getContact().getLabels().contains(ContactLabel.BUILDER));
    }

    @Test
    void createBuilder_shouldPersistUnregisteredBuilder() {
        // Arrange
        ContactRequestDto contactRequestDto = toContactRequestDto(toContactDto(testBuilderUser.getContact()));

        CreateBuilderRequest request = CreateBuilderRequest.builder()
                .registered(false)
                .contactRequestDto(contactRequestDto)
                .build();

        // Act
        CreateBuilderResponse response = userService.createBuilder(request);

        // Assert
        assertNotNull(response);
        assertNotNull(response.getUserDto());
        UserDto userDto = response.getUserDto();
        assertNotNull(userDto.getId());
        assertFalse(userDto.isRegistered());
        assertEquals(testBuilderUserContact.getEmail(), userDto.getEmail());
        assertNotNull(userDto.getContactDto());
        assertTrue(userDto.getContactDto().getLabels().contains(ContactLabel.BUILDER.name()));

        // Verify persistence by finding the user in the database
        Optional<User> persistedUser = userService.findById(userDto.getId());
        assertTrue(persistedUser.isPresent());
        User foundUser = persistedUser.get();
        assertEquals(userDto.getId(), foundUser.getId());
        assertEquals(userDto.getEmail(), foundUser.getEmail());
        assertFalse(foundUser.isRegistered());
        assertTrue(foundUser.getContact().getLabels().contains(ContactLabel.BUILDER));
    }

    @Test
    void createOwner_shouldPersistRegisteredOwner() {
        // Arrange
        ContactRequestDto contactRequestDto = toContactRequestDto(toContactDto(testOwnerUser.getContact()));

        CreateOwnerRequest request = CreateOwnerRequest.builder()
                .registered(true)
                .contactRequestDto(contactRequestDto)
                .build();

        // Act
        CreateOwnerResponse response = userService.createOwner(request);

        // Assert
        assertNotNull(response);
        assertNotNull(response.getUserDto());
        UserDto userDto = response.getUserDto();
        assertNotNull(userDto.getId());
        assertTrue(userDto.isRegistered());
        assertEquals(testOwnerUser.getContact().getEmail(), userDto.getEmail());
        assertNotNull(userDto.getContactDto());
        assertTrue(userDto.getContactDto().getLabels().contains(ContactLabel.OWNER.name()));

        // Verify persistence by finding the user in the database
        Optional<User> persistedUser = userService.findById(userDto.getId());
        assertTrue(persistedUser.isPresent());
        User foundUser = persistedUser.get();
        assertEquals(userDto.getId(), foundUser.getId());
        assertEquals(userDto.getEmail(), foundUser.getEmail());
        assertTrue(foundUser.isRegistered());
        assertTrue(foundUser.getContact().getLabels().contains(ContactLabel.OWNER));
    }

    @Test
    void createOwner_shouldPersistUnregisteredOwner() {
        // Arrange
        ContactRequestDto contactRequestDto = toContactRequestDto(toContactDto(testOwnerUser.getContact()));

        CreateOwnerRequest request = CreateOwnerRequest.builder()
                .registered(false)
                .contactRequestDto(contactRequestDto)
                .build();

        // Act
        CreateOwnerResponse response = userService.createOwner(request);

        // Assert
        assertNotNull(response);
        assertNotNull(response.getUserDto());
        UserDto userDto = response.getUserDto();
        assertNotNull(userDto.getId());
        assertFalse(userDto.isRegistered());
        assertEquals(testOwnerUser.getEmail(), userDto.getEmail());
        assertNotNull(userDto.getContactDto());
        assertTrue(userDto.getContactDto().getLabels().contains(ContactLabel.OWNER.name()));

        // Verify persistence by finding the user in the database
        Optional<User> persistedUser = userService.findById(userDto.getId());
        assertTrue(persistedUser.isPresent());
        User foundUser = persistedUser.get();
        assertEquals(userDto.getId(), foundUser.getId());
        assertEquals(userDto.getEmail(), foundUser.getEmail());
        assertFalse(foundUser.isRegistered());
        assertTrue(foundUser.getContact().getLabels().contains(ContactLabel.OWNER));
    }
}
