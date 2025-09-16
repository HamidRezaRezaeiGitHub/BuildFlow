package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.AbstractModelJpaTest;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.TestPropertySource;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@Slf4j
@DataJpaTest
@TestPropertySource(properties = {
        "app.users.mock.enabled=true",
        "app.users.mock.roles.TESTER.count=3",
        "app.users.mock.roles.BUILDER.count=2"
})
class UserMockDataInitializerIntegrationTest extends AbstractModelJpaTest {

    @TestConfiguration
    static class UserMockDataInitializerTestConfig {
        @Bean
        public ContactService contactService(ContactRepository contactRepository) {
            return new ContactService(contactRepository);
        }

        @Bean
        public UserService userService(UserRepository userRepository, ContactService contactService) {
            return new UserService(userRepository, contactService);
        }

        @Bean
        public UserMockDataProperties userMockDataProperties() {
            UserMockDataProperties properties = new UserMockDataProperties();
            properties.setEnabled(true);
            
            Map<String, UserMockDataProperties.MockUserProps> roles = Map.of(
                "TESTER", createMockUserProps(3),
                "BUILDER", createMockUserProps(2)
            );
            properties.setRoles(roles);
            
            return properties;
        }
        
        private UserMockDataProperties.MockUserProps createMockUserProps(int count) {
            UserMockDataProperties.MockUserProps props = new UserMockDataProperties.MockUserProps();
            props.setCount(count);
            return props;
        }

        @Bean
        public UserMockDataInitializer userMockDataInitializer(UserMockDataProperties properties, UserService userService) {
            return new UserMockDataInitializer(properties, userService);
        }
    }

    @Autowired
    private UserMockDataProperties userMockDataProperties;

    @Autowired
    private UserMockDataInitializer userMockDataInitializer;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ContactRepository contactRepository;

    @Test
    void userMockDataProperties_shouldBindCorrectly_whenConfigured() {
        // Then
        assertTrue(userMockDataProperties.isEnabled());
        assertNotNull(userMockDataProperties.getRoles());
        assertEquals(2, userMockDataProperties.getRoles().size());
        
        assertEquals(3, userMockDataProperties.getRoles().get("TESTER").getCount());
        assertEquals(2, userMockDataProperties.getRoles().get("BUILDER").getCount());
    }

    @Test
    void initializeMockUsers_shouldCreateMockUsers_whenEnabled() throws Exception {
        // Given - create a fresh initializer with isolated properties
        UserMockDataProperties testProperties = new UserMockDataProperties();
        testProperties.setEnabled(true);
        
        UserMockDataProperties.MockUserProps testerProps = new UserMockDataProperties.MockUserProps();
        testerProps.setCount(2);
        UserMockDataProperties.MockUserProps builderProps = new UserMockDataProperties.MockUserProps();
        builderProps.setCount(1);
        
        testProperties.setRoles(Map.of(
            "TESTER", testerProps,
            "BUILDER", builderProps
        ));
        
        ContactService contactService = new ContactService(contactRepository);
        UserService userService = new UserService(userRepository, contactService);
        
        long initialUserCount = userRepository.count();
        
        // When - initialization happens in constructor
        UserMockDataInitializer testInitializer = new UserMockDataInitializer(testProperties, userService);
        
        // Then
        long finalUserCount = userRepository.count();
        assertEquals(initialUserCount + 3, finalUserCount); // 2 TESTER + 1 BUILDER users
        
        Map<String, List<User>> mockUsers = testInitializer.getMockUsers();
        assertEquals(2, mockUsers.size());
        assertEquals(2, mockUsers.get("TESTER").size());
        assertEquals(1, mockUsers.get("BUILDER").size());
        
        // Verify user properties
        for (User user : mockUsers.get("TESTER")) {
            assertNotNull(user.getUsername());
            assertTrue(user.getUsername().startsWith("t")); // role's first letter
            assertNotNull(user.getEmail());
            assertTrue(user.getEmail().contains("@testerexample.com"));
            assertNotNull(user.getContact());
            assertNotNull(user.getContact().getFirstName());
            assertNotNull(user.getContact().getLastName());
            assertFalse(user.getContact().getLabels().isEmpty()); // Should have at least OTHER label
            assertTrue(user.getContact().getLabels().contains(ContactLabel.OTHER)); // TESTER maps to OTHER
        }
        
        for (User user : mockUsers.get("BUILDER")) {
            assertNotNull(user.getUsername());
            assertTrue(user.getUsername().startsWith("b")); // role's first letter
            assertNotNull(user.getEmail());
            assertTrue(user.getEmail().contains("@builderexample.com"));
            assertNotNull(user.getContact());
            assertNotNull(user.getContact().getFirstName());
            assertNotNull(user.getContact().getLastName());
            assertTrue(user.getContact().getLabels().contains(ContactLabel.BUILDER)); // BUILDER maps to BUILDER
        }
    }

    @Test
    void initializeMockUsers_shouldDoNothing_whenDisabled() throws Exception {
        // Given
        UserMockDataProperties disabledProperties = new UserMockDataProperties();
        disabledProperties.setEnabled(false);
        long initialUserCount = userRepository.count();
        
        // When - initialization happens in constructor
        UserMockDataInitializer disabledInitializer = new UserMockDataInitializer(disabledProperties, null);
        
        // Then
        long finalUserCount = userRepository.count();
        assertEquals(initialUserCount, finalUserCount);
        assertTrue(disabledInitializer.getMockUsers().isEmpty());
    }

    @Test
    void initializeMockUsers_shouldDoNothing_whenNoRolesConfigured() throws Exception {
        // Given
        UserMockDataProperties emptyProperties = new UserMockDataProperties();
        emptyProperties.setEnabled(true);
        emptyProperties.setRoles(Map.of());
        
        // Create a fresh userService for this test
        ContactService contactService = new ContactService(contactRepository);
        UserService userService = new UserService(userRepository, contactService);
        
        long initialUserCount = userRepository.count();
        
        // When - initialization happens in constructor
        UserMockDataInitializer emptyInitializer = new UserMockDataInitializer(emptyProperties, userService);
        
        // Then
        long finalUserCount = userRepository.count();
        assertEquals(initialUserCount, finalUserCount);
        assertTrue(emptyInitializer.getMockUsers().isEmpty());
    }
}