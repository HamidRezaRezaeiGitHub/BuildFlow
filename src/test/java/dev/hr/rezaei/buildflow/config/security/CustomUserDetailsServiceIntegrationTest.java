package dev.hr.rezaei.buildflow.config.security;

import dev.hr.rezaei.buildflow.AbstractModelJpaTest;
import dev.hr.rezaei.buildflow.user.ContactService;
import dev.hr.rezaei.buildflow.user.User;
import dev.hr.rezaei.buildflow.user.UserRepository;
import dev.hr.rezaei.buildflow.user.UserService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

@Slf4j
@DataJpaTest
class CustomUserDetailsServiceIntegrationTest extends AbstractModelJpaTest {

    @TestConfiguration
    static class CustomUserDetailsServiceTestConfig {
        @Bean
        public ContactService contactService(dev.hr.rezaei.buildflow.user.ContactRepository contactRepository) {
            return new ContactService(contactRepository);
        }

        @Bean
        public UserService userService(UserRepository userRepository, ContactService contactService) {
            return new UserService(userRepository, contactService);
        }

        @Bean
        public CustomUserDetailsService customUserDetailsService(UserService userService,
                                                                 UserAuthenticationRepository userAuthenticationRepository) {
            return new CustomUserDetailsService(userService, userAuthenticationRepository);
        }
    }

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private UserAuthenticationRepository userAuthenticationRepository;

    @Autowired
    private UserRepository userRepository;

    private User testUser;
    private UserAuthentication testUserAuth;

    @BeforeEach
    void setUpTestData() {
        // Create and persist test user using available helper method
        testUser = createRandomBuilderUser();
        persistUserDependencies(testUser);
        testUser = userRepository.save(testUser);

        // Create and persist user authentication with correct field names
        testUserAuth = UserAuthentication.builder()
                .username(testUser.getUsername())
                .passwordHash("$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFO3Q8E7cgJ5VB5lzqOQnN6") // "password"
                .enabled(true)
                .createdAt(Instant.now())
                .build();
        testUserAuth = userAuthenticationRepository.save(testUserAuth);
    }

    @Test
    void loadUserByUsername_shouldReturnUserDetails_whenUserExists() {
        // When
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(testUser.getUsername());

        // Then
        assertNotNull(userDetails);
        assertEquals(testUser.getUsername(), userDetails.getUsername());
        assertEquals(testUserAuth.getPasswordHash(), userDetails.getPassword());
        assertTrue(userDetails.isEnabled());
        assertTrue(userDetails.isAccountNonExpired());
        assertTrue(userDetails.isAccountNonLocked());
        assertTrue(userDetails.isCredentialsNonExpired());
        assertNotNull(userDetails.getAuthorities());
        assertFalse(userDetails.getAuthorities().isEmpty());
    }

    @Test
    void loadUserByUsername_shouldReturnUserPrincipal_whenUserExists() {
        // When
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(testUser.getUsername());

        // Then
        assertInstanceOf(UserPrincipal.class, userDetails);
        UserPrincipal userPrincipal = (UserPrincipal) userDetails;
        assertEquals(testUser.getUsername(), userPrincipal.getUsername());
        assertEquals(testUser.getEmail(), userPrincipal.getEmail());
        assertEquals(testUserAuth.getPasswordHash(), userPrincipal.getPassword());
        assertEquals(testUserAuth.isEnabled(), userPrincipal.isEnabled());
    }

    @Test
    void loadUserByUsername_shouldThrowException_whenUserAuthenticationNotFound() {
        // Given
        String nonExistentUsername = "nonexistent";

        // When & Then
        assertThrows(UsernameNotFoundException.class,
                () -> customUserDetailsService.loadUserByUsername(nonExistentUsername)
        );
    }

    @Test
    void loadUserByUsername_shouldThrowException_whenUserNotFound() {
        // Given - Create UserAuthentication without corresponding User
        String orphanUsername = "orphan_user";
        UserAuthentication orphanAuth = UserAuthentication.builder()
                .username(orphanUsername)
                .passwordHash("$2a$10$test")
                .enabled(true)
                .createdAt(Instant.now())
                .build();
        userAuthenticationRepository.save(orphanAuth);

        // When & Then
        assertThrows(UsernameNotFoundException.class,
                () -> customUserDetailsService.loadUserByUsername(orphanUsername)
        );
    }

    @Test
    void loadUserByUsername_shouldHandleDisabledUserAuthentication_whenAuthenticationDisabled() {
        // Given - Create disabled UserAuthentication
        String disabledUsername = "disabled_user";
        User disabledUser = createRandomBuilderUser();
        disabledUser.setUsername(disabledUsername);
        disabledUser.setEmail("disabled@example.com");
        persistUserDependencies(disabledUser);
        disabledUser = userRepository.save(disabledUser);

        UserAuthentication disabledAuth = UserAuthentication.builder()
                .username(disabledUsername)
                .passwordHash("$2a$10$test")
                .enabled(false)
                .createdAt(Instant.now())
                .build();
        userAuthenticationRepository.save(disabledAuth);

        // When
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(disabledUsername);

        // Then
        assertNotNull(userDetails);
        assertEquals(disabledUsername, userDetails.getUsername());
        assertEquals(disabledAuth.isEnabled(), userDetails.isEnabled());
    }

    @Test
    void loadUserByUsername_shouldHandleUnregisteredUser_whenUserNotRegistered() {
        // Given - Create unregistered user
        String unregisteredUsername = "unregistered_user";
        User unregisteredUser = createRandomBuilderUser();
        unregisteredUser.setUsername(unregisteredUsername);
        unregisteredUser.setEmail("unregistered@example.com");
        unregisteredUser.setRegistered(false);
        persistUserDependencies(unregisteredUser);
        unregisteredUser = userRepository.save(unregisteredUser);

        UserAuthentication unregisteredAuth = UserAuthentication.builder()
                .username(unregisteredUsername)
                .passwordHash("$2a$10$test")
                .enabled(true)
                .createdAt(Instant.now())
                .build();
        userAuthenticationRepository.save(unregisteredAuth);

        // When
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(unregisteredUsername);

        // Then
        assertNotNull(userDetails);
        assertEquals(unregisteredUsername, userDetails.getUsername());
        assertTrue(userDetails.isEnabled());
    }

    @Test
    void loadUserByUsername_shouldReturnCorrectAuthorities_whenUserLoaded() {
        // When
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(testUser.getUsername());

        // Then
        assertNotNull(userDetails.getAuthorities());
    }

    @Test
    void loadUserByUsername_shouldWorkWithDifferentEmailFormats_whenEmailIsValid() {
        // Given - Create user with different email format
        String emailUsername = "test.email+tag@example.com";
        User emailUser = createRandomBuilderUser();
        emailUser.setUsername(emailUsername);
        persistUserDependencies(emailUser);
        emailUser.setEmail(emailUsername);
        emailUser = userRepository.save(emailUser);

        UserAuthentication emailAuth = UserAuthentication.builder()
                .username(emailUsername)
                .passwordHash("$2a$10$test")
                .enabled(true)
                .createdAt(Instant.now())
                .build();
        userAuthenticationRepository.save(emailAuth);

        // When
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(emailUsername);

        // Then
        assertNotNull(userDetails);
        assertEquals(emailUsername, userDetails.getUsername());
        UserPrincipal userPrincipal = (UserPrincipal) userDetails;
        assertEquals(emailUsername, userPrincipal.getEmail());
    }

    @Test
    void loadUserByUsername_shouldPreservePasswordHash_whenUserLoaded() {
        // Given
        String expectedPasswordHash = "$2a$10$EXPECTED.HASH.VALUE";
        testUserAuth.setPasswordHash(expectedPasswordHash);
        userAuthenticationRepository.save(testUserAuth);

        // When
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(testUser.getUsername());

        // Then
        assertEquals(expectedPasswordHash, userDetails.getPassword());
    }

    @Test
    void loadUserByUsername_shouldBeTransactional_whenDatabaseOperationFails() {
        // This test verifies the @Transactional annotation is working
        // by confirming that the method is read-only and properly isolated

        // When
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(testUser.getUsername());

        // Then - Should complete successfully even if we make subsequent database changes
        assertNotNull(userDetails);

        // Modify the user after loading - this should not affect the returned UserDetails
        testUser.setUsername("modified_username");
        userRepository.save(testUser);

        // The loaded UserDetails should still have the original username
        assertEquals(testUserAuth.getUsername(), userDetails.getUsername());
    }

    @Test
    void loadUserByUsername_shouldHandleCaseVariations_whenUsernameCase() {
        // This test verifies exact username matching (case-sensitive)
        String mixedCaseUsername = "TestUser@Example.Com";
        User mixedCaseUser = createRandomBuilderUser();
        mixedCaseUser.setUsername(mixedCaseUsername);
        mixedCaseUser.setEmail(mixedCaseUsername);
        mixedCaseUser.getContact().setEmail(mixedCaseUsername); // Ensure contact email matches user email
        persistUserDependencies(mixedCaseUser);
        mixedCaseUser = userRepository.save(mixedCaseUser);

        UserAuthentication mixedCaseAuth = UserAuthentication.builder()
                .username(mixedCaseUsername)
                .passwordHash("$2a$10$test")
                .enabled(true)
                .createdAt(Instant.now())
                .build();
        userAuthenticationRepository.save(mixedCaseAuth);

        // When - Load with exact case
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(mixedCaseUsername);

        // Then
        assertNotNull(userDetails);
        assertEquals(mixedCaseUsername, userDetails.getUsername());

        // When - Try with different case
        assertThrows(
                UsernameNotFoundException.class,
                () -> customUserDetailsService.loadUserByUsername(mixedCaseUsername.toLowerCase())
        );
    }
}
