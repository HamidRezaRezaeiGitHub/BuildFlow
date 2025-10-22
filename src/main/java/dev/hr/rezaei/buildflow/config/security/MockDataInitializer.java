package dev.hr.rezaei.buildflow.config.security;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import dev.hr.rezaei.buildflow.config.security.dto.SignUpRequest;
import dev.hr.rezaei.buildflow.user.ContactLabel;
import dev.hr.rezaei.buildflow.user.dto.ContactAddressRequestDto;
import dev.hr.rezaei.buildflow.user.dto.ContactRequestDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@ConditionalOnProperty(value = "app.users.mock.enabled", havingValue = "true")
public class MockDataInitializer {

    private final AuthService authService;
    private final ObjectMapper objectMapper;

    public MockDataInitializer(AuthService authService) {
        this.authService = authService;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());

        initializeMockData();
    }

    @Transactional
    protected void initializeMockData() {
        log.info("Starting mock data initialization from JSON files...");

        // Load users from JSON
        List<MockUserData> mockUsers = loadMockUsers();
        // Load authentications from JSON
        List<MockAuthenticationData> mockAuthentications = loadMockAuthentications();

        if (mockUsers.isEmpty()) {
            log.warn("No mock users found in JSON file.");
            return;
        }

        if (mockAuthentications.isEmpty()) {
            log.warn("No mock authentications found in JSON file.");
            return;
        }

        // Create a map for easy lookup of authentication data by username
        Map<String, MockAuthenticationData> authMap = new HashMap<>();
        for (MockAuthenticationData authData : mockAuthentications) {
            authMap.put(authData.username, authData);
        }

        // Process each user
        for (MockUserData userData : mockUsers) {
            try {
                // Check if user already exists
                if (authService.userAuthExistsByUsername(userData.username) || 
                    authService.userExistsByUsername(userData.username)) {
                    log.debug("Mock user '{}' already exists, skipping...", userData.username);
                    continue;
                }

                // Get authentication data for this user
                MockAuthenticationData authData = authMap.get(userData.username);
                if (authData == null) {
                    log.warn("No authentication data found for user '{}', skipping...", userData.username);
                    continue;
                }

                // Parse role
                Role role;
                try {
                    role = Role.valueOf(authData.role);
                } catch (Exception e) {
                    log.error("Invalid role '{}' for user '{}', skipping...", authData.role, userData.username);
                    continue;
                }

                // Create contact request DTO from JSON data
                ContactRequestDto contactRequestDto = createContactRequestDto(userData.contact);

                // Create sign-up request
                SignUpRequest signUpRequest = SignUpRequest.builder()
                        .username(userData.username)
                        .password(authData.passwordHash) // Note: Will be hashed by registerUserWithRole
                        .contactRequestDto(contactRequestDto)
                        .build();

                // Register the user
                authService.registerUserWithRole(signUpRequest, role);
                log.info("Successfully initialized mock user: {} with role: {}", userData.username, role);

            } catch (Exception e) {
                log.error("Error initializing mock user '{}': {}", userData.username, e.getMessage(), e);
            }
        }

        log.info("Mock data initialization completed.");
    }

    private List<MockUserData> loadMockUsers() {
        try {
            // Try to load from classpath first
            InputStream is = getClass().getClassLoader().getResourceAsStream("../../../mock-data/Users.json");
            if (is != null) {
                log.info("Loading mock users from classpath: mock-data/Users.json");
                return objectMapper.readValue(is, new TypeReference<List<MockUserData>>() {});
            }

            // Try to load from filesystem (project root)
            File file = new File("mock-data/Users.json");
            if (file.exists()) {
                log.info("Loading mock users from filesystem: {}", file.getAbsolutePath());
                return objectMapper.readValue(file, new TypeReference<List<MockUserData>>() {});
            }

            log.warn("Could not find Users.json in classpath or filesystem");
            return new ArrayList<>();

        } catch (IOException e) {
            log.error("Error loading mock users from JSON: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    private List<MockAuthenticationData> loadMockAuthentications() {
        try {
            // Try to load from classpath first
            InputStream is = getClass().getClassLoader().getResourceAsStream("../../../mock-data/UserAuthentications.json");
            if (is != null) {
                log.info("Loading mock authentications from classpath: mock-data/UserAuthentications.json");
                return objectMapper.readValue(is, new TypeReference<List<MockAuthenticationData>>() {});
            }

            // Try to load from filesystem (project root)
            File file = new File("mock-data/UserAuthentications.json");
            if (file.exists()) {
                log.info("Loading mock authentications from filesystem: {}", file.getAbsolutePath());
                return objectMapper.readValue(file, new TypeReference<List<MockAuthenticationData>>() {});
            }

            log.warn("Could not find UserAuthentications.json in classpath or filesystem");
            return new ArrayList<>();

        } catch (IOException e) {
            log.error("Error loading mock authentications from JSON: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    private ContactRequestDto createContactRequestDto(MockContactData contactData) {
        // Parse labels from strings - keep as strings for DTO
        List<String> labelStrings = new ArrayList<>();
        for (String labelStr : contactData.labels) {
            try {
                // Handle the case where JSON has "Administrator" but enum has "ADMINISTRATOR"
                String enumName = labelStr.toUpperCase().replace(" ", "_");
                // Validate it's a valid ContactLabel
                ContactLabel.valueOf(enumName);
                labelStrings.add(labelStr);
            } catch (Exception e) {
                log.warn("Invalid contact label '{}', skipping...", labelStr);
            }
        }

        // Create address DTO if address data exists
        ContactAddressRequestDto addressDto = null;
        if (contactData.address != null) {
            addressDto = ContactAddressRequestDto.builder()
                    .unitNumber(contactData.address.unitNumber)
                    .streetNumberAndName(contactData.address.streetNumberAndName)
                    .city(contactData.address.city)
                    .stateOrProvince(contactData.address.stateOrProvince)
                    .postalOrZipCode(contactData.address.postalOrZipCode)
                    .country(contactData.address.country)
                    .build();
        }

        return ContactRequestDto.builder()
                .firstName(contactData.firstName)
                .lastName(contactData.lastName)
                .labels(labelStrings)
                .email(contactData.email)
                .phone(contactData.phone)
                .addressRequestDto(addressDto)
                .build();
    }

    // Inner classes for JSON deserialization
    @SuppressWarnings("unused") // Fields are used by Jackson for JSON deserialization
    private static class MockUserData {
        public String id;
        public String username;
        public String email;
        public boolean registered;
        public MockContactData contact;
    }

    @SuppressWarnings("unused") // Fields are used by Jackson for JSON deserialization
    private static class MockContactData {
        public String id;
        public String firstName;
        public String lastName;
        public List<String> labels;
        public String email;
        public String phone;
        public MockAddressData address;
    }

    @SuppressWarnings("unused") // Fields are used by Jackson for JSON deserialization
    private static class MockAddressData {
        public String id;
        public String unitNumber;
        public String streetNumberAndName;
        public String city;
        public String stateOrProvince;
        public String postalOrZipCode;
        public String country;
    }

    @SuppressWarnings("unused") // Fields are used by Jackson for JSON deserialization
    private static class MockAuthenticationData {
        public String id;
        public String username;
        public String passwordHash;
        public String role;
        public boolean enabled;
        public String createdAt;
        public String lastLogin;
    }
}