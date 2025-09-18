package dev.hr.rezaei.buildflow.config.security;

import dev.hr.rezaei.buildflow.config.security.dto.SignUpRequest;
import dev.hr.rezaei.buildflow.user.Contact;
import dev.hr.rezaei.buildflow.user.User;
import dev.hr.rezaei.buildflow.user.UserMockDataInitializer;
import dev.hr.rezaei.buildflow.user.dto.ContactRequestDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Random;

import static dev.hr.rezaei.buildflow.user.ContactDtoMapper.toContactDto;
import static dev.hr.rezaei.buildflow.user.ContactDtoMapper.toContactRequestDto;
import static dev.hr.rezaei.buildflow.user.UserMockDataInitializer.MOCK_USER_PREFIX;

@Slf4j
@Component
@ConditionalOnBean(UserMockDataInitializer.class)
@DependsOn("userMockDataInitializer")
public class MockDataInitializer {

    private final AuthService authService;
    private final Map<String, List<User>> mockUsers;
    private final Random random = new Random();

    public MockDataInitializer(AuthService authService, UserMockDataInitializer userMockDataInitializer) {
        this.authService = authService;
        this.mockUsers = userMockDataInitializer.getMockUsers();

        initializeMockData();
    }

    protected void initializeMockData() {
        deleteOldMockData();

        if (mockUsers == null || mockUsers.isEmpty()) {
            log.warn("No mock users found to create mock authentication data for.");
            return;
        }

        for (var entry : mockUsers.entrySet()) {
            String roleName = entry.getKey();
            Role role = Role.valueOf(roleName);
            List<User> users = entry.getValue();
            for (User user : users) {
                String randomPassword = generateRandomPassword(random.nextInt(5) + 10);
                Contact contact = user.getContact();
                ContactRequestDto contactRequestDto = toContactRequestDto(toContactDto(contact));

                SignUpRequest signUpRequest = SignUpRequest.builder()
                        .username(user.getUsername())
                        .password(randomPassword)
                        .contactRequestDto(contactRequestDto)
                        .build();

                authService.registerUserWithRole(signUpRequest, role);
            }
        }

    }

    protected String generateRandomPassword(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*?&_";
        StringBuilder password = new StringBuilder();
        for (int i = 0; i < length; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }
        return password.toString();
    }

    protected void deleteOldMockData() {
        authService.getAllUserAuthentications().stream()
                .filter(auth -> auth.getUsername().startsWith(MOCK_USER_PREFIX))
                .filter(auth -> auth.getLastLogin() == null)
                .forEach(auth -> {
                    log.info("Deleting old mock user: {}", auth.getUsername());
                    authService.deleteUser(auth.getUsername());
                });
    }
}