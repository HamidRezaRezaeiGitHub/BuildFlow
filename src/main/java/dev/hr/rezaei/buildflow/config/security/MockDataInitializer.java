package dev.hr.rezaei.buildflow.config.security;

import com.fasterxml.jackson.core.type.TypeReference;
import dev.hr.rezaei.buildflow.config.security.dto.SignUpRequest;
import dev.hr.rezaei.buildflow.data.migration.JsonLoadUtil;
import dev.hr.rezaei.buildflow.data.migration.dto.MockAuthenticationData;
import dev.hr.rezaei.buildflow.data.migration.dto.MockContactData;
import dev.hr.rezaei.buildflow.data.migration.dto.MockUserData;
import dev.hr.rezaei.buildflow.user.ContactLabel;
import dev.hr.rezaei.buildflow.user.dto.ContactAddressRequestDto;
import dev.hr.rezaei.buildflow.user.dto.ContactRequestDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
@Order(2) // Runs after AdminUserInitializer (Order 1)
@ConditionalOnProperty(value = "app.users.mock.enabled", havingValue = "true")
public class MockDataInitializer implements ApplicationRunner {

    private final AuthService authService;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        initializeMockData();
    }

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
            authMap.put(authData.getUsername(), authData);
        }

        // Process each user
        for (MockUserData userData : mockUsers) {
            try {
                // Check if user already exists
                if (authService.userAuthExistsByUsername(userData.getUsername()) || authService.userExistsByUsername(userData.getUsername())) {
                    log.debug("Mock user '{}' already exists, skipping...", userData.getUsername());
                    continue;
                }

                // Get authentication data for this user
                MockAuthenticationData authData = authMap.get(userData.getUsername());
                if (authData == null) {
                    log.warn("No authentication data found for user '{}', skipping...", userData.getUsername());
                    continue;
                }

                // Parse role
                Role role;
                try {
                    role = Role.valueOf(authData.getRole());
                } catch (Exception e) {
                    log.error("Invalid role '{}' for user '{}', skipping...", authData.getRole(), userData.getUsername());
                    continue;
                }

                // Create contact request DTO from JSON data
                ContactRequestDto contactRequestDto = createContactRequestDto(userData.getContact());

                // Create sign-up request
                SignUpRequest signUpRequest = SignUpRequest.builder()
                        .username(userData.getUsername())
                        .password(authData.getPasswordHash()) // Note: Will be hashed
                        .contactRequestDto(contactRequestDto)
                        .build();

                // Register the user
                authService.registerUserWithRole(signUpRequest, role);
                log.info("Successfully initialized mock user: {} with role: {}", userData.getUsername(), role);

            } catch (Exception e) {
                log.error("Error initializing mock user '{}': {}", userData.getUsername(), e.getMessage(), e);
            }
        }

        log.info("Mock data initialization completed.");
    }

    private List<MockUserData> loadMockUsers() {
        return JsonLoadUtil.loadJsonArray("Users.json", new TypeReference<List<MockUserData>>() {
        });
    }

    private List<MockAuthenticationData> loadMockAuthentications() {
        return JsonLoadUtil.loadJsonArray("UserAuthentications.json", new TypeReference<List<MockAuthenticationData>>() {
        });
    }

    private ContactRequestDto createContactRequestDto(MockContactData contactData) {
        // Parse labels from strings - keep as strings for DTO
        List<String> labelStrings = new ArrayList<>();
        for (String labelStr : contactData.getLabels()) {
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
        if (contactData.getAddress() != null) {
            addressDto = ContactAddressRequestDto.builder().unitNumber(contactData.getAddress().getUnitNumber()).streetNumberAndName(contactData.getAddress().getStreetNumberAndName()).city(contactData.getAddress().getCity()).stateOrProvince(contactData.getAddress().getStateOrProvince()).postalOrZipCode(contactData.getAddress().getPostalOrZipCode()).country(contactData.getAddress().getCountry()).build();
        }

        return ContactRequestDto.builder().firstName(contactData.getFirstName()).lastName(contactData.getLastName()).labels(labelStrings).email(contactData.getEmail()).phone(contactData.getPhone()).addressRequestDto(addressDto).build();
    }
}